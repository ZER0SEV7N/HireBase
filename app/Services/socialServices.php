<?php

namespace App\Services;

use App\Models\User;
use Laravel\Socialite\Contracts\User as SocialiteUser;

//Clase global para el manejo de socialite 
class SocialServices{
    
    //Funcion para encontrar o crear un usuario a partir de la información obtenida por socialite
    public function findOrCreate(SocialiteUser $socialiteUser, string $provider): User{
        
        $user = User::where('email', $socialiteUser->getEmail())->first();

        $providerIdField = "{$provider}_id";
        
        //Crear si el usuario no existe
        if(!$user){
            $user = User::create([
                'name' => $socialiteUser->getName() ?? $socialiteUser->getNickname(),
                'email' => $socialiteUser->getEmail(),
                $providerIdField => $socialiteUser->getId(),
                'profile_picture' => $socialiteUser->getAvatar(),
                'password' => null,
            ]);
        //Actualizar el campo del provider si el usuario existe pero no tiene ese campo
        }else if(!$user->$providerIdField) {
            $user->update([$providerIdField => $socialiteUser->getId()]);
        }

        return $user;
    }

    public function profileIncomplete(User $user): bool{
        return empty($user->name) 
            || empty($user->lastname) 
            || empty($user->DNI)             
            || empty($user->profile_picture) 
            || empty($user->birthdate)       
            
            || $user->hardskill === 'Others';
    }
}