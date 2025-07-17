const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

/**
 * Command Handler - Commands klasöründeki tüm komut dosyalarını yükler
 * @param {Client} client - Discord client instance
 * @returns {Collection} Yüklenen komutların collection'ı
 */
function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../commands');
    
    // Commands klasörü yoksa oluştur
    if (!fs.existsSync(commandsPath)) {
        fs.mkdirSync(commandsPath, { recursive: true });
        console.log('\x1b[36m[PX-Guard]\x1b[0m Commands klasörü oluşturuldu');
        return new Collection();
    }
    
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    if (commandFiles.length === 0) {
        console.log('\x1b[33m[PX-Guard]\x1b[0m Commands klasöründe komut dosyası bulunamadı');
        return new Collection();
    }
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if (!command.data) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Komut dosyasında 'data' özelliği eksik: ${file}`);
            continue;
        }
        
        if (!command.execute) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Komut dosyasında 'execute' fonksiyonu eksik: ${file}`);
            continue;
        }
        
        try {
            client.commands.set(command.data.name, command);
        } catch (error) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Komut yükleme hatası (${file}):`, error);
        }
    }
    
    return client.commands;
}

/**
 * Interaction Handler - Slash komutları işler
 * @param {Client} client - Discord client instance
 */
function handleInteraction(client) {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
        
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m ${interaction.commandName} komutu bulunamadı`);
            return;
        }
        
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Komut çalıştırma hatası: ${interaction.commandName}`, error);
            
            const errorMessage = 'Komut çalıştırılırken bir hata oluştu!';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, flags: 64 });
            } else {
                await interaction.reply({ content: errorMessage, flags: 64 });
            }
        }
    });
}

/**
 * Register Commands - Slash komutları Discord'a kaydeder
 * @param {Client} client - Discord client instance
 */
async function registerCommands(client) {
    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }
    
    try {
        await client.application.commands.set(commands);
        console.log(`\x1b[32m[PX-Guard]\x1b[0m ${commands.length} komut başarıyla kaydedildi`);
    } catch (error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Komut kaydetme hatası:', error);
    }
}

module.exports = {
    loadCommands,
    handleInteraction,
    registerCommands
}; 