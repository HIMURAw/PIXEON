-- px-web/server.lua
local ox = exports.oxmysql -- mysql-async kullanıyorsan ismi değiştir

-- ❶ Basit SELECT fonksiyonu
local function fetchCharacters(cb)
    ox:query(
        'SELECT * FROM bans',
        {}, -- hazır parametre yok
        function(result) cb(result) end
    )
end

-- ❷ HTTP handler tanımla
--    DOKÜMANTASYON: SetHttpHandler (CFX native) :contentReference[oaicite:0]{index=0}
SetHttpHandler(function(req, res)
    -- Örn. /px-web/bans
    if req.path == '/bans' then
        fetchCharacters(function(rows)
            -- Basit CORS yanıtı
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- 404 fallback
    res.writeHead(404, { ['Content-Type'] = 'text/plain' })
    res.send('Not found')
end)
