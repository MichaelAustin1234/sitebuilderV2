<?php

namespace Database\Factories;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Toko;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProdukFactory extends Factory
{
    protected $model = Produk::class;

    public function definition(): array
    {
        return [
            'toko_id' => Toko::factory(),
            'kategori_id' => Kategori::factory(),
            'nama' => $this->faker->words(3, true),
            'harga' => $this->faker->numberBetween(15000, 350000),
            'deskripsi' => $this->faker->paragraph(2),
            'foto_path' => null,
        ];
    }
}
