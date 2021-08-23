<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // create template milestones
        foreach ($milestones as $milestone) {
            Milestone::create([
                'name' => $milestone[0],
                'period' => $milestone[1],
                'is_week' => $milestone[2],
            ]);
        }

        // create template tasks with fk to template milestones and categories
        foreach (Milestone::all() as $milestone) {
            TemplateTask::factory(5)->for($milestone)->hasAttached(Category::all()->random())->create();
        }
    }
}
