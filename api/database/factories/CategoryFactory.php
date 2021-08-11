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
            'category_name' => $this->faker->name(),
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 3953a14f6b75df6f204f07170c62433396037a4c
=======
>>>>>>> dbe558e882a3fd0524591086e0c59c081abaa7ad
>>>>>>> framgia-develop
>>>>>>> 0f21d90c88a79a75041b61158f6284e73a35a612
        ];
    }
}
