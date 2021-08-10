<?php

namespace Database\Seeders;

<<<<<<< HEAD
use Illuminate\Database\Seeder;
use App\Models\Category;
=======
use App\Models\Category;
use Illuminate\Database\Seeder;
>>>>>>> dbe558e882a3fd0524591086e0c59c081abaa7ad

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
        Category::factory(20)->create();
=======
        Category::factory()->count(5)->create();
>>>>>>> dbe558e882a3fd0524591086e0c59c081abaa7ad
    }
}
