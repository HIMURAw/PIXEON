<?php
/**
 * PXDevelopment License System - PHP Version
 * 
 * Bu script, PHP uygulamaları için lisans kontrol sistemi sağlar.
 */

$data = [];
$lcnstatus = null;

/**
 * Public IP adresini al
 */
function getPublicIP() {
    try {
        $ip = file_get_contents('http://api.ipify.org/');
        return trim($ip);
    } catch (Exception $e) {
        echo "IP alma hatası: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * HTTP isteği gönder
 */
function performHttpRequest($url) {
    try {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => 'Content-Type: application/json',
                'timeout' => 5
            ]
        ]);
        
        $response = file_get_contents($url, false, $context);
        return trim($response);
    } catch (Exception $e) {
        echo "HTTP istek hatası: " . $e->getMessage() . "\n";
        return null;
    }
}

/**
 * Başarılı lisans mesajını yazdır
 */
function printSuccessMessage() {
    echo "
                    [+]
                    [+]
                    [+]    ooooooooo.   ooooooo  ooooo oooooooooo.
                    [+]    `888   `Y88.  `8888    d8'  `888'   `Y8b
                    [+]     888   .d88'    Y888..8P     888      888  .ooooo.  oooo    ooo
                    [+]     888ooo88P'      `8888'      888      888 d88' `88b  `88.  .8'
                    [+]     888            .8PY888.     888      888 888ooo888   `88..8'
                    [+]     888           d8'  `888b    888     d88' 888    .o    `888'
                    [+]    o888o        o888o  o88888o o888bood8P'   `Y8bod8P'     `8'
                    [+]
                    [+]
                    \n";
    
    echo "
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
                    \n";
}

/**
 * Lisans kontrolü yap
 */
function checkLicense() {
    global $data, $lcnstatus;
    
    while (true) {
        try {
            // IP adresini al
            $userIp = getPublicIP();
            if (!$userIp) {
                echo "IP adresi alınamadı!\n";
                $lcnstatus = false;
                break;
            }
            
            $url = "http://VDSIP:3000/check_ip?ip=" . $userIp;
            
            // Lisans kontrolü
            $response = performHttpRequest($url);
            
            if ($response === "VALID") {
                // Başarılı lisans
                printSuccessMessage();
                $lcnstatus = true;
            } else {
                $lcnstatus = false;
            }
            
            // 1 saniye bekle
            sleep(1);
            
            if ($lcnstatus !== null) {
                break;
            }
            
        } catch (Exception $e) {
            echo "Lisans kontrol hatası: " . $e->getMessage() . "\n";
            $lcnstatus = false;
        }
    }
    
    if (!$lcnstatus) {
        while (true) {
            echo "\033[31m[License]\033[0m invalid license...\n";
            $data[] = "invalid license";
            exit(1);
        }
    }
}

// Programı başlat
echo "🔐 Starting license check...\n";
checkLicense();
?> 