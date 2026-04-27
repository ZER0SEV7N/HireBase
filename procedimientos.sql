-- Usar la base de datos
USE hirebase;

-- Crear Vista
CREATE VIEW user_profiles AS
SELECT 
    id,
    CONCAT(name, ' ', lastname) AS fullname,
    name,
    lastname,
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
    IN p_hardSkill ENUM('Frontend', 'Backend', 'Design', 'Analyst', 'Full Stack', 'Others'),
    IN p_password CHAR(64),
    IN p_profile_picture VARCHAR(255),
    IN p_bio TEXT
)
BEGIN
    UPDATE users
    SET 
        name = p_name, 
        lastname = p_lastname, 
        email = p_email, 
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

