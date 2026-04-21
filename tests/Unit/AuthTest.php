<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class AuthTest extends TestCase
{
    //Pruebas unitarias para la controladora de autenticacion
    //Estas pruebas se pueden expandir para cubrir casos como registro, login, recuperación de contraseña, autenticación social, etc.
    public function test_register_user()
    {
        test()->postJson('/api/register', [
            'name' => 'Test User',
            'email' => ''
        ])->assertStatus(422); //Debe fallar por falta de campos obligatorios
    }
}
