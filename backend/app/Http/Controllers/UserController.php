<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class userController extends Controller
{
    //Funcion para obtener el perfil del usuario autenticado
    public function profile()
    {
        try{
            $userProfile = DB::table('user_profiles')->where('id', Auth::id())->first();

            if(!$userProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'User profile not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $userProfile,
                'message' => 'User profile retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user profile: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para actualizar el perfil del usuario autenticado
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            $request->validate([
                'name' => 'required|string|max:50',
                'lastname' => 'required|string|max:50',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'DNI' => 'nullable|string|max:20|unique:users,DNI,' . $user->id,
                'hardSkill' => 'nullable|in:Frontend,Backend,Design,Analyst,Full Stack,Others',
                'bio' => 'nullable|string|max:2000',
            ]);

            DB::statement('CALL sp_updateUser(?,?,?,?,?,?,?,?,?)', [
                $user->id,             //id
                $request->name,        //name
                $request->lastname,    //lastname
                $request->email,       //email
                $request->DNI,         //DNI
                $request->hardSkill ?? $user->hardSkill, //hardSkill (permite mantener el valor actual si no se proporciona uno nuevo)
                $user->password,        //password
                $user->profile_picture, //profile_picture 
                $user->bio
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User profile updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user profile: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para actualizar la foto de perfil del usuario autenticado
    public function updateProfilePicture(Request $request)
    {
        try{
            $request->validate([
                'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            ]);

            $user = $request->user();

            if($request->hasFile('photo')){
                //Si el usuario ya tiene una foto de perfil, eliminarla antes de subir la nueva
                if ($user->profile_picture && !str_starts_with($user->profile_picture, 'http')) 
                    Storage::disk('public')->delete($user->profile_picture);
                
                $path = $request->file('photo')->store('profiles', 'public');
                $user->update(['profile_picture' => $path]);

                return response()->json([
                    'success' => true,
                    // Devolvemos la URL completa para que Next.js la renderice inmediatamente
                    'data' => ['profile_picture' => url('storage/' . $path)], 
                    'message' => 'Profile photo updated successfully'
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile picture: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para subir o actualizar el CV del usuario atenticado
    public function uploadCV(Request $request)
    {
        try{
            $user = $request->user();

            $request->validate([
                'cv_file' => 'nullable|file|mimes:pdf|max:5120', 
            ]);

            if($request->hasFile('cv_file')){
                //Si el usuario ya tiene un CV, eliminarlo antes de subir el nuevo
                if ($user->cv_url) 
                    Storage::disk('public')->delete($user->cv_url);
                
                $path = $request->file('cv_file')->store('cvs', 'public');
                $user->update(['cv_url' => $path]);

                return response()->json([
                    'success' => true,
                    'data' => ['cv_url' => url('storage/' . $path)], 
                    'message' => 'CV uploaded successfully'
                ], 200);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload CV: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funciones de administrador para gestion de usuarios
    public function index()
    {
        try{
            $users = DB::table('user_profiles')->where('role', 'user')->get();

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 400);
        }
    }

    //Funcion para cambiar el estado del postulante
    public function changeStatus(Request $request, $id)
    {
        try{
            $request->validate([
                'status' => 'required|in:Review,Interview,Hired,Rejected'
            ]);
            
            DB::statement('CALL sp_changeStatus(?,?)', [
                $id,             
                $request->status 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User status updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user status: ' . $e->getMessage()
            ], 400);
        }
    }

    //Activar o desactivar una cuenta de usuario
    public function toggleActive($id)
    {
        try{
            $user = User::findOrFail($id);

            if($user->is_active){
                DB::statement('CALL sp_deactivateUser(?)', [$id]);
                $message = 'User deactivated successfully';
            } else {
                DB::statement('CALL sp_activateUser(?)', [$id]);
                $message = 'User activated successfully';
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle user active status: ' . $e->getMessage()
            ], 400);
        }
    }
}
