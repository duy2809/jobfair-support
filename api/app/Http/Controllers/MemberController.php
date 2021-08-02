<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        return User::all('id', 'name', 'email', 'created_at');
    }

    public function showMember($id)
    {
        $user = User::findOrFail($id);
        $categories = $user->categories;
        return [
            'user' => $user,
            'categories' => $categories
        ];
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
