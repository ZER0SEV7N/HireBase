-- Crear base de datos
DROP DATABASE IF EXISTS hirebase;
CREATE DATABASE IF NOT EXISTS hirebase;

-- Usar la base de datos
USE hirebase;

-- Crear tabla users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 1
    name CHAR(50) NOT NULL, -- 2
    lastname CHAR(50) NULL, -- 3
    email CHAR(50) UNIQUE, -- 4
    birthdate DATE NULL, -- 5
    DNI CHAR(9) UNIQUE NULL, -- 6
    hardSkill ENUM('Frontend', 'Backend', 'Design', 'Analyst', 'Full Stack', 'Others')  NULL, -- 7
    password CHAR(64) NULL, -- 8
    role ENUM('admin', 'user') DEFAULT 'user', -- 9
    profile_picture VARCHAR(50) NULL, -- 10
    bio TEXT NULL, -- 11
    cv_url VARCHAR(255) NULL, -- 12
    is_active BOOLEAN DEFAULT TRUE, -- 13
    status ENUM('Review', 'Interview', 'Hired', 'Rejected') DEFAULT 'Review', -- 14
    is_approved BOOLEAN DEFAULT FALSE, -- 15

    google_id VARCHAR(255) NULL, 
    github_id VARCHAR(255) NULL,
    linkedin_id VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla password_resets
CREATE TABLE password_resets(
    email CHAR(50) NOT NULL,
    token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
