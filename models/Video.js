const db = require('../config/db');

class Video {
    // Get all videos for a course
    static async getByCourse(courseId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM videos WHERE course_id = ? ORDER BY order_index ASC, created_at ASC',
                [courseId]
            );
            return rows;
        } catch (error) {
            console.error('Error getting videos by course:', error);
            throw error;
        }
    }

    // Create new video
    static async create(videoData) {
        try {
            const { 
                course_id, 
                title, 
                description, 
                video_url, 
                thumbnail_url, 
                duration, 
                order_index 
            } = videoData;
            
            const [result] = await db.query(
                `INSERT INTO videos 
                (course_id, title, description, video_url, thumbnail_url, duration, order_index) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    course_id, 
                    title, 
                    description || null, 
                    video_url, 
                    thumbnail_url || null, 
                    duration || null, 
                    order_index || null
                ]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating video:', error);
            throw error;
        }
    }

    // Find video by ID
    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM videos WHERE id = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding video by ID:', error);
            throw error;
        }
    }

    // Get all videos
    static async getAll() {
        try {
            const [rows] = await db.query(
                `SELECT v.*, c.title as course_title 
                FROM videos v
                LEFT JOIN courses c ON v.course_id = c.id
                ORDER BY v.created_at DESC`
            );
            return rows;
        } catch (error) {
            console.error('Error getting all videos:', error);
            throw error;
        }
    }

    // Update video
    static async update(id, videoData) {
        try {
            const fields = [];
            const values = [];

            if (videoData.title !== undefined) {
                fields.push('title = ?');
                values.push(videoData.title);
            }
            if (videoData.description !== undefined) {
                fields.push('description = ?');
                values.push(videoData.description);
            }
            if (videoData.video_url !== undefined) {
                fields.push('video_url = ?');
                values.push(videoData.video_url);
            }
            if (videoData.thumbnail_url !== undefined) {
                fields.push('thumbnail_url = ?');
                values.push(videoData.thumbnail_url);
            }
            if (videoData.duration !== undefined) {
                fields.push('duration = ?');
                values.push(videoData.duration);
            }
            if (videoData.order_index !== undefined) {
                fields.push('order_index = ?');
                values.push(videoData.order_index);
            }

            if (fields.length === 0) {
                throw new Error('No fields to update');
            }

            values.push(id);
            const query = `UPDATE videos SET ${fields.join(', ')} WHERE id = ?`;

            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating video:', error);
            throw error;
        }
    }

    // Delete video
    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM videos WHERE id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    }
}

module.exports = Video;