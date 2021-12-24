<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Jobfair;
use App\Models\Milestone;
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
use stdClass;

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
        $arr = str_split($request->input('taskId'));
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($id);
        $first = $jobfair->schedule->tasks()->whereHas('users', null, '=', 0)->where('is_parent', 0)->get()->map(function ($item) use ($jobfair) {
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
            ->where('jobfairs.id', '=', $id)->where('tasks.is_parent', 0)
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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $jobfair = Jobfair::findOrFail($id);
        $schedule = Schedule::where('jobfair_id', '=', $id)->first();
        $idTemplateTask = $request->data;
        for ($i = 0; $i < count($idTemplateTask); $i += 1) {
            $templateTask = $schedule->templateTasks()->where('template_tasks.id', $idTemplateTask[$i])->first();

            $duration = 0;
            if (!isset($templateTask)) {
                $templateTask = TemplateTask::find($idTemplateTask[$i]);
                if ($templateTask->unit === 'students') {
                    $duration = (float) $templateTask->effort * $jobfair->number_of_students;
                } else if ($templateTask->unit === 'none') {
                    $duration = (float) $templateTask->effort;
                } else {
                    $duration = (float) $templateTask->effort * $jobfair->number_of_companies;
                }

                $duration = $templateTask->is_day ? $duration : ceil($duration / 24);
            } else {
                $duration = $templateTask->pivot->duration;
            }

            $duration--;
            $numDates = $templateTask->milestone->is_week ? $templateTask->milestone->period * 7 : $templateTask->milestone->period;
            $startTime = date('Y-m-d', strtotime($jobfair->start_date.' + '.$numDates.'days'));
            $input = $templateTask->toArray();
            $input['start_time'] = $startTime;
            $input['end_time'] = date('Y-m-d', strtotime($startTime.' + '.max($duration, 0).'days'));
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
            //comment history
            $comment = Comment::create([
                'user_id'         => auth()->user()->id,
                'task_id'         => $newTask->id,
                'is_created_task' => true,
            ]);
            \App\Events\Broadcasting\CommentCreated::dispatch($comment);
        }

        return response()->json('added task successfully');
    }

    public function updateTask(Request $request, $id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::findOrFail($id);
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

        //comment history

        $editedField = [];
        if ($request->has('status')) {
            if ($task->status !== $request->status) {
                $editedField['old_status'] = $task->status;
                $editedField['new_status'] = $request->status;
            }
        }

        if ($request->has('description_of_detail')) {
            if ($request->description_of_detail !== $task->description_of_detail) {
                $editedField['old_description'] = $task->description_of_detail;
                $editedField['new_description'] = $request->description_of_detail;
            }
        }

        if ($request->has('name')) {
            if ($request->name !== $task->name) {
                $editedField['old_name'] = $task->name;
                $editedField['new_name'] = $request->name;
            }
        }

        if ($request->has('start_time')) {
            if ($request->start_time !== $task->start_time->format('Y/m/d')) {
                $editedField['old_start_date'] = $task->start_time->format('Y/m/d');
                $editedField['new_start_date'] = $request->start_time;
            }
        }

        if ($request->has('end_time')) {
            if ($request->end_time !== $task->end_time->format('Y/m/d')) {
                $editedField['old_end_date'] = $task->end_time->format('Y/m/d');
                $editedField['new_end_date'] = $request->end_time;
            }
        }

        if (count($editedField) > 0) {
            $editedField['user_id'] = auth()->user()->id;
            $editedField['task_id'] = $id;
            $comment = Comment::create($editedField);
            \App\Events\Broadcasting\CommentCreated::dispatch($comment);
        }

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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::with([
            'milestone:id,name',
            'categories:id,category_name',
            'users:id,name',
            'schedule.jobfair:id,name,jobfair_admin_id',
            'templateTask:id,effort,is_day,unit',
        ])->findOrFail($id);
        if ($task->is_parent === 1) {
            $task->children = Task::where('parent_id', $task->id)->get();
        }

        return response()->json($task);
    }

    private function validateTaskRelation($id, $task, $beforeTasks, $afterTasks)
    {
        // validate relation
        $tasks = Task::where('schedule_id', $task->schedule_id)->get();
        $milestones = Milestone::all();
        orderMilestonesByPeriod($milestones);
        $milestones = $milestones->pluck('id')->toArray();
        $currentTaskMilestone = array_search($task->milestone_id, $milestones);
        $prerequisites = DB::table('pivot_table_tasks')->where('before_tasks', '<>', $id)
            ->where('after_tasks', '<>', $id)
            ->whereIn('before_tasks', $tasks->pluck('id')->toArray())
            ->whereIn('after_tasks', $tasks->pluck('id')->toArray())
            ->select(['after_tasks', 'before_tasks'])->get();
        foreach ($beforeTasks as $beforeTaskID) {
            if (
                array_search(
                    $tasks->where('id', $beforeTaskID)->first()->milestone_id,
                    $milestones
                ) > $currentTaskMilestone
            ) {
                return [
                    'error' => 'invalid before tasks',
                ];
            }

            $newPrerequisite = new stdClass();
            $newPrerequisite->before_tasks = $beforeTaskID;
            $newPrerequisite->after_tasks = intval($id);
            $prerequisites->push($newPrerequisite);
        }

        foreach ($afterTasks as $afterTaskID) {
            if (
                array_search(
                    $tasks->where('id', $afterTaskID)->first()->milestone_id,
                    $milestones
                ) < $currentTaskMilestone
            ) {
                return [
                    'error' => 'invalid after tasks',
                ];
            }

            $newPrerequisite = new stdClass();
            $newPrerequisite->before_tasks = intval($id);
            $newPrerequisite->after_tasks = $afterTaskID;
            $prerequisites->push($newPrerequisite);
        }

        if (taskRelation($tasks->pluck('id')->toArray(), $prerequisites) === 'invalid') {
            return [
                'error' => 'invalid relations',
            ];
        }

        return 'oke';
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

        $task = Task::findOrFail($id);
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

        //comment history
        $editedField = [];
        if ($request->has('status')) {
            if ($task->status !== $request->status) {
                $editedField['old_status'] = $task->status;
                $editedField['new_status'] = $request->status;
            }
        }

        if ($request->has('description_of_detail')) {
            if ($request->description_of_detail !== $task->description_of_detail) {
                $editedField['old_description'] = $task->description_of_detail;
                $editedField['new_description'] = $request->description_of_detail;
            }
        }

        if ($request->has('name')) {
            if ($request->name !== $task->name) {
                $editedField['old_name'] = $task->name;
                $editedField['new_name'] = $request->name;
            }
        }

        if ($request->has('start_time')) {
            if ($request->start_time !== $task->start_time->format('Y/m/d')) {
                $editedField['old_start_date'] = $task->start_time->format('Y/m/d');
                $editedField['new_start_date'] = $request->start_time;
            }
        }

        if ($request->has('end_time')) {
            if ($request->end_time !== $task->end_time->format('Y/m/d')) {
                $editedField['old_end_date'] = $task->end_time->format('Y/m/d');
                $editedField['new_end_date'] = $request->end_time;
            }
        }

        // handle input reviewers
        $listReviewers = [];
        if ($request->has('reviewers')) {
            if ($request->input('reviewers') === [] || $request->input('reviewers') === [null]) {
                $listOldReviewers = $task->reviewers;
                $listOldReviewersID = $listOldReviewers->pluck('id')->toArray();
                $listNewReviewers = [];
                if (
                    !(
                        is_array($listNewReviewers)
                        && is_array($listOldReviewersID)
                        && count($listNewReviewers) === count($listOldReviewersID)
                        && array_diff($listNewReviewers, $listOldReviewersID) === array_diff($listOldReviewersID, $listNewReviewers)
                    )
                ) {
                    $editedField['old_reviewers'] = implode(',', $listOldReviewers->pluck('name')->toArray());
                    $editedField['new_reviewers'] = '';
                }
            } else {
                $checkKey = 1;
                // check is each reviewers valid
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

                if ($checkKey !== 1) {
                    return response()->json(['message' => 'list reviewers invalid'], 400);
                }

                $listOldReviewers = $task->reviewers;
                $listOldReviewersID = $listOldReviewers->pluck('id')->toArray();
                $listNewReviewers = $request->input('reviewers');
                if (
                    !(
                        is_array($listNewReviewers)
                        && is_array($listOldReviewersID)
                        && count($listNewReviewers) === count($listOldReviewersID)
                        && array_diff($listNewReviewers, $listOldReviewersID) === array_diff($listOldReviewersID, $listNewReviewers)
                    )
                ) {
                    $editedField['old_reviewers'] = implode(',', $listOldReviewers->pluck('name')->toArray());
                    $editedField['new_reviewers'] = implode(',', User::whereIn('id', $listNewReviewers)->pluck('name')->toArray());
                }

                $listReviewers = $request->input('reviewers');
            }
        } else {
            $listReviewers = 'none';
        }

        // update reviewers
        if ($listReviewers !== 'none') {
            $task->reviewers()->sync($listReviewers);
        }

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
                // comment history
                $editedField['old_assignees'] = implode(',', $listOldMember);
                $editedField['new_assignees'] = implode(',', $listMember);

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

        // comment history and update before after tasks
        $task->update($request->all());

        if ($request->has('beforeTasks')) {
            $result = $this->validateTaskRelation($id, $task, $request->beforeTasks, $request->afterTasks);
            if ($result !== 'oke') {
                return response($result, 400);
            }

            $oldBeforeTasks = $task->beforeTasks;
            $newBeforeTasks = $request->beforeTasks;
            $oldBeforeTasksID = $oldBeforeTasks->pluck('id')->toArray();

            if (
                !(
                    is_array($newBeforeTasks)
                    && is_array($oldBeforeTasksID)
                    && count($newBeforeTasks) === count($oldBeforeTasksID)
                    && array_diff($newBeforeTasks, $oldBeforeTasksID) === array_diff($oldBeforeTasksID, $newBeforeTasks)
                )
            ) {
                // store list assignees as string with format "id1, id2, id3, ..."
                $editedField['old_previous_tasks'] = implode(',', $oldBeforeTasks->pluck('name')->toArray());
                $editedField['new_previous_tasks'] = implode(',', Task::whereIn('id', $newBeforeTasks)->pluck('name')->toArray());
                $task->beforeTasks()->sync($request->beforeTasks);
            }
        }

        if ($request->has('afterTasks')) {
            $oldAfterTasks = $task->afterTasks;
            $newAfterTasks = $request->afterTasks;
            $oldAfterTasksID = $oldAfterTasks->pluck('id')->toArray();
            if (
                !(
                    is_array($newAfterTasks)
                    && is_array($oldAfterTasksID)
                    && count($newAfterTasks) === count($oldAfterTasksID)
                    && array_diff($newAfterTasks, $oldAfterTasksID) === array_diff($oldAfterTasksID, $newAfterTasks)
                )
            ) {
                // store list assignees as string with format "id1, id2, id3, ..."
                $editedField['old_following_tasks'] = implode(',', $oldAfterTasks->pluck('name')->toArray());
                $editedField['new_following_tasks'] = implode(',', Task::whereIn('id', $newAfterTasks)->pluck('name')->toArray());
                $task->afterTasks()->sync($request->afterTasks);
            }
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

        //save comment history
        if (count($editedField) > 0) {
            $editedField['user_id'] = auth()->user()->id;
            $editedField['task_id'] = $id;
            $comment = Comment::create($editedField);
            \App\Events\Broadcasting\CommentCreated::dispatch($comment);
        }

        $task->save();

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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::findOrFail($id);
        $deletedTask = $task->toArray();
        $task->categories()->detach();
        $task->beforeTasks()->detach();
        $task->afterTasks()->detach();
        $task->delete();

        return response()->json(['message' => 'Delete Successfully', 'deleted_task' => $deletedTask], 200);
    }

    public function getReviewers($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Task::findOrFail($id)->reviewers;
    }

    public function getListReviewers($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::findOrFail($id);
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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $beforeTasks = Task::with('beforeTasks:id,name')->findOrFail($id, ['id', 'name']);

        return response()->json($beforeTasks);
    }

    public function getAfterTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $afterTasks = Task::with('afterTasks:id,name')->findOrFail($id, ['id', 'name']);

        return response()->json($afterTasks);
    }

    public function getTemplateTaskNotAdd($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Jobfair::with([
            'schedule.tasks' => function ($q) {
                $q->select('template_task_id', 'schedule_id');
            },
        ])->findOrFail($id);

        $templateTask = TemplateTask::whereNotIn('id', $task->schedule->tasks->pluck('template_task_id'))->where('is_parent', 0)
            ->with(['categories:id,category_name', 'milestone:id,name'])->get(['id', 'name', 'milestone_id']);

        return response()->json($templateTask);
    }

    public function checkAssignee($taskID, $userID)
    {
        $arr = str_split($taskID);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Task::findOrFail($taskID)->users->pluck('id')->contains($userID);
    }

    public function getUserSameCategory($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::findOrFail($id);

        $user = User::whereHas('categories', function (Builder $query) use ($task) {
            $query->whereIn('categories.id', $task->categories()->pluck('id'));
        })->get(['users.id', 'users.name']);

        return response()->json($user);
    }

    public function updateManagerTask(Request $request, $id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $task = Task::findOrFail($id);

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

                //comment history
                $comment = Comment::create([
                    'old_assignees' => implode(',', $listOldMember),
                    'new_assignees' => implode(',', $listMember),
                    'user_id'       => auth()->user()->id,
                    'task_id'       => $id,
                ]);
                \App\Events\Broadcasting\CommentCreated::dispatch($comment);
            }
        }

        return response()->json(['message' => 'Edit Successfully'], 200);
    }
}
