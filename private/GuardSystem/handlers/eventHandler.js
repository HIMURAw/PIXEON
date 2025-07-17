const fs = require('fs');
const path = require('path');

/**
 * Event Handler - Events klasöründeki tüm event dosyalarını yükler
 * @param {Client} client - Discord client instance
 */
function loadEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
    
    // Events klasörü yoksa oluştur
    if (!fs.existsSync(eventsPath)) {
        fs.mkdirSync(eventsPath, { recursive: true });
        console.log('\x1b[36m[PX-Guard]\x1b[0m Events klasörü oluşturuldu');
        return;
    }
    
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    if (eventFiles.length === 0) {
        console.log('\x1b[33m[PX-Guard]\x1b[0m Events klasöründe event dosyası bulunamadı');
        return;
    }
    
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        
        if (!event.name) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Event dosyasında 'name' özelliği eksik: ${file}`);
            continue;
        }
        
        if (!event.execute) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Event dosyasında 'execute' fonksiyonu eksik: ${file}`);
            continue;
        }
        
        try {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
            
        } catch (error) {
            console.error(`\x1b[31m[PX-Guard]\x1b[0m Event yükleme hatası (${file}):`, error);
        }
    }
}

module.exports = loadEvents; 