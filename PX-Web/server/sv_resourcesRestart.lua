local ox = exports.oxmysql

-- Tüm kaynakları listeleme fonksiyonu ve fetchCharacters kaldırıldı

-- HTTP handler
SetHttpHandler(function(req, res)
    -- Sadece restart endpointi
    if req.method == 'POST' and req.path:sub(1, 19) == '/resources/restart/' then
        local resourceName = req.path:sub(20) -- örn: /resources/restart/qb-core → "qb-core"

        if GetResourceState(resourceName) ~= 'missing' then
            StopResource(resourceName)
            Wait(1000) -- 1 saniye beklet, sistem yorulmasın
            StartResource(resourceName)

            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode({ success = true, message = resourceName .. ' restarted.' }))
        else
            res.writeHead(404, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode({ success = false, message = 'Resource not found: ' .. resourceName }))
        end
        return
    end

    -- 404 fallback
    res.writeHead(404, { ['Content-Type'] = 'text/plain' })
    res.send('Not found')
end)
