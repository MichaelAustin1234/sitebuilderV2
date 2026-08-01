<?php

namespace Database\Factories;

use App\Models\Template;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TokoFactory extends Factory
{
    protected $model = Toko::class;

    public function definition(): array
    {
        $namaToko = $this->faker->company();

        return [
            'user_id' => User::factory(),
            'template_id' => Template::factory(),
            'nama_toko' => substr($namaToko, 0, 50),
            'slug' => Str::slug($namaToko),
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#D97757',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Selamat Datang di Toko Kami',
                    'about_us' => 'Kami menyediakan produk-produk berkualitas tinggi.',
                ],
                'kontak' => [
                    'whatsapp' => '081234567890',
                    'alamat' => 'Jl. Merdeka No. 123, Jakarta',
                ],
            ],
        ];
    }
}
