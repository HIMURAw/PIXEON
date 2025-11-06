const mysql = require('mysql2/promise');
const Config = require('../../../config.js');

const pool = mysql.createPool({
    host: Config.db.host,
    user: Config.db.user,
    password: Config.db.password,
    database: Config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('\x1b[38;5;208m[BACKEND]\x1b[0m Veri Tabanı Bağlantısı Başarılı bir şekilde sağlandı.');
        connection.release();
        return true;
    } catch (error) {
        console.error('[BACKEND] Veri Tabanı Bağlantısı Başarısız.    HATA:', error);
        return false;
    }
}

async function checkLogin(username, password) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        return rows.length > 0;
    } catch (error) {
        console.error('Login check failed:', error);
        return false;
    }
}

checkConnection();

module.exports = {
    pool,
    checkConnection,
    checkLogin
};
