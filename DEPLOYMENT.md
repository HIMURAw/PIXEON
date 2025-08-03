# 🚀 Deployment Guide

Bu rehber, projenizi production'a deploy etmek için gerekli adımları açıklar.

## 📋 Gereksinimler

- Node.js 18+
- MySQL/MariaDB
- Domain (örn: `yourdomain.com`)
- SSL Sertifikası (HTTPS için)

## 🔧 Environment Setup

### 1. Web API (Backend) Setup

```bash
cd apps/web
cp env.example .env
```

`.env` dosyasını düzenleyin:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database Configuration
DB_HOST=your-database-host.com
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=pxdevwebsitev3

# Discord OAuth Configuration
DISCORD_CLIENT_ID=1310954355884691488
DISCORD_CLIENT_SECRET=jJVJw74-NfIh7BOHcRBEFO-NCB5hcqXA
DISCORD_GUILD_ID=1269430268402335867
DISCORD_REDIRECT_URI=https://yourdomain.com/auth/discord/callback

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret
```

### 2. UI (Frontend) Setup

```bash
cd apps/UI
cp env.example .env
```

`.env` dosyasını düzenleyin:

```env
# API URL
REACT_APP_API_URL=https://api.yourdomain.com

# Environment
REACT_APP_ENV=production
```

## 🌐 Domain Configuration

### Discord Developer Portal

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. Uygulamanızı seçin
3. **OAuth2 > Redirects** bölümünde:
   - `https://yourdomain.com/auth/discord/callback` ekleyin
4. **OAuth2 > Scopes** bölümünde:
   - `identify`
   - `email`
   - `guilds`
   - `guilds.members.read`

### DNS Configuration

```
# Ana domain
yourdomain.com -> Frontend (React App)

# API subdomain
api.yourdomain.com -> Backend (Node.js API)
```

## 🚀 Deployment Steps

### 1. Backend Deployment

```bash
# Dependencies yükle
cd apps/web
npm install

# Production build
npm run build

# PM2 ile başlat
pm2 start dist/index.js --name "pxdev-api"
```

### 2. Frontend Deployment

```bash
# Dependencies yükle
cd apps/UI
npm install

# Production build
npm run build

# Nginx ile serve et
sudo cp -r build/* /var/www/yourdomain.com/
```

### 3. Nginx Configuration

```nginx
# Frontend (yourdomain.com)
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /var/www/yourdomain.com;
        try_files $uri $uri/ /index.html;
    }
}

# Backend API (api.yourdomain.com)
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL Setup (Let's Encrypt)

```bash
# Certbot yükle
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## 🔄 Environment Değişiklikleri

Domain değiştirdiğinizde sadece şu dosyaları güncelleyin:

1. **Backend**: `apps/web/.env`
   - `DISCORD_REDIRECT_URI`
   - `FRONTEND_URL`

2. **Frontend**: `apps/UI/.env`
   - `REACT_APP_API_URL`

3. **Discord Developer Portal**
   - OAuth2 Redirect URI'ları

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Error**: Backend'de CORS ayarlarını kontrol edin
2. **Database Connection**: Database host ve credentials'ları kontrol edin
3. **Discord OAuth**: Redirect URI'ların doğru olduğundan emin olun

### Logs

```bash
# Backend logs
pm2 logs pxdev-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

Sorun yaşarsanız:
1. Logları kontrol edin
2. Environment variables'ları doğrulayın
3. Discord Developer Portal ayarlarını kontrol edin 