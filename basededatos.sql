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

-- Insertar un usuario de ejemplo
INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture, is_active, status, is_approved)
VALUES ('Daniel', 'Singer', 'danielenriquesinger0@gmail.com', '2004-07-07', '000000001', 'Others', '123456', 'admin', NULL, TRUE, 'Hired', TRUE),
       ('Maria', 'Gonzalez', 'maria.gonzalez@example.com', '1995-03-15', '000000002', 'Backend', 'password456', 'user', NULL, TRUE, 'Review', FALSE),
       ('John', 'Doe', 'john.doe@example.com', '1990-01-01', '000000003', 'Frontend', 'password123', 'user', NULL, FALSE, 'Rejected', FALSE);



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
    cv_url
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
        bio = p_bio
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

-- Procedimiento para dashboard
CREATE PROCEDURE sp_dashboard()
BEGIN
    SELECT
        count(*) AS total_users,
        SUM(CASE WHEN status = 'Review' THEN 1 ELSE 0 END) AS Pending_Review,
        SUM(CASE WHEN status = 'Interview' THEN 1 ELSE 0 END) AS in_Interview,
        SUM(CASE WHEN status = 'Hired' THEN 1 ELSE 0 END) AS Hired,
        SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS Rejected
    FROM users
    where role = 'user';
END //

-- Procedimiento para obtener los usuarios registrados en los últimos 7 días
CREATE PROCEDURE sp_recentUsers()
BEGIN
    Select
        DATE(created_at) AS registration_date,
        COUNT(*) AS registration_count
    FROM users
    WHERE role = 'user'
    GROUP BY registration_date
    ORDER BY registration_date ASC
    LIMIT 7;
END //

DELIMITER ;

-- Datos de prueba
CALL sp_register('Alice', 'Smith', 'alice.smith@example.com', '1992-05-10', '000000004', 'Frontend', 'password789', 'user', NULL);
CALL sp_register('Bob', 'Johnson', 'bob.johnson@example.com', '1988-12-20', '000000005', 'Backend', 'password321', 'user', NULL);
CALL sp_register('Charlie', 'Brown', 'charlie.brown@example.com', '1995-08-15', '000000006', 'Design', 'password987', 'user', NULL);