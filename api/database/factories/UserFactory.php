<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name'             => $this->faker->name(),
            'email'            => $this->faker->unique()->safeEmail(),
            'password'         => Hash::make('12345678'),
            'avatar'           => Str::random(20),
            'role'             => $this->faker->numberBetween(1, 3),
            'number_of_record' => $this->faker->numberBetween(1, 3),
            'chatwork_id'      => Str::random(10),
            'phone_number'     => $this->faker->numberBetween(10000000, 100000000),
            'remember_token'   => null,
            'updated_at'       => now(),
            'created_at'       => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function unverified()
    {
        return $this->state(function (array $attributes) {
            return [
                'email_verified_at' => null,
            ];
        });
    }
}
