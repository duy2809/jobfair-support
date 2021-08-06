<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\TemplateTask;
use Illuminate\Http\Request;

class TemplateTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $templateTasks = TemplateTask::with(['categories:id,category_name', 'templateMilestone:id,name'])
            ->orderBy('template_tasks.created_at', 'DESC')
            ->get(['template_tasks.id', 'template_tasks.name', 'template_tasks.milestone_id', 'template_tasks.created_at']);

        return response()->json($templateTasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $newTemplateTask = TemplateTask::create($request->all());
        $newTemplateTask->categories()->attach($request->category_id);
        if (!empty($request->beforeTasks)) {
            $newTemplateTask->beforeTasks()->attach($request->beforeTasks);
        }

        if (!empty($request->afterTasks)) {
            $newTemplateTask->afterTasks()->attach($request->afterTasks);
        }
        return response()->json(['message' => 'Save Successfully'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $templateTask = TemplateTask::with(['categories:id,category_name', 'templateMilestone:id,name'])->find($id);

        return response()->json($templateTask);
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
        $templateTask = TemplateTask::find($id);
        $templateTask->update($request->all());
        $templateTask->categories()->sync($request->category_id);
        if (!empty($request->beforeTasks)) {
            $templateTask->beforeTasks()->sync($request->beforeTasks);
        }

        if (!empty($request->afterTasks)) {
            $templateTask->afterTasks()->sync($request->afterTasks);
        }

        return response()->json(['message' => 'Edit Successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $templateTasks = TemplateTask::find($id);
        $templateTasks->categories()->detach();
        $templateTasks->beforeTasks()->detach();
        $templateTasks->afterTasks()->detach();
        $templateTasks->delete();

        return response()->json(['message' => 'Delete Successfully'], 200);
    }

    public function getCategoriesTasks()
    {
        $categories = Category::has('templateTasks')->get();

        return response()->json($categories);
    }

    public function getBeforeTasks($id)
    {
        $beforeTasks = TemplateTask::with('beforeTasks:id,name')->find($id, ['id', 'name']);
        return response()->json($beforeTasks);
    }

    public function getAfterTasks($id)
    {
        $afterTasks = TemplateTask::with('afterTasks:id,name')->find($id, ['id', 'name']);

        return response()->json($afterTasks);
    }
}


