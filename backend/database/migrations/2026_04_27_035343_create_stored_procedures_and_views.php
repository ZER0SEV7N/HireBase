<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    public function up(): void
    {
        //Vista
        DB::unprepared('
            DROP VIEW IF EXISTS user_profiles;
            CREATE VIEW user_profiles AS
            SELECT 
                id, name, lastname, email, DNI, role, hardSkill, 
                bio, profile_picture, cv_url, is_active, status, 
                created_at, updated_at
            FROM users;
        ');

        //PROCEDIMIENTO: Actualizar Perfil
        DB::unprepared('
            DROP PROCEDURE IF EXISTS sp_updateUser;
            CREATE PROCEDURE sp_updateUser(
                IN p_id INT,
                IN p_name VARCHAR(50),
                IN p_lastname VARCHAR(50),
                IN p_email VARCHAR(100),
                IN p_DNI VARCHAR(20),
                IN p_hardSkill VARCHAR(50),
                IN p_password VARCHAR(255),
                IN p_profile_picture VARCHAR(255),
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
                    password = COALESCE(p_password, password), 
                    profile_picture = p_profile_picture, 
                    bio = p_bio,
                    updated_at = NOW()
                WHERE id = p_id;
            END;
        ');

        //Procedimiento: Registrar Usuario
        DB::unprepared('
            DROP PROCEDURE IF EXISTS sp_register;
            CREATE PROCEDURE sp_register(
                IN p_name CHAR(50),
                IN p_lastname CHAR(50),
                IN p_email CHAR(50),
                IN p_birthdate DATE,
                IN p_DNI CHAR(9),
                IN p_hardSkill VARCHAR(50),
                IN p_password CHAR(64),
                IN p_role ENUM("admin", "user"),
                IN p_profile_picture VARCHAR(50)
            )
            BEGIN
                INSERT users (name, lastname, email, birthdate, DNI, hardSkill, password, role, profile_picture, created_at, updated_at)
                VALUES (p_name, p_lastname, p_email, p_birthdate, p_DNI, p_hardSkill, p_password, p_role, p_profile_picture, NOW(), NOW());
            END;
        ');

        //PROCEDIMIENTO: Cambiar Estado
        DB::unprepared('
            DROP PROCEDURE IF EXISTS sp_changeStatus;
            CREATE PROCEDURE sp_changeStatus(
                IN p_id INT,
                IN p_status VARCHAR(20)
            )
            BEGIN
                UPDATE users
                SET status = p_status, updated_at = NOW()
                WHERE id = p_id;
            END;
        ');

        //PROCEDIMIENTOS: Activar y Desactivar
        DB::unprepared('
            DROP PROCEDURE IF EXISTS sp_activateUser;
            CREATE PROCEDURE sp_activateUser(IN p_id INT)
            BEGIN
                UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = p_id;
            END;
        ');

        DB::unprepared('
            DROP PROCEDURE IF EXISTS sp_deactivateUser;
            CREATE PROCEDURE sp_deactivateUser(IN p_id INT)
            BEGIN
                UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = p_id;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP VIEW IF EXISTS user_profiles;');
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_updateUser;');
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_register;');
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_changeStatus;');
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_activateUser;');
        DB::unprepared('DROP PROCEDURE IF EXISTS sp_deactivateUser;');
    }
};
