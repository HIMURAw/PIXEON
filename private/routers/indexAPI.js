const express = require('express');
const router = express.Router();
const { pool } = require('../DB/connect');
const client = require('../../server.js');
const Config = require('../../config.json');

// Discord ürünlerinin ortalama yıldızını getir
router.get('/discord/products/average-rating', async (req, res) => {
    try {
        // product_feedback tablosundan tüm yıldız ortalamasını hesapla
        const [rows] = await pool.query(`
            SELECT 
                AVG(rating) as averageRating,
                COUNT(*) as totalFeedbacks,
                COUNT(DISTINCT product_channel_id) as ratedProducts
            FROM product_feedback
        `);

        const result = rows[0];

        console.log('Database result:', result); // Debug için

        // Eğer hiç feedback yoksa varsayılan değer döndür
        if (result.totalFeedbacks === 0 || result.averageRating === null) {
            return res.status(200).json({
                success: true,
                data: {
                    averageRating: 4.9,
                    totalProducts: 0,
                    ratedProducts: 0,
                    totalFeedbacks: 0,
                    message: 'Henüz hiç değerlendirme bulunmuyor, varsayılan değer gösteriliyor'
                }
            });
        }

        // Ortalama yıldızı güvenli şekilde hesapla
        let averageRating = 0;
        if (result.averageRating !== null && result.averageRating !== undefined) {
            const rating = parseFloat(result.averageRating);
            if (!isNaN(rating)) {
                averageRating = parseFloat(rating.toFixed(2));
            }
        }

        // Toplam ürün sayısını al
        const [productCount] = await pool.query(`
            SELECT COUNT(*) as totalProducts
            FROM discord_products
        `);

        const totalProducts = productCount[0].totalProducts;

        res.status(200).json({
            success: true,
            data: {
                averageRating: averageRating,
                totalProducts: totalProducts,
                ratedProducts: result.ratedProducts,
                totalFeedbacks: result.totalFeedbacks,
                unratedProducts: totalProducts - result.ratedProducts,
                message: 'Ortalama yıldız başarıyla hesaplandı'
            }
        });

    } catch (error) {
        console.error('Ortalama yıldız hesaplanırken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Ortalama yıldız hesaplanırken bir hata oluştu'
        });
    }
});

