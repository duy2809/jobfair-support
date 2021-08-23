<?php

namespace Database\Seeders;

use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $poly = [
            'App\Models\TemplateTask',
            'App\Models\Task',
        ];
        $path = [
            '/',
            '/abc',
            '/abc/aaa',
        ];

        for ($i = 0; $i < 5; $i++) {
            DB::table('documents')->insert([
                'document_type' => $faker->randomElement($poly),
                'document_id' => $i + 1,
                'update_date' => $faker->date(),
                'name' => $faker->name(),
                'link' => $faker->url(),
                'path' => $faker->randomElement($path),
                'is_file' => $faker->boolean(),
                'authorId' => $faker->numberBetween(1, 4),
                'updaterId' => $faker->numberBetween(1, 4),
            ]);
        }
    }
}
