<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
        return Schedule::all();
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

    public function getMilestones($id)
    {
        return Schedule::with(['milestones:id,name'])->find($id, ['id']);
    }

    public function getTemplateTasks($id)
    {
        return Schedule::with('templateTasks:id,name')->find($id, ['id']);
    }

    public function search(Request $request)
    {
        return Schedule::where('name', 'like', '%' . $request->input('name') . '%')->get();
    }

    public function getScheduleb($id)
    {
        $schedule = Schedule::where('jobfair_id', '=', $id)->get();

        return response()->json([
            'data' => $schedule,
        ]);
    }

    public static function taskWithPrerequisites($prerequisites)
    {
        $tasks = [];
        foreach ($prerequisites as [$task, $req]) {
            $tasks[$task][] = $req;
        }
        return $tasks;
    }

    public static function findOrderList($prerequisites)
    {
        $tasks = static::taskWithPrerequisites($prerequisites);

        $list = $visited = [];
        $order = function ($task) use (&$list, &$visited, &$tasks, &$order) {
            # If we have visited the node before, return
            if (isset($visited[$task])) {
                return;
            }

            # If this node has no dependencies, add it
            # to the list of tasks we can take
            if (isset($tasks[$task]) && count($tasks[$task]) == 0) {
                $visited[$task] = true;
                // $color[$task] = 2;
                $list[] = $task;
                return;
            }

            # Go through the task deps and process them
            if (isset($tasks[$task])) {
                foreach ($tasks[$task] as $req) {
                    $order($req);
                }
            }
            # Mark as visited
            $visited[$task] = true;
            # Add to list
            $list[] = $task;
        };

        # Go through all the tasks and run the order
        foreach ($tasks as $task => $deps) {
            $order($task);
        }
        return $list;
    }

    public static function findAllReq($list, $reqArray)
    {
        $result = [];
        foreach ($list as $key => $value) {
            if (array_search($value, $reqArray) === 0 || array_search($value, $reqArray)) {
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
            array_push($levels, array($end));

        } else {
            array_push($levels, [0 => $end]);
        }
        return $levels;

    }

    public static function orderTasks($tasks, $endTasks, $orderedList)
    {
        $end = $endTasks[0];
        $res = static::addOrderIndex($tasks, $end, $orderedList);
        for ($i = 1; $i < count($endTasks); $i++) {
            $res[count($res) - 1][] = $endTasks[$i];
        }
        return $res;
    }

    public static function convertArray($input)
    {
        $output = [];
        foreach ($input as $index => $value) {
            foreach ($value as $key => $taskId) {
                $output[$taskId] = $index;
            }
        }
        return $output;
    }

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
        $result = $result+static::convertArray($relation);
        return $result;
    }

    public static function milestoneWithOrder($schedule, $milestones, $templateTasks, &$tasksWithOrderIndex)
    {
        $milestones = $milestones->map(function ($item) use ($templateTasks, $schedule, &$tasksWithOrderIndex) {
            $postfix = ($item->is_week) ? "週間後" : "日後";
            // get all tasks in this milestone
            $ownTasks = $schedule->templateTasks()->where('milestone_id', $item->id);
            // get tasks with and without relation
            $relation = DB::table('pivot_table_template_tasks')
                ->select(['after_tasks', 'before_tasks'])->whereIn('before_tasks', $ownTasks->pluck('id'))
                ->whereIn('after_tasks', $ownTasks->pluck('id'))
                ->get()->map(function ($element) {
                return array($element->after_tasks, $element->before_tasks);
            });
            $withoutRelation = $ownTasks->whereHas('beforeTasks', null, '=', 0)->whereHas('afterTasks', null, '=', 0)->pluck('id');
            // get end tasks of relation tasks
            $endTasks = $schedule->templateTasks()->where('milestone_id', $item->id)->whereHas('beforeTasks', null, '>', 0)->whereHas('afterTasks', null, '=', 0)->pluck('id');

            $orderTasks = static::order($withoutRelation, $relation, $endTasks);
            $tasksWithOrderIndex = $tasksWithOrderIndex + $orderTasks;
            $totalIndex = count(array_unique($orderTasks));
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'timestamp'     => $item->period == 0 ? "" : $item->period . $postfix,
                'numberOfTasks' => $templateTasks->get()->where('milestone_id', $item->id)->count(),
                'totalIndex'    => $totalIndex,
            ];
        });
        return $milestones;
    }

    public static function getTemplateTasksOrdered($schedule, $tasksWithOrderIndex)
    {
        $result = [];
        $templateTasks = $schedule->templateTasks;
        foreach ($templateTasks as $item) {
            $categories = $item->categories->pluck('id');
            foreach ($categories as $categoryId) {
                $result[] = [
                    'id'          => $item->id,
                    'name'        => $item->name,
                    'description' => $item->description_of_detail,
                    'milestoneId' => $item->milestone_id,
                    'categoryId'  => $categoryId,
                    'orderIndex'  => $tasksWithOrderIndex[$item->id],
                ];
            }
        }
        return $result;
        // $templateTasks = $schedule->templateTasks->map(function ($item) use ($tasksWithOrderIndex) {
        //     // $categories = $item->categories->pluck('id');
        //     return [
        //         'task' => [
        //             'id'          => $item->id,
        //             'name'        => $item->name,
        //             'description' => $item->description_of_detail,
        //             'milestoneId' => $item->milestone_id,
        //             'categoryId'  => '',
        //             'orderIndex'  => $tasksWithOrderIndex[$item->id],
        //         ],
        //     ];
        // });
        // return $templateTasks;
    }

    public static function getCategories($scheduleId)
    {
        $categories = Category::whereHas('templateTasks', function (EloquentBuilder $query) {
            $query->whereIn('id', Schedule::find(1)->templateTasks->pluck('id'));
        })->with(['templateTasks' => function ($query) use ($scheduleId) {
            $query->whereHas('schedules', function (EloquentBuilder $query) use ($scheduleId) {
                $query->where('id', $scheduleId);
            });
        }])->get()->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->category_name,
                'numberOfTasks' => count($item->templateTasks->pluck('id')),
            ];
        });
        return $categories;
    }

    public function getGanttChart($id)
    {
        $schedule = Schedule::find($id);
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
}
