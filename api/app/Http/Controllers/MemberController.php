<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return User::all('id', 'name', 'email', 'created_at');
    }
}