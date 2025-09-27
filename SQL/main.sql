-- PX Development Discord Server Database Schema
-- Bu dosya tüm gerekli tabloları oluşturur

-- Veritabanını oluştur (eğer yoksa)
CREATE DATABASE IF NOT EXISTS pxdev_discord;
USE pxdev_discord;

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    email VARCHAR(255),
    password VARCHAR(255), -- Opsiyonel, Discord OAuth kullanıldığında boş olabilir
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_discord_id (discord_id),
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Staff tablosu (yönetici rolleri)
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    role_color VARCHAR(7) DEFAULT '#3498db',
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_role_name (role_name),
    INDEX idx_is_active (is_active),
    INDEX idx_joined_at (joined_at)
);

-- Discord roller cache tablosu
CREATE TABLE IF NOT EXISTS discord_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id VARCHAR(255) UNIQUE NOT NULL,
    role_name VARCHAR(255) NOT NULL,
    role_color VARCHAR(7) DEFAULT '#95a5a6',
    permissions BIGINT DEFAULT 0,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_role_id (role_id),
    INDEX idx_role_name (role_name),
    INDEX idx_position (position)
);

-- Discord üyeler cache tablosu
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
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_member_id (member_id),
    INDEX idx_user_id (user_id),
    INDEX idx_username (username),
    INDEX idx_is_bot (is_bot),
    INDEX idx_last_updated (last_updated)
);

-- Sunucu istatistikleri tablosu
CREATE TABLE IF NOT EXISTS server_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_count INT DEFAULT 0,
    online_count INT DEFAULT 0,
    channel_count INT DEFAULT 0,
    role_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_created_at (created_at)
);

-- Kullanıcı aktiviteleri tablosu
CREATE TABLE IF NOT EXISTS user_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type ENUM('login', 'logout', 'page_view', 'api_call') NOT NULL,
    activity_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_created_at (created_at)
);

-- API istekleri log tablosu
CREATE TABLE IF NOT EXISTS api_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT,
    response_time INT, -- milliseconds
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_data JSON,
    response_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_endpoint (endpoint),
    INDEX idx_method (method),
    INDEX idx_status_code (status_code),
    INDEX idx_created_at (created_at)
);

-- Sistem ayarları tablosu
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    INDEX idx_is_public (is_public)
);

-- Varsayılan sistem ayarlarını ekle
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('discord_guild_id', '', 'string', 'Discord sunucu ID', FALSE),
('discord_bot_token', '', 'string', 'Discord bot token', FALSE),
('site_name', 'PX Development', 'string', 'Site adı', TRUE),
('site_description', 'Discord sunucu yönetim sistemi', 'string', 'Site açıklaması', TRUE),
('maintenance_mode', 'false', 'boolean', 'Bakım modu durumu', FALSE),
('max_api_requests_per_minute', '100', 'number', 'Dakikada maksimum API isteği', FALSE),
('session_timeout', '7', 'number', 'Oturum süresi (gün)', FALSE),
('enable_registration', 'true', 'boolean', 'Kayıt olma durumu', FALSE),
('enable_discord_oauth', 'true', 'boolean', 'Discord OAuth durumu', TRUE),
('default_user_role', 'member', 'string', 'Varsayılan kullanıcı rolü', FALSE);

-- Örnek staff rolleri (opsiyonel)
INSERT INTO staff (user_id, role_name, role_color, permissions, is_active) 
SELECT 
    u.id,
    'Administrator',
    '#e74c3c',
    '{"can_manage_users": true, "can_manage_staff": true, "can_view_logs": true, "can_manage_settings": true}',
    TRUE
FROM users u 
WHERE u.discord_id = 'your_admin_discord_id' 
LIMIT 1;

-- Veritabanı kullanıcısı oluştur (güvenlik için)
-- Bu komutları MySQL root kullanıcısı ile çalıştırın
-- CREATE USER 'pxdev_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON pxdev_discord.* TO 'pxdev_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Performans optimizasyonu için view'lar
CREATE VIEW IF NOT EXISTS active_staff AS
SELECT 
    u.id,
    u.discord_id,
    u.username,
    u.display_name,
    u.avatar_url,
    s.role_name,
    s.role_color,
    s.joined_at,
    s.permissions
FROM users u
JOIN staff s ON u.id = s.user_id
WHERE s.is_active = TRUE
ORDER BY s.joined_at ASC;

CREATE VIEW IF NOT EXISTS user_stats AS
SELECT 
    u.id,
    u.username,
    u.created_at,
    COUNT(s.id) as staff_roles_count,
    COUNT(ua.id) as activity_count,
    MAX(ua.created_at) as last_activity
FROM users u
LEFT JOIN staff s ON u.id = s.user_id AND s.is_active = TRUE
LEFT JOIN user_activities ua ON u.id = ua.user_id
GROUP BY u.id, u.username, u.created_at;

-- Tetikleyiciler (triggers)
DELIMITER $$

-- Kullanıcı güncellendiğinde updated_at otomatik güncelle
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

-- Staff rolü eklendiğinde log kaydet
CREATE TRIGGER IF NOT EXISTS log_staff_addition
    AFTER INSERT ON staff
    FOR EACH ROW
BEGIN
    INSERT INTO user_activities (user_id, activity_type, activity_data, created_at)
    VALUES (NEW.user_id, 'api_call', JSON_OBJECT('action', 'staff_role_added', 'role_name', NEW.role_name), CURRENT_TIMESTAMP);
END$$

DELIMITER ;

-- İndeksleri optimize et
OPTIMIZE TABLE users, staff, discord_roles, discord_members, server_stats, user_activities, api_logs, system_settings;

-- Başarılı kurulum mesajı
SELECT 'PX Development Database Schema created successfully!' as message;
SELECT 'Don''t forget to:' as reminder_1;
SELECT '1. Update web.json with your database credentials' as reminder_2;
SELECT '2. Replace your_admin_discord_id with actual Discord ID' as reminder_3;
SELECT '3. Create database user with proper permissions' as reminder_4;
SELECT '4. Configure Discord bot settings' as reminder_5;
