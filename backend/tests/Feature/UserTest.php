<?php

namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; 
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Storage; 
use Illuminate\Http\UploadedFile;
class UserTest extends TestCase
{
    use RefreshDatabase;

    //Prueba unitaria para la controladora de usuario
    //Estas pruebas se pueden expandir para cubrir casos como actualización de perfil, obtención de perfil, etc.
    //Prueba de obtención del perfil del usuario autenticado
    public function test_obtener_perfil_usuario_autenticado()
    {
        $user = User::factory()->create();

        // Nota: Asegúrate de que la ruta coincida con tu api.php (ej. /api/profile)
        $this->actingAs($user, 'sanctum')
             ->getJson('/api/profile')
             ->assertStatus(200)
             ->assertJsonStructure([
                 'success',
                 'data' => [
                     'id', 'name', 'email' // Ajusta según las columnas reales de tu vista user_profiles
                 ],
                 'message'
             ]);
    }

    //Prueba de acceso a la ruta protegida sin autenticación
    public function test_error_obtener_perfil_sin_autenticacion()
    {
        // Intentar acceder a la ruta protegida sin token
        $this->getJson('/api/profile')
             ->assertStatus(401); // 401 Unauthorized
    }

    //Prueba de obtencion de un perfil inexistente.
    public function test_obtener_perfil_usuario_inexistente()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');
        $user->delete();

