<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
//use Intervention\Image\ImageServiceProvider;

use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $rules = [
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email',   
            'chatwork_id' => 'sometimes|string',
            'role' => 'numeric',
            'number_of_record' => 'numeric',
            'phone_number' => 'numeric',
        ];

        $validator = Validator::make($request->all(), $rules);
        $validator->validated();
        $user = User::find($id);
        $user->update($request->all());
        
        return response()->json(['message' => 'Updated successfully']);
    }

    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|max:24',
            'comfirm_password' => 'required|string|same:password',
        ]);

        $user = User::find($id);
        if (Hash::check($request->current_password, $user->password)){
            $user->update([
                'password' =>bcrypt($request->password)
            ]);
        } else {
            return response()->json(['message' => 'Current password incorrect']);
        }
        
        return response()->json(['message' => 'Password has been successfully changed']);
    }

    public function updateAvatar(Request $request, $id){
        if($request->hasFile('avatar')){
            //$test = $request->file('avatar');
            //dd([$test, $request->file('avatar')->storeAs('public/image/avatars', $id . '.' . $request->avatar->extension())]);
    	    $user = User::find($id);

            $rules = [
                'avatar' => 'required|mimes:jpg,png|max:4096',
            ];
        
            $avatar = $user->id . '.' . $request->avatar->extension();
            $load = $request->file('avatar')->storeAs('public/image/avatars', $avatar);

            $path = "/image/avatars/$avatar";
            $user->avatar = $path;
            $user->update();
        
    	    return response()->json([
                'message' => 'Success',
            ]); 
        } 
        
        return response()->json(['message' => 'Failed']);

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return User::destroy($id);
    }
}
