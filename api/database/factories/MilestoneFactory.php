<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class MilestoneFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Milestone::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'schedule_id' => Schedule::factory(),
            'is_week' => $this->faker->boolean(),
            'period' => $this->faker->numberBetween(1, 50),
        ];
    }
}
