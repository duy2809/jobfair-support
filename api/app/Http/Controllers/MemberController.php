<?php

namespace App\Http\Controllers;

use App\Models\User;

class MemberController extends Controller
{
    /**
     * Display list users.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all('name', 'email', 'created_at');
    }
}
