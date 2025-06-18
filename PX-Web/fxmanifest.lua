-- px-web/fxmanifest.lua
fx_version 'cerulean'
game 'gta5'

author 'Umut'
description 'PX‑Web: Sunucu içi HTTP API'
version '1.0.0'

-- Sunucu tarafı kod
server_script 'server/sv_playersDB.lua'
dependency 'oxmysql' -- veya mysql-async, hangisini kullanıyorsan
