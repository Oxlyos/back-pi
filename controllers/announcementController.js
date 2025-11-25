const Announcement = require('../models/Announcement');

class AnnouncementController {
    // Create new announcement for a course
    static async createAnnouncement(req, res) {
        console.log('>>> ENTERING createAnnouncement controller');
        console.log('Request body:', JSON.stringify(req.body));
        try {
            const { courseId } = req.params;
            const { title, description } = req.body;

            console.log('Received announcement request:', {
                courseId,
                body: req.body,
                title,
                description,
                titleType: typeof title,
                descriptionType: typeof description
            });

            // Validate required fields with trimming
            const trimmedTitle = title?.trim();
            const trimmedDescription = description?.trim();

            if (!trimmedTitle || !trimmedDescription) {
                console.log('Validation failed - missing fields:', {
                    title: !!trimmedTitle,
                    description: !!trimmedDescription,
                    originalTitle: title,
                    originalDescription: description
                });
                return res.status(400).json({
                    success: false,
                    message: 'Title and description are required and cannot be empty',
                    details: {
                        titleProvided: !!trimmedTitle,
                        descriptionProvided: !!trimmedDescription
                    }
                });
            }

            // Map frontend field 'description' to backend field 'content'
            const announcementData = {
                course_id: courseId,
                title: trimmedTitle,
                content: trimmedDescription
            };

            const announcementId = await Announcement.create(announcementData);

            res.status(201).json({
                success: true,
                message: 'Announcement created successfully',
                announcementId: announcementId
            });

        } catch (error) {
            console.error('Create announcement error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while creating announcement'
            });
        }
    }

    // Get all announcements for a course
    static async getAnnouncementsByCourse(req, res) {
        try {
            const { courseId } = req.params;

            const announcements = await Announcement.getByCourse(courseId);

            res.status(200).json({
                success: true,
                announcements: announcements
            });

        } catch (error) {
            console.error('Get announcements error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while fetching announcements'
            });
        }
    }
}

module.exports = AnnouncementController;
