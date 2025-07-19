/*

Bu Web sistesi HIMURA tarafından sıfırdan kodlanmıştır


*/

module.exports = {
  // Geliştirme ortamı ayarları
  dev: {
    port: "3000",            // Web server'ın çalışacağı port
    secretKey: "perronunanasininaminiyalayanutkininsikininkili", // Oturum ve şifreleme için anahtar
    encryptionKey: "perronunanasininaminiyalayanutkininsikininkiliamacrypticin", // Ekstra şifreleme anahtarı
    domain: "localhost"
  },
  // Veritabanı bağlantı ayarları
  db: {
    host: "localhost",       // MySQL sunucu adresi
    user: "root",            // MySQL kullanıcı adı
    password: "",            // MySQL şifresi
    database: "fivemwebpanel" // Kullanılacak veritabanı adı
  },
  // Discord bot ve sunucu ayarları
  discord: {
    token: "MTIzODI2ODU2MjE3MTIzNjM4NA.GxHzP7.2p7U9PZmEBhvy2JVXGVCUltY1UHtQc2SsSdLv8", // Ana Discord bot token'ı
    clientSecret: "qRcEVZsH2j4esmz0P14jNFVuLA8NBnCH", // Discord OAuth2 client secret
    clientId: "1238268562171236384", // Discord uygulama (bot) client ID'si
    guidid: "1269430268402335867", // Discord sunucu (guild) ID'si
    defaultRoleId: "1273294014321266780", // Sunucuya yeni giren kişiye verilecek rol
    serverName: "PXDevelopment", // Sunucu adı (görsel amaçlı)
    serverLogo: "https://cdn.discordapp.com/attachments/1392486533696720918/1393597767409995806/pxdev-photoaidcom-cropped.png?ex=6874694f&is=687317cf&hm=ddf111401e57619d81552fec3b0fb10fc8d3ce92ee167ed7a721abe7e6129c5b&", // Sunucu logosu (görsel amaçlı)
    voicechannel: "1391498861960237219", // Ana ses kanalı ID'si
    AnnoncementChannel: "1392487272666108024", // Duyuru kanalı ID'si
    commaentChannel: "1292529004577816750", // Yorum/feedback kanalı ID'si
    redirectUri: "http://localhost:3000/auth/discord/callback", // Discord OAuth2 callback URL'si
    adminRoleId: "1392601717555855490", // Discord sunucusundaki admin rolünün ID'si
    supportRoleId: "1269431116499128414", // Destek ekibi rol ID'si
    // Discord log ve webhook ayarları
    log: {
      WebhookName: "PXDevelopment Log", // Webhook ile gönderilecek mesajlarda görünen isim
      WebhookLogoURL: "https://cdn.discordapp.com/attachments/1392486533696720918/1393597767409995806/pxdev-photoaidcom-cropped.png?ex=6874694f&is=687317cf&hm=ddf111401e57619d81552fec3b0fb10fc8d3ce92ee167ed7a721abe7e6129c5b&", // Webhook avatarı
      LoginLogoutWebhookURL: "https://discord.com/api/webhooks/1394057251697852607/0tekx9EjMGp0F9_ZE9Yy186HiC4rrCx6qTRIcEcAGZI7SHA83WgX0CTpEtzC3qpevI8o", // Giriş/çıkış logları için webhook
      RoleLogWebhookURL: "https://discord.com/api/webhooks/1394057323411931287/eJYyiJdzaSs9X829j_KFojL_zdfpkONS1eV3qIihG5TmC4yY2qopmMGpJYvCshrNacN8", // Rol değişiklik logları için webhook
      MessageWebhookURL: "https://discord.com/api/webhooks/1394057279799558347/-6o4QPDZA77qnbiFcm_hhp21gTRjv9g24T51KyAPGTgkDXq0a7UCezZ99MZHFc9gewrS", // Mesaj logları için webhook
      VoiceWebhookURL: "https://discord.com/api/webhooks/1394057300217565349/GVdEAOAPnmPm59dTPhLER3lRifn47ltK1RXRbxY2P__nky-y7ZMo2b6J5f9bVzgbfNkX", // Ses kanalı logları için webhook
      ChannelWebhookURL: "https://discord.com/api/webhooks/1394057343410634904/GzV1Iy5lTJ1L6dlKsDcV-fXbMIrSrSdnylpcL11IbObCTyLh6VYXQ0vwbx35ujjhW7Rl", // Kanal logları için webhook
      emojiWebhookURL: "https://discord.com/api/webhooks/1394057365896302707/Ri0IqTT3DKnzbcNpg-HP3jvylVY6mU24DSYN1EBbppRCbenLjqfdRFdhGPZRO3ZmU0CI", // Emoji logları için webhook
      inviteWebhookURL: "https://discord.com/api/webhooks/1394057387547033611/eQvG_hpwkqm6ZjWqHlWr2aHm7_9tTjziheLahX2t2XpbE5xmQEgKeLi8jboHDRcFqOLM", // Davet logları için webhook
      serverWebhookURL: "https://discord.com/api/webhooks/1394057405939318806/zb2LKaf7DqkXStywf-yGkbX5_X6vzsV8ufTynRntJ9Ah97bJlScCzwpXEVljDZxHG3uE", // Sunucu ayar logları için webhook
      LicenseLog: "https://canary.discord.com/api/webhooks/1394481628331507864/F-usgjkiamRV7AWYUeM3OIHNrsJ95AH0JmcL7WnpfJnbez1VEebOSTJ-XUmRDzfT3b3n", // Lisans işlemleri için webhook
      GuardLog: "https://discord.com/api/webhooks/1395185474645266612/Lo3ccLcZlp6C1DZZRAPaTEWOvSLzETuYzxpE1ns1LDuJHnTkdfc4ZYdYq0VSKDwP1iHF" // Guard sistemi logları için webhook
    },
    // Shop bot ve ödeme ayarları
    shopBot: {
      near: "Bu ürün çok yakında satışa çıkacak! Takipte kalın ve fırsatları kaçırmayın. 🎉", // Yakında çıkacak ürün mesajı
      seelLogChannel: "1395051347203592242",
      customerRoleId: "1283221241720864851", // Satın alanlara verilen rol ID'si
      feedbackChannelId: "1292529004577816750", // Feedback/yorum kanalı ID'si
      papara: "2061250544", // Papara ödeme numarası
      iban: "TR48 0004 6003 4588 8000 2038 65", // IBAN ile ödeme için hesap
      ibanName: "Yusuf Öztürk", // IBAN alıcı isim soyisim
      dolar: 40.17, // Dolar kuru (TL)
      euro: 46.97, // Euro kuru (TL)
      productCategoryIds: [ // Ürün kategorilerinin Discord kanal ID'leri
        "1271181568077201560",
        "1392450251843174430",
        "1392450503710998588"
      ]
    },
    // Ticket botu ayarları
    ticketBot: {
      ticket_bot_token: "MTMxMDk1NDM1NTg4NDY5MTQ4OA.GvqDnG.81bGzbI350WeT5Zmm2DdOr6pZ0vosUOJ5CkUA4", // Ticket sistemi için ayrı bot token'ı
      clientId: "1310954355884691488",
      catagory: "1269435075913846857",
      trascriptChannelID: "1394989578015867040"
    },
    partnerBot: {
      logChannel: '1395077219461759119',    // Başvuruların gideceği kanal
      categoryId: '1393597381630758973'  // Onaylanınca kanalın açılacağı kategori
    },
    guardBot: {
      guard_bot_token: "MTI0NzMyNTY3OTMyNjk4NjI1MA.GYfk5R.Sqhccp8RgabiVmT74ByzGa0i_SfnPzJBxSgLI0",
      guard_client_id: "1247325679326986250",
      guard_owner_id: "768372430631731210",
    }
  },
  // Web arayüzüyle ilgili ayarlar (şu an boş)
  web: {}
}; 