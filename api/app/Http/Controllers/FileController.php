<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class FileController extends Controller
{
    //upload file function

    function upload(Request $request )
    {
        // if ($request->hasFile('docs')) {
        //     $rules = [
        //         'avatar' => 'required|mimes:docs,pdf|max:4096',
        //     ];

        //     $validator = Validator::make($request->all(), $rules);
        //     $validator->validated();
        //     $req->file('docs')->store('/docs', $doc);

        //     $path = "/docs/$doc";
        //     $user->update();

        //     return response()->json($path);
        // }
        $path = $request->file('docs')->store('public');
        return response()->json($path);
        // return response()->json(['message' => 'Failed']);
    }
}
