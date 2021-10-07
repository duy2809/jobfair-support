<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Jobfair;
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
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', '/')
            ->where('document_id', $jfId)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();

        return response()->json($files);
    }

    public function getLatest($id)
    {
        return DB::table('documents')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('is_file', true)
            ->where('document_id', $id)
            ->orderBy('documents.updated_at', 'desc')
            ->take(10)
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)
    {
        {
            $rules = [
                'name' => [
                    'required',
                    Rule::unique('documents')->where('path', $request->path)->where('document_id', $request->document_id)->where('is_file', $request->is_file),
                ],
            ];
            if ($request->is_file) {
                $rules['link'] = 'required';
            }

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return response()->json($validator->messages(), 200);
            }

            Document::create(array_merge(
                $request->all(),
                ['authorId' => auth()->user()->id],
                ['updaterId' => auth()->user()->id],
                ['document_type' => 'App\Models\Jobfair']
            ));

            return DB::table('documents')
                ->select('*')
                ->where('path', $request->path)
                ->where('document_id', $request->document_id)
                ->orderBy('documents.is_file', 'asc')
                ->orderBy('documents.updated_at', 'desc')
                ->get();
        }
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
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', $request->path)
            ->where('document_id', $request->jfId)
            ->orderBy('is_file', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function search(Request $request)
    {
        $query = Document::query();
        if ($request->has('name')) {
            $query->where('name', 'LIKE', "%$request->name%");
        }

        if ($request->has('start_date')) {
            $query->where('updated_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('updated_at', '<=', $request->end_date);
        }

        if ($request->has('updaterId')) {
            $query->where('updaterId', $request->updaterId);
        }

        return $query->where('is_file', true)->where('document_id', $request->jfID)->addSelect([
            'authorName' => User::select('name')
                ->whereColumn('id', 'documents.authorId'),
        ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->orderBy('documents.updated_at', 'desc')->get();
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
        $document = Document::find($id);
        $rules = [
            'name' => Rule::unique('documents')->where('path', $document->path)
                ->where('document_id', $document->document_id)
                ->where('is_file', $document->is_file)
                ->whereNot('id', $id),
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->messages(), 200);
        }

        $document->update(array_merge($request->all(), ['updaterId' => auth()->user()->id]));

        return DB::table('documents')
            ->select('*')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', $document->path)
            ->where('document_id', $document->document_id)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();
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

    public function destroyArrayOfDocument(Request $request, $id)
    {
        $path = Document::where('id', $request->id[0])->first()->path;
        foreach ($request->id as $index) {
            $document = Document::find($index);
            if (!$document->is_file) {
                if ($path === '/') {
                    $pathD = $path.$document->name;
                } else {
                    $pathD = $path.'/';
                    $pathD .= $document->name;
                }

                $term = $pathD.'/';
                $term .= '%';
                Document::where('path', 'LIKE', $term)->orWhere('path', $pathD)->delete();
            }

            Document::destroy($index);
        }

        return Document::select('*')
            ->where('path', $path)
            ->where('document_id', $id)
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->orderBy('is_file', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function getMember($id)
    {
        $jobfair = Jobfair::find($id);

        return User::where('role', 1)->orWhere('id', $jobfair->user->id)->orWhereIn('id', $jobfair->schedule->users->pluck('id'))->get();
    }
}
