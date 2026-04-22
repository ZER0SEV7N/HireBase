<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SocialController;

//Rutas publicas para registro, login y autenticación social
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//Ruta para recuperación de contraseña
Route::post('/password/recover', [AuthController::class, 'recoverPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

//Rutas para autenticación social
Route::get('/auth/{provider}/redirect', [SocialController::class, 'redirect']);
Route::get('/auth/{provider}/callback', [SocialController::class, 'callback']);

//Rutas protegidas para el perfil del usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [UserController::class, 'profile']);
    Route::patch('/profile', [UserController::class, 'updateProfile']);

    //Ruta para completar el perfil después de la autenticación social
    Route::post('/profile/complete', [AuthController::class, 'completeProfile']);

    //Ruta para cambiar la foto de perfil
    Route::post('/profile/picture', [UserController::class, 'updateProfilePicture']);
    
    //Ruta para cambiar el CV
    Route::post('/profile/cv', [UserController::class, 'uploadCV']);

    //Ruta para cerrar sesión
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('admin')->group(function () {
        //Ruta para el administrador
        Route::get('/users', [UserController::class, 'index']);
        Route::patch('/users/{id}/status', [UserController::class, 'changeStatus']);
        Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    });
});