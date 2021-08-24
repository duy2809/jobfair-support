<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($jfId)
    {
        $files = DB::table('documents')
            ->addSelect(['authorName' => User::select('name')
                        ->whereColumn('id','documents.authorId')])
            ->addSelect(['updaterName' => User::select('name')
                        ->whereColumn('id','documents.updaterId')])
            ->where('path','/')
            ->where('document_id', $jfId)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();

        return response()->json($files);
    }

    public function getLatest()
    {
        $file = DB::table('documents')
            ->addSelect(['authorName' => User::select('name')
                ->whereColumn('id','documents.authorId')])
            ->addSelect(['updaterName' => User::select('name')
                ->whereColumn('id','documents.updaterId')])
            ->where('is_file',true)
            ->orderBy('documents.updated_at', 'desc')
            ->take(10)
            ->get();
        return $file;
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private function checkUnique($name, $path)
    {
        $data = Document::where('path', '=', $path)->where('name', '=', $name)->get();
        if($data->isEmpty()) return true;
        return false;
    }
    public function store(Request $request)
    {
        if($this->checkUnique($request->name, $request->path))
        {
            if($request->is_file)
            {
                $rules = [
                'link' => 'required',
                ];
                $validator = Validator::make($request->all(), $rules);
                $validator->validate();
            }
            Document::create(array_merge($request->all(),['document_type' => 'App\Models\Jobfair']));
            return Document::select('*')
                ->where('path',$request->path)
                ->orderBy('documents.is_file', 'asc')
                ->orderBy('documents.updated_at', 'desc')
                ->get();
        }
        return $messages = [
            'document.name.unique' => 'Given name already have in folder',
        ];
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
    //  Display files and folder in specific folder.
    public function getPath(Request $request)
    {
        $data = DB::table('documents')
        ->select('*')
        ->where('path', $request->path)
        ->where('document_id', $request->jfId)
        ->orderBy('is_file', 'asc')
        ->orderBy('updated_at', 'desc')
        ->get();

        return response()->json($data);
    }
    public function search(Request $request)
    {
        $query = document::all()->get();
        if($request->has('name'))
        {
            $query::where('name', 'LIKE', "%$request->name%");
        }
        if($request->has('updated_at'))
        {
            $query::whereBetween('updated_at', [$request->from,$request->to]);
        }
        if($request->has('updaterId'))
        {
            $query::where('updaterId', 'LIKE', "%$request->updaterId%");
        }

        return $query
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();
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
        if($this->checkUnique($request->name, $request->path))
        {
            if($request->is_file)
            {
                $rules = [
                    'link' => 'required',
                ];
                $validator = Validator::make($request->all(), $rules);
                $validator->validate();
            }
            Document::find($id)
                ->update(array_merge($request->all(), ['updaterId' => auth()->user()->id]));

            return DB::table('documents')
                ->select('*')
                ->where('path', $request->path)
                ->orderBy('documents.is_file', 'asc')
                ->orderBy('documents.updated_at', 'desc')
                ->get();
        }
        return $messages = [
            'document.name.unique' => 'Given name already have in folder',
        ];
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
    public function destroyArrayOfDocument(Request $request)
    {
        $path = Document::where('id', $request->id[0])->first();
        foreach($request->id as $Id)
            Document::destroy($Id);

        return Document::select('*')
            ->where('path', $path->path)
            ->orderBy('is_file', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();
    }
}
