<?php

namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; 
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
class UserTest extends TestCase
{
    use RefreshDatabase;

    //Prueba unitaria para la controladora de usuario
    //Estas pruebas se pueden expandir para cubrir casos como actualización de perfil, obtención de perfil, etc.
    //Prueba de obtención del perfil del usuario autenticado
    public function test_obtener_perfil_usuario_autenticado()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/user/profile')
             ->assertStatus(200)
             ->assertJsonStructure([
                 'success',
                 'data' => [
                     'id',
                     'name',
                     'lastname',
                     'email',
                     'DNI',
                     'bio',
                     'profile_picture'
                 ],
                 'message'
             ]); //Debe ser exitoso y retornar un status 200
    }

    //Prueba de obtencion de un perfil inexistente.
    public function test_obtener_perfil_usuario_inexistente()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/user/profile')
             ->assertStatus(404)
             ->assertJson([
                 'success' => false,
                 'message' => 'User profile not found'
             ]); //Debe retornar un status 404 y un mensaje de error
    }

    //Prueba de actualización del perfil del usuario autenticado con datos válidos


}
