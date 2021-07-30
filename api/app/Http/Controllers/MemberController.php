<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        return User::all('id', 'name', 'email', 'created_at');
    }

    public function showMember($id) 
    {
        $member = User::findOrFail($id);
        return $member;
    }

    public function update(Request $request, $id)
    {
        // $rules = [
        //     'name' => 'required|regex:/^[^\s]*$/',
        //     'email' => Rule::unique('users'),
        // ];
        // $validator = Validator::make($request->all(), $rules);
        // $validator->validate();

        return User::find($id)->update($request->all());
    }

}
