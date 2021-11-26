<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
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
    public function getTaskRole($jobfair_id, $user_id, $task_id) {
        if (Jobfair::find($jobfair_id)->where('jobfair_admin_id', $user_id)->count()) {
            return 'jfadmin';
        }
        if (Assignment::where('task_id', $task_id)->count() == 1) {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)->count() == 0) {
                return 'member';
            } else {
                return 'taskMember'.$user_id;
            }
        } else {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)) {
                return 'taskMember'.$user_id;
            } else if ($user->reviewTasks->find($task_id)) {
                return 'reviewer';
            } else {
                return 'member';
            }
        }
        }
        public function getStatus($jobfair_id, $user_id, $task_id)
    {
        $status =  null;
        if (Jobfair::find($jobfair_id)->where('jobfair_admin_id', $user_id)->count()) {
            $status = array(
                '未着手',
                '進行中',
                '完了',
                '未完了',
                '中断'
            ); 
            return $status;
        }
        if (Assignment::where('task_id', $task_id)->count() == 1) {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)->count() == 0) {
                return null;
            } else {
                $status = array(
                    '未着手',
                    '進行中',
                    '完了',
                    '未完了',
                    '中断'
                ); 
                return $status;
            }
        } else {
            $user = User::find($user_id);
            if ($user->tasks->find($task_id)) {
                $status = array(
                    '未着手',
                    '進行中',
                    'レビュー待ち'
                );
                return $status;
            } else if ($user->reviewTasks->find($task_id)) {
                $status = array(
                    '未着手',
                    '進行中',
                    '完了',
                    '未完了',
                    '中断'
                ); 
                return $status;
            } else {
                return null;
            }
        }
    }
    public function handleStatusTask($task_id) {
        $assignments = Assignment::where('task_id', $task_id)->get();
        $isNew = true;
        foreach($assignments as $assignment) {
            if (strcmp($assignment->status, '未着手') != 0) {
                $isNew = false;
            }
        }
        if ($isNew == false) {
            $task = Task::find($task_id);
            $task->status = '進行中';
            $task->save();
        }
    }
    public function updateStatus($user_id, $task_id, Request $request) {
        $assignment = Assignment::where('user_id', $user_id)->where('task_id', $task_id)->update(['status'=>$request->status]); 
        $this->handleStatusTask($task_id);
        return $request->status;    
    }
}
