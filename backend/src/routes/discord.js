import express from 'express';
import { discordAPI, getStaffMembers } from '../config/discord.js';
import { query, queryOne, insert, update } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get Discord server information
router.get('/guild', async (req, res, next) => {
  try {
    const guild = await discordAPI.getGuild();
    
    res.json({
      success: true,
      data: {
        id: guild.id,
        name: guild.name,
        description: guild.description,
        member_count: guild.approximate_member_count,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        banner: guild.banner ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png` : null
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all guild members
router.get('/members', async (req, res, next) => {
  try {
    const members = await discordAPI.getGuildMembers();
    
    res.json({
      success: true,
      data: members,
      count: members.length
    });
  } catch (error) {
    next(error);
  }
});

// Get staff members
router.get('/staff', async (req, res, next) => {
  try {
    const staffMembers = await getStaffMembers();
    
    // Cache staff data in database
    for (const staff of staffMembers) {
      // Update or insert user
      const existingUser = await queryOne(
        'SELECT id FROM users WHERE discord_id = ?',
        [staff.id]
      );

      let userId;
      if (existingUser) {
        userId = existingUser.id;
        await update('users', {
          username: staff.username,
          display_name: staff.displayName,
          avatar_url: staff.avatar
        }, `id = ${userId}`);
      } else {
        userId = await insert('users', {
          discord_id: staff.id,
          username: staff.username,
          display_name: staff.displayName,
          avatar_url: staff.avatar
        });
      }

      // Update staff roles
      for (const role of staff.roles) {
        const existingStaff = await queryOne(
          'SELECT id FROM staff WHERE user_id = ? AND role_name = ?',
          [userId, role.name]
        );

        if (!existingStaff) {
          await insert('staff', {
            user_id: userId,
            role_name: role.name,
            role_color: role.color,
            permissions: JSON.stringify({ position: role.position }),
            is_active: true
          });
        }
      }
    }
    
    res.json({
      success: true,
      data: staffMembers,
      count: staffMembers.length
    });
  } catch (error) {
    next(error);
  }
});

// Get guild roles
router.get('/roles', async (req, res, next) => {
  try {
    const roles = await discordAPI.getGuildRoles();
    
    // Cache roles in database
    for (const role of roles) {
      const existingRole = await queryOne(
        'SELECT id FROM discord_roles WHERE role_id = ?',
        [role.id]
      );

      if (!existingRole) {
        await insert('discord_roles', {
          role_id: role.id,
          role_name: role.name,
          role_color: `#${role.color.toString(16).padStart(6, '0')}`,
          permissions: role.permissions,
          position: role.position
        });
      } else {
        await update('discord_roles', {
          role_name: role.name,
          role_color: `#${role.color.toString(16).padStart(6, '0')}`,
          permissions: role.permissions,
          position: role.position
        }, `id = ${existingRole.id}`);
      }
    }
    
    res.json({
      success: true,
      data: roles,
      count: roles.length
    });
  } catch (error) {
    next(error);
  }
});

// Get member by ID
router.get('/member/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await discordAPI.getMember(id);
    
    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
});

// Get cached staff from database
router.get('/staff/cached', async (req, res, next) => {
  try {
    const staff = await query(`
      SELECT 
        u.discord_id,
        u.username,
        u.display_name,
        u.avatar_url,
        s.role_name,
        s.role_color,
        s.joined_at,
        s.is_active
      FROM users u
      JOIN staff s ON u.id = s.user_id
      WHERE s.is_active = 1
      ORDER BY s.joined_at ASC
    `);

    // Group by user
    const staffMap = new Map();
    staff.forEach(row => {
      if (!staffMap.has(row.discord_id)) {
        staffMap.set(row.discord_id, {
          id: row.discord_id,
          username: row.username,
          displayName: row.display_name || row.username,
          avatar: row.avatar_url,
          roles: [],
          joinedAt: row.joined_at
        });
      }
      staffMap.get(row.discord_id).roles.push({
        name: row.role_name,
        color: row.role_color
      });
    });

    const staffArray = Array.from(staffMap.values());
    
    res.json({
      success: true,
      data: staffArray,
      count: staffArray.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;