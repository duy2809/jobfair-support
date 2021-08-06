<?php

namespace Database\Seeders;

<<<<<<< HEAD
use Illuminate\Database\Seeder;
use App\Models\Category;
=======
use App\Models\Category;
use Illuminate\Database\Seeder;
>>>>>>> 3953a14f6b75df6f204f07170c62433396037a4c

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
<<<<<<< HEAD
        Category::factory(100)->create();
=======
        Category::factory()->count(5)->create();
>>>>>>> 3953a14f6b75df6f204f07170c62433396037a4c
    }
}
