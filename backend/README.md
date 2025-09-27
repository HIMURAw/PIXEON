# PX Development Backend API

Discord sunucu yönetimi için geliştirilmiş Node.js backend API'si.

## 🚀 Özellikler

- **Express.js** web framework
- **MySQL** veritabanı entegrasyonu
- **Discord.js** bot entegrasyonu
- **JWT** kimlik doğrulama
- **Rate limiting** ve güvenlik
- **RESTful API** yapısı
- **Staff yönetimi**
- **Kullanıcı yönetimi**

## 📋 Gereksinimler

- Node.js 18+
- MySQL 8.0+
- Discord Bot Token

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env
```

3. **Environment değişkenlerini düzenleyin:**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pxdev_discord
DB_USER=root
DB_PASSWORD=your_password

# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_GUILD_ID=your_discord_server_id

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

4. **MySQL veritabanını oluşturun:**
```sql
CREATE DATABASE pxdev_discord;
```

5. **Sunucuyu başlatın:**
```bash
# Development
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /health` - Sunucu durumu

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi
- `PUT /api/auth/profile` - Profil güncelleme

### Discord
- `GET /api/discord/guild` - Sunucu bilgisi
- `GET /api/discord/members` - Tüm üyeler
- `GET /api/discord/staff` - Staff üyeleri
- `GET /api/discord/roles` - Roller
- `GET /api/discord/member/:id` - Belirli üye
- `GET /api/discord/staff/cached` - Önbelleklenmiş staff

### Staff Management
- `GET /api/staff` - Tüm staff üyeleri
- `GET /api/staff/:id` - Belirli staff üyesi
- `POST /api/staff/refresh` - Discord'dan veri yenileme
- `PUT /api/staff/:id/role` - Staff rolü güncelleme
- `DELETE /api/staff/:id` - Staff üyesi silme

### User Management
- `GET /api/user` - Tüm kullanıcılar (admin)
- `GET /api/user/:id` - Belirli kullanıcı
- `PUT /api/user/:id` - Kullanıcı güncelleme
- `DELETE /api/user/:id` - Kullanıcı silme (admin)

## 🔧 Konfigürasyon

### Discord Bot Kurulumu

1. [Discord Developer Portal](https://discord.com/developers/applications) üzerinden bot oluşturun
2. Bot token'ını alın
3. Bot'u sunucunuza davet edin
4. Gerekli izinleri verin:
   - View Channels
   - Send Messages
   - Manage Roles
   - View Server Insights

### MySQL Kurulumu

```sql
CREATE DATABASE pxdev_discord;
CREATE USER 'pxdev_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON pxdev_discord.* TO 'pxdev_user'@'localhost';
FLUSH PRIVILEGES;
```

## 🏗️ Proje Yapısı

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MySQL bağlantısı
│   │   └── discord.js       # Discord API entegrasyonu
│   ├── middleware/
│   │   ├── auth.js          # Kimlik doğrulama
│   │   ├── errorHandler.js  # Hata yönetimi
│   │   └── notFound.js      # 404 handler
│   ├── routes/
│   │   ├── auth.js          # Kimlik doğrulama route'ları
│   │   ├── discord.js       # Discord API route'ları
│   │   ├── staff.js         # Staff yönetimi route'ları
│   │   └── user.js          # Kullanıcı yönetimi route'ları
│   └── server.js            # Ana sunucu dosyası
├── .env.example             # Environment değişkenleri örneği
├── package.json             # Proje bağımlılıkları
└── README.md               # Bu dosya
```

## 🔒 Güvenlik

- **Helmet.js** güvenlik header'ları
- **Rate limiting** API koruması
- **JWT** token tabanlı kimlik doğrulama
- **CORS** konfigürasyonu
- **Input validation** ve sanitization
- **Error handling** güvenli hata mesajları

## 📊 Veritabanı Şeması

### Users Tablosu
- `id` - Birincil anahtar
- `discord_id` - Discord kullanıcı ID'si
- `username` - Kullanıcı adı
- `display_name` - Görünen ad
- `avatar_url` - Avatar URL'si
- `email` - E-posta adresi
- `created_at` - Oluşturulma tarihi
- `updated_at` - Güncellenme tarihi

### Staff Tablosu
- `id` - Birincil anahtar
- `user_id` - Kullanıcı referansı
- `role_name` - Rol adı
- `role_color` - Rol rengi
- `permissions` - İzinler (JSON)
- `is_active` - Aktif durumu
- `joined_at` - Katılım tarihi

### Discord Roles Tablosu
- `id` - Birincil anahtar
- `role_id` - Discord rol ID'si
- `role_name` - Rol adı
- `role_color` - Rol rengi
- `permissions` - Discord izinleri
- `position` - Rol pozisyonu

### Discord Members Tablosu
- `id` - Birincil anahtar
- `member_id` - Discord üye ID'si
- `user_id` - Kullanıcı referansı
- `username` - Kullanıcı adı
- `display_name` - Görünen ad
- `avatar_url` - Avatar URL'si
- `roles` - Roller (JSON)
- `joined_at` - Katılım tarihi
- `premium_since` - Premium başlangıç tarihi
- `is_bot` - Bot durumu
- `last_updated` - Son güncelleme

## 🚀 Deployment

### Docker ile Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### PM2 ile Production

```bash
npm install -g pm2
pm2 start src/server.js --name "pxdev-backend"
pm2 save
pm2 startup
```

## 📝 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Discord**: PX Development Server
- **Website**: https://pxdev.com
- **Email**: info@pxdev.com