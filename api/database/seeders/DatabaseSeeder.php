<?php

namespace Database\Seeders;

use App\Models\Jobfair;
use App\Models\Milestone;
use App\Models\Schedule;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        Jobfair::factory(10)->create();
        Schedule::factory(10)->create()->each(function ($schedule) {
            $schedule->milestones()->saveMany(Milestone::factory(5)->make());
            $schedule->milestones->each(function ($milestone) {
                $milestone->tasks()->saveMany(Task::factory(5)->make());
            });
        });
    }
}
