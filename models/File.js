const db = require('../config/db');

class File {
    // Get all files for a course
    static async getByCourse(courseId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM files WHERE course_id = ? ORDER BY created_at DESC',
                [courseId]
            );
            return rows;
        } catch (error) {
            console.error('Error getting files by course:', error);
            throw error;
        }
    }

    // Create new file
    static async create(fileData) {
        try {
            const { course_id, title, file_url, file_type, file_size } = fileData;
            
            const [result] = await db.query(
                'INSERT INTO files (course_id, title, file_url, file_type, file_size) VALUES (?, ?, ?, ?, ?)',
                [course_id, title, file_url, file_type || null, file_size || null]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating file:', error);
            throw error;
        }
    }

    // Find file by ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM files WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding file by ID:', error);
            throw error;
        }
    }

    // Get all files
    static async getAll() {
        try {
            const [rows] = await db.query(
                `SELECT f.*, c.title as course_title 
                FROM files f
                LEFT JOIN courses c ON f.course_id = c.id
                ORDER BY f.created_at DESC`
            );
            return rows;
        } catch (error) {
            console.error('Error getting all files:', error);
            throw error;
        }
    }

    // Update file
    static async update(id, fileData) {
        try {
            const fields = [];
            const values = [];

            if (fileData.title !== undefined) {
                fields.push('title = ?');
                values.push(fileData.title);
            }
            if (fileData.file_url !== undefined) {
                fields.push('file_url = ?');
                values.push(fileData.file_url);
            }
            if (fileData.file_type !== undefined) {
                fields.push('file_type = ?');
                values.push(fileData.file_type);
            }
            if (fileData.file_size !== undefined) {
                fields.push('file_size = ?');
                values.push(fileData.file_size);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);
            const query = `UPDATE files SET ${fields.join(', ')} WHERE id = ?`;

            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating file:', error);
            throw error;
        }
    }

    // Delete file
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM files WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }
}

module.exports = File;