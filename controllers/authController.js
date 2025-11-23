const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_jwt_secret_key_change_this_in_production';

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { 
                first_name, 
                last_name, 
                phone_number, 
                email, 
                password, 
                role,
                // Optional professor fields
                bio,
                profile_image,
                years_experience,
                specialization,
                // Optional student fields
                university,
                major
            } = req.body;

            // Required fields validation
            if (!first_name || !last_name || !phone_number || !email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'All required fields must be provided'
                });
            }

            // Role validation
            const validRoles = ['student', 'professor'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role. Must be student or professor'
                });
            }

            // Professor-specific validation
            if (role === 'professor') {
                if (years_experience !== undefined && (years_experience < 0 || years_experience > 100)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Years of experience must be between 0 and 100'
                    });
                }
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }

            // Check if user exists
            const userExists = await User.exists(email);
            if (userExists) {
                return res.status(409).json({
                    success: false,
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Prepare user data
            const userData = {
                first_name,
                last_name,
                phone_number,
                email,
                password: hashedPassword,
                role
            };

            // Add optional fields based on role
            if (role === 'professor') {
                if (bio) userData.bio = bio;
                if (profile_image) userData.profile_image = profile_image;
                if (years_experience !== undefined) userData.years_experience = years_experience;
                if (specialization) userData.specialization = specialization;
            } else if (role === 'student') {
                if (bio) userData.bio = bio;
                if (profile_image) userData.profile_image = profile_image;
                if (university) userData.university = university;
                if (major) userData.major = major;
            }

            console.log('userData being sent to User.create:', userData);

            // Create user
            const userId = await User.create(userData);

            res.status(201).json({
                success: true,
                message: 'Account created successfully',
                userId: userId,
                role: role
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password and role are required'
                });
            }

            const validRoles = ['student', 'professor'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role'
                });
            }

            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            if (user.role !== role) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials or wrong role selected'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                    role: user.role
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    role: user.role,
                    bio: user.bio,
                    profile_image: user.profile_image,
                    university: user.university,
                    major: user.major,
                    years_experience: user.years_experience,
                    specialization: user.specialization
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'
            });
        }
    }

    // Get current user profile
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Remove password from response
            delete user.password;

            res.status(200).json({
                success: true,
                user: user
            });

        } catch (error) {
            console.error('Profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Update user profile (supports both student and professor)
    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { 
                first_name,
                last_name,
                bio, 
                profile_image, 
                years_experience, 
                specialization,
                university,
                major 
            } = req.body;

            const updates = [];
            const values = [];

            // Common fields
            if (first_name !== undefined) {
                updates.push('first_name = ?');
                values.push(first_name);
            }
            if (last_name !== undefined) {
                updates.push('last_name = ?');
                values.push(last_name);
            }
            if (bio !== undefined) {
                updates.push('bio = ?');
                values.push(bio);
            }
            if (profile_image !== undefined) {
                updates.push('profile_image = ?');
                values.push(profile_image);
            }

            // Professor fields
            if (years_experience !== undefined) {
                if (years_experience < 0 || years_experience > 100) {
                    return res.status(400).json({
                        success: false,
                        message: 'Years of experience must be between 0 and 100'
                    });
                }
                updates.push('years_experience = ?');
                values.push(years_experience);
            }
            if (specialization !== undefined) {
                updates.push('specialization = ?');
                values.push(specialization);
            }

            // Student fields
            if (university !== undefined) {
                updates.push('university = ?');
                values.push(university);
            }
            if (major !== undefined) {
                updates.push('major = ?');
                values.push(major);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'No fields to update'
                });
            }

            values.push(userId);
            const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

            const db = require('../config/db');
            await db.query(query, values);

            const updatedUser = await User.findById(userId);
            delete updatedUser.password; // Remove password from response

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: updatedUser
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }

    // Get public profile by ID (for viewing any user's profile)
    static async getProfileById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Return public profile (different data based on role)
            const publicProfile = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                full_name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
                bio: user.bio,
                profile_image: user.profile_image,
                created_at: user.created_at
            };

            // Add role-specific fields
            if (user.role === 'professor') {
                publicProfile.years_experience = user.years_experience;
                publicProfile.specialization = user.specialization;
            } else if (user.role === 'student') {
                publicProfile.university = user.university;
                publicProfile.major = user.major;
            }

            res.status(200).json({
                success: true,
                user: publicProfile
            });

        } catch (error) {
            console.error('Get profile by ID error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
}

module.exports = AuthController;