<?php

namespace App\Http\Controllers;

use App\Http\Requests\ScheduleRequest;
use App\Models\Category;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\TemplateTask;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
        return Schedule::whereNull('jobfair_id')->get();
    }

    public function getAll()
    {
        return Schedule::whereNull('jobfair_id')->get();
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
        $rules = [
            'name' => 'required',
            'name' => [
                Rule::unique('schedules')->whereNull('jobfair_id'),
            ],
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        $schedule = new Schedule();
        $schedule->name = $request->name;
        $schedule->save();
        $schedule->milestones()->attach($request->addedMilestones);
        $schedule->templateTasks()->attach($request->addedTemplateTasks);

        return $schedule;
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

        return Schedule::findOrFail($id);
    }

    public function getAllMilestones()
    {
        return Milestone::all();
    }

    public function getAllTemplateTasks()
    {
        return TemplateTask::all();
    }

    public function getAddedMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::findOrFail($id)->milestones;
    }

    public function getAddedTemplateTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::findOrFail($id)->templateTasks;
    }

    public function checkScheduleNameExist(Request $request)
    {
        return count(Schedule::where('name', $request->name)->get()) !== 0 ? 'exist' : 'not exist';
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ScheduleRequest $request, $id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Schedule::findOrFail($id);
        $schedule->name = $request->name;
        $schedule->save();
        $addedMilestones = $request->addedMilestones;
        $addedTemplateTasks = $request->addedTemplateTasks;
        $schedule->templateTasks()->detach();
        $schedule->templateTasks()->attach($addedTemplateTasks);
        $schedule->templateTasks->each(function ($templateTask) use ($schedule, $addedMilestones) {
            if (!in_array($templateTask->milestone_id, $addedMilestones)) {
                $schedule->templateTasks()->detach($templateTask->id);
            }
        });
        $schedule->milestones()->detach();
        $schedule->milestones()->attach($addedMilestones);
    }

    public function getMilestones($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::with('milestones:id,name')->findOrFail($id, ['id']);
    }

    public function getTemplateTasks($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Schedule::with('templateTasks:id,name')->findOrFail($id, ['id']);
    }

    public function search(Request $request)
    {
        return Schedule::where('name', 'like', '%'.$request->input('name').'%')->get();
    }

    public function getSchedule($id)
    {
        $schedule = Schedule::where('jobfair_id', '=', $id)->get();

        return response()->json([
            'data' => $schedule,
        ]);
    }

    /**
     * Convert relation to array
     *
     * Eg: 1->3, 2->3, 3->4 => $prerequisites = [[3, 1], [3, 2], [4, 3]]
     * => output: ['3' => [1, 2], '4' => [3]]
     * @param  Array $prerequisites
     * @return Array $tasks - converted array
     */
    public static function taskWithPrerequisites($prerequisites)
    {
        $tasks = [];
        foreach ($prerequisites as [$task, $req]) {
            $tasks[$task][] = $req;
        }

        return $tasks;
    }

    /**
     * Sort tasks by relation
     *
     * Eg: 1->3, 2->3, 3->4 => $prerequisites = [[3, 1], [3, 2], [4, 3]]
     * => output: [1, 2, 3, 4]
     * @param  Array $prerequisites
     * @return Array $lists - tasks ordered by relation
     */
    public static function findOrderList($prerequisites)
    {
        $tasks = static::taskWithPrerequisites($prerequisites);

        $list = $visited = [];
        $order = function ($task) use (&$list, &$visited, &$tasks, &$order) {
            // If we have visited the node before, return
            if (isset($visited[$task])) {
                return;
            }

            // If this node has no dependencies, add it
            // to the list of tasks we can take
            if (isset($tasks[$task]) && count($tasks[$task]) === 0) {
                $visited[$task] = true;
                // $color[$task] = 2;
                $list[] = $task;

                return;
            }

            // Go through the task deps and process them
            if (isset($tasks[$task])) {
                foreach ($tasks[$task] as $req) {
                    $order($req);
                }
            }

            // Mark as visited
            $visited[$task] = true;
            // Add to list
            $list[] = $task;
        };

        // Go through all the tasks and run the order
        foreach ($tasks as $task => $deps) {
            $order($task);
        }

        return $list;
    }

    /**
     * Find and order all prerequisites of one task
     *
     * @param  Array $orderedList
     * @param  Array $prerequisites
     * @return Array
     */
    public static function findAllReq($orderedList, $prerequisites)
    {
        $result = [];
        foreach ($orderedList as $key => $value) {
            if (array_search($value, $prerequisites) === 0 || array_search($value, $prerequisites)) {
                $result[] = $value;
            }
        }

        return $result;
    }

    public static function append(&$arr1, $arr2)
    {
        $length = count($arr2);
        for ($i = 0; $i < $length; $i++) {
            $arr1[$i][] = $arr2[$i];
        }
    }

    public static function addOrderIndex($tasks, $end, $orderedList)
    {
        $levels = [];
        if (isset($tasks[$end])) {
            $length = count($tasks[$end]);
            if ($length !== 1) {
                $res = static::findAllReq($orderedList, $tasks[$end]);
                foreach ($res as $key => $value) {
                    $index = array_search($value, $orderedList);
                    $temp = array_splice($orderedList, 0, $index + 1);
                    static::append($levels, $temp);
                }
            } else {
                $levels = static::addOrderIndex($tasks, $tasks[$end][0], $orderedList);
            }

            array_push($levels, [$end]);
        } else {
            array_push($levels, [0 => $end]);
        }

        return $levels;
    }

    /**
     * Order tasks by relation then push end tasks to result
     * @param  Array $tasks
     * @param  Array $orderedList
     * @param  Array $endTasks - 1 || more tasks with same start date
     * @return Array
     */
    public static function orderTasks($tasks, $endTasks, $orderedList)
    {
        if (count($endTasks)) {
            $end = $endTasks[0];
            $res = static::addOrderIndex($tasks, $end, $orderedList);
            for ($i = 1; $i < count($endTasks); $i++) {
                $res[count($res) - 1][] = $endTasks[$i];
            }

            return $res;
        }

        return [];
    }

    /**
     * Flat array
     * Eg: [[5, 8, 10], [3], [2, 4]]
     * output: ['5' => 0, '8' => 0, '10' => 0, '3' => 1, '2' => 2, '4' => 2]
     * @param  Array $input
     * @return Array
     */
    public static function flatArray($input)
    {
        if (count($input)) {
            $output = [];
            foreach ($input as $index => $value) {
                foreach ($value as $key => $taskId) {
                    $output[$taskId] = $index;
                }
            }

            return $output;
        }

        return [];
    }

    /**
     * Sort tasks by relation
     *
     * @param  Array $withoutRelation - tasks without relation
     * @param  Array $withRelation - tasks and it relation
     * @param  Array $endTasks - end tasks of this milestone
     * @return Array - tasks ordered by relation
     */
    public static function order($withoutRelation, $withRelation, $endTasks)
    {
        $result = [];
        $relation = [];
        foreach ($withoutRelation as $key => $value) {
            $result[$value] = 0;
        }

        if (count($withRelation) > 0) {
            $list = static::findOrderList($withRelation);
            $temp = static::taskWithPrerequisites($withRelation);
            $relation = static::orderTasks($temp, $endTasks, $list);
        }

        return $result + static::flatArray($relation);
    }

    /**
     * Sort milestones, count template tasks
     *
     * @param  App\Models\Schedule  $schedule
     * @param  Array  $tasksWithOrderIndex - Store tasks id and order index
     * @return Array - milestones ordered
     */
    public static function milestoneWithOrder($schedule, $milestones, $templateTasks, &$tasksWithOrderIndex)
    {
        $milestones = $milestones->map(function ($item) use ($templateTasks, $schedule, &$tasksWithOrderIndex) {
            $postfix = $item->is_week ? '週間後' : '日後';
            // get all tasks in this milestone
            $ownTasks = $schedule->templateTasks()->where('milestone_id', $item->id);
            // get tasks with and without relation
            $relation = DB::table('pivot_table_template_tasks')
                ->select(['after_tasks', 'before_tasks'])->whereIn('before_tasks', $ownTasks->pluck('template_tasks.id'))
                ->whereIn('after_tasks', $ownTasks->pluck('template_tasks.id'))
                ->get()->map(function ($element) {
                    return [$element->after_tasks, $element->before_tasks];
                });
            $withoutRelation = $ownTasks->whereHas('beforeTasks', null, '=', 0)
                ->whereHas('afterTasks', null, '=', 0)->pluck('template_tasks.id');

            // end tasks of this milestone
            $endTasks = $schedule->templateTasks()->where('milestone_id', $item->id)
                ->whereHas('beforeTasks', function ($query) use ($item) {
                    $query->where('milestone_id', $item->id);
                }, '>', 0)
                ->whereHas('afterTasks', function ($query) use ($item) {
                    $query->where('milestone_id', $item->id);
                }, '=', 0)
                ->pluck('template_tasks.id');
            $orderTasks = static::order($withoutRelation, $relation, $endTasks);
            $tasksWithOrderIndex += $orderTasks;
            // $totalIndex - Number of time slots
            // Eg: Total = 5 tasks; task 1, 2 have same start date => 4 time slots
            $totalIndex = count(array_unique($orderTasks));

            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'timestamp'     => $item->period === 0 ? '' : $item->period.$postfix,
                'numberOfTasks' => $templateTasks->get()->where('milestone_id', $item->id)->count(),
                'totalIndex'    => $totalIndex,
            ];
        });

        return $milestones;
    }

    /**
     * Get template tasks and sort result
     *
     * @param  App\Models\Schedule  $schedule
     * @param  Array  $tasksWithOrderIndex - Store tasks id and order index
     * @return Array - tasks ordered
     */
    public static function getTemplateTasksOrdered($schedule, $tasksWithOrderIndex)
    {
        $result = [];
        $templateTasks = $schedule->templateTasks;
        foreach ($templateTasks as $item) {
            $categories = $item->categories;
            foreach ($categories as $categoryId) {
                $result[] = [
                    'id'          => $item->id,
                    'name'        => $item->name,
                    'description' => $item->description_of_detail,
                    'milestoneId' => $item->milestone_id,
                    'categoryId'  => $categoryId->id,
                    'orderIndex'  => $tasksWithOrderIndex[$item->id],
                ];
            }
        }

        return $result;
    }

    /**
     * Get categories have tasks in schedule
     *
     * @param  int  $scheduleId
     * @return Array categories
     */
    public static function getCategories($scheduleId)
    {
        $templateTasks = Schedule::find($scheduleId)->templateTasks
            ->pluck('id');

        return Category::whereHas(
            'templateTasks',
            function (EloquentBuilder $query) use ($templateTasks) {
                $query->whereIn('template_tasks.id', $templateTasks);
            }
        )->with([
            'templateTasks' => function ($query) use ($scheduleId) {
                $query->whereHas('schedules', function (EloquentBuilder $query) use ($scheduleId) {
                    $query->where('schedules.id', $scheduleId);
                });
            },
        ])->get()->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->category_name,
                'numberOfTasks' => count($item->templateTasks),
            ];
        });
    }

    public function getGanttChart($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $schedule = Schedule::findOrFail($id);
        $milestones = $schedule->milestones;
        $templateTasks = $schedule->templateTasks()->with('categories');
        $tasksWithOrderIndex = [];

        $milestones = static::milestoneWithOrder($schedule, $milestones, $templateTasks, $tasksWithOrderIndex);
        $templateTasks = static::getTemplateTasksOrdered($schedule, $tasksWithOrderIndex);
        $categories = static::getCategories($id);

        return response()->json([
            'milestones' => $milestones,
            'tasks'      => $templateTasks,
            'categories' => $categories,
        ]);
    }

    public function destroy($id)
    {
        try {
            DB::table('milestone_schedule')->where('schedule_id', $id)->delete();
            DB::table('tasks')->where('schedule_id', $id)->update(['schedule_id' => null]);
            DB::table('list_members')->where('schedule_id', $id)->delete();
            DB::table('schedule_template_task')->where('schedule_id', $id)->delete();
            $arr = str_split($id);
            foreach ($arr as $char) {
                if ($char < '0' || $char > '9') {
                    return response(['message' => 'invalid id'], 404);
                }
            }

            Schedule::findOrFail($id)->delete();
        } catch (Exception $e) {
            report($e);
            $data = ['message' => 'Exist a relation with schedule, can not delete!'];

            return response()->json($data, 204);
        }
    }

    public function createTemplateTaskParent(Request $request)
    {
        $schedule = Schedule::findOrFail($request->schedule_id);

        // create template task parent
        foreach ($request->parent as $parent) {
            $idCategory = [];
            $milestone = TemplateTask::find($parent['children'][0])->milestone_id;
            foreach ($parent['children'] as $child) {
                $id = TemplateTask::find($child)->milestone_id;
                if ($milestone !== $id) {
                    return response()->json(['message' => 'invalid milestone'], 422);
                }

                $temp = TemplateTask::find($child)->categories()->pluck('id')->toArray();
                $idCategory = array_merge($idCategory, $temp);
            }

            $idCategory = array_unique($idCategory);
            $newTemplateTask = TemplateTask::create([
                'name' => $parent['name'],
                'is_parent' => true,
                'milestone_id' => $milestone,
            ]);

            $newTemplateTask->categories()->attach(array_values($idCategory));
            // add template task parent to table schedule_template_task
            $schedule->templateTasks()->attach($newTemplateTask);
            $schedule->templateTasks()->updateExistingPivot($parent['children'], [
                'template_task_parent_id' => $newTemplateTask->id,
            ]);
            TemplateTask::whereIn('id', $parent['children'])->update(['has_parent' => 1]);
        }

        // Change duration
        $milestones = $schedule->milestones;
        foreach ($milestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $milestones = $milestones->sortBy('day');
        foreach ($request->milestones as $milestone) {
            $index = $milestones->search(function ($element) use ($milestone) {
                return $element->id === $milestone['milestone_id'];
            });
            // the gap between two milestone is possible the time of this milestone
            // if it's the last milestone then the duration is forever
            $gap = $index < count($milestones) - 1 ?
            $milestones[$index + 1]->day - $milestones[$index]->day : PHP_INT_MAX;
            // min start time of all template task is milestone's start time
            $minStartTime = $milestones[$index]->day;
            $mapTaskIDToEndTime = collect([]);
            $templateTasks = $schedule->templateTasks()->where('milestone_id', $milestone['milestone_id'])->get()->filter(function ($task) {
                return $task->is_parent === 0;
            });
            $templateTaskIds = $templateTasks->pluck('id')->toArray();
            $prerequisites = DB::table('pivot_table_template_tasks')->select(['after_tasks', 'before_tasks'])
                ->whereIn('before_tasks', $templateTaskIds)->whereIn('after_tasks', $templateTaskIds)->get();
            $templateTasksOrder = taskRelation($templateTaskIds, $prerequisites);
            // if loop with this order, each before tasks of a template task will be handled before it
            foreach ($templateTasksOrder as $templateTaskId => $orderIndex) {
                //set new start time = the latest before task's end time + 1
                $newStartTime = $minStartTime;
                $templateTask = $templateTasks->where('id', $templateTaskId)->first();
                $templateTask->beforeTasks->each(function ($element)
 use (&$newStartTime, $mapTaskIDToEndTime, $templateTaskIds) {
                    if (in_array($element->id, $templateTaskIds)) {
                        $possibleStartTime = $mapTaskIDToEndTime[$element->id] + 1;
                        if ($newStartTime < $possibleStartTime) {
                            $newStartTime = $possibleStartTime;
                        }
                    }
                });
                // request must send all template tasks in a milestone
                if (!array_key_exists($templateTaskId, $milestone['template_tasks'])) {
                    return response([
                        'msg'                      => 'you must specify duration of all template task in a milestone',
                        'missing_template_task_id' => $templateTaskId,
                    ]);
                }

                $newEndTime = $newStartTime + $milestone['template_tasks'][$templateTaskId] - 1;
                $mapTaskIDToEndTime->put($templateTaskId, $newEndTime);
                if ($newEndTime > $minStartTime + $gap - 1) {
                    return response([
                        'msg' => 'invalid duration',
                    ], 400);
                }
            }
        }

        // if all milestones's duration is oke then update the durations
        foreach ($request->milestones as $milestone) {
            $templateTasks = $schedule->templateTasks()
                ->where('milestone_id', $milestone['milestone_id'])->where('template_tasks.is_parent', 0)->get(['template_tasks.id']);
            foreach ($templateTasks as $templateTask) {
                DB::table('schedule_template_task')->where('schedule_id', $request->schedule_id)
                    ->where('template_task_id', $templateTask->id)
                    ->update(['duration' => $milestone['template_tasks'][$templateTask->id]]);
            }
        }

        return response()->json('Create Successfully');
    }

    public function deleteTemplateTaskParent(Request $request, $id)
    {
        $templateTaskParent = TemplateTask::findOrFail($id);
        DB::table('schedule_template_task')->where('template_task_parent_id', $id)->where('schedule_id', $request->schedule_id)->update([
            'template_task_parent_id' => null,
        ]);
        $templateTasks->schedules()->detach();
        $templateTaskParent->categories()->detach();
        $templateTaskParent->delete();

        return response()->json('OK');
    }

    public function getListTemplateTasks($id)
    {
        $idTemplateTask = DB::table('schedule_template_task')->where('schedule_id', $id)->pluck('template_task_id');
        $schedule = Schedule::with([
            'milestones:id,name,is_week,period',
            'milestones.templateTasks' => function ($templateTask) use ($idTemplateTask) {
                $templateTask->whereIn('template_tasks.id', $idTemplateTask)->select(['id', 'name', 'milestone_id']);
            },
        ])->findOrFail($id, ['id', 'name']);
        foreach ($schedule->milestones as $item) {
            $day = $item->is_week === 1 ? $item->period * 7 : $item->period;
            $item['day'] = $day;
        }

        $schedule->milestones = $schedule->milestones->sortBy('day');
        foreach ($schedule->milestones as $milestone) {
            $index = $schedule->milestones->search(function ($element) use ($milestone) {
                return $element->id === $milestone['id'];
            });
            // the gap between two milestone is possible the time of this milestone
            // if it's the last milestone then the duration is forever
            $gap = $index < count($schedule->milestones) - 1 ?
            $schedule->milestones[$index + 1]->day - $schedule->milestones[$index]->day : PHP_INT_MAX;
            $milestone['gap'] = $gap;
        }

        foreach ($schedule->milestones as $milestone) {
            foreach ($milestone->templateTasks as $templateTask) {
                $taskParentId = DB::table('schedule_template_task')->where('template_task_id', $templateTask->id)
                    ->where('schedule_id', $id)->first()->template_task_parent_id;
                $templateTask['parent'] = $taskParentId === null ? 0 : $taskParentId;
                $temp = TemplateTask::findOrFail($templateTask->id);
                $templateTask['beforeTasks'] = $temp->beforeTasks->pluck('id');
                $templateTask['afterTasks'] = $temp->afterTasks->pluck('id');
            }
        }

        return $schedule->milestones->toArray();
    }
}
