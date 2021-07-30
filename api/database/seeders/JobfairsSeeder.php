<?php

namespace Database\Seeders;

use App\Models\Jobfair;
use Illuminate\Database\Seeder;

class JobfairsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Jobfair::factory()->times(100)->create();
    }
}
