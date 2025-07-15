# 🔐 PXDevelopment Lisans API Sistemi

Bu API, sunucu lisanslarını doğrulamak için kullanılan güvenli bir sistemdir.

## 📋 API Endpoints

### 1. IP Doğrulama API'si
**Endpoint:** `GET /check_ip`

**Parametreler:**
- `ip` (zorunlu): Doğrulanacak IP adresi
- `server_name` (opsiyonel): Sunucu adı
- `license_key` (opsiyonel): Lisans anahtarı

**Örnek Kullanım:**
```bash
GET http://localhost:3000/check_ip?ip=192.168.1.1
```

**Başarılı Yanıt (VALID):**
```json
{
    "status": "VALID",
    "message": "IP address is licensed",
    "license": {
        "id": 1,
        "server_name": "HIMURA Server",
        "server_ip": "192.168.1.1",
        "added_by": "Admin",
        "created_at": "2024-01-15T10:30:00.000Z"
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Geçersiz Yanıt (INVALID):**
```json
{
    "status": "INVALID",
    "message": "IP address is not licensed",
    "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Lisans Durumu Kontrolü API'si
**Endpoint:** `GET /license_status`

**Parametreler:**
- `ip` (zorunlu): Kontrol edilecek IP adresi

**Örnek Kullanım:**
```bash
GET http://localhost:3000/license_status?ip=192.168.1.1
```

**Başarılı Yanıt:**
```json
{
    "status": "SUCCESS",
    "licensed": true,
    "license": {
        "id": 1,
        "server_name": "HIMURA Server",
        "server_ip": "192.168.1.1",
        "added_by": "Admin",
        "created_at": "2024-01-15T10:30:00.000Z"
    }
}
```

## 🔔 Discord Webhook Entegrasyonu

API, tüm lisans doğrulama işlemlerini Discord webhook'larına gönderir:

### Webhook Mesajları:
- ✅ **VALID**: Başarılı lisans doğrulaması
- ❌ **INVALID**: Geçersiz IP adresi
- ⚠️ **ERROR**: Veritabanı hatası

### Webhook Konfigürasyonu:
`config.json` dosyasında aşağıdaki ayarları kullanır:
```json
{
    "discord": {
        "log": {
            "serverWebhookURL": "WEBHOOK_URL",
            "WebhookName": "PXDevelopment Log",
            "WebhookLogoURL": "LOGO_URL"
        }
    }
}
```

## 🛡️ Güvenlik Özellikleri

1. **IP Format Doğrulaması**: Geçerli IPv4 formatı kontrolü
2. **Veritabanı Güvenliği**: SQL injection koruması
3. **Detaylı Loglama**: Tüm işlemler loglanır
4. **Discord Entegrasyonu**: Gerçek zamanlı bildirimler

## 📊 Veritabanı Yapısı

```sql
CREATE TABLE licenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_name VARCHAR(255) NOT NULL,
    server_ip VARCHAR(45) UNIQUE NOT NULL,
    added_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Veritabanını yapılandırın:**
`config.json` dosyasında veritabanı ayarlarını güncelleyin.

3. **Discord webhook'larını ayarlayın:**
`config.json` dosyasında webhook URL'lerini güncelleyin.

4. **Sunucuyu başlatın:**
```bash
node server.js
```

## 🔧 Konfigürasyon

`config.json` dosyasında aşağıdaki ayarları yapılandırın:

```json
{
    "dev": {
        "port": "3000",
        "secretKey": "your-secret-key"
    },
    "db": {
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "fivemwebpanel"
    },
    "discord": {
        "log": {
            "serverWebhookURL": "your-discord-webhook-url",
            "WebhookName": "PXDevelopment Log",
            "WebhookLogoURL": "your-logo-url"
        }
    }
}
```

## 📝 Kullanım Örnekleri

### JavaScript ile API Kullanımı:
```javascript
// IP doğrulama
fetch('http://localhost:3000/check_ip?ip=192.168.1.1')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'VALID') {
            console.log('Lisans geçerli:', data.license);
        } else {
            console.log('Lisans geçersiz:', data.message);
        }
    });

// Lisans durumu kontrolü
fetch('http://localhost:3000/license_status?ip=192.168.1.1')
    .then(response => response.json())
    .then(data => {
        console.log('Lisans durumu:', data.licensed);
    });
```

### cURL ile API Kullanımı:
```bash
# IP doğrulama
curl "http://localhost:3000/check_ip?ip=192.168.1.1"

# Lisans durumu kontrolü
curl "http://localhost:3000/license_status?ip=192.168.1.1"
```

## 🐛 Hata Kodları

- `400`: Geçersiz parametreler
- `500`: Sunucu hatası
- `200`: Başarılı işlem

## 📞 Destek

Herhangi bir sorun yaşarsanız, Discord sunucumuzda destek alabilirsiniz.

---

**PXDevelopment Team** 🚀 