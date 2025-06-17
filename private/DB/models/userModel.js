const { pool } = require('../connect');

// Admins tablosunu oluştur
async function createAdminsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Admins table created or already exists');
    } catch (error) {
        console.error('Error creating admins table:', error);
        throw error;
    }
}

// User History tablosunu oluştur
async function createUserHistoryTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                username VARCHAR(255) NOT NULL,
                action ENUM('warn', 'kick', 'ban', 'unban') NOT NULL,
                reason TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                moderator_id VARCHAR(255) NOT NULL,
                moderator_username VARCHAR(255) NOT NULL
            )
        `);
        console.log('User History table created or already exists');
    } catch (error) {
        console.error('Error creating user history table:', error);
        throw error;
    }
}

// Admin girişi kontrolü.
async function checkLogin(username, password) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM admins WHERE username = ? AND password = ?',
            [username, password]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('Login check failed:', error);
        return false;
    }
}

// Kullanıcı geçmişi ekle
async function addUserHistory(data) {
    try {
        console.log('Adding user history:', data);
        const [result] = await pool.execute(
            'INSERT INTO user_history (user_id, username, action, reason, moderator_id, moderator_username) VALUES (?, ?, ?, ?, ?, ?)',
            [data.userId, data.username, data.action, data.reason, data.moderatorId, data.moderatorUsername]
        );
        return result;
    } catch (error) {
        console.error('Error adding user history:', error);
        throw error;
    }
}

// Kullanıcı geçmişini getir
async function getUserHistory(filters = {}) {
    try {
        let query = 'SELECT * FROM user_history';
        const params = [];

        if (filters.date) {
            query += ' WHERE DATE(timestamp) = ?';
            params.push(filters.date);
        }

        if (filters.type && filters.type !== 'all') {
            query += params.length ? ' AND' : ' WHERE';
            query += ' action = ?';
            params.push(filters.type);
        }

        query += ' ORDER BY timestamp DESC';

        const [rows] = await pool.execute(query, params);
        return rows;
    } catch (error) {
        console.error('Error getting user history:', error);
        throw error;
    }
}

// Tabloları oluştur
(async () => {
    try {
        await createAdminsTable();
        await createUserHistoryTable();
    } catch (error) {
        console.error('Error creating tables:', error);
    }
})();

module.exports = {
    createAdminsTable,
    createUserHistoryTable,
    checkLogin,
    addUserHistory,
    getUserHistory
}; 