local ox = exports.oxmysql

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

local function fetchBans(cb)
    ox:query('SELECT * FROM bans', {}, function(result) cb(result) end)
end

local function fetchPlayers(cb)
    ox:query('SELECT * FROM players', {}, function(result) cb(result) end)
end

local function fetchCars(cb)
    ox:query('SELECT * FROM players_vehicles', {}, function(result) cb(result) end)
end

local function fetchJobs(cb)
    ox:query('SELECT job FROM players', {}, function(result) cb(result) end)
end

local function fetchPlayTime(cb)
    ox:query('SELECT * FROM player_playtime', {}, function(result) cb(result) end)
end

SetHttpHandler(function(req, res)
    -- /resources: scriptleri listele
    if req.method == 'GET' and req.path == '/resources' then
        local resourceList = fetchResources()
        res.writeHead(200, {
            ['Content-Type'] = 'application/json',
            ['Access-Control-Allow-Origin'] = '*'
        })
        res.send(json.encode(resourceList))
        return
    end

    if req.method == 'GET' and req.path == '/playtime' then
        ox:query('SELECT identifier, total_seconds FROM player_playtime', {}, function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- /resources/restart/:name: resource restart
    if req.method == 'POST' and req.path:sub(1, 19) == '/resources/restart/' then
        local resourceName = req.path:sub(20)
        if GetResourceState(resourceName) ~= 'missing' then
            StopResource(resourceName)
            Wait(1000)
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

    -- /bans: banlı oyuncuları listele
    if req.method == 'GET' and req.path == '/bans' then
        fetchBans(function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- /characters: oyuncuları listele
    if req.method == 'GET' and req.path == '/characters' then
        fetchPlayers(function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- /cars: oyuncu araçlarını listele
    if req.method == 'GET' and req.path == '/cars' then
        fetchCars(function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- /jobs: oyuncu işlerini listele
    if req.method == 'GET' and req.path == '/jobs' then
        fetchJobs(function(rows)
            res.writeHead(200, {
                ['Content-Type'] = 'application/json',
                ['Access-Control-Allow-Origin'] = '*'
            })
            res.send(json.encode(rows))
        end)
        return
    end

    -- /positions: oyuncu pozisyonlarını listele
    if req.method == 'GET' and req.path == '/positions' then
        local players = {}
        for _, src in ipairs(GetPlayers()) do
            local ped = GetPlayerPed(src)
            local coords = GetEntityCoords(ped)
            local name = GetPlayerName(src)
            table.insert(players, {
                id = src,
                name = name,
                x = coords.x,
                y = coords.y,
                z = coords.z
            })
        end
        res.writeHead(200, {
            ['Content-Type'] = 'application/json',
            ['Access-Control-Allow-Origin'] = '*'
        })
        res.send(json.encode(players))
        return
    end

    -- 404 fallback
    res.writeHead(404, { ['Content-Type'] = 'text/plain' })
    res.send('Not found')
end)
