<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // TODO: Authorization

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Comment::all();
    }

    public function store(Request $request)
    {
        // $status = ['未着手', '進行中'];
        // $listMemberssignee = Task::find($request->task_id)->users()->pluck('users.id')->toArray();
        // if (!in_array($request->status, $status) && in_array(auth()->user()->id, $listMemberssignee)) {
        //     return response()->json(['message' => 'Error'], 403);
        // }

        // validate request: add 'Accept: application/json' to request headers to get error message
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'body' => 'string',
            'assignee' => 'string',
            'status' => 'string',
            'description' => 'string',
        ]);
        // $input is attributes for new comment
        $input = [
            'user_id' => auth()->user()->id,
            'task_id' => $request->task_id,
            'body' => $request->body,
        ];
        $task = Task::find($request->task_id);
        if ($request->has('status')) {
            if ($task->status !== $request->status) {
                $input['old_status'] = $task->status;
                $input['new_status'] = $request->status;
                // store task-updating history in comment and update task
                $task->update(['status' => $request->status]);
            }
        }

        if ($request->has('assignee')) {
            $listMember = json_decode($request->assignee, true);
            $listOldMember = $task->users->pluck('id')->toArray();
            // if old assignees equal to request's assignees (in any order) then don't update anything
            if (
                !(
                is_array($listMember)
                && is_array($listOldMember)
                && count($listMember) === count($listOldMember)
                && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                )
            ) {
                // store list assignees as string with format "id1, id2, id3, ..."
                $input['old_assignees'] = implode(',', $listOldMember);
                $input['new_assignees'] = implode(',', $listMember);
                // sync laravel N to N
                $task->users()->syncWithPivotValues($listMember, [
                    'join_date' => Carbon::now()->toDateTimeString(),
                ]);
            }
        }

        if ($request->has('description')) {
            if ($request->description !== $task->description_of_detail) {
                $input['old_description'] = $task->description_of_detail;
                $input['new_description'] = $request->description;
            }

            $task->update(['description_of_detail' => $request->description]);
        }

        // return new comment
        return Comment::create($input);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // $data = Task::with([
        //     'comments' => function ($query) {
        //         $query->latest('updated_at')->take(5)->get();
        //     },
        //     'comments.user:id,name',
        // ])->find($id, ['id', 'name']);
        // return response()->json($data);
    }

    // in request MUST have 2 query strings: start, count
    public function showMore($id, Request $request)
    {
        $request->validate(
            [
                'start' => 'required|numeric',
                'count' => 'required|numeric',
            ]
        );
        $data = Task::with([
            'comments' => function ($query) use ($request) {
                $query->latest('updated_at')->offset($request->start)->take($request->count)->get();
            },
            'comments.user:id,name',
        ])->find($id, ['id', 'name']);

        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'body' => 'string',
        ]);
        if (
            !Comment::findOrFail($id)->update([
                'body' => $request->body,
            ])
        ) {
            return response()->json(['message' => 'Fail to update'], 500);
        }

        return response()->json(Comment::find($id), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return Comment::findOrFail($id)->delete();
    }
}
