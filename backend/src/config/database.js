import mysql from 'mysql2/promise';
import { databaseConfig } from './config.js';

// Database configuration
const dbConfig = {
  host: databaseConfig.host || 'localhost',
  port: databaseConfig.port || 3306,
  user: databaseConfig.user || 'root',
  password: databaseConfig.password || '',
  database: databaseConfig.name || 'pxdev_discord',
  waitForConnections: true,
  connectionLimit: databaseConfig.connectionLimit || 10,
  queueLimit: databaseConfig.queueLimit || 0,
  acquireTimeout: databaseConfig.acquireTimeout || 60000,
  timeout: databaseConfig.timeout || 60000,
  reconnect: databaseConfig.reconnect !== false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discord_id VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        avatar_url TEXT,
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Staff table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        role_name VARCHAR(255) NOT NULL,
        role_color VARCHAR(7),
        permissions JSON,
        is_active BOOLEAN DEFAULT TRUE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Discord roles cache
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS discord_roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_id VARCHAR(255) UNIQUE NOT NULL,
        role_name VARCHAR(255) NOT NULL,
        role_color VARCHAR(7),
        permissions BIGINT,
        position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Discord members cache
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS discord_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT,
        username VARCHAR(255) NOT NULL,
        display_name VARCHAR(255),
        avatar_url TEXT,
        roles JSON,
        joined_at TIMESTAMP NULL,
        premium_since TIMESTAMP NULL,
        is_bot BOOLEAN DEFAULT FALSE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Database query helper functions
export const query = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

export const queryOne = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
};

export const insert = async (table, data) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, values);
    
    return result.insertId;
  } catch (error) {
    console.error('Database insert error:', error.message);
    throw error;
  }
};

export const update = async (table, data, where) => {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const [result] = await pool.execute(sql, [...values]);
    
    return result.affectedRows;
  } catch (error) {
    console.error('Database update error:', error.message);
    throw error;
  }
};

export const remove = async (table, where, params = []) => {
  try {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    const [result] = await pool.execute(sql, params);
    
    return result.affectedRows;
  } catch (error) {
    console.error('Database delete error:', error.message);
    throw error;
  }
};

// Initialize database on startup
testConnection().then(async (connected) => {
  if (connected) {
    await initializeDatabase();
  }
});

export default pool;