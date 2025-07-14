const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');
const client = require('../../server.js');
const Config = require('../../config.json');

// Activity Statistics - Genel istatistikler
router.get('/stats', async (req, res) => {
    try {
        // Önce activity_history tablosunun var olup olmadığını kontrol et
        const tableExists = await checkActivityHistoryTable();
        
        let messageCount, voiceActivity, activeUsers, avgSession;
        
        if (tableExists) {
            // Yeni activity_history tablosundan istatistikler
            [messageCount] = await db.pool.query(`
                SELECT COUNT(*) as total 
                FROM discord_activity_history 
                WHERE activity_type = 'message'
            `);
            
            [voiceActivity] = await db.pool.query(`
                SELECT COUNT(DISTINCT user_id) as total 
                FROM discord_activity_history 
                WHERE activity_type = 'voice' 
                AND action = 'join'
                AND event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `);
            
            [activeUsers] = await db.pool.query(`
                SELECT COUNT(DISTINCT user_id) as total 
                FROM discord_activity_history 
                WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `);
            
            [avgSession] = await db.pool.query(`
                SELECT AVG(duration_seconds) as avg_duration 
                FROM discord_activity_history 
                WHERE activity_type = 'voice' 
                AND action = 'leave' 
                AND duration_seconds > 0
                AND event_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            `);
        } else {
            // Fallback: Eski tablolardan istatistikler
            [messageCount] = await db.pool.query('SELECT COUNT(*) as total FROM discord_message_log');
            
            [voiceActivity] = await db.pool.query(`
                SELECT COUNT(DISTINCT user_id) as total 
                FROM discord_voice_log 
                WHERE action = 'join' 
                AND event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `);
            
            [activeUsers] = await db.pool.query(`
                SELECT COUNT(DISTINCT user_id) as total FROM (
                    SELECT user_id FROM discord_message_log 
                    WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                    UNION
                    SELECT user_id FROM discord_voice_log 
                    WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ) as combined_activity
            `);
            
            [avgSession] = await db.pool.query(`
                SELECT AVG(duration_seconds) as avg_duration 
                FROM discord_voice_log 
                WHERE action = 'leave' 
                AND duration_seconds > 0
                AND event_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            `);
        }

        const stats = {
            totalMessages: messageCount[0].total,
            voiceActivity: activeUsers[0].total > 0 ? Math.round((voiceActivity[0].total / activeUsers[0].total) * 100) : 0,
            activeUsers: activeUsers[0].total,
            avgSession: avgSession[0].avg_duration ? Math.round(avgSession[0].avg_duration / 60) : 30
        };

        res.json({
            success: true,
            stats: stats
        });

    } catch (error) {
        console.error('Activity stats alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

// Activity Overview Chart - Ana aktivite grafiği
router.get('/chart/overview', async (req, res) => {
    try {
        const { period = '7d' } = req.query;
        
        let interval, limit;
        switch (period) {
            case '7d':
                interval = '1 DAY';
                limit = 7;
                break;
            case '30d':
                interval = '1 DAY';
                limit = 30;
                break;
            case '90d':
                interval = '1 DAY';
                limit = 90;
                break;
            default:
                interval = '1 DAY';
                limit = 7;
        }

        // Mesaj aktivitesi
        const [messageData] = await db.pool.query(`
            SELECT 
                DATE(event_time) as date,
                COUNT(*) as count
            FROM discord_activity_history 
            WHERE activity_type = 'message'
            AND event_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(event_time)
            ORDER BY date
        `, [limit]);

        // Ses aktivitesi
        const [voiceData] = await db.pool.query(`
            SELECT 
                DATE(event_time) as date,
                COUNT(DISTINCT user_id) as count
            FROM discord_activity_history 
            WHERE activity_type = 'voice' 
            AND action = 'join'
            AND event_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(event_time)
            ORDER BY date
        `, [limit]);

        // Tarih aralığını oluştur
        const dates = [];
        const messages = [];
        const voiceUsers = [];

        for (let i = limit - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            dates.push(date.toLocaleDateString('tr-TR', { weekday: 'short' }));
            
            const messageEntry = messageData.find(item => item.date.toISOString().split('T')[0] === dateStr);
            messages.push(messageEntry ? messageEntry.count : 0);
            
            const voiceEntry = voiceData.find(item => item.date.toISOString().split('T')[0] === dateStr);
            voiceUsers.push(voiceEntry ? voiceEntry.count : 0);
        }

        res.json({
            success: true,
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Messages',
                        data: messages,
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)'
                    },
                    {
                        label: 'Voice Users',
                        data: voiceUsers,
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)'
                    }
                ]
            }
        });

    } catch (error) {
        console.error('Activity chart verisi alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Grafik verisi alınırken hata oluştu'
        });
    }
});

