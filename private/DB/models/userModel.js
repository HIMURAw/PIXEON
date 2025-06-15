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

// Admin girişi kontrolü
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

module.exports = {
    createAdminsTable,
    checkLogin
}; 