// Tüm ürünleri yıldızlarıyla birlikte getir (opsiyonel)
router.get('/discord/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                id,
                channel_id,
                channel_name,
                product_title as name,
                price_tl as price,
                details as description,
                added_at as created_at
            FROM discord_products
            ORDER BY added_at DESC
        `);

        res.status(200).json({
            success: true,
            data: {
                products: rows,
                totalCount: rows.length,
                message: 'Ürünler başarıyla getirildi'
            }
        });

    } catch (error) {
        console.error('Ürünler getirilirken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Ürünler getirilirken bir hata oluştu'
        });
    }
});

// Customer rolündeki kişilerin sayısını getir
router.get('/discord/customer', async (req, res) => {
    try {
        const Config = require('../../config.json');
        const customerRoleId = Config.discord.shopBot.customerRoleId;

        if (!customerRoleId) {
            return res.status(400).json({
                success: false,
                error: 'Customer rol ID bulunamadı',
                message: 'Config dosyasında customer rol ID tanımlanmamış'
            });
        }

        // Discord client'ı al
        const client = require('../../server.js');

        // Bot'un hazır olup olmadığını kontrol et
        if (!client.isReady()) {
            return res.status(503).json({
                success: false,
                error: 'Discord bot hazır değil',
                message: 'Bot henüz Discord\'a bağlanmadı'
            });
        }

        // Guild'i al
        const guild = client.guilds.cache.get(Config.discord.guidid);

        if (!guild) {
            return res.status(404).json({
                success: false,
                error: 'Guild bulunamadı',
                message: 'Belirtilen Discord sunucusu bulunamadı'
            });
        }

        // Customer rolünü al
        const customerRole = guild.roles.cache.get(customerRoleId);

        if (!customerRole) {
            return res.status(404).json({
                success: false,
                error: 'Customer rol bulunamadı',
                message: 'Belirtilen customer rolü Discord sunucusunda bulunamadı'
            });
        }

        // Customer rolündeki üye sayısını al
        const memberCount = customerRole.members.size;

        res.status(200).json({
            success: true,
            data: {
                customerCount: memberCount,
                roleName: customerRole.name,
                roleId: customerRoleId,
                guildName: guild.name,
                lastUpdated: new Date().toISOString(),
                message: 'Customer sayısı başarıyla alındı'
            }
        });

    } catch (error) {
        console.error('Customer sayısı alınırken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Customer sayısı alınırken bir hata oluştu'
        });
    }
});

// Discord sunucusundaki toplam üye sayısını getir
router.get('/discord/server', async (req, res) => {
    try {
        const Config = require('../../config.json');

        // Discord client'ı al
        const client = require('../../server.js');

        // Bot'un hazır olup olmadığını kontrol et
        if (!client.isReady()) {
            return res.status(503).json({
                success: false,
                error: 'Discord bot hazır değil',
                message: 'Bot henüz Discord\'a bağlanmadı'
            });
        }

        // Guild'i al
        const guild = client.guilds.cache.get(Config.discord.guidid);

        if (!guild) {
            return res.status(404).json({
                success: false,
                error: 'Guild bulunamadı',
                message: 'Belirtilen Discord sunucusu bulunamadı'
            });
        }

        // Sunucudaki toplam üye sayısını al
        const memberCount = guild.memberCount;

        res.status(200).json({
            success: true,
            data: {
                serverMemberCount: memberCount,
                guildName: guild.name,
                guildId: guild.id,
                lastUpdated: new Date().toISOString(),
                message: 'Sunucu üye sayısı başarıyla alındı'
            }
        });

    } catch (error) {
        console.error('Sunucu üye sayısı alınırken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Sunucu üye sayısı alınırken bir hata oluştu'
        });
    }
});

router.get('/discord/support', async (req, res) => {
    try {
        const supportRoleId = Config.discord.supportRoleId;

        if (!supportRoleId) {
            return res.status(400).json({
                success: false,
                error: 'Support rol ID bulunamadı',
                message: 'Config dosyasında support rol ID tanımlanmamış'
            });
        }

        // Discord client'ı al
        const client = require('../../server.js');

        // Bot'un hazır olup olmadığını kontrol et
        if (!client.isReady()) {
            return res.status(503).json({
                success: false,
                error: 'Discord bot hazır değil',
                message: 'Bot henüz Discord\'a bağlanmadı'
            });
        }

        // Guild'i al
        const guild = client.guilds.cache.get(Config.discord.guidid);

        if (!guild) {
            return res.status(404).json({
                success: false,
                error: 'Guild bulunamadı',
                message: 'Belirtilen Discord sunucusu bulunamadı'
            });
        }

        // Support rolünü al
        const supportRole = guild.roles.cache.get(supportRoleId);

        if (!supportRole) {
            return res.status(404).json({
                success: false,
                error: 'Support rol bulunamadı',
                message: 'Belirtilen support rolü Discord sunucusunda bulunamadı'
            });
        }

        // Support rolündeki üyeleri al
        const members = supportRole.members.map(member => ({
            id: member.id,
            username: member.user.username,
            displayName: member.displayName,
            avatar: member.user.displayAvatarURL({ dynamic: true }),
            joinedAt: member.joinedAt,
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.hexColor
            }))
        }));

        res.status(200).json({
            success: true,
            data: {
                supportCount: members.length,
                roleName: supportRole.name,
                roleId: supportRoleId,
                roleColor: supportRole.hexColor,
                guildName: guild.name,
                members: members,
                lastUpdated: new Date().toISOString(),
                message: 'Support üyeleri başarıyla alındı'
            }
        });

    } catch (error) {
        console.error('Support üyeleri alınırken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Support üyeleri alınırken bir hata oluştu'
        });
    }
});

// Product feedback tablosundaki tüm verileri getir
router.get('/product-feedback', async (req, res) => {
    try {
        // Tüm feedback verilerini getir
        const [rows] = await pool.query(`
            SELECT 
                id,
                user_id,
                username,
                product_channel_id,
                product_channel_name,
                rating,
                message,
                created_at
            FROM product_feedback
            ORDER BY created_at DESC
        `);

        // Discord client'ı al
        const client = require('../../server.js');

        // Her feedback için kullanıcı avatarını al
        const feedbacksWithAvatars = await Promise.all(rows.map(async (feedback) => {
            try {
                let avatarUrl = null;
                
                // Bot'un hazır olup olmadığını kontrol et
                if (client.isReady()) {
                    // Kullanıcıyı Discord'dan al
                    const user = await client.users.fetch(feedback.user_id).catch(() => null);
                    if (user) {
                        avatarUrl = user.displayAvatarURL({ format: 'png', size: 128 });
                    }
                }
                
                return {
                    ...feedback,
                    avatar_url: avatarUrl
                };
            } catch (error) {
                console.error(`Avatar alınırken hata oluştu (user_id: ${feedback.user_id}):`, error);
                return {
                    ...feedback,
                    avatar_url: null
                };
            }
        }));

        // Toplam istatistikleri hesapla
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as totalFeedbacks,
                AVG(rating) as averageRating,
                COUNT(DISTINCT user_id) as uniqueUsers,
                COUNT(DISTINCT product_channel_id) as ratedProducts
            FROM product_feedback
        `);

        const statistics = stats[0];

        res.status(200).json({
            success: true,
            data: {
                feedbacks: feedbacksWithAvatars,
                statistics: {
                    totalFeedbacks: statistics.totalFeedbacks,
                    averageRating: parseFloat(statistics.averageRating || 0).toFixed(2),
                    uniqueUsers: statistics.uniqueUsers,
                    ratedProducts: statistics.ratedProducts
                },
                totalCount: feedbacksWithAvatars.length,
                message: 'Feedback verileri başarıyla getirildi'
            }
        });

    } catch (error) {
        console.error('Feedback verileri getirilirken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Feedback verileri getirilirken bir hata oluştu'
        });
    }
});

