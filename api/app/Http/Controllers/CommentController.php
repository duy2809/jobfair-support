<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $status = ['未着手', '進行中', '進行中'];
        $assignee = Task::find($request->task_id)->users()->pluck('users.id')->toArray();
        if (!in_array($request->status, $status) && in_array(auth()->user()->id, $assignee)) {
            return response()->json(['message' => 'Error'], 404);
        }

        $input = $request->all();
        if ($request->has('status')) {
            $task = Task::find($request->task_id);
            $input['old_status'] = $task->status;
            $input['new_status'] = $request->status;
            $task->update(['status' => $request->status]);
        }

        if ($request->has('assignee')) {
            Task::find($request->task_id)->users()->syncWithPivotValues($request->assignee, [
                'join_date' => Carbon::now()->toDateTimeString(),
            ]);
        }

        $input['user_id'] = auth()->user()->id;
        Comment::create($input);

        return response()->json(['message' => 'Success']);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Task::with([
            'comments' => function ($query) {
                $query->latest('updated_at')->take(5)->get();
            },
            'comments.user:id,name',
        ])->find($id, ['id', 'name']);

        return response()->json($data);
    }

    public function showMore($id, Request $request)
    {
        $data = Task::with([
            'comments' => function ($query) use ($request) {
                $query->latest('updated_at')->offset($request->count)->take(10)->get();
            },
            'comments.user:id,name',
        ])->find($id, ['id', 'name']);

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
    }
}
