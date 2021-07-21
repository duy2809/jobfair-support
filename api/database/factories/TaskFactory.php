<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Task::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'start_time' => $this->faker->date(),
            'end_time' => $this->faker->date(),
            'number_of_member' => $this->faker->numberBetween(1, 10),
            'status' => $this->faker->randomElement(['未着手', '進行中', '完了', '中断', '未完了']),
            'remind_member' => $this->faker->boolean(),
            'description_of_detail' => $this->faker->text(),
            'relation_task_id' => $this->faker->numberBetween(1, 10),
            'milestone_id' => Milestone::factory(),
            'user_id' => 1,
        ];
    }
}
