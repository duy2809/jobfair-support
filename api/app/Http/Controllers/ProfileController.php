<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rules = [
            'id' => 'exists:App\Models\User,id',
        ];
        $validator = Validator::make([
            'id' => $id,
        ], $rules);
        $validator->validate();
        // $contents = Storage::download('image/avatars/1.jpg');
        // $exists = Storage::disk('public')->exists('1.jpg');
        // $test = Storage::disk('public')->url('app/public/1.jpg');
        // $path = storage_path('app/public/1.jpg');

        return User::find($id);
    }

    public function avatar($id)
    {
        // return Storage::download(Auth::user()->avatar,'avatar');
        $avatar = User::find($id)->avatar;

        return Storage::download($avatar);

        // return Storage::download($link);
        // return User::find($id)->avatar;
        // return Auth::user();
    }

    public function getAvatar()
    {
        return Storage::download(Auth::user()->avatar, 'avatar');
    }

    public function updateUserInfo(Request $request, $id)
    {
        //
        $rules = [
            'name' => 'required|string',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->whereNot('id', $id),

            ],
            'chatwork_id' => 'required|string',
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
        if (Hash::check($request->current_password, $user->password)) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        } else {
            return response()->json(['message' => 'Current password incorrect']);
        }

        return response()->json(['message' => 'Password has been successfully changed']);
    }

    public function updateAvatar(Request $request, $id)
    {
        if ($request->hasFile('avatar')) {
            //$test = $request->file('avatar');
            //dd([$test, $request->file('avatar')->storeAs('public/image/avatars', $id . '.' . $request->avatar->extension())]);
            $user = User::find($id);

            $rules = [
                'avatar' => 'required|mimes:jpg,png|max:4096',
            ];

            $validator = Validator::make($request->all(), $rules);
            $validator->validated();

            //dd($request);

            $avatar = $user->id . '.' . $request->avatar->extension();
            $load = $request->file('avatar')->storeAs('public/image/avatars', $avatar);

            $path = "public/image/avatars/$avatar";
            $request->avatar = $path;
            //dd($request);
            $user->update();

            //return $user;
            return response()->json($path);
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
