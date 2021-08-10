<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
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
        return [
<<<<<<< HEAD
            'category_name' => preg_replace('/\s/', '_', $this->faker->unique()->name())
=======
            'category_name' => $this->faker->name(),
>>>>>>> dbe558e882a3fd0524591086e0c59c081abaa7ad
        ];
    }
}
