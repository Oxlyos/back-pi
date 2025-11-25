const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers.authorization ? 'Auth header present' : 'No auth header');
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body));
    }
    next();
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

async function testDB() {
    try {
        const connection = await db.getConnection();
        console.log('Database connected!');
        connection.release();
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
}

testDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/courses', announcementRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/testimonials', testimonialRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is connected!' });
});

app.get('/', (req, res) => {
    res.send('Bienvenue sur SkillBridge E-Learning Platform!');
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});