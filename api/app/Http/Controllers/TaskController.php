<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
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
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tasks = Task::with([
            'milestone:id,name',
            'categories:id,category_name',
            'users:id,name',
            'templateTask:id,effort,is_day,unit'
        ])->find($id);
        return response()->json($tasks);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
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
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $task = Task::find($id);
        $task->categories()->detach();
        $task->beforeTasks()->detach();
        $task->afterTasks()->detach();
        $task->delete();

        return response()->json(['message' => 'Delete Successfully'], 200);
    }
    public function getBeforeTasks($id)
    {
        $beforeTasks = Task::with('beforeTasks:id,name')->find($id, ['id', 'name']);

        return response()->json($beforeTasks);
    }

    public function getAfterTasks($id)
    {
        $afterTasks = Task::with('afterTasks:id,name')->find($id, ['id', 'name']);

        return response()->json($afterTasks);
    }
}