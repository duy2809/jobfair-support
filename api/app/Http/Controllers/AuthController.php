<?php

namespace App\Http\Controllers;

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
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $preURL = session()->get('preURL');
        if (Auth::attempt($credentials, $request->remember)) {
            $request->session()->regenerate();

            return response()->json(['message' => 'Login successfully', 'auth' => auth()->user(), 'preURL' => $preURL], 200);
        }

        return response()->json(['message' => 'Email or password is incorrect'], 400);
    }

    public function preURL(Request $request)
    {
        $url = $request->query('preURL');
        session()->put('preURL', $url);

        return $url;
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
