import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Discord client configuration
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ]
});

// Discord REST API for direct API calls
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Discord API configuration
export const discordConfig = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  guildId: process.env.DISCORD_GUILD_ID,
  apiBaseUrl: 'https://discord.com/api/v10'
};

// Discord API helper functions
export const discordAPI = {
  // Get guild information
  getGuild: async () => {
    try {
      const response = await rest.get(Routes.guild(discordConfig.guildId));
      return response;
    } catch (error) {
      console.error('Error fetching guild:', error.message);
      throw error;
    }
  },

  // Get all members with roles
  getGuildMembers: async () => {
    try {
      const members = [];
      let after = '0';
      
      while (true) {
        const response = await rest.get(Routes.guildMembers(discordConfig.guildId), {
          query: new URLSearchParams({
            limit: '1000',
            after: after
          })
        });
        
        members.push(...response);
        
        if (response.length < 1000) break;
        after = response[response.length - 1].user.id;
      }
      
      return members;
    } catch (error) {
      console.error('Error fetching guild members:', error.message);
      throw error;
    }
  },

  // Get member by ID
  getMember: async (memberId) => {
    try {
      const response = await rest.get(Routes.guildMember(discordConfig.guildId, memberId));
      return response;
    } catch (error) {
      console.error('Error fetching member:', error.message);
      throw error;
    }
  },

  // Get all roles
  getGuildRoles: async () => {
    try {
      const response = await rest.get(Routes.guildRoles(discordConfig.guildId));
      return response;
    } catch (error) {
      console.error('Error fetching guild roles:', error.message);
      throw error;
    }
  },

  // Get channels
  getGuildChannels: async () => {
    try {
      const response = await rest.get(Routes.guildChannels(discordConfig.guildId));
      return response;
    } catch (error) {
      console.error('Error fetching guild channels:', error.message);
      throw error;
    }
  }
};

// Staff role detection
export const getStaffMembers = async () => {
  try {
    const members = await discordAPI.getGuildMembers();
    const roles = await discordAPI.getGuildRoles();
    
    // Define staff role names (customize as needed)
    const staffRoleNames = [
      'Administrator',
      'Admin',
      'Moderator',
      'Mod',
      'Developer',
      'Dev',
      'Support',
      'Helper',
      'Event Manager',
      'Community Manager',
      'Security',
      'Content Creator',
      'Technical Support',
      'Translator',
      'VIP'
    ];
    
    // Filter staff roles
    const staffRoles = roles.filter(role => 
      staffRoleNames.some(staffName => 
        role.name.toLowerCase().includes(staffName.toLowerCase())
      )
    );
    
    const staffMembers = [];
    
    for (const member of members) {
      const memberRoles = member.roles || [];
      const hasStaffRole = memberRoles.some(roleId => 
        staffRoles.some(role => role.id === roleId)
      );
      
      if (hasStaffRole && !member.user.bot) {
        const memberStaffRoles = memberRoles
          .map(roleId => staffRoles.find(role => role.id === roleId))
          .filter(role => role !== undefined);
        
        staffMembers.push({
          id: member.user.id,
          username: member.user.username,
          displayName: member.nick || member.user.display_name || member.user.username,
          avatar: member.user.avatar ? 
            `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=256` :
            `https://cdn.discordapp.com/embed/avatars/${member.user.discriminator % 5}.png`,
          roles: memberStaffRoles.map(role => ({
            id: role.id,
            name: role.name,
            color: `#${role.color.toString(16).padStart(6, '0')}`,
            position: role.position
          })),
          joinedAt: member.joined_at,
          status: member.presence?.status || 'offline'
        });
      }
    }
    
    return staffMembers;
  } catch (error) {
    console.error('Error getting staff members:', error.message);
    throw error;
  }
};

// Client event handlers
client.once('ready', () => {
  console.log(`🤖 Discord bot logged in as ${client.user.tag}!`);
});

client.on('error', (error) => {
  console.error('Discord client error:', error);
});

// Login to Discord
if (discordConfig.token) {
  client.login(discordConfig.token).catch(error => {
    console.error('Failed to login to Discord:', error.message);
  });
}

export default client;