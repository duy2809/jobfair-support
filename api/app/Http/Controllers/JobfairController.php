<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
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
        $deleteSchedule = Schedule::where('jobfair_id', $id)->first();
        $templateSchedule = Schedule::find($request->schedule_id);
        $finalSchedule = [];
        if ($deleteSchedule->name !== $templateSchedule->name) {
            $deleteMilestone = Milestone::where('schedule_id', $deleteSchedule->id)->get();
            for ($i = 0; $i < count($deleteMilestone); $i++) {
                $temp = Task::where('milestone_id', $deleteMilestone[$i]->id)->get();
                for ($j = 0; $j < count($temp); $j++) {
                    $temp[$j]->delete();
                }
            }

            for ($i = 0; $i < count($deleteMilestone); $i++) {
                $deleteMilestone[$i]->delete();
            }

            $deleteSchedule->delete();

            $response->update($request->all());
            $templateSchedule = Schedule::find($request->schedule_id);
            $templateMilestone = Milestone::where('schedule_id', $templateSchedule->id)->get();
            $templateTask = [];
            $finalSchedule = Schedule::create([
                'name' => $templateSchedule->name,
                'jobfair_id' => $id,
            ]);
            $finalMilestone = [];
            $finalTask = [];
            for ($i = 0; $i < count($templateMilestone); $i++) {
                $temp = Milestone::create([
                    'name' => $templateMilestone[$i]->name,
                    'period' => $templateMilestone[$i]->period,
                    'is_week' => $templateMilestone[$i]->is_week,
                    'schedule_id' => $finalSchedule->id,
                ]);
                array_push($finalMilestone, $temp);
                $templateTask = Task::where('milestone_id', $templateMilestone[$i]->id)->get();
                for ($j = 0; $j < count($templateTask); $j++) {
                    $tas = Task::create([
                        'name' => $templateTask[$j]->name,
                        'start_time' => $templateTask[$j]->start_time,
                        'end_time' => $templateTask[$j]->end_time,
                        'number_of_member' => $templateTask[$j]->number_of_member,
                        'status' => $templateTask[$j]->status,
                        'remind_member' => $templateTask[$j]->remind_member,
                        'description_of_detail' => $templateTask[$j]->description_of_detail,
                        'relation_task_id' => $templateTask[$j]->relation_task_id,
                        'milestone_id' => $temp->id,
                        'user_id' => $templateTask[$j]->user_id,
                    ]);
                    array_push($finalTask, $tas);
                }
            }
        } else {
            $response->update($request->all());
            $finalSchedule = Schedule::where('jobfair_id', $id)->first();
        }

        return [
            'data' => ['Jobfair' => $response,'Schedule' => $finalSchedule],
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
        return Jobfair::where('name', '=', $request->name)->get();
    }
}
