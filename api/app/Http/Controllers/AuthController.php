<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $request->session()->regenerate();
            $user = auth()->user();
            $manage_jf_ids = Jobfair::where('jobfair_admin_id', $user->id)->pluck('id')->toArray();
            $user->setAttribute('manage_jf_ids', $manage_jf_ids);
            return response()->json(['message' => 'Login successfully', 'auth' => $user], 200);
        }

        return response()->json(['message' => 'Email or password is incorrect'], 400);
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        if (Auth::check()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response(['message' => 'Logout'], 200);
        }

        return response(['message' => 'Please login'], 400);
    }
}
