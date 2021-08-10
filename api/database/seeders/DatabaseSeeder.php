<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryDetail;
use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
use App\Models\TemplateMilestone;
use App\Models\TemplateTask;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // first 3 users in 3 role
        User::create([
            'name' => 'Sun Asterisk',
            'email' => 'jobfair@sun-asterisk.com',
            'password' => Hash::make('12345678'),
            'avatar' => 'image/avatars/default.jpg',
            'role' => 1,
            'chatwork_id' => Str::random(10),
            'remember_token' => null,
            'updated_at' => now(),
            'created_at' => now(),
        ]);

        $JFadmin = User::create([
            'name' => 'JF Admin',
            'email' => 'AnAdmin@sun-asterisk.com',
            'password' => Hash::make('12345678'),
            'avatar' => 'image/avatars/default.jpg',
            'role' => 2,
            'chatwork_id' => Str::random(10),
            'remember_token' => null,
            'updated_at' => now(),
            'created_at' => now(),
        ]);

        User::create([
            'name' => 'Member',
            'email' => 'AMember@sun-asterisk.com',
            'password' => Hash::make('12345678'),
            'avatar' => 'image/avatars/default.jpg',
            'role' => 3,
            'chatwork_id' => Str::random(10),
            'remember_token' => null,
            'updated_at' => now(),
            'created_at' => now(),
        ]);

        // milestones data
        $milestones = [
            [
                '会社紹介',
                0,
                0,
            ],
            ['オープンSCP', 4, 0],
            ['プロファイル選択ラウンドの結果', 2, 1],
            ['1回目の面接', 3, 1],
            [' 1回目の面接結果', 4, 1],
            ['2回目の面接', 5, 1],
            [' 2回目の面接結果', 6, 1],
        ];
        // create category + category detail
        Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '1次面接練習']);
        Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => 'TC業務']);
        Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '企業担当']);
        Category::factory()->has(CategoryDetail::factory()->count(3))->create(['category_name' => '管理者']);

        // create users
        User::factory(30)->create();
        User::all()->each(function ($user) {
            $user->categories()->attach(Category::all()->random(2));
        });
        // create template milestones
        foreach ($milestones as $milestone) {
            TemplateMilestone::create([
                'name' => $milestone[0],
                'period' => $milestone[1],
                'is_week' => $milestone[2],
            ]);
        }

        // create template tasks with fk to template milestones and categories
        foreach (TemplateMilestone::all() as $milestone) {
            TemplateTask::factory(2)->for($milestone)->hasAttached(Category::all()->random(2))->create();
        }

        // create 3 template schedules
        foreach (range(0, 2) as $index) {
            $schedule = Schedule::factory()->create();
            // create milestones for template schedule
            foreach (TemplateMilestone::all() as $templateMilestone) {
                $milestone = Milestone::make([
                    'name' => $templateMilestone->name,
                    'period' => $templateMilestone->period,
                    'is_week' => $templateMilestone->is_week,
                ]);
                $milestone->schedule_id = $schedule->id;
                $milestone->save();
                // Task::factory(2)->for($milestone)->hasAttached(Category::all()->random(2))->create();
                // TODO Tasks Relation
                foreach ($templateMilestone->templateTasks as $templateTask) {
                    Task::create([
                        'name' => $templateTask->name,
                        'is_day' => $templateTask->is_day,
                        'unit' => $templateTask->unit,
                        'effort' => $templateTask->effort,
                        'description_of_detail' => $templateTask->description_of_detail,
                        'milestone_id' => $milestone->id,
                    ]);
                }
            }
        }

        //create 3 jobfairs
        Jobfair::factory(3)->create();

        Jobfair::all()->first()->update([
            'jobfair_admin_id' => $JFadmin->id,
        ]); // first JF assign to $JFadmin
        foreach (Jobfair::all() as $jobfair) {
            // random template schedule
            $templateSchedule = Schedule::where('jobfair_id', null)->get()->random(1)->first();
            $scheduleAttr = $templateSchedule->toArray();
            array_shift($scheduleAttr);
            $schedule = Schedule::create($scheduleAttr);
            $schedule->update(['jobfair_id' => $jobfair->id]);
            // add members for jobfair
            $jobfair->schedule->users()->attach(User::where('id', '<>', $jobfair->jobfair_admin_id)->get()->random(10));
            // clone tasks and milestones from template schedule to jobfair's schedule
            $milestones = $templateSchedule->milestones;
            foreach ($milestones as $milestone) {
                $milestoneAttr = $milestone->toArray();
                array_shift($milestoneAttr);
                $newMilestone = Milestone::create($milestoneAttr);
                $newMilestone->update(['schedule_id' => $schedule->id]);
                $tasks = $milestone->tasks;
                foreach ($tasks as $task) {
                    // TODO Tasks Relation
                    $newTask = Task::create([
                        'name' => $task->name,
                        'start_time' => $task->start_time,
                        'end_time' => $task->end_time,
                        'number_of_member' => $task->number_of_member,
                        'status' => $task->status,
                        'remind_member' => $task->remind_member,
                        'description_of_detail' => $task->description_of_detail,
                        'milestone_id' => $newMilestone->id,
                        'user_id' => $task->user_id,
                        'is_day' => $task->is_day,
                        'effort' => $task->effort,
                        'unit' => $task->unit,
                    ]);
                    // assign categories for new task
                    $newTask->categories()->attach(Category::all()->random(2));
                    // assign to jobfair's members whose have same category
                    $users = $jobfair->schedule->users()->whereHas('categories', function (Builder $query) use ($newTask) {
                        $query->whereIn('id', $newTask->categories()->pluck('id'));
                    })->get()->random(2);
                    $newTask->users()->attach($users, [
                        'notification' => 'thong bao',
                        'join_date' => now(),
                        'completed_date' => null,
                    ]);
                }
            }
        }
    }
}
