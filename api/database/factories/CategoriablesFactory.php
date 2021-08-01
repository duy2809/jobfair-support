<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriablesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $categoriable = [
            App\User::class,
            App\Task::class,
        ];
    
        return [
            'categoriable_id' => $faker->numberBetween(0,10),
            'categoriable_type' => $faker->randomElement($categoriable),
            'category_id' => $faker->numberBetween(0,5)
        ];
    }
}
