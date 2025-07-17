module.exports = {
    name: 'error',
    once: false,
    execute(error) {
        console.error('\x1b[31m[PX-Guard]\x1b[0m Bot hatası:', error);
        
        // Hata detaylarını logla
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            type: error.name
        };
        
        console.error('\x1b[31m[PX-Guard]\x1b[0m Hata detayları:', JSON.stringify(errorInfo, null, 2));
    }
}; 