<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TemplateTask;
use Illuminate\Http\Request;

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
    public function store(Request $request, $id)
    {
        $jobfair = Jobfair::find($id);
        $schedule = Schedule::where('jobfair_id', '=', $id)->first();
        $idTemplateTask = $request->data;
        for ($i = 0; $i < count($idTemplateTask); $i += 1) {
            $templateTask = TemplateTask::find($idTemplateTask[$i]);
            $numDates = $templateTask->milestone->is_week ? $templateTask->milestone->period * 7 : $templateTask->milestone->period;
            $startTime = date('Y-m-d', strtotime($jobfair->start_date.' + '.$numDates.'days'));
            $duration = 0;
            if ($templateTask->unit === 'students') {
                $duration = (float) $templateTask->effort * $jobfair->number_of_students;
            } else if ($templateTask->unit === 'none') {
                $duration = (float) $templateTask->effort;
            } else {
                $duration = (float) $templateTask->effort & $jobfair->number_of_companies;
            }

            $duration = $templateTask->is_day ? $duration : ceil($duration / 24);
            $newTask = Task::create([
                'name'             => $templateTask->name,
                'start_time'       => $startTime,
                'end_time'         => date('Y-m-d', strtotime($startTime.' + '.$duration.'days')),
                'status'           => '未着手',
                'milestone_id'     => $templateTask->milestone_id,
                'schedule_id'      => $schedule->id,
                'template_task_id' => $templateTask->id,
            ]);
            $newTask->categories()->attach($templateTask->categories);
        }

        return response()->json('added task successfully');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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
    }
}
