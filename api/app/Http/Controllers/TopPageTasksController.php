<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class TopPageTasksController extends Controller
{
    public function tasks(Request $request)
    {
        // $user = $request->user();
        $user = User::find(2);
        $taskName = $request->input('task-name') === null ? '' : $request->input('task-name');
        $startTime = $request->input('start-time') === null ? '' : $request->input('start-time');
        $jobfairName = $request->input('jobfair-name') === null ? '' : $request->input('jobfair-name');
        $tasks = User::findOrFail($user->id)->tasks->sortBy('start_time')->values();
        $tasks->each(function ($task, $index) use ($tasks) {
            array_values($tasks->all())[$index] = array_values($tasks->all())[$index]->milestone->schedule->jobfair;
        });
        $result = array_filter($tasks->all(), function ($task) use ($taskName, $startTime, $jobfairName) {
            return str_contains($task->name, $taskName)
             && str_contains($task->start_time, $startTime)
             && str_contains($task->milestone->schedule->jobfair, $jobfairName);
        });
        if ($taskName === '' && $startTime === '' && $jobfairName === '') {
            return response()->json(array_values(array_slice($result, 0, 5)));
        }

        return response()->json(array_values($result));
    }
}
