<?php

namespace Database\Seeders;
<<<<<<< HEAD

use App\Models\Category;
use Illuminate\Database\Seeder;

=======
use Illuminate\Database\Seeder;
>>>>>>> 0f21d90c88a79a75041b61158f6284e73a35a612
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
        Category::factory()->count(100)->create();
=======
        Category::factory(100)->create();
>>>>>>> 0f21d90c88a79a75041b61158f6284e73a35a612
    }
}
