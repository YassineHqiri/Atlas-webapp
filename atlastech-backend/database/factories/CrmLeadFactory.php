<?php

namespace Database\Factories;

use App\Models\CrmLead;
use Illuminate\Database\Eloquent\Factories\Factory;

class CrmLeadFactory extends Factory
{
    protected $model = CrmLead::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'company' => $this->faker->company(),
            'status' => 'new',
        ];
    }
}
