<?php

namespace Database\Factories;

use App\Models\ServicePack;
use Illuminate\Database\Eloquent\Factories\Factory;

class ServicePackFactory extends Factory
{
    protected $model = ServicePack::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 500),
        ];
    }
}
