<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TemplateTask;
use App\Models\User;
use App\Notifications\TaskCreated;
use App\Notifications\TaskEdited;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
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

    public function checkRole(Request $request)
    {
        $task = Task::findOrFail($request->input('taskId'));
        $adminId = $task->schedule->jobfair->jobfair_admin_id;
        if ($adminId === intval($request->input('userId'))) {
            return response('Access granted', 200);
        }

        abort(403, 'Permission denied');
    }

    public function getTaskByJfId($id)
    {
        // $jobfair = Jobfair::find($id);
        // $tasks = $jobfair->schedule->tasks()->with('users')->get();
        // $result = collect([]);
        // foreach ($tasks as $task) {
        //     $temp = collect([]);

        //     foreach ($task->users as $assignee) {
        //         $temp->push([
        //             "jobfairName" => $jobfair->name,
        //             "userId" => $assignee->id,
        //             "userName" => $assignee->name,
        //             "avatar" => $assignee->avatar,
        //             "id" => $task->id,
        //             "name" => $task->name,
        //             "start_time" => $task->start_time,
        //             "end_time" => $task->end_time,
        //             "status" => $task->status,
        //             "remind_member" => $task->remind_member,
        //             "description_of_detail" => $task->description_of_detail,
        //             "relation_task_id" => null,
        //             "milestone_id" => $task->milestone,
        //             "user_id" => $task->user_id,
        //             "created_at" => $task->created_at,
        //             "updated_at" => $task->updated_at,
        //             "schedule_id" => $task->schedule_d,
        //             "memo" => $task->memo,
        //             "template_task_id" => $task->template_task_id,
        //             "taskName" => $task->name,
        //         ]);

        //     }

        //     $result->merge($temp);
        // }
        // return $result;
        $jobfair = Jobfair::find($id);
        $first = $jobfair->schedule->tasks()->whereHas('users', null, '=', 0)->get()->map(function ($item) use ($jobfair) {
            return [
                'jobfairName'           => $jobfair->name,

                'id'                    => $item->id,
                'name'                  => $item->name,
                'start_time'            => $item->start_time,
                'end_time'              => $item->end_time,
                'status'                => $item->status,
                'remind_member'         => $item->remind_member,
                'description_of_detail' => $item->description_of_detail,
                'relation_task_id'      => null,
                'milestone_id'          => $item->milestone,
                'user_id'               => $item->user_id,
                'created_at'            => $item->created_at,
                'updated_at'            => $item->updated_at,
                'schedule_id'           => $item->schedule_d,
                'memo'                  => $item->memo,
                'template_task_id'      => $item->template_task_id,
                'taskName'              => $item->name,
            ];
        });

        return DB::table('jobfairs')
            ->join('schedules', 'jobfairs.id', '=', 'schedules.jobfair_id')
            ->join('tasks', 'schedules.id', '=', 'tasks.schedule_id')
            ->join('assignments', 'assignments.task_id', 'tasks.id')
            ->join('users', 'assignments.user_id', '=', 'users.id')
            ->select('jobfairs.name as jobfairName', 'users.id as userId', 'users.name as userName', 'users.avatar', 'tasks.*', 'tasks.name as taskName')
            ->where('jobfairs.id', '=', $id)
            ->get()->merge($first);
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

            //notification
            Notification::send(
                $newTask->users,
                new TaskCreated($newTask, auth()->user())
            );
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
            'name'                  => [
                Rule::unique('tasks')->whereNot('id', $id)->where('schedule_id', $task->schedule_id),
            ],
            'start_time'            => 'date',
            'end_time'              => 'date',
            'status'                => [
                Rule::in($status),
            ],
            'remind_member'         => 'boolean',
            'milestone_id'          => 'exists:milestones,id',
            'schedule_id'           => 'exists:schedules,id',
            'user_id'               => 'exists:users,id',
            'memo'                  => 'string|nullable',
            'description_of_detail' => 'string|nullable',
            'template_task_id'      => 'exists:template_tasks,id',
        ]);
        $task->update($request->all());
        //notification TaskEdited
        $editedUser = auth()->user();
        $jobfairAdmin = $task->schedule->jobfair->user;
        Notification::send(
            $task->users()
                ->where('users.id', '<>', $editedUser->id)->get(),
            new TaskEdited($editedUser, $task)
        );
        Notification::send(
            $task->reviewers()
                ->where('users.id', '<>', $editedUser->id)->get(),
            new TaskEdited($editedUser, $task)
        );
        if ($editedUser->id !== $jobfairAdmin->id) {
            $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
        }

        if ($request->has('assignee')) {
            $listMember = $request->assignee;
            $listOldMember = $task->users->pluck('id')->toArray();
            if (
                !(
                    is_array($listMember)
                    && is_array($listOldMember)
                    && count($listMember) === count($listOldMember)
                    && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                )
            ) {
                $task->users()->syncWithPivotValues($listMember, [
                    'join_date' => Carbon::now()->toDateTimeString(),
                ]);
                // notification for new assignees
                $newAssignees = array_diff($listMember, $listOldMember);
                $listId = [];
                foreach ($newAssignees as $newAssignee) {
                    $listId[] = $newAssignee;
                }

                Notification::send(
                    User::whereIn('id', $listId)->get(),
                    new TaskCreated($task, auth()->user())
                );
            }
        }

        if (!empty($request->beforeTasks)) {
            $task->beforeTasks()->sync($request->beforeTasks);
        }

        if (!empty($request->afterTasks)) {
            $task->afterTasks()->sync($request->afterTasks);
        }

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
            'schedule.jobfair:id,name,jobfair_admin_id',
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
        $ad = $task->schedule->jobfair->user->id;
        $request->validate([
            'user_id'               => 'exists:users,id',
            'description_of_detail' => 'string|nullable',
            'template_task_id'      => 'exists:template_tasks,id',
            'start_time'            => 'date',
            'end_time'              => 'date',
            'name'                  => [
                Rule::unique('tasks')->whereNot('id', $id)->where('schedule_id', $task->schedule_id),
            ],
        ]);

        if ($request->has('reviewers')) {
            if ($request->input('reviewers') === [] || $request->input('reviewers') === [null]) {
                if ($request->has('admin')) {
                    $listMember = $request->admin;
                    $listOldMember = $task->users->pluck('id')->toArray();
                    if (
                        !(
                            is_array($listMember)
                            && is_array($listOldMember)
                            && count($listMember) === count($listOldMember)
                            && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                        )
                    ) {
                        // notification for new assignees
                        $newAssignees = array_diff($listMember, $listOldMember);
                        $listId = [];
                        foreach ($newAssignees as $newAssignee) {
                            $listId[] = $newAssignee;
                        }

                        Notification::send(
                            User::whereIn('id', $listId)->get(),
                            new TaskCreated($task, auth()->user())
                        );
                    }
                }

                $task->update($request->all());
                if (!empty($request->beforeTasks)) {
                    $task->beforeTasks()->sync($request->beforeTasks);
                }

                if (!empty($request->afterTasks)) {
                    $task->afterTasks()->sync($request->afterTasks);
                }

                // notification edited
                $editedUser = auth()->user();
                $jobfairAdmin = $task->schedule->jobfair->user;
                Notification::send(
                    $task->users()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                Notification::send(
                    $task->reviewers()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                if ($editedUser->id !== $jobfairAdmin->id) {
                    $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                }

                if (!empty($request->admin)) {
                    $task->users()->syncWithPivotValues($request->admin, [
                        'join_date' => Carbon::now()->toDateTimeString(),
                    ]);
                }

                $task->reviewers()->sync([]);
                $task->save();

                return response()->json(['message' => 'Edit Successfully'], 200);
            }

            $checkKey = 1;
            foreach ($request->input('reviewers') as $key => $reviewer) {
                $user = User::find($reviewer);
                $categories = array_column($user->categories->toArray(), 'category_name');
                if (
                    (in_array('レビュアー', $categories) && in_array($task->categories()->first()->category_name, $categories))
                    || $reviewer === $ad
                ) {
                    continue;
                }

                $checkKey = 0;

                break;
            }

            if ($checkKey === 1) {
                if ($request->has('admin')) {
                    $listMember = $request->admin;
                    $listOldMember = $task->users->pluck('id')->toArray();
                    if (
                        !(
                            is_array($listMember)
                            && is_array($listOldMember)
                            && count($listMember) === count($listOldMember)
                            && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                        )
                    ) {
                        // notification for new assignees
                        $newAssignees = array_diff($listMember, $listOldMember);
                        $listId = [];
                        foreach ($newAssignees as $newAssignee) {
                            $listId[] = $newAssignee;
                        }

                        Notification::send(
                            User::whereIn('id', $listId)->get(),
                            new TaskCreated($task, auth()->user())
                        );
                    }
                }

                $task->update($request->all());
                if (!empty($request->beforeTasks)) {
                    $task->beforeTasks()->sync($request->beforeTasks);
                }

                if (!empty($request->afterTasks)) {
                    $task->afterTasks()->sync($request->afterTasks);
                }

                // notification edited
                $editedUser = auth()->user();
                $jobfairAdmin = $task->schedule->jobfair->user;
                Notification::send(
                    $task->users()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                Notification::send(
                    $task->reviewers()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                if ($editedUser->id !== $jobfairAdmin->id) {
                    $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                }

                if (!empty($request->admin)) {
                    $task->users()->syncWithPivotValues($request->admin, [
                        'join_date' => Carbon::now()->toDateTimeString(),
                    ]);
                }

                $task->reviewers()->sync($request->input('reviewers'));
                $task->save();

                return response()->json(['message' => 'Edit Successfully'], 200);
            }

            return response()->json(['message' => 'list reviewers invalid'], 400);
        } else {
            if ($request->has('admin')) {
                $listMember = $request->admin;
                $listOldMember = $task->users->pluck('id')->toArray();
                if (
                    !(
                        is_array($listMember)
                        && is_array($listOldMember)
                        && count($listMember) === count($listOldMember)
                        && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                    )
                ) {
                    // notification for new assignees
                    $newAssignees = array_diff($listMember, $listOldMember);
                    $listId = [];
                    foreach ($newAssignees as $newAssignee) {
                        $listId[] = $newAssignee;
                    }

                    Notification::send(
                        User::whereIn('id', $listId)->get(),
                        new TaskCreated($task, auth()->user())
                    );
                }
            }

            $task->update($request->all());
            if (!empty($request->beforeTasks)) {
                $task->beforeTasks()->sync($request->beforeTasks);
            }

            if (!empty($request->afterTasks)) {
                $task->afterTasks()->sync($request->afterTasks);
            }

            // notification edited
            $editedUser = auth()->user();
            $jobfairAdmin = $task->schedule->jobfair->user;
            Notification::send(
                $task->users()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            Notification::send(
                $task->reviewers()
                    ->where('users.id', '<>', $editedUser->id)->get(),
                new TaskEdited($editedUser, $task)
            );
            if ($editedUser->id !== $jobfairAdmin->id) {
                $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
            }

            if (!empty($request->admin)) {
                $task->users()->syncWithPivotValues($request->admin, [
                    'join_date' => Carbon::now()->toDateTimeString(),
                ]);
            }

            return response()->json(['message' => 'Edit Successfully'], 200);
        }

        return response()->json(['message' => 'Error'], 400);
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

    public function getReviewers($id)
    {
        return Task::find($id)->reviewers;
    }

    public function getListReviewers($id)
    {
        $task = Task::find($id);
        $ad = $task->schedule->jobfair->user->id;
        $listReviewers = [];
        foreach (User::all() as $user) {
            $categories = array_column($user->categories->toArray(), 'category_name');
            if ((in_array('レビュアー', $categories) && in_array($task->categories()->first()->category_name, $categories)) || $user->id === $ad) {
                array_push($listReviewers, $user);
            }
        }

        return response()->json($listReviewers);
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

    public function checkAssignee($taskID, $userID)
    {
        return Task::find($taskID)->users->pluck('id')->contains($userID);
    }

    public function getUserSameCategory($id)
    {
        $task = Task::find($id);

        $schedule = $task->schedule;

        $user = $schedule->users()->whereHas('categories', function (Builder $query) use ($task) {
            $query->whereIn('categories.id', $task->categories()->pluck('id'));
        })->get(['users.id', 'users.name']);

        return response()->json($user);
    }

    public function updateManagerTask(Request $request, $id)
    {
        $task = Task::find($id);

        if ($request->has('assignee')) {
            $listMember = $request->assignee;
            $listOldMember = $task->users->pluck('id')->toArray();
            if (
                !(
                    is_array($listMember)
                    && is_array($listOldMember)
                    && count($listMember) === count($listOldMember)
                    && array_diff($listMember, $listOldMember) === array_diff($listOldMember, $listMember)
                )
            ) {
                // notification edited
                $editedUser = auth()->user();
                $jobfairAdmin = $task->schedule->jobfair->user;
                Notification::send(
                    $task->users()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                Notification::send(
                    $task->reviewers()
                        ->where('users.id', '<>', $editedUser->id)->get(),
                    new TaskEdited($editedUser, $task)
                );
                if ($editedUser->id !== $jobfairAdmin->id) {
                    $jobfairAdmin->notify(new TaskEdited($editedUser, $task));
                }

                $task->users()->syncWithPivotValues($listMember, [
                    'join_date' => Carbon::now()->toDateTimeString(),
                ]);

                // notification for new assignees
                $newAssignees = array_diff($listMember, $listOldMember);
                $listId = [];
                foreach ($newAssignees as $newAssignee) {
                    $listId[] = $newAssignee;
                }

                Notification::send(
                    User::whereIn('id', $listId)->get(),
                    new TaskCreated($task, auth()->user())
                );
            }
        }

        return response()->json(['message' => 'Edit Successfully'], 200);
    }
}
