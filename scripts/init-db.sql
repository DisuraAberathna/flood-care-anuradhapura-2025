-- Database initialization script for Flood Data Management
-- Run this script to create the database and table manually if needed

CREATE DATABASE IF NOT EXISTS flood_data;

USE flood_data;

CREATE TABLE IF NOT EXISTS isolated_people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  number_of_members INT NOT NULL,
  address TEXT NOT NULL,
  house_state VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO isolated_people (name, age, number_of_members, address, house_state) VALUES
('John Doe', 45, 4, '123 Main Street, City, State', 'Partially Damaged'),
('Jane Smith', 32, 2, '456 Oak Avenue, City, State', 'Safe'),
('Bob Johnson', 58, 5, '789 Pine Road, City, State', 'Severely Damaged');

