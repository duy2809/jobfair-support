<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskCreated;
use App\Notifications\TaskEdited;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

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
        // validate request: add 'Accept: application/json' to request headers to get error message
        $assignee = [];
        $status = '';
        $request->validate([
            'task_id'     => 'required|numeric|exists:tasks,id',
            'status'      => 'string',
            'body'        => 'string',
            'description' => 'string',
        ]);
        // $input is attributes for new comment
        $input = [
            'user_id' => auth()->user()->id,
            'task_id' => $request->task_id,
            'body'    => $request->body,
        ];
        $task = Task::find($request->task_id);

        $isUpdatedTask = false;
        if ($request->has('status')) {
            $status = $request->status;
            if ($task->status !== $request->status) {
                $input['old_status'] = $task->status;
                $input['new_status'] = $request->status;
                // store task-updating history in comment and update task
                $task->update(['status' => $request->status]);
                $isUpdatedTask = true;
            }
        }

        if ($request->has('description')) {
            if ($request->description !== $task->description_of_detail) {
                $input['old_description'] = $task->description_of_detail;
                $input['new_description'] = $request->description;
            }

            $task->update(['description_of_detail' => $request->description]);
            $isUpdatedTask = true;
        }

        //notification
        if ($isUpdatedTask) {
            $editedUser = auth()->user();
            $jobfairAdmin = $task->schedule->jobfair->user;
            Notification::send(
                $task->users()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            Notification::send(
                $task->reviewers()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            if ($editedUser->id !== $jobfairAdmin->id) {
                $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
            }
        }

        if ($request->has('assignee')) {
            $listMember = json_decode($request->assignee, true);
            $listOldMember = $task->users->pluck('id')->toArray();
            $assignee = collect($listMember)->map(function ($id) {
                return [
                    'id'   => $id,
                    'name' => User::find($id)->name,
                ];
            });
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

                // notification for new assignees
                $newAssignees = array_diff($listMember, $listOldMember);
                $listId = [];
                foreach ($newAssignees as $newAssignee) {
                    $listId[] = $newAssignee;
                }

                Notification::send(
                    User::whereIn('id', $listId)->get(),
                    new TaskCreated($task, auth()->user())
                );
                if (!$isUpdatedTask) {
                    $editedUser = auth()->user();
                    $jobfairAdmin = $task->schedule->jobfair->user;
                    Notification::send(
                        $task->users()
                            ->where('users.id', '<>', $editedUser->id)->get(),
                        new TaskEdited($editedUser, $task)
                    );
                    Notification::send(
                        $task->reviewers()
                            ->where('users.id', '<>', $editedUser->id)->get(),
                        new TaskEdited($editedUser, $task)
                    );
                    if ($editedUser->id !== $jobfairAdmin->id) {
                        $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                    }
                }
            }
        }

        // return new comment
        $comment = Comment::create($input);
        $listOldAssignees = [];
        $listNewAssignees = [];
        if ($comment->old_assignees && $comment->new_assignees) {
            $listOldAssignees = explode(',', $comment->old_assignees);
            $listNewAssignees = explode(',', $comment->new_assignees);
        }

        $listOldAssignees = collect($listOldAssignees)->map(function ($assingee) {
            return User::find($assingee)->name;
        });
        $listNewAssignees = collect($listNewAssignees)->map(function ($assingee) {
            return User::find($assingee)->name;
        });

        // return [$comment, $listOldAssignees, $listNewAssignees];
        return [
            'id'            => $comment->id,
            'author'        => [
                'id'     => $comment->user->id,
                'name'   => $comment->user->name,
                'avatar' => $comment->user->avatar,

            ],
            'created'       => $comment->created_at,
            'content'       => $comment->body,
            'edited'        => $comment->updated_at > $comment->created_at,
            'last_edit'     => $comment->updated_at,
            'assignee'      => $assignee,
            'status'        => $status,
            'old_status'    => $comment->old_status ?? null,
            'new_status'    => $comment->new_status ?? null,

            'new_assignees' => $listNewAssignees,
            'old_assignees' => $listOldAssignees,
        ];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */

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
            'comments.user:id,name,avatar',
        ])->find($id, ['id', 'name']);

        $result = $data->comments->map(function ($comment) {
            $listOldAssignees = [];
            $listNewAssignees = [];
            if ($comment->old_assignees && $comment->new_assignees) {
                $listOldAssignees = explode(',', $comment->old_assignees);
                $listNewAssignees = explode(',', $comment->new_assignees);
            }

            $listOldAssignees = collect($listOldAssignees)->map(function ($assingee) {
                return User::find($assingee)->name;
            });
            $listNewAssignees = collect($listNewAssignees)->map(function ($assingee) {
                return User::find($assingee)->name;
            });

            // return $comment;
            return [
                'id'              => $comment->id,
                'author'          => [
                    'id'     => $comment->user->id,
                    'name'   => $comment->user->name,
                    'avatar' => $comment->user->avatar,
                ],
                'created'         => $comment->created_at,
                'content'         => $comment->body,
                'edited'          => $comment->updated_at > $comment->created_at,
                'last_edit'       => $comment->updated_at,
                'old_assignees'   => $listOldAssignees ?? null,
                'new_assignees'   => $listNewAssignees ?? null,
                'old_description' => $comment->old_description,
                'new_description' => $comment->new_description,
                'old_status'      => $comment->old_status,
                'new_status'      => $comment->new_status,
            ];
        });

        return response()->json($result);
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
            'content' => 'string',
        ]);
        if (
            !Comment::findOrFail($id)->update([
                'body' => $request->content,
            ])
        ) {
            return response()->json(['message' => 'Fail to update'], 500);
        }

        $comment = Comment::find($id);

        return response()->json($comment, 200);

        // $data = [
        //     'id'        => $comment->id,
        //     'author'    => [
        //         'id'     => $comment->user->id,
        //         'name'   => $comment->user->name,
        //         'avatar' => $comment->user->avatar,
        //     ],
        //     'created'   => $comment->created_at,
        //     'content'   => $comment->body,
        //     'edited'    => $comment->updated_at > $comment->created_at,
        //     'last_edit' => $comment->updated_at,
        //     'assignee'  => [],
        //     'status'    => 'status',
        // ];

        // return response()->json($data, 200);
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
