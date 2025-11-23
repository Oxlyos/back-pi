const express = require('express');
const app = express();
const db = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const questionRoutes = require('./routes/questionRoutes');

app.use(express.json());

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
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenue sur SkillBridge E-Learning Platform!');
});

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});