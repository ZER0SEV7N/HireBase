-- Usar la base de datos
USE hirebase;
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