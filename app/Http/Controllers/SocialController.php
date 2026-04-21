<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Services\SocialService;

class SocialController extends Controller
{
    protected $socialService;

    //Inyectar el servicio de SocialService para manejar la lógica de autenticación social
    public function __construct(SocialService $socialService)
    {
        $this->socialService = $socialService;
    }

    //Redirigir al usuario a la página de autenticación del proveedor social
    public function redirect($provider)
    {
        return response()->json([
            'success' => true,
            'url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl()
        ], 200);
    }

    //Manejar la respuesta del proveedor social después de la autenticación API
    public function callback($provider)
    {
        try{
            $socialUser = Socialite::driver($provider)->stateless()->user();
        }
        catch (\Exception $e) {
            $frontend = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->to($frontend . '/auth?error=' . $provider . '_auth_failed');
        }

        $user = $this->socialService->findOrCreate($socialUser, $provider);

        $token = $user->createToken('auth_token')->plainTextToken;

        $frontend = env('FRONTEND_URL', 'http://localhost:3000');
        $redirectUrl = $frontend . '/auth/callback?token=' . $token;

        if($this->socialService->profileIncomplete($user)){
            $redirectUrl .= '&action=complete_profile';
        }

        return redirect()->to($redirectUrl);
    }
}
