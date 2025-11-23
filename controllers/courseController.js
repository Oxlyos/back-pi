const Course = require('../models/Course');
const Video = require('../models/Video');
const Announcement = require('../models/Announcement');
const File = require('../models/File');

class CourseController {
    // Get all courses
    static async getAllCourses(req, res) {
        try {
            const courses = await Course.getAll();
            
            res.status(200).json({
                success: true,
                courses: courses
            });

        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get single course with all details (videos, announcements, files)
    static async getCourse(req, res) {
        try {
            const { id } = req.params;
            const course = await Course.findById(id);
            
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            // Get videos, announcements, and files
            const videos = await Video.getByCourse(id);
            const announcements = await Announcement.getByCourse(id);
            const files = await File.getByCourse(id);

            res.status(200).json({
                success: true,
                course: {
                    ...course,
                    videos: videos,
                    announcements: announcements,
                    files: files
                }
            });

        } catch (error) {
            console.error('Get course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Create course with videos and files (UPDATED - supports form data from frontend)
    static async createCourse(req, res) {
        try {
            const { 
                title, 
                description, 
                professor_introduction,
                image_url,
                video_links, // Array of video URLs from frontend
                files // Array of file data from frontend
            } = req.body;
            
            const professor_id = req.user.userId;

            if (!title || !description) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and description are required'
                });
            }

            // Create the course first
            const courseId = await Course.create({
                title,
                description,
                professor_id,
                professor_introduction: professor_introduction || null,
                image_url: image_url || null
            });

            // Add videos if provided
            if (video_links && Array.isArray(video_links) && video_links.length > 0) {
                for (let i = 0; i < video_links.length; i++) {
                    const videoUrl = video_links[i];
                    if (videoUrl && videoUrl.trim() !== '') {
                        await Video.create({
                            course_id: courseId,
                            title: `Video ${i + 1}`,
                            video_url: videoUrl.trim(),
                            order_index: i + 1
                        });
                    }
                }
            }

            // Add files if provided
            if (files && Array.isArray(files) && files.length > 0) {
                for (const file of files) {
                    if (file.file_url) {
                        await File.create({
                            course_id: courseId,
                            title: file.title || 'Course Material',
                            file_url: file.file_url,
                            file_type: file.file_type || 'pdf',
                            file_size: file.file_size || null
                        });
                    }
                }
            }

            res.status(201).json({
                success: true,
                message: 'Course created successfully with videos and files',
                courseId: courseId
            });

        } catch (error) {
            console.error('Create course error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get my courses (professor's courses)
    static async getMyCourses(req, res) {
        try {
            const professor_id = req.user.userId;
            const courses = await Course.getByProfessor(professor_id);

            res.status(200).json({
                success: true,
                courses: courses
            });

        } catch (error) {
            console.error('Get my courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Add video to course
    static async addVideo(req, res) {
        try {
            const { id } = req.params;
            const { title, description, video_url, thumbnail_url, duration, order_index } = req.body;

            if (!title || !video_url) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and video URL are required'
                });
            }

            // Verify course exists and belongs to professor
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            if (course.professor_id !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only add videos to your own courses'
                });
            }

            const videoId = await Video.create({
                course_id: id,
                title,
                description,
                video_url,
                thumbnail_url,
                duration,
                order_index
            });

            res.status(201).json({
                success: true,
                message: 'Video added successfully',
                videoId: videoId
            });

        } catch (error) {
            console.error('Add video error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Add announcement to course (NO COURSE_ID in body - it comes from URL params)
    static async addAnnouncement(req, res) {
        try {
            const { id } = req.params; // Get course_id from URL
            const { title, content } = req.body; // Only title and content in body

            if (!title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and content are required'
                });
            }

            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            if (course.professor_id !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only add announcements to your own courses'
                });
            }

            const announcementId = await Announcement.create({
                course_id: id,
                title,
                content
            });

            res.status(201).json({
                success: true,
                message: 'Announcement added successfully',
                announcementId: announcementId
            });

        } catch (error) {
            console.error('Add announcement error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // NEW: Add general announcement (with course_id in body for dropdown)
    static async createGeneralAnnouncement(req, res) {
        try {
            const { course_id, title, content } = req.body;

            if (!course_id || !title || !content) {
                return res.status(400).json({
                    success: false,
                    message: 'Course, title and content are required'
                });
            }

            // Verify course exists and belongs to professor
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            if (course.professor_id !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only add announcements to your own courses'
                });
            }

            const announcementId = await Announcement.create({
                course_id,
                title,
                content
            });

            res.status(201).json({
                success: true,
                message: 'Announcement created successfully',
                announcementId: announcementId
            });

        } catch (error) {
            console.error('Create announcement error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Add file to course
    static async addFile(req, res) {
        try {
            const { id } = req.params;
            const { title, file_url, file_type, file_size } = req.body;

            if (!title || !file_url) {
                return res.status(400).json({
                    success: false,
                    message: 'Title and file URL are required'
                });
            }

            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            if (course.professor_id !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only add files to your own courses'
                });
            }

            const fileId = await File.create({
                course_id: id,
                title,
                file_url,
                file_type,
                file_size
            });

            res.status(201).json({
                success: true,
                message: 'File added successfully',
                fileId: fileId
            });

        } catch (error) {
            console.error('Add file error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = CourseController;