<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
  
    public function index(Request $request)
    {
        return User::all('id', 'name', 'email', 'created_at');
    }

    public function showMember($id)
    {
        $user = User::findOrFail($id);
        $categories = $user->categories->pluck(['category_name']);

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

        $user->categories()->sync($request->get('categories'));

        return $user->save();
    }
}
