const https = require('https');
const http = require('http');

let data = [];
let lcnstatus = null;

async function getPublicIP() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://api.ipify.org/', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data.trim());
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function performHttpRequest(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data.trim());
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

function printSuccessMessage() {
    console.log(`
                    [+]
                    [+]
                    [+]    ooooooooo.   ooooooo  ooooo oooooooooo.
                    [+]    \`888   \`Y88.  \`8888    d8'  \`888'   \`Y8b
                    [+]     888   .d88'    Y888..8P     888      888  .ooooo.  oooo    ooo
                    [+]     888ooo88P'      \`8888'      888      888 d88' \`88b  \`88.  .8'
                    [+]     888            .8PY888.     888      888 888ooo888   \`88..8'
                    [+]     888           d8'  \`888b    888     d88' 888    .o    \`888'
                    [+]    o888o        o888o  o88888o o888bood8P'   \`Y8bod8P'     \`8'
                    [+]
                    [+]
                    `);
    
    console.log(`
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    `);
}

async function checkLicense() {
    while (true) {
        try {
            // IP adresini al
            const userIp = await getPublicIP();
            const url = `http://VDSIP:3000/check_ip?ip=${userIp}`;
            
            // Lisans kontrolü
            const response = await performHttpRequest(url);
            
            if (response === "VALID") {
                // Başarılı lisans
                printSuccessMessage();
                lcnstatus = true;
            } else {
                lcnstatus = false;
            }
            
            // 1 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (lcnstatus !== null) {
                break;
            }
            
        } catch (error) {
            console.error('License check error:', error.message);
            lcnstatus = false;
        }
    }
    
    if (!lcnstatus) {
        while (true) {
            console.log('\x1b[31m[License]\x1b[0m invalid license...');
            data.push("invalid license");
            process.exit(1);
        }
    }
}

// Programı başlat
console.log('🔐 Starting license check...');
checkLicense().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
