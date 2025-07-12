const express = require('express');
const router = express.Router();
const { pool } = require('../DB/connect');

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

module.exports = router;
