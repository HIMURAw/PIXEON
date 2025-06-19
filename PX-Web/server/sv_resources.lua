-- Sunucudaki scriptleri listeleyen fonksiyon
local function fetchResources()
    local resources = {}

    for i = 0, GetNumResources() - 1 do
        local name = GetResourceByFindIndex(i)
        if name then
            table.insert(resources, {
                name = name,
                state = GetResourceState(name),
                path = GetResourcePath(name)
            })
        end
    end

    return resources
end

-- HTTP handler
SetHttpHandler(function(req, res)
    if req.path == '/resources' then
        local resourceList = fetchResources()

        res.writeHead(200, {
            ['Content-Type'] = 'application/json',
            ['Access-Control-Allow-Origin'] = '*'
        })
        res.send(json.encode(resourceList))
        return
    end

    -- Diğer endpointler (örnek: /cars)
    if req.path == '/cars' then
        fetchCharacters(function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- 404
    res.writeHead(404, { ['Content-Type'] = 'text/plain' })
    res.send('Not found')
end)
