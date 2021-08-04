<?php

namespace Database\Seeders;

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
        $schedules = \App\Models\Schedule::factory(10)->create();
        foreach ($schedules as $schedule) {
            \App\Models\Milestone::factory(10)->has(\App\Models\Task::factory()->count(3))->create(['schedule_id' => $schedule->id]);
        }

        \App\Models\User::factory(10)->create();
        \App\Models\TemplateMilestone::factory(50)->create();
        \App\Models\Jobfair::factory(10)->create();
    }
}
