<?php

namespace Database\Factories;

use App\Models\CrmNote;
use App\Models\CrmLead;
use Illuminate\Database\Eloquent\Factories\Factory;

class CrmNoteFactory extends Factory
{
    protected $model = CrmNote::class;

    public function definition()
    {
        return [
            'crm_lead_id' => CrmLead::factory(),
            'content' => $this->faker->paragraph(),
        ];
    }
}

