const express = require('express');
const router = express.Router();
const db = require('../DB/connect.js');

// API endpoint - Kullanıcı loglarını getir
router.get('/logindb', async (req, res) => {
    try {
        const { discord_id, username, email, search, limit = 100, page = 1 } = req.query;
        
        let sql = 'SELECT * FROM discord_users WHERE 1=1';
        const params = [];

        if (search) {
            sql += ' AND (username LIKE ? OR discord_id LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        } else {
            if (discord_id) {
                sql += ' AND discord_id = ?';
                params.push(discord_id);
            }

            if (username) {
                sql += ' AND username LIKE ?';
                params.push(`%${username}%`);
            }

            if (email) {
                sql += ' AND email LIKE ?';
                params.push(`%${email}%`);
            }
        }

        // Toplam kayıt sayısını al
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await db.pool.query(countSql, params);
        const totalRecords = countResult[0].total;

        // Sayfalama
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.pool.query(sql, params);

        const users = rows.map(row => ({
            id: row.id,
            discord_id: row.discord_id,
            username: row.username,
            avatar: row.avatar,
            email: row.email,
            roles: row.roles ? JSON.parse(row.roles) : [],
            created_at: row.created_at,
            updated_at: row.updated_at,
            formatted_created: new Date(row.created_at).toLocaleString('tr-TR'),
            formatted_updated: new Date(row.updated_at).toLocaleString('tr-TR'),
            avatar_url: row.avatar ? `https://cdn.discordapp.com/avatars/${row.discord_id}/${row.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(row.discord_id) % 5}.png`
        }));

        res.json({
            success: true,
            users: users,
            total: totalRecords,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalRecords / parseInt(limit))
        });

    } catch (error) {
        console.error('Kullanıcı logları alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı logları alınırken hata oluştu'
        });
    }
});

// API endpoint - Belirli bir kullanıcıyı getir
router.get('/:discord_id', async (req, res) => {
    try {
        const { discord_id } = req.params;

        const [rows] = await db.pool.query(
            'SELECT * FROM discord_users WHERE discord_id = ?',
            [discord_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Kullanıcı bulunamadı'
            });
        }

        const user = rows[0];
        const userData = {
            id: user.id,
            discord_id: user.discord_id,
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            roles: user.roles ? JSON.parse(user.roles) : [],
            created_at: user.created_at,
            updated_at: user.updated_at,
            formatted_created: new Date(user.created_at).toLocaleString('tr-TR'),
            formatted_updated: new Date(user.updated_at).toLocaleString('tr-TR'),
            avatar_url: user.avatar ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discord_id) % 5}.png`
        };

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Kullanıcı detayı alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı detayı alınırken hata oluştu'
        });
    }
});

// API endpoint - Kullanıcı istatistikleri
router.get('/stats/overview', async (req, res) => {
    try {
        const [totalUsers] = await db.pool.query('SELECT COUNT(*) as total FROM discord_users');
        const [todayUsers] = await db.pool.query('SELECT COUNT(*) as count FROM discord_users WHERE DATE(created_at) = CURDATE()');
        const [weekUsers] = await db.pool.query('SELECT COUNT(*) as count FROM discord_users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)');
        const [monthUsers] = await db.pool.query('SELECT COUNT(*) as count FROM discord_users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
        const [recentUsers] = await db.pool.query('SELECT * FROM discord_users ORDER BY created_at DESC LIMIT 5');

        const recentUsersData = recentUsers.map(user => ({
            id: user.id,
            discord_id: user.discord_id,
            username: user.username,
            avatar_url: user.avatar ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discord_id) % 5}.png`,
            created_at: user.created_at,
            formatted_created: new Date(user.created_at).toLocaleString('tr-TR')
        }));

        res.json({
            success: true,
            stats: {
                total: totalUsers[0].total,
                today: todayUsers[0].count,
                thisWeek: weekUsers[0].count,
                thisMonth: monthUsers[0].count,
                recentUsers: recentUsersData
            }
        });

    } catch (error) {
        console.error('Kullanıcı istatistikleri alınırken hata:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
});

// API endpoint - Kullanıcı arama
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        const { limit = 20 } = req.query;

        const [rows] = await db.pool.query(
            'SELECT * FROM discord_users WHERE username LIKE ? OR discord_id LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ?',
            [`%${query}%`, `%${query}%`, `%${query}%`, parseInt(limit)]
        );

        const users = rows.map(row => ({
            id: row.id,
            discord_id: row.discord_id,
            username: row.username,
            avatar: row.avatar,
            email: row.email,
            roles: row.roles ? JSON.parse(row.roles) : [],
            created_at: row.created_at,
            updated_at: row.updated_at,
            formatted_created: new Date(row.created_at).toLocaleString('tr-TR'),
            formatted_updated: new Date(row.updated_at).toLocaleString('tr-TR'),
            avatar_url: row.avatar ? `https://cdn.discordapp.com/avatars/${row.discord_id}/${row.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(row.discord_id) % 5}.png`
        }));

        res.json({
            success: true,
            users: users,
            total: users.length,
            query: query
        });

    } catch (error) {
        console.error('Kullanıcı arama hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı arama sırasında hata oluştu'
        });
    }
});

// API endpoint - Kullanıcı güncelleme
router.put('/:discord_id', async (req, res) => {
    try {
        const { discord_id } = req.params;
        const { username, avatar, email, roles } = req.body;

        const [result] = await db.pool.query(
            'UPDATE discord_users SET username = ?, avatar = ?, email = ?, roles = ?, updated_at = NOW() WHERE discord_id = ?',
            [
                username,
                avatar,
                email,
                roles ? JSON.stringify(roles) : null,
                discord_id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi'
        });

    } catch (error) {
        console.error('Kullanıcı güncellenirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı güncellenirken hata oluştu'
        });
    }
});

// API endpoint - Kullanıcı silme
router.delete('/:discord_id', async (req, res) => {
    try {
        const { discord_id } = req.params;

        const [result] = await db.pool.query(
            'DELETE FROM discord_users WHERE discord_id = ?',
            [discord_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            message: 'Kullanıcı başarıyla silindi'
        });

    } catch (error) {
        console.error('Kullanıcı silinirken hata:', error);
        res.status(500).json({
            success: false,
            error: 'Kullanıcı silinirken hata oluştu'
        });
    }
});

module.exports = router;
