const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const config = require('../config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('🔄 Starting command registration process...');
console.log(`📁 Found ${commandFiles.length} command files: ${commandFiles.join(', ')}`);

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`✅ Successfully loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${file} is missing required properties`);
        }
    } catch (error) {
        console.error(`❌ Error loading command ${file}:`, error);
    }
}

const rest = new REST().setToken(config.discord.token);

(async () => {
    try {
        console.log(`🔄 Started refreshing ${commands.length} application (/) commands.`);

        if (!config.discord.clientId) {
            throw new Error('Client ID is missing in config.json');
        }

        const data = await rest.put(
            Routes.applicationCommands(config.discord.clientId),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
        console.log('📝 Registered commands:');
        data.forEach(cmd => {
            console.log(`   - /${cmd.name}: ${cmd.description}`);
        });
    } catch (error) {
        console.error('❌ Error during command registration:', error);
        if (error.code === 50001) {
            console.error('Missing Access: The bot does not have the "applications.commands" scope');
        } else if (error.code === 50013) {
            console.error('Missing Permissions: The bot does not have the required permissions');
        }
    }
})(); 