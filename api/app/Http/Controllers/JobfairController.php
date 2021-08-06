<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class JobfairController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Jobfair::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'start_date' => 'required|date',
            'number_of_students' => 'required|numeric|gte:1',
            'number_of_companies' => 'required|numeric|gte:1',
            'jobfair_admin_id' => 'required|numeric',
        ]);
        $jobFair = Jobfair::create([
            'name' => $request->input('name'),
            'start_date' => $request->input('start_date'),
            'number_of_students' => $request->input('number_of_students'),
            'number_of_companies' => $request->input('number_of_companies'),
            'jobfair_admin_id' => $request->input('jobfair_admin_id'),
        ]);
        $templateSchedule = Schedule::find($request->schedule_id);
        $scheduleAttr = $templateSchedule->toArray();
        array_shift($scheduleAttr);
        $schedule = Schedule::create($scheduleAttr);

        $schedule->update(['jobfair_id' => $jobFair->id]);
        $milestones = $templateSchedule->milestones;
        foreach ($milestones as $milestone) {
            $milestoneAttr = $milestone->toArray();
            array_shift($milestoneAttr);
            $newMilestone = Milestone::create($milestoneAttr);
            $newMilestone->update(['schedule_id' => $schedule->id]);
            $tasks = $milestone->tasks;
            foreach ($tasks as $task) {
                Task::create([
                    'name' => $task->name,
                    'start_time' => $task->start_time,
                    'end_time' => $task->end_time,
                    'number_of_member' => $task->number_of_member,
                    'status' => $task->status,
                    'remind_member' => $task->remind_member,
                    'description_of_detail' => $task->description_of_detail,
                    'relation_task_id' => $task->relation_task_id,
                    'milestone_id' => $newMilestone->id,
                    'user_id' => $task->user_id,
                ]);
            }
        }

        return $jobFair;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Jobfair::with('user:id,name')->find($id);
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
        $response = Jobfair::find($id);
        $delete_schedule = Schedule::where('jobfair_id', $id)->first();
        $base_schedule = Schedule::find($request->schedule_id);
        $final_schedule = [];
        if ($delete_schedule->name !== $base_schedule->name) {
            $delete_milestone = Milestone::where('schedule_id', $delete_schedule->id)->get();
            for ($i = 0; $i < count($delete_milestone); $i++) {
                $adb = Task::where('milestone_id', $delete_milestone[$i]->id)->get();
                for ($j = 0; $j < count($adb); $j++) {
                    $adb[$j]->delete();
                }
            }

            for ($i = 0; $i < count($delete_milestone); $i++) {
                $delete_milestone[$i]->delete();
            }

            $delete_schedule->delete();

            $response->update($request->all());
            $base_schedule = Schedule::find($request->schedule_id);
            $base_milestone = Milestone::where('schedule_id', $base_schedule->id)->get();
            $base_task = [];
            $final_schedule = Schedule::create([
                'name' => $base_schedule->name,
                'jobfair_id' => $id,
            ]);
            $final_milestone = [];
            $final_task = [];
            for ($i = 0; $i < count($base_milestone); $i++) {
                $temp = Milestone::create([
                    'name' => $base_milestone[$i]->name,
                    'period' => $base_milestone[$i]->period,
                    'is_week' => $base_milestone[$i]->is_week,
                    'schedule_id' => $final_schedule->id,
                ]);
                array_push($final_milestone, $temp);
                $base_task = Task::where('milestone_id', $base_milestone[$i]->id)->get();
                for ($j = 0; $j < count($base_task); $j++) {
                    $tas = Task::create([
                        'name' => $base_task[$j]->name,
                        'start_time' => $base_task[$j]->start_time,
                        'end_time' => $base_task[$j]->end_time,
                        'number_of_member' => $base_task[$j]->number_of_member,
                        'status' => $base_task[$j]->status,
                        'remind_member' => $base_task[$j]->remind_member,
                        'description_of_detail' => $base_task[$j]->description_of_detail,
                        'relation_task_id' => $base_task[$j]->relation_task_id,
                        'milestone_id' => $temp->id,
                        'user_id' => $base_task[$j]->user_id,
                    ]);
                    array_push($final_task, $tas);
                }
            }
        } else {
            $response->update($request->all());
            $final_schedule = Schedule::where('jobfair_id', $id)->first();
        }

        return [
            'data' => 'suceess',
        ];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Jobfair::destroy($id);
        return response()->json(['message' => 'Deleted Successfully'], 200);
    }

    public function getMilestones($id)
    {
        $milestones = Jobfair::find($id)->schedule()->with([
            'milestones' => function ($query) {
                $query->with([
                    'tasks' => function ($task) {
                        $task->select('milestone_id', 'name', 'status');
                    },
                ])->get();
            },
        ])->get();

        return response()->json([
            'data' => $milestones,
        ]);
    }

    public function getTasks($id)
    {
        $tasks = Jobfair::find($id)->schedule()->with([
            'tasks' => function ($query) {
                $query->select(['tasks.name', 'tasks.status', 'tasks.id']);
            },
        ])->get(['id']);

        return response()->json([
            'data' => $tasks,
        ]);
    }

    public function updatedTasks($id, Request $request)
    {
        $tasks = Jobfair::find($id)->schedule()->with([
            'tasks' => function ($query) {
                $query->select(['tasks.name', 'tasks.updated_at', 'tasks.id', 'users.name as username'])
                    ->join('users', 'users.id', '=', 'tasks.user_id')
                    ->orderBy('tasks.updated_at', 'DESC')
                    ->take(30);
            },
        ])->get(['id']);

        return response()->json([
            'data' => $tasks,
        ]);
    }

    public function searchTask($id, Request $request)
    {
        $tasks = Jobfair::find($id)->schedule()->with([
            'tasks' => function ($query) use ($request) {
                return $query->where('tasks.name', 'LIKE', "%$request->name%");
            },
        ])->get();

        return response()->json([
            'data' => $tasks,
        ]);
    }

    public function checkNameExisted(Request $request)
    {
        return User::where('name', '=', $request->name)->first();
    }
}
