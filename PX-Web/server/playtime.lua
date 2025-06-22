local ox = exports.oxmysql
local playtimeCache = {}

-- Oyuncu giriş yaptığında başlat
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    local src = source
    playtimeCache[src] = os.time()
end)

-- Oyuncu çıkınca süreyi kaydet
AddEventHandler('playerDropped', function(reason)
    local src = source
    local joinTime = playtimeCache[src]
    if joinTime then
        local sessionSeconds = os.time() - joinTime
        local identifier = GetPlayerIdentifier(src, 0)
        updatePlaytime(identifier, sessionSeconds)
        playtimeCache[src] = nil
    end
end)

-- Her 5 dakikada bir aktif oyuncuların süresini güncelle
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(5 * 60 * 1000)
        for _, src in ipairs(GetPlayers()) do
            local joinTime = playtimeCache[src]
            if joinTime then
                local sessionSeconds = os.time() - joinTime
                local identifier = GetPlayerIdentifier(src, 0)
                updatePlaytime(identifier, sessionSeconds)
                playtimeCache[src] = os.time()
            end
        end
    end
end)

function updatePlaytime(identifier, seconds)
    if not identifier then return end
    ox:query('INSERT INTO player_playtime (identifier, total_seconds) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_seconds = total_seconds + VALUES(total_seconds)', {identifier, seconds})
end 