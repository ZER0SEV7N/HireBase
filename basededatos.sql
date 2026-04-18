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
    is_active BOOLEAN DEFAULT TRUE, -- 11
    status ENUM('Review', 'Interview', 'hired', 'Rejected') DEFAULT 'Review', -- 12
    is_approved BOOLEAN DEFAULT FALSE, -- 13

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

-- Insertar un usuario de ejemplo
INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture, is_active, status, is_approved)
VALUES ('Daniel', 'Singer', 'danielenriquesinger0@gmail.com', '2004-07-07', '000000001', 'Others', '123456', 'admin', NULL, TRUE, 'hired', TRUE);

-- Crear Vista
CREATE VIEW user_profiles AS
SELECT 
    id,
    CONCAT(name, ' ', lastname) AS fullname,
    name,
    email,
    birthdate,
    hardSkill,
    DNI,
    status,
    role,
    profile_picture
FROM users;

-- ==========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ==========================================

DELIMITER //

-- Procedimiento para registrar un nuevo usuario
CREATE PROCEDURE sp_register(
    IN p_name CHAR(50),
    IN p_lastname CHAR(50),
    IN p_email CHAR(50),
    IN p_birthdate DATE,
    IN p_DNI CHAR(9),
    IN p_hardSkill ENUM('Frontend', 'Backend', 'Design', 'Analyst', 'Full Stack', 'Others'),
    IN p_password CHAR(64),
    IN p_role ENUM('admin', 'user'),
    IN p_profile_picture VARCHAR(50)
)
BEGIN
    INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture)
    VALUES (p_name, p_lastname, p_email, p_birthdate, p_DNI, p_hardSkill, p_password, p_role, p_profile_picture);
END //


-- Procedimiento para actualizar algun campo del usuario
CREATE PROCEDURE sp_updateUser(
    IN p_id INT,
    IN p_name CHAR(50),
    IN p_lastname CHAR(50),
    IN p_email CHAR(50),
    IN p_DNI CHAR(9),
    IN p_hardSkill ENUM('Frontend', 'Backend', 'Design', 'Analyst', 'Full Stack', 'Others'),
    IN p_password CHAR(64),
    IN p_profile_picture VARCHAR(50)
)
BEGIN
    UPDATE users
    SET name = p_name, lastname = p_lastname, email = p_email, DNI = p_DNI, hardSkill = p_hardSkill, password = p_password, profile_picture = p_profile_picture
    WHERE id = p_id;
END //


-- Procedimiento para desactivar un usuario
CREATE PROCEDURE sp_deactivateUser(
    IN p_id INT
)
BEGIN
    UPDATE users
    SET is_active = FALSE
    WHERE id = p_id;
END //


-- Procedimiento para activar un usuario
CREATE PROCEDURE sp_activateUser(
    IN p_id INT
)
BEGIN
    UPDATE users
    SET is_active = TRUE
    WHERE id = p_id;
END //


-- Procedimiento para cambiar el estado de un usuario
CREATE PROCEDURE sp_changeStatus(
    IN p_id INT,
    IN p_status ENUM('Review', 'Interview', 'hired', 'Rejected')
)
BEGIN
    UPDATE users
    SET status = p_status, is_approved = IF(p_status = 'hired', TRUE, FALSE)
    WHERE id = p_id;
END //


-- Procedimiento para crear el token de recuperación de contraseña
CREATE PROCEDURE sp_recoveryPassword(
    IN p_email CHAR(50),
    IN p_token VARCHAR(100)
)
BEGIN
    INSERT password_resets (email, token)
    VALUES (p_email, p_token);
END //

DELIMITER ;