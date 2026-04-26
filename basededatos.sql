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
    profile_picture,
    bio,
    cv_url,
    is_active,
    is_approved
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
    INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture, created_at, updated_at)
    VALUES (p_name, p_lastname, p_email, p_birthdate, p_DNI, p_hardSkill, p_password, p_role, p_profile_picture, NOW(), NOW());
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
    IN p_profile_picture VARCHAR(50),
    IN p_bio TEXT
)
BEGIN
    UPDATE users
    SET 
        name = p_name, 
        lastname = p_lastname, 
        email = p_email, 
        DNI = p_DNI, 
        hardSkill = p_hardSkill, 
        password = p_password, 
        profile_picture = p_profile_picture, 
        bio = p_bio,
        updated_at = NOW()
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
    IN p_status ENUM('Review', 'Interview', 'Hired', 'Rejected')
)
BEGIN
    UPDATE users
    SET status = p_status, is_approved = IF(p_status = 'Hired', TRUE, FALSE)
    WHERE id = p_id;
END //

-- Datos de prueba

-- Contraseñas hasheadas para los usuarios de ejemplo (12345678)
-- Insertar un usuario de ejemplo
INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture, is_active, status, is_approved, created_at, updated_at)
VALUES ('Daniel', 'Singer', 'adminhirebase@gmail.com', '2004-07-07', '000000001', 'Others', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'admin', NULL, TRUE, 'Hired', TRUE, NOW(), NOW()),
       ('Maria', 'Gonzalez', 'maria.gonzalez@example.com', '1995-03-15', '000000002', 'Backend', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'user', NULL, TRUE, 'Review', FALSE, NOW(), NOW()),
       ('John', 'Doe', 'john.doe@example.com', '1990-01-01', '000000003', 'Frontend', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'user', NULL, FALSE, 'Rejected', FALSE, NOW(), NOW());

CALL sp_register('Alice', 'Smith', 'alice.smith@example.com', '1992-05-10', '000000004', 'Frontend', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'user', NULL);
CALL sp_register('Bob', 'Johnson', 'bob.johnson@example.com', '1988-12-20', '000000005', 'Backend', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'user', NULL);
CALL sp_register('Charlie', 'Brown', 'charlie.brown@example.com', '1995-08-15', '000000006', 'Design', '$2y$12$sRG1d6Ib.GIol7b.4IAXqe.hyW1FlfDoXNiRyQVBiqC2fdpcE5RBa', 'user', NULL);