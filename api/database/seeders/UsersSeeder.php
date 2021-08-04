<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
<<<<<<< HEAD
        User::factory()->times(100)->create();
=======
        User::factory()->times(30)->create();
>>>>>>> merge
    }
}
