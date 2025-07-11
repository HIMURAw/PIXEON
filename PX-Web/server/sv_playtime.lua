local ox = exports.oxmysql
local QBCore = exports['qb-core']:GetCoreObject()

local playtimeCache = {}

-- Oyuncu giriş yaptığında başlat (playerConnecting yerine PlayerLoaded kullandık)
RegisterNetEvent('QBCore:Server:PlayerLoaded', function()
    local src = source
    playtimeCache[src] = os.time()
end)

-- Süreyi güncelleyen fonksiyon
local function updatePlaytime(identifier, seconds)
    if not identifier then return end
    ox:query(
        'INSERT INTO player_playtime (identifier, total_seconds) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_seconds = total_seconds + VALUES(total_seconds)',
        { identifier, seconds }
    )

    print("Playtime script loaded successfully!")
    print(identifier, seconds)
end


-- Oyuncu çıktığında süreyi kaydet<
AddEventHandler('playerDropped', function(reason)
    local src = source
    local joinTime = playtimeCache[src]

    if joinTime then
        local Player = QBCore.Functions.GetPlayer(src)
        if Player then
            local identifier = Player.PlayerData.citizenid
            local sessionSeconds = os.time() - joinTime
            updatePlaytime(identifier, sessionSeconds)
        end
        playtimeCache[src] = nil
    end
end)

-- Her 5 dakikada bir aktif oyuncuların süresini güncelle
CreateThread(function()
    while true do
        Wait(5 * 60 * 1000)
        for _, src in pairs(GetPlayers()) do
            local joinTime = playtimeCache[src]
            if joinTime then
                local Player = QBCore.Functions.GetPlayer(tonumber(src))
                if Player then
                    local identifier = Player.PlayerData.citizenid
                    local sessionSeconds = os.time() - joinTime
                    updatePlaytime(identifier, sessionSeconds)
                    playtimeCache[src] = os.time() -- sıfırla
                end
            end
        end
    end
end)