        $this->getJson('/api/profile')
             ->assertStatus(404)
             ->assertJson([
                 'success' => false,
                 'message' => 'User profile not found'
             ]); //Debe retornar un status 404 y un mensaje de error
    }    

    //Prueba de actualización del perfil del usuario autenticado con datos válidos
    public function test_actualizar_perfil_exitosamente()
    {
        $user = User::factory()->create();

        $payload = [
            'name' => 'Daniel',
            'lastname' => 'Singer',
            'email' => 'daniel.nuevo@gmail.com',
            'DNI' => '12345678',
            'hardSkill' => 'Frontend',
            'bio' => 'Programador con experiencia en Laravel y React.'
        ];

        $this->actingAs($user, 'sanctum')
             ->patchJson('/api/profile', $payload)
             ->assertStatus(200)
             ->assertJson([
                 'success' => true,
                 'message' => 'User profile updated successfully'
             ]);
    }

    //Prueba de actualización del perfil del usuario autenticado con datos inválidos
    public function test_error_actualizar_perfil_con_datos_invalidos()
    {
       $user = User::factory()->create();

        // Enviamos un payload vacío
        $this->actingAs($user, 'sanctum')
             ->patchJson('/api/profile', [])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['name', 'lastname', 'email']);
    }

    //Prueba de actualizacion con email ya registrado por otro usuario
    public function test_error_actualizar_perfil_con_email_ya_registrado()
    {
        User::factory()->create(['email' => 'ocupado@empresa.com']);
        
        $user = User::factory()->create(['email' => 'daniel@gmail.com']);

        $payload = [
            'name' => 'Daniel',
            'lastname' => 'Perez',
            'email' => 'ocupado@empresa.com', 
        ];

        $this->actingAs($user, 'sanctum')
             ->patchJson('/api/profile', $payload)
             ->assertStatus(422) //422 Unprocessable Entity (Error de validación)
             ->assertJsonValidationErrors(['email']);
    }

    //Prueba de subida de foto de perfil con un archivo válido
    public function test_subir_foto_de_perfil_exitosamente()
    {
        Storage::fake('public');
        
        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg');

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/profile/picture', [
                 'photo' => $file
             ])
             ->assertStatus(200)
             ->assertJsonStructure(['success', 'data' => ['profile_picture'], 'message']);

        $user->refresh();
        Storage::disk('public')->assertExists($user->profile_picture);
    }

    //Prueba de subida de foto de perfil con un formato de archivo no permitido
    public function test_error_subir_foto_de_perfil_formato_invalido()
    {
        Storage::fake('public');
        $user = User::factory()->create();

        //Creamos un archivo que NO es imagen (ej. un PDF haciéndose pasar por foto)
        $file = UploadedFile::fake()->create('documento.pdf', 100, 'application/pdf');

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/profile/picture', [
                 'photo' => $file
             ])
             ->assertStatus(422) //Falla la validación 'mimes:jpeg,png,jpg,webp'
             ->assertJsonValidationErrors(['photo']);
    }

    //Prueba de subida de foto de perfil con un archivo que excede el tamaño máximo permitido
    public function test_error_subir_foto_demasiado_pesada()
    {
        Storage::fake('public');
        $user = User::factory()->create();

        //Creamos una imagen falsa de 5MB (tu límite es 2048 KB = 2MB)
        $file = UploadedFile::fake()->create('avatar_gigante.jpg', 5000, 'image/jpeg');

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/profile/picture', [
                 'photo' => $file
             ])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['photo']);
    }

    //Prueba de subida de CV con un archivo válido
    public function test_subir_cv_exitosamente()
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('mi_curriculum.pdf', 1000, 'application/pdf');

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/profile/cv', [
                 'cv_file' => $file
             ])
             ->assertStatus(200);

        $user->refresh();
        Storage::disk('public')->assertExists($user->cv_url);
    }

    //Prueba de subida de CV con un formato de archivo no permitido
    public function test_error_subir_cv_formato_invalido()
    {
        Storage::fake('public');
        $user = User::factory()->create();

        //Creamos un archivo que NO es PDF (ej. una imagen haciéndose pasar por CV)
        $file = UploadedFile::fake()->createWithContent('foto.jpg', 'contenido falso');

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/profile/cv', [
                 'cv_file' => $file
             ])
             ->assertStatus(422) //Falla la validación 'mimes:pdf'
             ->assertJsonValidationErrors(['cv_file']);
    }

    //Prueba de obtencion de todos los usuarios (solo para admin)
    public function test_obtener_todos_los_usuarios_como_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(5)->create();

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/users')
             ->assertStatus(200)
             ->assertJsonStructure([
                 'success',
                 'data' => [
                     '*' => ['id', 'name', 'email'] // Ajusta según las columnas reales de tu vista user_profiles
                 ],
                 'message'
             ]);
    }

    //Prueba de obtencion de todos los usuarios sin ser admin
    public function test_error_obtener_todos_los_usuarios_sin_ser_admin()
    {
        $user = User::factory()->create(['role' => 'user']);
        User::factory()->count(5)->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/users')
             ->assertStatus(403); // 403 Forbidden
    }

    //Prueba para desactivar un usuario (solo para admin)
    public function test_desactivar_usuario_como_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['is_active' => true]);

        $this->actingAs($admin, 'sanctum')
             ->patchJson("/api/users/{$user->id}/toggle-active")
             ->assertStatus(200)
             ->assertJson([
                 'success' => true,
                 'message' => 'User deactivated successfully'
             ]);

        $user->refresh();
        $this->assertEquals(0, $user->is_active);
    }

    //Prueba para desactivar un usuario sin ser admin
    public function test_error_desactivar_usuario_sin_ser_admin()
    {
        $user = User::factory()->create(['role' => 'user', 'is_active' => true]);
        $otherUser = User::factory()->create(['role' => 'user']);

        $this->actingAs($otherUser, 'sanctum')
             ->patchJson("/api/users/{$user->id}/toggle-active")
             ->assertStatus(403); //403 Forbidden
    }

    //Prueba para activar un usuario desactivado (solo para admin)
    public function test_activar_usuario_desactivado_como_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['is_active' => false]); 

        $this->actingAs($admin, 'sanctum')
             ->patchJson("/api/users/{$user->id}/toggle-active")
             ->assertStatus(200) 
             ->assertJson([
                 'success' => true,
                 'message' => 'User activated successfully' 
             ]);

        $user->refresh();
        $this->assertEquals(1, $user->is_active); 
    }

    //Prueba para cambiar el estado de un usuario (Interview | Hired | Rejected | Review) siendo admin
    public function test_cambiar_estado_usuario_como_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['status' => 'Review']);

        $this->actingAs($admin, 'sanctum')
             ->patchJson("/api/users/{$user->id}/status", [
                 'status' => 'Interview'
             ])
             ->assertStatus(200)
             ->assertJson([
                 'success' => true,
                 'message' => 'User status updated successfully'
             ]);

        $user->refresh();
        $this->assertEquals('Interview', $user->status);
    }

    //Prueba para cambiar el estado de un usuario sin ser admin
    public function test_error_cambiar_estado_usuario_sin_ser_admin()
    {
        $user = User::factory()->create(['role' => 'user', 'status' => 'Review']);
        $otherUser = User::factory()->create(['role' => 'user']);

        $this->actingAs($otherUser, 'sanctum')
             ->patchJson("/api/users/{$user->id}/status", [
                 'status' => 'Interview'
             ])
             ->assertStatus(403); //403 Forbidden
    }

    //Prueba para cambiar el estado de un usuario a un estado no permitido
    public function test_error_cambiar_estado_usuario_a_estado_no_permitido()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['status' => '']);

        $this->actingAs($admin, 'sanctum')
             ->patchJson("/api/users/{$user->id}/status", [
                 'status' => 'InvalidStatus'
             ])
             ->assertStatus(422) //422 Unprocessable Entity (Error de validación)
             ->assertJsonValidationErrors(['status']);
    }
}
