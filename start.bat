@echo off
chcp 65001 >nul
color 0B
cls

REM -- Başlık ve banner --
echo.
echo ==========================================
echo   🚀 PXDevelopment WebSite V2 Başlatiliyor
echo ==========================================
echo.

REM -- Yükleniyor başlığı --
setlocal enabledelayedexpansion
echo.

REM -- Sunucu başlatılıyor mesajı --
color 0A
echo [INFO] Sunucu başlatiliyor...
echo.

REM -- Node.js başlat --
color 07
node server.js

endlocal