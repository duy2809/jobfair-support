<?php

namespace App\Http\Controllers;

use Storage;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

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
        // return $contents;
    }

    public function getAvatar(){
        return Storage::download(Auth::user()->avatar, 'avatar');
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
