<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Auth::user()->role === 2) {
            return User::select('id', 'name', 'email', 'created_at')->where('role', '=', 2)->orWhere('role', '=', 3)->get();
        } else if (Auth::user()->role === 1) {
            return User::select('id', 'name', 'email', 'created_at')->get();
        }

        return User::select('id', 'name', 'email', 'created_at')->where('role', '=', 3)->get();
    }

    public function showMember($id)
    {
        $user = User::findOrFail($id);
        $categories = $user->categories;

        return [
            'user' => $user,
            'categories' => $categories,
        ];
    }

    public function update(Request $request, $id)
    {
        $rules = [
            'name' => 'required|min:3|max:30',
            'email' => 'required|min:10|max:50',
            'email' => Rule::unique('users')->ignore($id)->where('email', request('email')),
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->categories()->sync($request->categories);
        $user->save();

        return $user->categories;
    }

    public function getTaskByID(Request $request, $id)
    {
        return User::findOrFail($id)->tasks;
    }

    public function getMember()
    {
        $user = User::select('id', 'name')->where('role', '=', 3)->get();

        return response()->json($user);
    }
}
