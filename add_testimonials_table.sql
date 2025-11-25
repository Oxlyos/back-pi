-- Add testimonials table to the database
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    avatar VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample testimonials
INSERT INTO testimonials (name, role, content, avatar) VALUES
('Sarah Johnson', 'Computer Science Student', 'The platform has completely transformed how I learn. The courses are well-structured and the professors are incredibly knowledgeable.', 'assets/images/student1.jpg'),
('Michael Chen', 'Data Science Major', 'I love the flexibility of the courses. Being able to learn at my own pace while having access to high-quality resources is amazing.', 'assets/images/student2.jpg'),
('Emily Davis', 'Web Development Student', 'The practical projects and hands-on approach helped me build a portfolio that got me my first internship.', 'assets/images/student3.jpg'),
('David Wilson', 'Software Engineering Student', 'The community forum is a game-changer. Getting help from peers and professors makes complex topics much easier to understand.', 'assets/images/student4.jpg');
