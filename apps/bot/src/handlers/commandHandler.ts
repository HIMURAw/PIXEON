import { REST, Routes, Collection } from 'discord.js'
import fs from 'fs'
import path from 'path'
const Config = require('../../config')

// Import types
import { Command, CustomClient } from '../types'

export async function loadCommands(client: CustomClient) {
    const commands: any[] = []
    const commandsPath = path.join(__dirname, '../commands')

    // commands koleksiyonunu başlat (tip güvenli)
    client.commands = new Collection()

    const folders = fs.readdirSync(commandsPath)
    for (const folder of folders) {
        const commandFiles = fs.readdirSync(path.join(commandsPath, folder)).filter(f => f.endsWith('.ts') || f.endsWith('.js'))

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, folder, file)
            const command: Command = require(filePath)

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command)
                commands.push(command.data.toJSON())
            } else {
                console.warn(`[UYARI] Komut dosyası eksik veya hatalı: ${file}`)
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(Config.discord.token)

    try {
        console.log('🔁 Slash komutları Discord API\'ye yükleniyor...')
        await rest.put(Routes.applicationCommands(Config.discord.clientId), { body: commands })
        console.log('✅ Slash komutları başarıyla yüklendi.')
    } catch (err) {
        console.error('❌ Slash komutları yüklenemedi:', err)
    }
}
