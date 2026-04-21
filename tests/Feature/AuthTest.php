<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; 
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    //Pruebas unitarias para la controladora de autenticacion
    
    //Estas pruebas se pueden expandir para cubrir casos como registro, 
    //login, recuperación de contraseña, completado de perfil, etc.
    public function test_register_user_con_datos_validos()
    {
        //Prueba de registro de usuario con datos válidos
        $this->postJson('/api/register', [
            'name' => 'carlos',
            'lastname' => 'lopez',
            'email' => 'carlos@example.com',
            'password' => 'password123',
            'DNI' => '12345678',
            'birthdate' => '1990-01-01',
            'hardSkill' => 'Backend'
        ])->assertStatus(201)
          ->assertJsonStructure([
              'success',
              'data' => [
                  'user',
                  'token'
              ],
              'message'
          ]); //Debe ser exitoso y retornar un status 201
    }

    //Prueba de registro de usuario con campos obligatorios faltantes
    public function test_register_falla_por_campos_obligatorios()
    {
        $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => ''
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['email', 'lastname', 'password', 'DNI', 'birthdate', 'hardSkill']);
    }

    //Prueba de registro de usuario con formato de email inválido
    public function test_register_falla_por_email_invalido()
    {
        User::factory()->create(['email' => 'carlos@example.com']);

        //Prueba de registro de usuario con email ya registrado
        $this->postJson('/api/register', [
            'name' => 'carlos 2',
            'lastname' => 'lopez',
            'email' => 'carlos@example.com', // Correo repetido
            'password' => 'password123',
            'DNI' => '87654321',
            'birthdate' => '1990-01-01',
            'hardSkill' => 'Frontend'
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['email']); //Debe fallar por email ya registrado
    }

    //Prueba de registro de usuario con contraseña débil
    public function test_register_falla_por_contraseña_débil()
    {
        //Prueba de registro con contraseña débil
        $this->postJson('/api/register', [
            'name' => 'Juan',
            'lastname' => 'Perez',
            'email' => 'juan@example.com',
            'password' => '123',
            'DNI' => '87654321',
            'birthdate' => '1990-01-01',
            'hardSkill' => 'Frontend'
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['password']); //Debe fallar por contraseña débil (requiere al menos 8 caracteres)
    }

    //Pruebas unitarias para el login de usuario
    public function test_login_user_con_credenciales_validas()
    {
        //Prueba de login con credenciales válidas
        $user = User::factory()->create([
            'email' => 'carlos@example.com',
            'password' => Hash::make('password123'),
            'is_active' => true 
        ]);

        $this->postJson('/api/login', [
            'email' => 'carlos@example.com',
            'password' => 'password123'
        ])->assertStatus(200)
          ->assertJsonStructure([
                'success',
                'data' => [
                    'user',
                    'token'
                ],
                'message'
            ]); //Devuelve un status 200 y la estructura esperada
    }

    //Prueba de login con credenciales inválidas
    public function test_login_user_con_credenciales_invalidas()
    {
        //Prueba de login con contraseña incorrecta
        User::factory()->create([
            'email' => 'carlos@example.com',
            'password' => Hash::make('password123'),
            'is_active' => true 
        ]);    

        $this->postJson('/api/login', [
            'email' => 'carlos@example.com',
            'password' => 'wrongpassword'
        ])->assertStatus(401)
          ->assertJson([ 
              'message' => 'The provided credentials are incorrect.'
          ]); //Debe fallar con status 401 y mensaje de credenciales incorrectas
    }

    //Prueba para un usuario inactivo
    public function test_login_user_inactivo()
    {
        
        $inactiveUser = User::factory()->create([
            'email' => 'inactivo@example.com',
            'password' => Hash::make('password123'),
            'is_active' => false
        ]);

        $this->postJson('/api/login', [
            'email' => 'inactivo@example.com',
            'password' => 'password123'
        ])->assertStatus(403)
          ->assertJson([
              'success' => false,
              'message' => 'Your account is inactive. Please contact support.'
          ]); 
    }

    //Pruebas unitarias para completar el perfil de usuario
   public function test_complete_profile()
    {
        $user = User::factory()->create([
            'name' => 'ZER0SEV7N',
            'lastname' => null,
            'DNI' => null
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/profile/complete', [ 
                 'name' => 'Daniel Enrique',
                 'lastname' => 'Singer Rojas',
                 'DNI' => '12345678',
                 'birthdate' => '2000-01-01',
                 'hardSkill' => 'Frontend'
             ])->assertStatus(200)
               ->assertJsonStructure([ 
                   'success',
                   'data' => [
                       'id', 'name', 'email'
                   ], 
                   'message'
               ]);
    }

    //Prueba de completar perfil con datos faltantes
    public function test_complete_profile_falla_por_datos_faltantes()
    {
        $user = User::factory()->create([
            'name' => 'ZER0SEV7N',
            'lastname' => null,
            'DNI' => null
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/profile/complete', [ 
                 'name' => 'Daniel Enrique',
                 'lastname' => 'Singer Rojas',
             ])->assertStatus(422)
               ->assertJsonValidationErrors(['DNI', 'birthdate', 'hardSkill']);
    }

    //Prueba para el logout de usuario
    public function test_logout_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/logout')
             ->assertStatus(200)
             ->assertJson([
                 'success' => true,
                 'message' => 'Logout successfully'
             ]); //Debe cerrar sesión exitosamente

        //Verificar que el token haya sido revocado
        $this->assertCount(0, $user->tokens);
    }

    //Prueba de recuperación de contraseña con envio de enlace
    public function test_recover_password_con_envia_link()
    {
        $user = User::factory()->create(['email' => 'danielsinger07@hotmail.com']);

        $this->postJson('/api/password/recover', [
            'email' => 'danielsinger07@hotmail.com'
        ])->assertStatus(200)
          ->assertJson([
                'success' => true,
                'message' => 'Recovery email sent successfully'
          ]); //Debe enviar el enlace de recuperación exitosamente
    }

    //Prueba de recuperación de contraseña con email no registrado
    public function test_recover_password_con_email_no_registrado()
    {
        $this->postJson('/api/password/recover', [
            'email' => 'daniel@example.com' // Email no registrado
        ])->assertStatus(422)
          ->assertJsonValidationErrors(['email']); //Debe fallar al no encontrar el email registrado
    }

    //Prueba de reinicio de contraseña con token válido
    public function test_reset_password_con_token_valido()
    {
        $user = User::factory()->create([
            'email' => 'danielsinger07@hotmail.com',
            'password' => Hash::make('oldpassword')
        ]);

        $token = Password::createToken($user);

        $this->postJson('/api/password/reset', [
            'email' => 'danielsinger07@hotmail.com',
            'token' => $token,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ])->assertStatus(200)
          ->assertJson([
              'success' => true,
              'message' => 'Password reset successfully'
          ]); //Debe reiniciar la contraseña exitosamente

        //Comprobar que la contraseña realmente cambió
        $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
    }

    //Prueba de reinicio de contraseña con token inválido
    public function test_reset_password_con_token_invalido()
    {
        $user = User::factory()->create([
            'email' => 'danielsinger07@hotmail.com',
            'password' => Hash::make('oldpassword')
        ]);
        $this->postJson('/api/password/reset', [
            'email' => 'danielsinger07@hotmail.com',
            'token' => 'invalidtoken',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123'
        ])->assertStatus(400)
          ->assertJson([
              'success' => false,
                'message' => 'Failed to reset password'
            ]); //Debe fallar al usar un token inválido
    }
}