// Belirli bir ürünün feedback'lerini getir
router.get('/product-feedback/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        // Belirli ürünün feedback'lerini getir
        const [rows] = await pool.query(`
            SELECT 
                id,
                user_id,
                username,
                product_channel_id,
                product_channel_name,
                rating,
                message,
                created_at
            FROM product_feedback
            WHERE product_channel_id = ?
            ORDER BY created_at DESC
        `, [productId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Feedback bulunamadı',
                message: 'Bu ürün için henüz feedback bulunmuyor'
            });
        }

        // Discord client'ı al
        const client = require('../../server.js');

        // Her feedback için kullanıcı avatarını al
        const feedbacksWithAvatars = await Promise.all(rows.map(async (feedback) => {
            try {
                let avatarUrl = null;
                
                // Bot'un hazır olup olmadığını kontrol et
                if (client.isReady()) {
                    // Kullanıcıyı Discord'dan al
                    const user = await client.users.fetch(feedback.user_id).catch(() => null);
                    if (user) {
                        avatarUrl = user.displayAvatarURL({ format: 'png', size: 128 });
                    }
                }
                
                return {
                    ...feedback,
                    avatar_url: avatarUrl
                };
            } catch (error) {
                console.error(`Avatar alınırken hata oluştu (user_id: ${feedback.user_id}):`, error);
                return {
                    ...feedback,
                    avatar_url: null
                };
            }
        }));

        // Bu ürün için istatistikleri hesapla
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as totalFeedbacks,
                AVG(rating) as averageRating,
                COUNT(DISTINCT user_id) as uniqueUsers
            FROM product_feedback
            WHERE product_channel_id = ?
        `, [productId]);

        const statistics = stats[0];

        res.status(200).json({
            success: true,
            data: {
                productId: productId,
                feedbacks: feedbacksWithAvatars,
                statistics: {
                    totalFeedbacks: statistics.totalFeedbacks,
                    averageRating: parseFloat(statistics.averageRating || 0).toFixed(2),
                    uniqueUsers: statistics.uniqueUsers
                },
                totalCount: feedbacksWithAvatars.length,
                message: 'Ürün feedback verileri başarıyla getirildi'
            }
        });

    } catch (error) {
        console.error('Ürün feedback verileri getirilirken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Ürün feedback verileri getirilirken bir hata oluştu'
        });
    }
});

// Belirli bir kullanıcının feedback'lerini getir
router.get('/product-feedback/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Belirli kullanıcının feedback'lerini getir
        const [rows] = await pool.query(`
            SELECT 
                id,
                user_id,
                username,
                product_channel_id,
                product_channel_name,
                rating,
                message,
                created_at
            FROM product_feedback
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Feedback bulunamadı',
                message: 'Bu kullanıcı için henüz feedback bulunmuyor'
            });
        }

        // Discord client'ı al
        const client = require('../../server.js');

        // Her feedback için kullanıcı avatarını al
        const feedbacksWithAvatars = await Promise.all(rows.map(async (feedback) => {
            try {
                let avatarUrl = null;
                
                // Bot'un hazır olup olmadığını kontrol et
                if (client.isReady()) {
                    // Kullanıcıyı Discord'dan al
                    const user = await client.users.fetch(feedback.user_id).catch(() => null);
                    if (user) {
                        avatarUrl = user.displayAvatarURL({ format: 'png', size: 128 });
                    }
                }
                
                return {
                    ...feedback,
                    avatar_url: avatarUrl
                };
            } catch (error) {
                console.error(`Avatar alınırken hata oluştu (user_id: ${feedback.user_id}):`, error);
                return {
                    ...feedback,
                    avatar_url: null
                };
            }
        }));

        // Bu kullanıcı için istatistikleri hesapla
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) as totalFeedbacks,
                AVG(rating) as averageRating,
                COUNT(DISTINCT product_channel_id) as ratedProducts
            FROM product_feedback
            WHERE user_id = ?
        `, [userId]);

        const statistics = stats[0];

        res.status(200).json({
            success: true,
            data: {
                userId: userId,
                feedbacks: feedbacksWithAvatars,
                statistics: {
                    totalFeedbacks: statistics.totalFeedbacks,
                    averageRating: parseFloat(statistics.averageRating || 0).toFixed(2),
                    ratedProducts: statistics.ratedProducts
                },
                totalCount: feedbacksWithAvatars.length,
                message: 'Kullanıcı feedback verileri başarıyla getirildi'
            }
        });

    } catch (error) {
        console.error('Kullanıcı feedback verileri getirilirken hata oluştu:', error);
        res.status(500).json({
            success: false,
            error: 'Sunucu hatası',
            message: 'Kullanıcı feedback verileri getirilirken bir hata oluştu'
        });
    }
});

// public/log klasöründeki dosya isimlerini listeleyen endpoint
const fs = require('fs');
const path = require('path');

router.get('/log-files', async (req, res) => {
    try {
        const logDir = path.join(__dirname, '../../public/log');
        const files = await fs.promises.readdir(logDir);
        // Sadece dosya isimlerini döndür, klasörleri filtrele
        const fileList = [];
        for (const file of files) {
            const filePath = path.join(logDir, file);
            const stat = await fs.promises.stat(filePath);
            if (stat.isFile()) {
                fileList.push(file);
            }
        }
        res.status(200).json({ success: true, files: fileList });
    } catch (error) {
        console.error('Log dosyaları listelenirken hata oluştu:', error);
        res.status(500).json({ success: false, error: 'Log dosyaları listelenemedi.' });
    }
});

module.exports = router;
