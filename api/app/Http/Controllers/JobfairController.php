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
    protected $offset;

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
            'name'                => 'required',
            'start_date'          => 'required|date',
            'number_of_students'  => 'required|numeric|gte:1',
            'number_of_companies' => 'required|numeric|gte:1',
            'jobfair_admin_id'    => 'required|numeric',
        ]);
        $jobFair = Jobfair::create([
            'name'                => $request->input('name'),
            'start_date'          => $request->input('start_date'),
            'number_of_students'  => $request->input('number_of_students'),
            'number_of_companies' => $request->input('number_of_companies'),
            'jobfair_admin_id'    => $request->input('jobfair_admin_id'),
        ]);
        $schedule = Schedule::find($request->schedule_id);
        Schedule::create($schedule->toArray())->update(['jobfair_id' => $jobFair->id]);
        $id = Schedule::where('jobfair_id', $jobFair->id)->get(['id']);

        $milestones = Milestone::where('schedule_id', $request->schedule_id)->get();

        foreach ($milestones as $milestone) {
            Milestone::create($milestone->toArray())->update(['schedule_id' => $id[0]->id]);
            $tasks = Task::where('milestone_id', $milestone->id)->get();
            foreach ($tasks as $task) {
                Task::create([
                    'name'                  => $task->name,
                    'start_time'            => $task->start_time,
                    'end_time'              => $task->end_time,
                    'number_of_member'      => $task->number_of_member,
                    'status'                => $task->status,
                    'remind_member'         => $task->remind_member,
                    'description_of_detail' => $task->description_of_detail,
                    'relation_task_id'      => $task->relation_task_id,
                    'milestone_id'          => $milestone->id,
                    'user_id'               => $task->user_id,
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

    // public function getTasks($id)
    // {
    //     return Jobfair::find($id)->schedule()->with('tasks')->get();
    // }

    //  public function updatedTasks($id)
    // {
    //     return Jobfair::find($id)->schedule()->with([
    //         'tasks' => function ($query) {
    //             $query->select(['tasks.*', 'users.name as username'])
    //                 ->join('users', 'users.id', '=', 'tasks.user_id')
    //                 ->orderBy('tasks.updated_at', 'DESC')
    //                 ->paginate(10);
    //         },
    //     ])->get();
    // }

    public function updatedTasks($id, Request $request)
    {
        return Jobfair::find($id)->schedule()->with([
            'tasks' => function ($query) {
                $query->select(['tasks.name', 'tasks.updated_at', 'tasks.id', 'users.name as username'])
                    ->join('users', 'users.id', '=', 'tasks.user_id')
                    ->orderBy('tasks.updated_at', 'DESC')
                    ->take(30);
            },
        ])->get(['id']);
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
