const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function seedTestimonials() {
    try {
        const sqlPath = path.join(__dirname, 'add_testimonials_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to get individual queries
        const queries = sql.split(';').filter(query => query.trim() !== '');

        for (const query of queries) {
            await db.query(query);
            console.log('Executed query');
        }

        console.log('Testimonials seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding testimonials:', error);
        process.exit(1);
    }
}

seedTestimonials();
