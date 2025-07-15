# 🔐 PXDevelopment Minecraft License Plugin

Bu plugin, Minecraft sunucuları için lisans kontrol sistemi sağlar.

## 📋 Özellikler

- ✅ Otomatik IP kontrolü
- ✅ Lisans doğrulama
- ✅ Geçersiz lisansta sunucu kapatma
- ✅ Oyuncuları kick etme
- ✅ Detaylı loglama

## 🚀 Kurulum

### 1. **Plugin Dosyalarını Hazırlayın**
```
plugins/
└── PXDevelopmentLicense/
    ├── LicensePlugin.jar
    └── plugin.yml
```

### 2. **Sunucu IP'sini Ayarlayın**
`LicensePlugin.java` dosyasında `VDSIP` yerine kendi sunucu IP'nizi yazın:
```java
String url = "http://YOUR_SERVER_IP:3000/check_ip?ip=" + userIp;
```

### 3. **Plugin'i Derleyin**
```bash
# Maven kullanarak
mvn clean package

# Veya IDE'nizde derleyin
```

### 4. **Sunucuya Yükleyin**
- `LicensePlugin.jar` dosyasını `plugins/` klasörüne kopyalayın
- Sunucuyu yeniden başlatın

## ⚙️ Konfigürasyon

### **plugin.yml**
```yaml
name: PXDevelopment License
version: 1.0.0
main: com.pxdevelopment.license.LicensePlugin
api-version: 1.13
description: PXDevelopment License System for Minecraft Servers
author: PXDevelopment
```

## 🔧 Çalışma Mantığı

### **Başlangıç:**
1. Plugin yüklendiğinde lisans kontrolü başlar
2. Public IP adresi alınır
3. API'ye lisans kontrolü isteği gönderilir

### **Başarılı Lisans:**
- ✅ HIMURA ASCII art gösterilir
- ✅ Plugin normal çalışmaya devam eder
- ✅ Sunucu aktif kalır

### **Geçersiz Lisans:**
- ❌ Hata mesajları gösterilir
- ❌ Tüm oyuncular kick edilir
- ❌ Sunucu kapatılır

## 📊 Log Mesajları

### **Başarılı:**
```
[INFO] [+]
[INFO] [+]    ooooooooo.   ooooooo  ooooo oooooooooo.
[INFO] [+]    `888   `Y88.  `8888    d8'  `888'   `Y8b
[INFO] [+]     888   .d88'    Y888..8P     888      888  .ooooo.  oooo    ooo
[INFO] [+]     888ooo88P'      `8888'      888      888 d88' `88b  `88.  .8'
[INFO] [+]     888            .8PY888.     888      888 888ooo888   `88..8'
[INFO] [+]     888           d8'  `888b    888     d88' 888    .o    `888'
[INFO] [+]    o888o        o888o  o88888o o888bood8P'   `Y8bod8P'     `8'
[INFO] [+]
[INFO] [+]	   valid license | HIMURA ^0
[INFO] [+]	   ||@everyone @here||
```

### **Geçersiz:**
```
[SEVERE] [License] invalid license...
[INFO] Player kicked: License is invalid! Server is shutting down.
```

## 🛡️ Güvenlik

- ✅ Timeout koruması (5 saniye)
- ✅ HTTP hata yönetimi
- ✅ Network bağlantı kontrolü
- ✅ Async işlemler

## 🔧 API Gereksinimleri

Plugin şu API endpoint'ini kullanır:
```
GET http://YOUR_SERVER_IP:3000/check_ip?ip=IP_ADDRESS
```

**Yanıtlar:**
- `VALID` - Lisans geçerli
- `INVALID` - Lisans geçersiz
- `ERROR` - Sunucu hatası

## 📝 Kullanım Örnekleri

### **Komut Satırından:**
```bash
# Plugin'i derle
javac -cp "spigot.jar" LicensePlugin.java

# JAR dosyası oluştur
jar cvf LicensePlugin.jar *.class plugin.yml

# Sunucuya kopyala
cp LicensePlugin.jar /path/to/minecraft/plugins/
```

### **Maven ile:**
```xml
<dependency>
    <groupId>org.spigotmc</groupId>
    <artifactId>spigot-api</artifactId>
    <version>1.19.4-R0.1-SNAPSHOT</version>
    <scope>provided</scope>
</dependency>
```

## 🐛 Sorun Giderme

### **Plugin Yüklenmiyor:**
- `plugin.yml` dosyasının doğru olduğundan emin olun
- Java versiyonunun uyumlu olduğunu kontrol edin
- Sunucu loglarını kontrol edin

### **Lisans Kontrolü Başarısız:**
- API sunucusunun çalıştığından emin olun
- IP adresinin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### **Network Hatası:**
- İnternet bağlantısını kontrol edin
- `api.ipify.org` erişilebilirliğini test edin
- Timeout sürelerini artırın

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- Discord sunucumuzda destek alın
- GitHub'da issue açın
- Email ile iletişime geçin

---

**PXDevelopment Team** 🚀 