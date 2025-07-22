# DiscordWebSync

Discord sunucu mesajlarını web sitesinde göstermek için basit PHP/HTML/JS entegrasyonu.

Simple PHP/HTML/JS integration to display Discord server messages on a website.

**Geliştirici / Developer:** CanBye

## Özellikler / Features

- Birden fazla Discord kanalından mesaj çekme / Fetch messages from multiple Discord channels
- Text mesajları, kullanıcı profilleri, tarih/saat gösterimi / Text messages, user profiles, date/time display
- Görsel ve video desteği / Image and video support
- Discord benzeri tema / Discord-like theme
- Responsive tasarım / Responsive design
- JSON cache sistemi / JSON cache system
- Türkçe/İngilizce dil desteği / Turkish/English language support

## Kurulum / Installation

1. `api/config.php` dosyasında Discord bot token ve kanal ID'lerini ayarlayın / Configure Discord bot token and channel IDs in `api/config.php`
2. Web sunucusunda PHP desteği gereklidir / Web server with PHP support required
3. `cache/` klasörüne yazma izni verin / Give write permissions to `cache/` folder

## Kullanım / Usage

1. Discord Developer Portal'dan bot oluşturun / Create a bot from Discord Developer Portal
2. Bot token'ını `api/config.php` dosyasına ekleyin / Add bot token to `api/config.php`
3. İstediğiniz kanal ID'lerini ekleyin / Add your desired channel IDs
4. **ÖNEMLİ / IMPORTANT:** Proje bir web sunucusunda çalışmalı (CORS kısıtlamaları nedeniyle) / Project must run on a web server (due to CORS restrictions)

### Yerel Test Sunucusu Kurulumu / Local Test Server Setup

#### PHP Built-in Server (Önerilen / Recommended)
```bash
php -S localhost:8000
```
Daha sonra tarayıcıda `http://localhost:8000` adresini açın / Then open `http://localhost:8000` in browser

#### XAMPP/WAMP kullanımı / XAMPP/WAMP Usage
1. XAMPP veya WAMP kurun / Install XAMPP or WAMP
2. Proje klasörünü `htdocs` içine kopyalayın / Copy project folder to `htdocs`
3. `http://localhost/DiscordWebSync` adresini açın / Open `http://localhost/DiscordWebSync`

#### Live Server (VS Code)
1. VS Code'da Live Server eklentisini kurun / Install Live Server extension in VS Code
2. `index.html` dosyasına sağ tıklayıp "Open with Live Server" seçin / Right-click `index.html` and select "Open with Live Server"

## API Endpoints

- `api/messages.php` - Discord mesajlarını çeker ve JSON formatında döner / Fetches Discord messages and returns in JSON format

## Dosya Yapısı / File Structure

```
DiscordWebSync/
├── index.html              # Ana sayfa / Main page
├── style.css               # Discord benzeri tema / Discord-like theme
├── script.js               # Frontend JavaScript + dil desteği / Frontend JavaScript + language support
├── api/
│   ├── messages.php         # Discord API endpoint
│   └── config.php          # Bot token ve kanal ayarları / Bot token and channel settings
├── cache/                   # JSON cache dosyaları / JSON cache files
└── README.md               # Bu dosya / This file
```

## Lisans / License

MIT License