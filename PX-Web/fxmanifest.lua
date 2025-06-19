-- px-web/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

author 'HIMURA'
description 'PX‑Web: Sunucu içi HTTP API'
version '1.0.0'

client_script 'client/*.lua'
server_script 'server/*.lua'
dependency 'oxmysql' -- veya mysql-async, hangisini kullanıyorsan
