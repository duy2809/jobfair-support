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
<<<<<<< HEAD
>>>>>>> 3953a14f6b75df6f204f07170c62433396037a4c
=======
>>>>>>> dbe558e882a3fd0524591086e0c59c081abaa7ad
>>>>>>> framgia-develop
        ];
    }
}
