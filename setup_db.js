const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        // Connect to MySQL server (without database selected)
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: ''
        });

        console.log('Connected to MySQL server.');

        // Create database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS e_learning');
        console.log('Database e_learning created or already exists.');

        // Use the database
        await connection.query('USE e_learning');

        // Read SQL file
        const sqlPath = path.join(__dirname, 'e_learning.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Split queries by semicolon
        // This is a simple split and might not handle all edge cases (like semicolons in strings), 
        // but works for standard dumps.
        const queries = sqlContent
            .split(';')
            .filter(query => query.trim().length > 0);

        console.log(`Found ${queries.length} queries to execute.`);

        for (const query of queries) {
            try {
                await connection.query(query);
            } catch (err) {
                // Ignore errors about tables already existing or specific dump comments
                if (!err.message.includes('already exists') && !query.trim().startsWith('/*') && !query.trim().startsWith('--')) {
                    console.warn('Warning executing query:', err.message);
                }
            }
        }

        console.log('Database setup completed successfully.');
        await connection.end();

    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

setupDatabase();