// Channel Activity Chart - Kanal aktivitesi
router.get('/chart/channels', async (req, res) => {
    try {
        const { type = 'messages' } = req.query;
        
        let query, label;
        if (type === 'messages') {
            query = `
                SELECT 
                    channel_name,
                    COUNT(*) as count
                FROM discord_activity_history 
                WHERE activity_type = 'message'
                AND event_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY channel_name
                ORDER BY count DESC
                LIMIT 10
            `;
            label = 'Messages';
        } else {
            query = `
                SELECT 
                    channel_name,
                    COUNT(DISTINCT user_id) as count
                FROM discord_activity_history 
                WHERE activity_type = 'voice'
                AND action = 'join'
                AND event_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY channel_name
                ORDER BY count DESC
                LIMIT 10
            `;
            label = 'Users';
        }

        const [rows] = await db.pool.query(query);

        const data = {
            labels: rows.map(row => `#${row.channel_name}`),
            datasets: [{
                label: label,
                data: rows.map(row => row.count),
                backgroundColor: [
                    'rgba(0, 123, 255, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(108, 117, 125, 0.8)',
                    'rgba(23, 162, 184, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(108, 117, 125, 0.8)'
                ],
                borderColor: [
                    '#007bff',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d',
                    '#17a2b8',
                    '#28a745',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d'
                ],
                borderWidth: 2
            }]
        };

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Channel activity chart verisi alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kanal grafiği verisi alınırken hata oluştu'
        });
    }
});

// Hourly Activity Pattern - Saatlik aktivite paterni
router.get('/chart/hourly', async (req, res) => {
    try {
        // Son 7 günün saatlik aktivite verisi
        const [rows] = await db.pool.query(`
            SELECT 
                HOUR(event_time) as hour,
                COUNT(*) as count
            FROM discord_activity_history 
            WHERE activity_type = 'message'
            AND event_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY HOUR(event_time)
            ORDER BY hour
        `);

        // 24 saatlik veriyi hazırla
        const hourlyData = new Array(24).fill(0);
        rows.forEach(row => {
            hourlyData[row.hour] = row.count;
        });

        const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
        const data = [hourlyData[0], hourlyData[4], hourlyData[8], hourlyData[12], hourlyData[16], hourlyData[20], hourlyData[23]];

        res.json({
            success: true,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Activity Level',
                    data: data,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            }
        });

    } catch (error) {
        console.error('Hourly activity chart verisi alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Saatlik aktivite verisi alınırken hata oluştu'
        });
    }
});

