const path = require('path');
const fs = require('fs');
const { Collection } = require('discord.js');

function loadCommands(client) {
    client.commands = new Collection();
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
                commands.push(command.data.toJSON());
            } else if (Array.isArray(command)) {
                // Çoklu komut export eden dosyalar için
                for (const cmd of command) {
                    if ('data' in cmd && 'execute' in cmd) {
                        client.commands.set(cmd.data.name, cmd);
                        commands.push(cmd.data.toJSON());
                    }
                }
            }
        } catch (error) {
            console.error(`❌ ${file} yüklenirken hata oluştu:`);
            console.error(error);
        }
    }
    return commands;
}

module.exports = { loadCommands };
