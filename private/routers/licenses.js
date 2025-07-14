const express = require('express');
const router = express.Router();
const { pool } = require('../DB/connect');

// Lisans ekle
router.post('/add', async (req, res) => {
    const { serverName, serverIP, addedBy } = req.body;
    
    // Input validation
    if (!serverName || !serverIP) {
        return res.status(400).json({ success: false, message: 'Server adı ve IP adresi zorunludur!' });
    }
    
    // IP adresi formatı kontrolü
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(serverIP)) {
        return res.status(400).json({ success: false, message: 'Geçersiz IP adresi formatı!' });
    }
    
    try {
        // Transaction başlat
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Aynı IP ile kayıt var mı kontrol et (FOR UPDATE ile kilitle)
            const [existing] = await connection.query(
                'SELECT id, server_name FROM licenses WHERE server_ip = ? FOR UPDATE',
                [serverIP]
            );
            
            if (existing.length > 0) {
                await connection.rollback();
                connection.release();
                return res.status(409).json({ 
                    success: false, 
                    message: `Bu IP adresi (${serverIP}) zaten "${existing[0].server_name}" sunucusu için kayıtlı!` 
                });
            }
            
            // Yeni lisans ekle
            await connection.query(
                'INSERT INTO licenses (server_name, server_ip, added_by) VALUES (?, ?, ?)',
                [serverName.trim(), serverIP, addedBy || null]
            );
            
            // Transaction'ı commit et
            await connection.commit();
            connection.release();
            
            res.json({ success: true, message: 'Lisans başarıyla eklendi!' });
            
        } catch (err) {
            // Transaction'ı rollback et
            await connection.rollback();
            connection.release();
            throw err;
        }
        
    } catch (err) {
        console.error('Lisans ekleme hatası:', err);
        
        // Duplicate entry hatası kontrolü
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('server_ip')) {
            // Tekrar kontrol et ve detaylı bilgi al
            try {
                const [existing] = await pool.query(
                    'SELECT server_name FROM licenses WHERE server_ip = ?',
                    [serverIP]
                );
                
                if (existing.length > 0) {
                    return res.status(409).json({ 
                        success: false, 
                        message: `Bu IP adresi (${serverIP}) zaten "${existing[0].server_name}" sunucusu için kayıtlı!` 
                    });
                }
            } catch (checkErr) {
                console.error('Duplicate kontrol hatası:', checkErr);
            }
            
            return res.status(409).json({ 
                success: false, 
                message: `Bu IP adresi (${serverIP}) zaten kayıtlı!` 
            });
        }
        
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu!' });
    }
});

// Ekli lisansları listele
router.get('/list', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM licenses ORDER BY created_at DESC');
        res.json({ success: true, licenses: rows });
    } catch (err) {
        console.error('Lisans listeleme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu!' });
    }
});

// Lisans sil
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Geçersiz lisans ID!' });
    }
    
    try {
        const [result] = await pool.query('DELETE FROM licenses WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Lisans bulunamadı!' });
        }
        
        res.json({ success: true, message: 'Lisans başarıyla silindi!' });
    } catch (err) {
        console.error('Lisans silme hatası:', err);
        res.status(500).json({ success: false, message: 'Sunucu hatası oluştu!' });
    }
});

module.exports = router; 