// User Activity Distribution - Kullanıcı aktivite dağılımı
router.get('/chart/user-distribution', async (req, res) => {
    try {
        // Kullanıcı aktivite seviyelerini hesapla
        const [userActivity] = await db.pool.query(`
            SELECT 
                user_id,
                COUNT(*) as message_count,
                COUNT(DISTINCT DATE(event_time)) as active_days
            FROM discord_activity_history 
            WHERE activity_type = 'message'
            AND event_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY user_id
        `);

        // Aktivite seviyelerini kategorize et
        let veryActive = 0, active = 0, moderate = 0, inactive = 0;

        userActivity.forEach(user => {
            if (user.active_days >= 20 && user.message_count >= 100) {
                veryActive++;
            } else if (user.active_days >= 10 && user.message_count >= 50) {
                active++;
            } else if (user.active_days >= 5 && user.message_count >= 20) {
                moderate++;
            } else {
                inactive++;
            }
        });

        res.json({
            success: true,
            data: {
                labels: ['Very Active', 'Active', 'Moderate', 'Inactive'],
                datasets: [{
                    data: [veryActive, active, moderate, inactive],
                    backgroundColor: [
                        '#28a745',
                        '#007bff',
                        '#ffc107',
                        '#dc3545'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            }
        });

    } catch (error) {
        console.error('User distribution chart verisi alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı dağılımı verisi alınırken hata oluştu'
        });
    }
});

// Recent Activity Feed - Son aktiviteler
router.get('/recent-activities', async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        // Önce activity_history tablosunun var olup olmadığını kontrol et
        const tableExists = await checkActivityHistoryTable();
        
        let allActivities;
        
        if (tableExists) {
            // Yeni activity_history tablosundan veri çek
            const [activities] = await db.pool.query(`
                SELECT 
                    activity_type as type,
                    user_id,
                    username,
                    target_name as content,
                    event_time,
                    action,
                    channel_name,
                    details
                FROM discord_activity_history 
                WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ORDER BY event_time DESC
                LIMIT ?
            `, [parseInt(limit)]);
            
            allActivities = activities;
        } else {
            // Fallback: Eski tablolardan veri çek
            const messageQuery = `
                SELECT 
                    'message' as type,
                    user_id,
                    username,
                    channel_name as content,
                    event_time,
                    action
                FROM discord_message_log 
                WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ORDER BY event_time DESC
                LIMIT ?
            `;
            
            const voiceQuery = `
                SELECT 
                    'voice' as type,
                    user_id,
                    username,
                    channel_name as content,
                    event_time,
                    action
                FROM discord_voice_log 
                WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ORDER BY event_time DESC
                LIMIT ?
            `;
            
            const roleQuery = `
                SELECT 
                    'role' as type,
                    user_id,
                    username,
                    role_name as content,
                    event_time,
                    action
                FROM discord_role_log 
                WHERE event_time >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
                ORDER BY event_time DESC
                LIMIT ?
            `;

            const [messageActivities] = await db.pool.query(messageQuery, [parseInt(limit)]);
            const [voiceActivities] = await db.pool.query(voiceQuery, [parseInt(limit)]);
            const [roleActivities] = await db.pool.query(roleQuery, [parseInt(limit)]);

            // Tüm aktiviteleri birleştir ve sırala
            allActivities = [...messageActivities, ...voiceActivities, ...roleActivities]
                .sort((a, b) => new Date(b.event_time) - new Date(a.event_time))
                .slice(0, parseInt(limit));
        }

        const formattedActivities = allActivities.map(activity => {
            let content, icon;
            
            switch (activity.type) {
                case 'message':
                    content = `sent a message in #${activity.channel_name || 'unknown'}`;
                    icon = 'fas fa-comment';
                    break;
                case 'voice':
                    if (activity.action === 'join') {
                        content = `joined voice channel #${activity.channel_name || 'unknown'}`;
                        icon = 'fas fa-headset';
                    } else {
                        content = `left voice channel #${activity.channel_name || 'unknown'}`;
                        icon = 'fas fa-headset';
                    }
                    break;
                case 'role':
                    if (activity.action === 'add') {
                        content = `was given role ${activity.content || 'unknown'}`;
                        icon = 'fas fa-user-tag';
                    } else {
                        content = `had role ${activity.content || 'unknown'} removed`;
                        icon = 'fas fa-user-tag';
                    }
                    break;
                case 'channel':
                    content = `${activity.action} channel #${activity.content || 'unknown'}`;
                    icon = 'fas fa-hashtag';
                    break;
                case 'emoji':
                    content = `${activity.action} emoji ${activity.content || 'unknown'}`;
                    icon = 'fas fa-smile';
                    break;
                case 'invite':
                    content = `${activity.action} invite for #${activity.channel_name || 'unknown'}`;
                    icon = 'fas fa-link';
                    break;
                case 'member':
                    content = `${activity.action} the server`;
                    icon = 'fas fa-user-plus';
                    break;
                default:
                    content = activity.content || 'performed an action';
                    icon = 'fas fa-info-circle';
            }

            return {
                type: activity.type,
                user: activity.username,
                content: content,
                time: getTimeAgo(activity.event_time),
                icon: icon
            };
        });

        res.json({
            success: true,
            activities: formattedActivities
        });

    } catch (error) {
        console.error('Recent activities alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Son aktiviteler alınırken hata oluştu'
        });
    }
});

