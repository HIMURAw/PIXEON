module.exports = {
    name: 'warn',
    once: false,
    execute(info) {
        console.warn('\x1b[33m[PX-Guard]\x1b[0m Discord.js uyarısı:', info);
        
        // Uyarı detaylarını logla
        const warnInfo = {
            message: info,
            timestamp: new Date().toISOString(),
            type: 'WARN'
        };
        
        console.warn('\x1b[33m[PX-Guard]\x1b[0m Uyarı detayları:', JSON.stringify(warnInfo, null, 2));
    }
}; 