<?php

namespace Database\Factories;

use App\Models\Jobfair;
use App\Models\User;
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
        $records = 1;

        return [
            'name' => $this->faker->name(),
            'start_date' => $this->faker->dateTimeThisYear('now', null) ,
            'number_of_students' => $records,
            'number_of_companies' => $records,
            'jobfair_admin_id' => User::factory(),
        ];
    }
}
