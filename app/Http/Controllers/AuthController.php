<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    //Funcion para registrar un nuevo usuario
    public function register(Request $request)
    {
        try{
            $request->validate([
                'name' => 'required|string|max:50',
                'lastname' => 'required|string|max:50',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6',
                'DNI' => 'required|string|max:20|unique:users',
                'birthdate' => 'required|date',
                'hardSkill' => 'required|in:Frontend,Backend,Design,Analyst,Full Stack,Others',
            ]);

            $hashPassword = Hash::make($request->password);

            DB::statement('CALL sp_register(?,?,?,?,?,?,?,?)', [
                $request->name,        //name
                $request->lastname,    //lastname
                $request->email,       //email
                $request->birthdate,   //p_birthdate
                $request->DNI,         //DNI
                $request->hardSkill,   //hardSkill
                $hashPassword,         //password
                'user',                //role
                null                   //profile_picture
            ]);

            $user = User::where('email', $request->email)->first();
            $token = $user->createToken('auth_token')->plainTextToken;

            $data = [
                'user' => $user,
                'token' => $token
            ];

            //Retornar una respuesta estructurada
            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'User registered successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para iniciar sesion
    public function login(Request $request)
    {
        try{
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            //Intentar autenticar al usuario con las credenciales proporcionadas
            if(!Auth::attempt($request->only('email', 'password'))){
                throw ValidationException::withMessages([
                    'message' => ['The provided credentials are incorrect.']
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();

            //Verificar si el usuario está activo antes de generar el token
            if(!$user->is_active){
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is inactive. Please contact support.'
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            
            $data = [
                'user' => $user,
                'token' => $token
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Login successful'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para cerrar sesion
    public function logout(Request $request)
    {
        try{
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para recuperar la cuenta de un usuario
    public function recoverPassword(Request $request)
    {
        try{
            $request->validate([
                'email' => 'required|email|exists:users,email'
            ]);

            $status = Password::sendResetLink($request->only('email'));

            //Verificar si el enlace se envió correctamente
            if($status === Password::RESET_LINK_SENT){
                return response()->json([
                    'success' => true,
                    'message' => 'Recovery email sent successfully'
                ], 200);
            }
            else{
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send recovery email'
                ], 400);
            }
        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Account recovery failed: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para completar el perfil del usuario después de la autenticación social
    public function completeProfile(Request $request)
    {
        try{
            $user = $request->user();

            $validated = $request->validate([
                'lastname' => 'required|string|max:50',
                'DNI' => 'required|string|max:9|unique:users,DNI,' . $user->id,
                'birthdate' => 'required|date',
                'hardSkill' => 'required|in:Frontend,Backend,Design,Analyst,Full Stack,Others',
            ]);

            $user->update($validated);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Profile completed successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete profile: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para restablecer la contraseña del usuario
    public function resetPassword(Request $request)
    {
        try{
            $request->validate([
                'token' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|string|min:6|confirmed',
            ]);

            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->save();

                    $user->tokens()->delete();
                }
            );

            if($status === Password::PASSWORD_RESET){
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset successful'
                ], 200);
            }
            else{
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to reset password'
                ], 400);
            }
        }catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Password reset failed: ' . $e->getMessage()
            ], 400);
        }
    }
}
