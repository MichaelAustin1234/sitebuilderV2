<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Toko;
use Illuminate\Database\Eloquent\Factories\Factory;

class KategoriFactory extends Factory
{
    protected $model = Kategori::class;

    public function definition(): array
    {
        return [
            'toko_id' => Toko::factory(),
            'nama' => ucfirst($this->faker->word()),
        ];
    }
}
