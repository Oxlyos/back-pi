const db = require('../config/db');

class User {
    // Create new user
    static async create(userData) {
        try {
            const fields = [];
            const placeholders = [];
            const values = [];

            // Add all provided fields dynamically
            for (const [key, value] of Object.entries(userData)) {
                fields.push(key);
                placeholders.push('?');
                values.push(value);
            }

            const query = `
                INSERT INTO users (${fields.join(', ')})
                VALUES (${placeholders.join(', ')})
            `;

            console.log('Insert Query:', query);
            console.log('Insert Values:', values);

            const [result] = await db.query(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Check if user exists by email
    static async exists(email) {
        try {
            const [rows] = await db.query(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('Error checking user existence:', error);
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    // Get all users (optional, for admin purposes)
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM users');
            return rows;
        } catch (error) {
            console.error('Error finding all users:', error);
            throw error;
        }
    }

    // Get all professors (for public display)
    static async getAllProfessors() {
        try {
            const [rows] = await db.query(
                `SELECT id, first_name, last_name, email, bio, profile_image, 
                        years_experience, specialization, created_at 
                 FROM users 
                 WHERE role = 'professor'
                 ORDER BY created_at DESC`
            );
            return rows;
        } catch (error) {
            console.error('Error finding all professors:', error);
            throw error;
        }
    }

    // Delete user by ID (optional)
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = User;