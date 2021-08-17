<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Milestone;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Display list schedule.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return Schedule::whereNull('jobfair_id')->get();
        return Schedule::all();
    }

    public function getAll()
    {
        return Schedule::all();
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
        $schedule = Schedule::findOrFail($id);
        $schedule->allMilestones = Milestone::all();
        $schedule->allMilestones->each(function ($milestone) {
            $milestone->templateTasks;
        });
        $schedule->milestones->each(function ($milestone) use ($schedule) {
            $milestone->templateTasks  = array_values($schedule->templateTasks->where('milestone_id', $milestone->id)->values()->all());
        });   
        return response()->json($schedule);
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
        $schedule = Schedule::findOrFail($id);
        $schedule->name = $request->newSchedule["name"];
        $schedule->save();
        foreach($request->addMilestones as $addMilestone) {
            $schedule->milestones()->attach($addMilestone["id"]);
        };
        foreach($request->removeMilestones as $removeMilestone) {
            $removeTemplateTasks = DB::table('template_tasks')->where('milestone_id', $removeMilestone["id"])->get();
            DB::table('schedule_template_task')->get()->each(function ($link) use ($removeTemplateTasks, $schedule) {
                $removeTemplateTasks->each(function ($removeTemplateTask) use ($schedule, $link) {
                    if($link->template_task_id === $removeTemplateTask->id) {
                        $schedule->templateTasks()->detach($removeTemplateTask->id);
                    }
                });
            });
            $schedule->milestones()->detach($removeMilestone["id"]);
        };
        foreach($request->addTemplateTasks as $addTemplateTask) {
            $schedule->templateTasks()->attach($addTemplateTask['id']);
        };
        foreach($request->removeTemplateTasks as $removeTemplateTask) {
            $schedule->templateTasks()->detach($removeTemplateTask['id']);
        };
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
    }

    public function getMilestones($id)
    {
        return Schedule::with(['milestones:id,name'])->find($id, ['id']);
    }

    public function getTemplateTasks($id)
    {
        return Schedule::with('templateTasks:id,name')->find($id, ['id']);
    }

    public function search(Request $request)
    {
        return Schedule::where('name', 'like', '%'.$request->input('name').'%')->get();
    }

    public function getScheduleb($id)
    {   
        $schedule = Schedule::where('jobfair_id', '=', $id)->get();

        return response()->json([
            'data' => $schedule,
        ]);
    }
}
