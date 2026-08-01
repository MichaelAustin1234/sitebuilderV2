<?php

namespace App\Actions\Toko;

use App\Models\Template;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CreateTokoAction
{
    public function execute(User $user, array $data): Toko
    {
        $namaToko = trim($data['nama_toko']);
        $slug = Str::slug($namaToko);

        // Check if slug already exists
        if (Toko::where('slug', $slug)->exists()) {
            throw ValidationException::withMessages([
                'nama_toko' => ['Nama toko ini menghasilkan slug (' . $slug . ') yang sudah digunakan toko lain. Silakan pilih nama toko yang berbeda.'],
            ]);
        }

        $defaultTemplate = Template::first();

        $toko = Toko::create([
            'user_id' => $user->id,
            'template_id' => $defaultTemplate?->id,
            'nama_toko' => $namaToko,
            'slug' => $slug,
            'status' => 'draft',
            'konfigurasi_layout' => [
                'warna_aksen' => $defaultTemplate->token_desain['warna_aksen'] ?? '#E69500',
                'teks_kustom' => [
                    'hero_title' => 'Selamat Datang di ' . $namaToko,
                    'about_us' => 'Toko online resmi ' . $namaToko . '. Temukan berbagai produk menarik berkualitas kami.',
                ],
                'kontak' => [
                    'whatsapp' => '',
                    'alamat' => '',
                ],
            ],
        ]);

        $toko->load('template');

        return $toko;
    }
}
