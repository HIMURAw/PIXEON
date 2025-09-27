import express from 'express';
import { query, queryOne, insert, update, remove } from '../config/database.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { getStaffMembers } from '../config/discord.js';
import { staffConfig } from '../config/config.js';

const router = express.Router();

// Get all staff members
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 6, role = null } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE s.is_active = 1';
    let params = [];

    if (role) {
      whereClause += ' AND s.role_name = ?';
      params.push(role);
    }

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
      ${whereClause}
      ORDER BY s.joined_at ASC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await queryOne(`
      SELECT COUNT(*) as total
      FROM users u
      JOIN staff s ON u.id = s.user_id
      ${whereClause}
    `, params);

    // Group by user
    const staffMap = new Map();
    staff.forEach(row => {
      if (!staffMap.has(row.discord_id)) {
        staffMap.set(row.discord_id, {
          id: row.discord_id,
          username: row.username,
          displayName: row.display_name || row.username,
          avatar: row.avatar_url || `https://cdn.discordapp.com/embed/avatars/${row.discord_id % 5}.png`,
          roles: [],
          joinedAt: row.joined_at,
          status: 'online' // Default status
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
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get staff by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const staff = await query(`
      SELECT 
        u.discord_id,
        u.username,
        u.display_name,
        u.avatar_url,
        u.email,
        s.role_name,
        s.role_color,
        s.permissions,
        s.joined_at,
        s.is_active
      FROM users u
      JOIN staff s ON u.id = s.user_id
      WHERE u.discord_id = ? AND s.is_active = 1
    `, [id]);

    if (staff.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Group roles
    const staffData = {
      id: staff[0].discord_id,
      username: staff[0].username,
      displayName: staff[0].display_name || staff[0].username,
      avatar: staff[0].avatar_url,
      email: staff[0].email,
      roles: staff.map(row => ({
        name: row.role_name,
        color: row.role_color,
        permissions: row.permissions ? JSON.parse(row.permissions) : null
      })),
      joinedAt: staff[0].joined_at,
      status: 'online' // Default status
    };

    res.json({
      success: true,
      data: staffData
    });
  } catch (error) {
    next(error);
  }
});

// Refresh staff data from Discord
router.post('/refresh', authenticate, async (req, res, next) => {
  try {
    const staffMembers = await getStaffMembers();

    // Clear existing staff data
    await query('UPDATE staff SET is_active = 0');

    // Insert/update staff data
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

      // Insert staff roles
      for (const role of staff.roles) {
        await insert('staff', {
          user_id: userId,
          role_name: role.name,
          role_color: role.color,
          permissions: JSON.stringify({ position: role.position }),
          is_active: true
        });
      }
    }

    res.json({
      success: true,
      message: 'Staff data refreshed successfully',
      count: staffMembers.length
    });
  } catch (error) {
    next(error);
  }
});

// Update staff role
router.put('/:id/role', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role_name, role_color, is_active } = req.body;

    // Find user
    const user = await queryOne(
      'SELECT id FROM users WHERE discord_id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update staff role
    const result = await update('staff', {
      role_name,
      role_color,
      is_active: is_active !== undefined ? is_active : true
    }, `user_id = ${user.id} AND role_name = '${role_name}'`);

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff role not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff role updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Remove staff member
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await queryOne(
      'SELECT id FROM users WHERE discord_id = ?',
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Deactivate staff roles
    const result = await update('staff', {
      is_active: false
    }, `user_id = ${user.id}`);

    res.json({
      success: true,
      message: 'Staff member removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;