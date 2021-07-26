<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
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

    public function updatedTasks($id, Request $request)
    {
        $tasks = Jobfair::find($id)->schedule()->with([
            'tasks' => function ($query) {
                $query->select(['tasks.name', 'tasks.updated_at', 'tasks.id', 'users.name as username'])
                    ->join('users', 'users.id', '=', 'tasks.user_id')
                    ->orderBy('tasks.updated_at', 'DESC')
                    ->take(20);
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
}
