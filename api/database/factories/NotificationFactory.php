<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => $this->faker->uuid(),
<<<<<<< HEAD
            'type' => 'タスク',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => 1,
            'subjectable_type' => 'App\Models\Task',
            'subjectable_id' => Task::pluck('id')->random(),
=======
            'type' => 'マイルストーン',
            'notifiable_type' => 'App\Models\User',
            'notifiable_id' => User::pluck('id')->random(),
            'subjectable_type' => 'App\Models\Milestone',
            'subjectable_id' => Milestone::pluck('id')->random(),
>>>>>>> update factory
            'data' => $this->faker->randomElement(['登録','削除','編集']),
            'read_at' => $this->faker->randomElement([ null ,now()]),
            'user_id' => 1,
            'updated_at' => now(),
            'created_at' => now(),
        ];
    }
}
