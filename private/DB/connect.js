const mysql = require('mysql2/promise');
const Config = require('../../config.js');

const pool = mysql.createPool({
    host: Config.db.host,
    user: Config.db.user,
    password: Config.db.password,
    database: Config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Veritabanı bağlantısını kontrol et
async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Kullanıcı girişi kontrolü
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

// Bağlantıyı test et
checkConnection();

module.exports = {
    pool,
    checkConnection,
    checkLogin
};
