# PXDevelopment License System - PowerShell Version
# Bu script, PowerShell uygulamaları için lisans kontrol sistemi sağlar.

$data = @()
$lcnstatus = $null

function Get-PublicIP {
    # Public IP adresini al
    try {
        $response = Invoke-WebRequest -Uri "http://api.ipify.org/" -TimeoutSec 5
        return $response.Content.Trim()
    }
    catch {
        Write-Host "IP alma hatası: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Invoke-LicenseRequest {
    param([string]$Url)
    
    # HTTP isteği gönder
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        $response = Invoke-WebRequest -Uri $Url -Headers $headers -TimeoutSec 5
        return $response.Content.Trim()
    }
    catch {
        Write-Host "HTTP istek hatası: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Show-SuccessMessage {
    # Başarılı lisans mesajını yazdır
    Write-Host @"
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
"@ -ForegroundColor Green
    
    Write-Host @"
                    [+]	   valid license | HIMURA ^0
                    [+]	   ||@everyone @here||
"@ -ForegroundColor Green
}

function Test-License {
    # Lisans kontrolü yap
    while ($true) {
        try {
            # IP adresini al
            $userIP = Get-PublicIP
            if (-not $userIP) {
                Write-Host "IP adresi alınamadı!" -ForegroundColor Red
                $script:lcnstatus = $false
                break
            }
            
            $url = "http://VDSIP:3000/check_ip?ip=$userIP"
            
            # Lisans kontrolü
            $response = Invoke-LicenseRequest -Url $url
            
            if ($response -eq "VALID") {
                # Başarılı lisans
                Show-SuccessMessage
                $script:lcnstatus = $true
            }
            else {
                $script:lcnstatus = $false
            }
            
            # 1 saniye bekle
            Start-Sleep -Seconds 1
            
            if ($script:lcnstatus -ne $null) {
                break
            }
        }
        catch {
            Write-Host "Lisans kontrol hatası: $($_.Exception.Message)" -ForegroundColor Red
            $script:lcnstatus = $false
        }
    }
    
    if (-not $script:lcnstatus) {
        while ($true) {
            Write-Host "[License] invalid license..." -ForegroundColor Red
            $script:data += "invalid license"
            exit 1
        }
    }
}

# Programı başlat
Write-Host "🔐 Starting license check..." -ForegroundColor Cyan
Test-License 