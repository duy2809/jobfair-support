<?php

namespace Database\Factories;

use App\Models\Jobfair;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobfairFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Jobfair::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'start_date' => $this->faker->date(),
            'number_of_companies' => $this->faker->numberBetween(1, 10),
            'number_of_students' => $this->faker->numberBetween(1, 10),

        ];
    }
}
