<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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
        ->whereNull('preFolderID')
        ->orderBy('documents.updated_at', 'desc')
        ->get();

        return response()->json($data);
    }

    public function Latest()
    {
        return Document::orderBy('document.updated_at', 'desc')
        ->take(10);
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
        Validator::make($request, ['name', Rule::unique('documents')->where('preFolderID', $request->preFolderId)]);
        if($request->is_file === true)
        {
            $rules = [
                'link' => 'required',
            ];
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        }

        return Document::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $pervious folder id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Document::find($id);
    }
    //  Display files and folder in specified folder.
    public function getPath($id)
    {
        $data = DB::table('documents')
        ->select('*')
        ->where('preFolderID', $id)
        ->orderBy('documents.updated_at', 'desc')
        ->get();

        return response()->json($data);
    }
    public function search(Request $request)
    {
        if($request->has('name'))
        {
            $query::where('name', 'LIKE', "%$request->name%");
        }
        if($request->has('update_date'))
        {
            $query::whereBetween('update_date', [$request->from,$request->to]);
        }
        if($request->has('name'))
        {
            $query::where('name', 'LIKE', "%$request->name%");
        }
        return $data->get;
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
        Validator::make($request, ['name', Rule::unique('documents')->where('preFolderID', $request->preFolderId)]);
        if($request->is_file === true)
        {
            $rules = [
                'link' => 'required',
            ];
            $validator = Validator::make($request->all(), $rules);
            $validator->validate();
        }

        return Category::find($id)->update($request->all());
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
