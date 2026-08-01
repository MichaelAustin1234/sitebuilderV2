<?php

namespace App\Actions\Kategori;

use App\Models\Kategori;
use App\Models\Toko;

class CreateKategoriAction
{
    /**
     * @param Toko $toko
     * @param array{nama: string} $data
     * @return Kategori
     */
    public function execute(Toko $toko, array $data): Kategori
    {
        return $toko->kategoris()->create([
            'nama' => trim($data['nama']),
        ]);
    }
}
