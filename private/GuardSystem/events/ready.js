module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`\x1b[32m[PX-Guard]\x1b[0m ${client.user.displayName} olarak giriş yapıldı!`);
        
        // Bot durumunu ayarla
        client.user.setActivity('PX Development', { type: 'WATCHING' });
    }
}; 