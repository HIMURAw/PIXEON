local WebSocketServer = require 'websocket'.server -- basit lua modülü

Citizen.CreateThread(function()
    local ws = WebSocketServer.listen(30121, '*')
    while true do
        local payload = {}
        for _, src in ipairs(GetPlayers()) do
            local ped             = GetPlayerPed(src)
            local name            = GetPlayerName(src)
            local coords          = GetEntityCoords(ped)
            payload[#payload + 1] = {
                id   = src,
                name = name,
                x    = coords.x,
                y    = coords.y,
                z    = coords.z
            }
        end
        local jsonData = json.encode(payload)
        ws:broadcast(jsonData)
        Wait(500) -- 0,5 sn: yeterli akıcılık + düşük load
    end
end)
