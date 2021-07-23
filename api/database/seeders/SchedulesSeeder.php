<?php

namespace Database\Seeders;

use App\Models\Schedule;
use Illuminate\Database\Seeder;

class SchedulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schedule::factory()->times(10)->create();
    }
}
