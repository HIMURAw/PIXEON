# 🔐 PXDevelopment License System - All Languages

Bu klasör, farklı programlama dilleri için lisans kontrol sistemlerini içerir.

## 📁 Dosya Yapısı

```
licanse/
├── licanse.lua          # FiveM/RedM Lua Script
├── licanse.java         # Standalone Java Application
├── licanse.js           # Node.js Application
├── licanse.py           # Python Application
├── licanse.php          # PHP Script
├── licanse.cs           # C# Application
├── licanse.go           # Go Application
├── licanse.rb           # Ruby Script
├── licanse.ps1          # PowerShell Script
└── LicanseMCPlugin/     # Minecraft Plugin
    ├── LicensePlugin.java
    ├── plugin.yml
    └── README_Minecraft.md
```

## 🚀 Kurulum ve Kullanım

### **1. Lua (FiveM/RedM)**
```bash
# Dosyayı resource klasörüne kopyalayın
# VDSIP yerine sunucu IP'nizi yazın
# server.cfg'ye ekleyin: ensure licanse
```

### **2. Java (Standalone)**
```bash
# Derle
javac licanse.java

# Çalıştır
java LicenseChecker
```

### **3. JavaScript (Node.js)**
```bash
# Bağımlılıkları yükle
npm install

# Çalıştır
node licanse.js
```

### **4. Python**
```bash
# Bağımlılıkları yükle
pip install requests

# Çalıştır
python licanse.py
```

### **5. PHP**
```bash
# Çalıştır
php licanse.php
```

### **6. C#**
```bash
# Derle
dotnet build

# Çalıştır
dotnet run
```

### **7. Go**
```bash
# Çalıştır
go run licanse.go
```

### **8. Ruby**
```bash
# Çalıştır
ruby licanse.rb
```

### **9. PowerShell**
```powershell
# Çalıştır
.\licanse.ps1
```

### **10. Minecraft Plugin**
```bash
# JAR dosyasını plugins/ klasörüne kopyalayın
# Sunucuyu yeniden başlatın
```

## ⚙️ Konfigürasyon

### **Sunucu IP'sini Ayarlayın**
Her dosyada `VDSIP` yerine kendi sunucu IP'nizi yazın:

**Lua:**
```lua
local url = "http://YOUR_SERVER_IP:3000/check_ip?ip=" .. userIp
```

**Java:**
```java
String url = "http://YOUR_SERVER_IP:3000/check_ip?ip=" + userIp;
```

**JavaScript:**
```javascript
const url = `http://YOUR_SERVER_IP:3000/check_ip?ip=${userIp}`;
```

**Python:**
```python
url = f"http://YOUR_SERVER_IP:3000/check_ip?ip={user_ip}"
```

**PHP:**
```php
$url = "http://YOUR_SERVER_IP:3000/check_ip?ip=" . $userIp;
```

**C#:**
```csharp
string url = $"http://YOUR_SERVER_IP:3000/check_ip?ip={userIp}";
```

**Go:**
```go
url := fmt.Sprintf("http://YOUR_SERVER_IP:3000/check_ip?ip=%s", userIP)
```

**Ruby:**
```ruby
url = "http://YOUR_SERVER_IP:3000/check_ip?ip=#{user_ip}"
```

**PowerShell:**
```powershell
$url = "http://YOUR_SERVER_IP:3000/check_ip?ip=$userIP"
```

## 🔧 API Gereksinimleri

Tüm diller şu API endpoint'ini kullanır:
```
GET http://YOUR_SERVER_IP:3000/check_ip?ip=IP_ADDRESS
```

**Yanıtlar:**
- `VALID` - Lisans geçerli
- `INVALID` - Lisans geçersiz
- `ERROR` - Sunucu hatası

## 📊 Özellikler

### **Her Dilde Ortak Özellikler:**
- ✅ Otomatik IP kontrolü (`api.ipify.org`)
- ✅ Lisans doğrulama
- ✅ HIMURA ASCII art
- ✅ Hata yönetimi
- ✅ Timeout koruması (5 saniye)
- ✅ 1 saniye bekleme süresi

### **Dil Özel Özellikler:**

**Lua (FiveM):**
- ✅ Citizen.CreateThread kullanımı
- ✅ PerformHttpRequest entegrasyonu
- ✅ Resource durdurma

**Java:**
- ✅ HttpURLConnection
- ✅ Async işlemler
- ✅ Renkli console çıktısı

**JavaScript:**
- ✅ Node.js HTTP modülü
- ✅ Promise tabanlı
- ✅ Modern async/await

**Python:**
- ✅ Requests kütüphanesi
- ✅ Exception handling
- ✅ Clean syntax

**PHP:**
- ✅ file_get_contents
- ✅ stream_context_create
- ✅ Exception handling

**C#:**
- ✅ HttpClient
- ✅ Async/await
- ✅ Modern .NET

**Go:**
- ✅ net/http paketi
- ✅ Goroutines
- ✅ Error handling

**Ruby:**
- ✅ Net::HTTP
- ✅ Timeout handling
- ✅ Clean syntax

**PowerShell:**
- ✅ Invoke-WebRequest
- ✅ Color output
- ✅ Windows native

**Minecraft Plugin:**
- ✅ Bukkit/Spigot API
- ✅ Async tasks
- ✅ Player management

## 🛡️ Güvenlik

### **Her Dilde:**
- ✅ Timeout koruması
- ✅ HTTP hata yönetimi
- ✅ Network bağlantı kontrolü
- ✅ Input validation

### **Ek Güvenlik:**
- ✅ IP format kontrolü
- ✅ SSL/TLS desteği
- ✅ User-Agent headers
- ✅ Error logging

## 📝 Kullanım Örnekleri

### **FiveM Resource:**
```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

client_script 'licanse.lua'
```

### **Node.js Package:**
```json
{
  "name": "pxdevelopment-license",
  "version": "1.0.0",
  "main": "licanse.js",
  "scripts": {
    "start": "node licanse.js"
  }
}
```

### **Python Requirements:**
```txt
requests>=2.25.1
```

### **C# Project:**
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
</Project>
```

## 🐛 Sorun Giderme

### **Genel Sorunlar:**
1. **IP alınamıyor:** İnternet bağlantısını kontrol edin
2. **API hatası:** Sunucu IP'sini kontrol edin
3. **Timeout:** Firewall ayarlarını kontrol edin

### **Dil Özel Sorunlar:**

**Lua:** FiveM API versiyonunu kontrol edin
**Java:** Java versiyonunu kontrol edin (8+)
**JavaScript:** Node.js versiyonunu kontrol edin (14+)
**Python:** Python versiyonunu kontrol edin (3.6+)
**PHP:** PHP versiyonunu kontrol edin (7.0+)
**C#:** .NET versiyonunu kontrol edin (6.0+)
**Go:** Go versiyonunu kontrol edin (1.16+)
**Ruby:** Ruby versiyonunu kontrol edin (2.5+)
**PowerShell:** PowerShell versiyonunu kontrol edin (5.0+)

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- Discord sunucumuzda destek alın
- GitHub'da issue açın
- Email ile iletişime geçin

---

**PXDevelopment Team** 🚀 