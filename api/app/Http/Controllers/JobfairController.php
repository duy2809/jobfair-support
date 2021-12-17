<?php

namespace App\Http\Controllers;

use App\Http\Requests\JobfairRequest;
use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\User;
use App\Notifications\JobfairCreated;
use App\Notifications\JobfairEdited;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class JobfairController extends Controller
{
    protected $slack;

    public function __construct(\App\Services\SlackService $slack)
    {
        $this->middleware('auth')->except('isAdminJobfair');
        $this->slack = $slack;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    private function createMilestonesAndTasks($templateSchedule, $newSchedule, $jobfair)
    {
        foreach ($templateSchedule->templateTasks as $templateTask) {
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
            $input['schedule_id'] = $newSchedule->id;
            $input['status'] = '未着手';
            $input['template_task_id'] = $templateTask->id;
            $newTask = Task::create($input);
            $newTask->categories()->attach($templateTask->categories);
        }
    }

    public function index()
    {
        $jobfairs = Jobfair::join('users', 'jobfairs.jobfair_admin_id', '=', 'users.id')
            ->select('jobfairs.*', 'users.name as admin')
            ->orderBy('jobfairs.updated_at', 'DESC')
            ->get();

        return response()->json($jobfairs);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(JobfairRequest $request)
    {
        $arr = str_split($request->schedule_id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        //Slack
        $channelname = strtolower($request->name);
        $response = $this->slack->createChannel($channelname);
        $res = json_decode($response);
        if ($res->ok === false && $res->error === 'name_taken') {
            return response()->json(['message' => 'Name channel already in use'], 422);
        }

        $templateSchedule = Schedule::findOrFail($request->schedule_id);
        $jobfair = Jobfair::create($request->validated());
        $newSchedule = Schedule::create($templateSchedule->toArray());
        $newSchedule->update(['jobfair_id' => $jobfair->id]);
        $newSchedule->milestones()->attach($templateSchedule->milestones);
        $this->createMilestonesAndTasks($templateSchedule, $newSchedule, $jobfair);
        if ($res->ok === true) {
            $jobfair->channel_id = $res->channel->id;
            $jobfair->save();
            $slackid = User::where('id', '=', $jobfair->jobfair_admin_id)->get(['chatwork_id']);
            $dataAdminToChannel = [$jobfair->channel_id, $slackid[0]->chatwork_id];
            $this->slack->addAdminToChannel($dataAdminToChannel);
            $this->slack->createChannelBot($jobfair->name, $res->channel->id);
        }

        $jobfair->user->notify(new JobfairCreated($jobfair, auth()->user()));

        return $jobfair;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Jobfair::with('user:id,name')->findOrFail($id);
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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($id);

        if ($request->schedule_id !== 'none') {
            $schedule = Schedule::where('jobfair_id', '=', $id)->first();
            $templateSchedule = Schedule::find($request->schedule_id);
            $schedule->update(['name' => $templateSchedule->name]);
            $schedule->milestones()->sync($templateSchedule->milestones);
            $schedule->tasks()->delete();
            $this->createMilestonesAndTasks($templateSchedule, $schedule, $jobfair);
        }

        $validated = $request->validate([
            'name'                => 'string|max:256',
            'start_date'          => 'date',
            'number_of_students'  => 'numeric',
            'number_of_companies' => 'numeric',
            'jobfair_admin_id'    => 'exists:users,id',
        ]);
        $jobfair->update($validated);

        $editedUser = auth()->user();

        // notify user
        if ($editedUser->role === 1) {
            $jobfair->user->notify(new JobfairEdited($jobfair, $editedUser));
        } else {
            Notification::send(
                User::where('role', 1)
                    ->get(),
                new JobfairEdited($jobfair, $editedUser)
            );
        }

        return response()->json('success');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        Jobfair::findOrFail($id)->delete();
        $jobfairs = Jobfair::join('users', 'jobfairs.jobfair_admin_id', '=', 'users.id')
            ->select('jobfairs.*', 'users.name as admin')
            ->orderBy('jobfairs.updated_at', 'DESC')
            ->get();

        return response()->json($jobfairs);
    }

    public function getMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Jobfair::findOrFail($id)->schedule;
        $milestonesId = collect(Task::where('schedule_id', $schedule->id)->pluck('milestone_id'));

        $milestones = Milestone::whereIn('id', $milestonesId->unique())->get(['id', 'name', 'period', 'is_week']);
        foreach ($milestones as $milestone) {
            $milestone['task'] = Task::where('milestone_id', $milestone->id)->where('schedule_id', $schedule->id)->get(['id', 'name', 'status']);
        }

        return response()->json($milestones);
    }

    public function getTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule.tasks' => function ($query) {
                $query->with('milestone:id,name', 'users:id,name', 'categories:id,category_name')

                    ->select(['tasks.id', 'tasks.name', 'tasks.start_time', 'tasks.end_time', 'tasks.milestone_id', 'tasks.status', 'tasks.schedule_id'])
                    ->orderBy('tasks.id', 'ASC');
            },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function updatedTasks($id, Request $request)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with(['schedule:id,jobfair_id', 'schedule.tasks' => function ($query) {
            $query->select(['tasks.name', 'tasks.updated_at', 'tasks.id', 'tasks.schedule_id', 'users.name as username'])
                ->join('users', 'users.id', '=', 'tasks.user_id')
                ->orderBy('tasks.updated_at', 'DESC')
                ->take(30);
        },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function searchTask($id, Request $request)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $tasks = Jobfair::with([
            'schedule.tasks' => function ($q) use ($request) {
                $q->select('id', 'name', 'status', 'start_time', 'end_time', 'updated_at', 'schedule_id')
                    ->where('tasks.name', 'LIKE', '%'.$request->name.'%');
            },
        ])->findOrFail($id, ['id']);

        return response()->json($tasks);
    }

    public function checkNameExisted(Request $request)
    {
        return Jobfair::where('name', '=', $request->name)->get();
    }

    public function isAdminJobfair(Request $request)
    {
        $arr = str_split($request->input('jobfairId'));
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($request->input('jobfairId'));
        $adminId = $jobfair->jobfair_admin_id;
        if ($adminId === intval($request->input('userId'))) {
            return response('Access granted', 200);
        }

        abort(403, 'Permission denied');
    }

    public function ganttChart($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($id);
        $tasks = $jobfair->schedule->tasks()->with(['beforeTasks', 'afterTasks'])->get();

        return response()->json($tasks);
    }
}
