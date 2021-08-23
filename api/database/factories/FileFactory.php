<?php

namespace Database\Factories;

use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class FileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Document::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker>unique()->name(),
            'link' => $this->faker->unique()->url,
            'is_file' => $this->faker->boolean(),
            'author' => User::pluck('id')->random(),
        ];
    }
}