// Utility function - Zaman önce hesaplama
function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now - past) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
}

// Check if activity_history table exists
async function checkActivityHistoryTable() {
    try {
        const [result] = await db.pool.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name = 'discord_activity_history'
        `);
        return result[0].count > 0;
    } catch (error) {
        console.error('Error checking activity_history table:', error);
        return false;
    }
}

// Migration function - Mevcut log verilerini activity_history tablosuna aktar
async function migrateExistingLogs() {
    try {
        console.log('🔄 Starting migration of existing logs to activity_history table...');
        
        // Check if table exists
        const tableExists = await checkActivityHistoryTable();
        if (!tableExists) {
            console.log('❌ discord_activity_history table does not exist. Please run the SQL script first.');
            return false;
        }
        
        // Message logs migration
        const [messageLogs] = await db.pool.query(`
            INSERT IGNORE INTO discord_activity_history 
            (activity_type, user_id, username, avatar_url, target_id, target_name, action, details, channel_id, channel_name, event_time)
            SELECT 
                'message' as activity_type,
                user_id,
                username,
                avatar_url,
                message_id as target_id,
                content as target_name,
                action,
                JSON_OBJECT('attachments_count', attachments_count, 'mentions_count', mentions_count) as details,
                channel_id,
                channel_name,
                event_time
            FROM discord_message_log
        `);
        console.log(`✅ Migrated ${messageLogs.affectedRows} message logs`);
        
        // Voice logs migration
        const [voiceLogs] = await db.pool.query(`
            INSERT IGNORE INTO discord_activity_history 
            (activity_type, user_id, username, avatar_url, target_id, target_name, action, details, channel_id, channel_name, duration_seconds, event_time)
            SELECT 
                'voice' as activity_type,
                user_id,
                username,
                avatar_url,
                channel_id as target_id,
                channel_name as target_name,
                action,
                JSON_OBJECT() as details,
                channel_id,
                channel_name,
                duration_seconds,
                event_time
            FROM discord_voice_log
        `);
        console.log(`✅ Migrated ${voiceLogs.affectedRows} voice logs`);
        
        // Role logs migration
        const [roleLogs] = await db.pool.query(`
            INSERT IGNORE INTO discord_activity_history 
            (activity_type, user_id, username, avatar_url, target_id, target_name, action, details, moderator_id, moderator_username, event_time)
            SELECT 
                'role' as activity_type,
                user_id,
                username,
                avatar_url,
                role_id as target_id,
                role_name as target_name,
                action,
                JSON_OBJECT('role_color', role_color) as details,
                moderator_id,
                moderator_username,
                event_time
            FROM discord_role_log
        `);
        console.log(`✅ Migrated ${roleLogs.affectedRows} role logs`);
        
        console.log('🎉 Migration completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return false;
    }
}

// Migration endpoint (sadece development için)
router.post('/migrate', async (req, res) => {
    try {
        const success = await migrateExistingLogs();
        if (success) {
            res.json({
                success: true,
                message: 'Migration completed successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Migration failed - table may not exist'
            });
        }
    } catch (error) {
        console.error('Migration endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Migration failed'
        });
    }
});

module.exports = router; 