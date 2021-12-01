<?php

namespace App\Http\Controllers;

use App\Events\Broadcasting\CommentCreated;
use App\Models\Assignment;
use App\Models\Comment;
use App\Models\Jobfair;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    /*
        new => 未着手
        inProgress => 進行中
        reviewing => レビュー待ち
        completed => 完了
        incompeleted => 未完了
        pending =>  中断
    */
    public function getTaskRole($jobfair_id, $user_id, $task_id)
    {
        if (Jobfair::find($jobfair_id)->where('jobfair_admin_id', $user_id)->count()) {
            return 'jfadmin';
        }

        if (Assignment::where('task_id', $task_id)->count() === 1) {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)->count() === 0) {
                return 'member';
            }

            return 'taskMember'.$user_id;
        }

        $user = User::find($user_id);
        if ($user->tasks->find($task_id)) {
            return 'taskMember'.$user_id;
        } else if ($user->reviewTasks->find($task_id)) {
            return 'reviewer';
        }

        return 'member';
    }

    public function getStatus($jobfair_id, $user_id, $task_id)
    {
        $status = null;
        if (Jobfair::find($jobfair_id)->where('jobfair_admin_id', $user_id)->count()) {
            return [
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断',
            ];
        }

        if (Assignment::where('task_id', $task_id)->count() === 1) {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)->count() === 0) {
                return null;
            }

            return [
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断',
            ];
        }

        $user = User::find($user_id);
        if ($user->tasks->find($task_id)) {
            return [
                '未着手',
                '進行中',
                'レビュー待ち',
            ];
        } else if ($user->reviewTasks->find($task_id)) {
            return [
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断',
            ];
        }

        return null;
    }

    public function handleStatusTask($task_id)
    {
        $assignments = Assignment::where('task_id', $task_id)->get();
        $isNew = true;
        foreach ($assignments as $assignment) {
            if (strcmp($assignment->status, '未着手') !== 0) {
                $isNew = false;
            }
        }

        if ($isNew === false) {
            $task = Task::find($task_id);
            if (strcmp($task->status, '進行中') === 0) {
                return '進行中';
            }

            $task->status = '進行中';
            $task->save();

            return $task->status;
        }

        return '未着手';
    }

    public function updateStatus($user_id, $task_id, Request $request)
    {
        $input = [
            'user_id' => auth()->user()->id,
            'task_id' => $task_id,
            'body'    => '',
        ];
        $assignment = Assignment::where('user_id', $user_id)->where('task_id', $task_id)->get();
        //Assignment::where('user_id', $user_id)->where('task_id', $task_id)->update(['status'=>$request->status]);
        //$assignment =  Assignment::where('user_id', $user_id)->where('task_id', $task_id);
        if ($assignment[0]->status !== $request->status) {
            $input['old_status'] = $assignment[0]->status;
            $input['new_status'] = $request->status;
            Assignment::where('user_id', $user_id)->where('task_id', $task_id)->update(['status' => $request->status]);
            $comment = Comment::create($input);
            CommentCreated::dispatch($comment);
        }

        $taskStatus = $this->handleStatusTask($task_id);

        return [
            'memberStatus' => $request->status,
            'taskStatus' => $taskStatus,
        ];
    }
}
