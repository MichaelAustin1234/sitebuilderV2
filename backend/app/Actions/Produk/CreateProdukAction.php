<?php

namespace App\Actions\Produk;

use App\Models\Produk;
use App\Models\Toko;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateProdukAction
{
    /**
     * @param Toko $toko
     * @param array{nama: string, harga: float|int, deskripsi?: string|null, kategori_id?: int|null, foto?: UploadedFile|null} $data
     * @return Produk
     */
    public function execute(Toko $toko, array $data): Produk
    {
        $fotoPath = null;

        if (isset($data['foto']) && $data['foto'] instanceof UploadedFile) {
            $fotoPath = $data['foto']->store('produk', 'public');
        }

        return $toko->produks()->create([
            'nama' => trim($data['nama']),
            'harga' => $data['harga'],
            'deskripsi' => isset($data['deskripsi']) ? trim($data['deskripsi']) : null,
            'kategori_id' => $data['kategori_id'] ?? null,
            'foto_path' => $fotoPath,
        ]);
    }
}
