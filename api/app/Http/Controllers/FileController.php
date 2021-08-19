<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('documents')
        ->select('*')
        ->orderBy('documents.updated_at', 'desc')
        ->get();

        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if($request->is_file === true)
        {
            $rules = [
                'name' => 'required',
                'link' => 'required',
            ];
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        } else {
            $rules = [
                'name' => 'required',
            ];
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        }

        return Document::create($request->all());
    }

    /**
     * Display files and folder in specified folder.
     *
     * @param  int  $pervious folder id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = DB::table('documents')
        ->select('*')
        ->where('preFolderID', $id)
        ->orderBy('documents.updated_at', 'desc')
        ->get();

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Document::destroy($id);
    }
}
