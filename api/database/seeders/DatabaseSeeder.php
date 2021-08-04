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
        $this->call(JobfairsSeeder::class);
        $this->call(SchedulesSeeder::class);
        \App\Models\User::factory(10)->create();
        \App\Models\TemplateMilestone::factory(50)->create();
        \App\Models\Jobfair::factory(10)->create();
    }
}
