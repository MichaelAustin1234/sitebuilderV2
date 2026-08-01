<?php

namespace Database\Factories;

use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateFactory extends Factory
{
    protected $model = Template::class;

    public function definition(): array
    {
        return [
            'nama' => $this->faker->words(2, true),
            'deskripsi' => $this->faker->sentence(),
            'thumbnail_path' => null,
            'token_desain' => [
                'warna_primer' => '#D97757',
                'warna_sekunder' => '#F4F1EA',
                'font_heading' => 'Playfair Display',
                'font_body' => 'Plus Jakarta Sans',
                'signature_element' => 'Organic badge',
            ],
        ];
    }
}
