<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TemplateTask;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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

    public function getTaskByJfId($id)
    {
        return DB::table('jobfairs')
            ->join('schedules', 'jobfairs.id', '=', 'schedules.jobfair_id')
            ->join('tasks', 'schedules.id', '=', 'tasks.schedule_id')
            ->join('assignments', 'assignments.task_id', 'tasks.id')
            ->join('users', 'assignments.user_id', '=', 'users.id')
            ->select('jobfairs.name as jobfairName', 'users.id as userId', 'users.name as userName', 'users.avatar', 'tasks.*', 'tasks.name as taskName')
            ->where('jobfairs.id', '=', $id)
            ->get();
    }

    public function getJobfair($jfId, $userId)
    {
        return DB::table('jobfairs')
            ->where('jobfairs.id', '=', $jfId)
            ->where('jobfairs.jobfair_admin_id', '=', $userId)
            ->get();
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
                $duration = (float) $templateTask->effort * $jobfair->number_of_companies;
            }

            $duration = $templateTask->is_day ? $duration : ceil($duration / 24);
            $input = $templateTask->toArray();
            $input['start_time'] = $startTime;
            $input['end_time'] = date('Y-m-d', strtotime($startTime.' + '.$duration.'days'));
            $input['schedule_id'] = $schedule->id;
            $input['status'] = '未着手';
            $input['template_task_id'] = $templateTask->id;
            $newTask = Task::create($input);
            $newTask->categories()->attach($templateTask->categories);
        }

        return response()->json('added task successfully');
    }

    public function updateTask(Request $request, $id)
    {
        $task = Task::find($id);
        $status = [
            '未着手',
            '進行中',
            '完了',
            '中断',
            '未完了',
        ];
        $request->validate([
            'name' => [
                Rule::unique('tasks')->whereNot('id', $id)->where('schedule_id', $task->schedule_id),
            ],
            'start_time' => 'date',
            'end_time' => 'date',
            'status' => [
                Rule::in($status),
            ],
            'remind_member' => 'boolean',
            'milestone_id' => 'exists:milestones,id',
            'schedule_id' => 'exists:schedules,id',
            'user_id' => 'exists:users,id',
            'memo' => 'string|nullable',
            'description_of_detail' => 'string|nullable',
            'template_task_id' => 'exists:template_tasks,id',
        ]);
        $task->update($request->all());

        return $task;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $task = Task::with([
            'milestone:id,name',
            'categories:id,category_name',
            'users:id,name',
            'schedule.jobfair:id,name',
            'templateTask:id,effort,is_day,unit',
        ])->find($id);

        return response()->json($task);
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
        $task = Task::find($id);
        $task->update($request->all());
        if (!empty($request->beforeTasks)) {
            $task->beforeTasks()->sync($request->beforeTasks);
        }

        if (!empty($request->afterTasks)) {
            $task->afterTasks()->sync($request->afterTasks);
        }

        if (!empty($request->admin)) {
            $task->users()->syncWithPivotValues($request->admin, [
                'join_date' => Carbon::now()->toDateTimeString(),
            ]);
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

    public function getTemplateTaskNotAdd($id)
    {
        $task = Jobfair::with([
            'schedule.tasks' => function ($q) {
                $q->select('template_task_id', 'schedule_id');
            },
        ])->find($id);

        $templateTask = TemplateTask::whereNotIn('id', $task->schedule->tasks->pluck('template_task_id'))
                                      ->with(['categories:id,category_name', 'milestone:id,name'])->get(['id', 'name', 'milestone_id']);

        return response()->json($templateTask);
    }
}
