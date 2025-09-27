-- Fix timestamp issues in discord_members table
-- Bu script mevcut tabloyu düzeltir veya yeniden oluşturur

USE pxdev_discord;

-- Mevcut tabloyu kontrol et ve gerekirse sil
DROP TABLE IF EXISTS discord_members;

-- Tabloyu doğru şekilde yeniden oluştur
CREATE TABLE discord_members (
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

-- Diğer tablolarda da benzer sorunlar varsa düzelt
-- staff tablosunu kontrol et
ALTER TABLE staff MODIFY COLUMN joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- discord_roles tablosunu kontrol et
ALTER TABLE discord_roles MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE discord_roles MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- users tablosunu kontrol et
ALTER TABLE users MODIFY COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users MODIFY COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

SELECT 'Timestamp issues fixed successfully!' as message;