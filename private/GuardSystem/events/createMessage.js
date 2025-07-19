const { pool } = require('../../DB/connect');
const Discord = require('discord.js');
const webhookLogger = require('../utils/webhookLogger');

// Basit küfür listesi (isteğe göre genişletilebilir)
const kufurler = [
  'aq', 'orospu', 'sik', 'piç', 'yarrak', 'ananı', 'anan', 'sikerim', 'sikik', 'salak', 'gerizekalı', 'mal', 'aptal', 'göt', 'pezevenk', 'kahpe', 'amına', 'amcık', 'amk', 'aq', 'mk', 'amq', 'amına koyim', 'amına koyayım'
];

// Link tespit regex'i
const linkRegex = /(https?:\/\/|www\.|discord\.gg|discordapp\.com\/invite|\.com|\.net|\.org|\.gg|\.xyz|\.tk|\.ml|\.io|\.me|\.pw|\.us|\.biz|\.info|\.co|\.uk|\.ru|\.de|\.jp|\.fr|\.au|\.br|\.in|\.tr)/i;

// Flood/spam kontrolü için kullanıcı başına mesaj zamanlarını tutan Map
const userMessageTimestamps = new Map();
const SPAM_LIMIT = 5; // 5 mesaj
const SPAM_INTERVAL = 4000; // 4 saniye
const TIMEOUT_DURATION = 60 * 1000; // 1 dakika susturma

module.exports = {
  name: 'messageCreate',
  once: false,
  /**
   * @param {import('discord.js').Message} message
   */
  async execute(message) {
    if (message.channel.type === Discord.ChannelType.DM) return;

    // Kullanıcı guard listesinde mi kontrol et
    let isGuard = false;
    try {
      const [userGuard] = await pool.query(
        'SELECT guard_level FROM discord_guard_users WHERE user_id = ? AND status = "active"',
        [message.author.id]
      );
      if (userGuard.length > 0) isGuard = true;
    } catch (err) {
      console.log('[PX-Guard] Guard kontrolü sırasında hata:', err);
    }

    // Flood/spam koruması (guard olmayanlar için)
    if (!isGuard && !message.author.bot) {
      const now = Date.now();
      const userId = message.author.id;
      if (!userMessageTimestamps.has(userId)) {
        userMessageTimestamps.set(userId, []);
      }
      const timestamps = userMessageTimestamps.get(userId);
      timestamps.push(now);
      // Son SPAM_LIMIT kadar mesajı tut
      if (timestamps.length > SPAM_LIMIT) timestamps.shift();
      userMessageTimestamps.set(userId, timestamps);
      // Eğer son SPAM_LIMIT mesaj SPAM_INTERVAL içinde atılmışsa spam olarak kabul et
      if (timestamps.length === SPAM_LIMIT && (timestamps[SPAM_LIMIT-1] - timestamps[0] < SPAM_INTERVAL)) {
        // Timeout (susturma) uygula
        try {
          if (message.member && message.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.ModerateMembers)) {
            await message.member.timeout(TIMEOUT_DURATION, 'Flood/Spam mesaj koruması');
            await message.channel.send({
              content: `<@${userId}> çok hızlı mesaj attığın için otomatik olarak 1 dakika susturuldun.`,
              allowedMentions: { users: [userId] }
            });
            // SQL log kaydı
            await pool.query(
              'INSERT INTO discord_guard_action_log (event_type, action, user_id, username, target_id, target_name, details) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                'floodSpam',
                'block',
                message.author.id,
                message.author.tag,
                message.author.id,
                message.author.tag,
                JSON.stringify({ channelId: message.channel.id, channelName: message.channel.name, guildId: message.guild.id, guildName: message.guild.name })
              ]
            );
            // Logla
            const embed = new Discord.EmbedBuilder()
              .setColor(0xffa500)
              .setTitle('⚠️ Flood/Spam Mesaj Tespit Edildi')
              .setDescription('Bir kullanıcı çok hızlı mesaj attığı için otomatik olarak susturuldu.')
              .addFields(
                { name: 'Kullanıcı', value: `${message.author.tag} (${userId})`, inline: true },
                { name: 'Kanal', value: `${message.channel.name ? '#' + message.channel.name : message.channel.id}`, inline: true },
                { name: 'Süre', value: '1 dakika', inline: true },
                { name: 'Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
              )
              .setTimestamp();
            await webhookLogger.sendWebhook(embed);
            // Kullanıcıyı tekrar tekrar susturmamak için zaman damgalarını temizle
            userMessageTimestamps.set(userId, []);
          }
        } catch (err) {
          console.log('[PX-Guard] Flood/Spam timeout uygulanırken hata:', err);
        }
      }
    }

    const content = message.content.toLowerCase();
    const kufurVarMi = kufurler.some(kufur => content.includes(kufur));
    const linkVarMi = !message.author.bot && linkRegex.test(content);

    if (kufurVarMi || linkVarMi) {
      try {
        await message.delete();
        let sebep = kufurVarMi ? 'küfür' : 'link';
        await message.channel.send({
          content: `<@${message.author.id}> mesajında ${sebep} tespit edildiği için silindi. Lütfen sunucu kurallarına uyunuz.`,
          allowedMentions: { users: [message.author.id] }
        });
        console.log(`[PX-Guard] ${message.author.tag} kullanıcısının mesajı '${sebep}' nedeniyle silindi.`);
        const embed = new Discord.EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('❌ Mesaj Silindi')
          .setDescription(`Bir mesaj silindi!`)
          .addFields(
            { name: '👤 Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: '📢 Kanal', value: `${message.channel.name ? '#' + message.channel.name : message.channel.id}`, inline: true },
            { name: '📝 Sebep', value: sebep, inline: true },
            { name: '💬 Mesaj', value: message.content || '(boş mesaj)', inline: false },
            { name: '🕒 Tarih', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
          )
          .setTimestamp();
        await webhookLogger.sendWebhook(embed);
      } catch (err) {
        console.log('[PX-Guard] Mesaj silinirken hata oluştu:', err);
      }
    }
  }
};
