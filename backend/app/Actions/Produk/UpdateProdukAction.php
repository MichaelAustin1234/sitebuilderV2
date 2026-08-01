<?php

namespace App\Actions\Produk;

use App\Models\Produk;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateProdukAction
{
    /**
     * @param Produk $produk
     * @param array{nama: string, harga: float|int, deskripsi?: string|null, kategori_id?: int|null, foto?: UploadedFile|null, hapus_foto?: bool} $data
     * @return Produk
     */
    public function execute(Produk $produk, array $data): Produk
    {
        $fotoPath = $produk->foto_path;

        if (!empty($data['hapus_foto']) && $fotoPath) {
            Storage::disk('public')->delete($fotoPath);
            $fotoPath = null;
        }

        if (isset($data['foto']) && $data['foto'] instanceof UploadedFile) {
            if ($fotoPath) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $data['foto']->store('produk', 'public');
        }

        $produk->update([
            'nama' => trim($data['nama']),
            'harga' => $data['harga'],
            'deskripsi' => isset($data['deskripsi']) ? trim($data['deskripsi']) : null,
            'kategori_id' => $data['kategori_id'] ?? null,
            'foto_path' => $fotoPath,
        ]);

        return $produk->fresh(['kategori']);
    }
}
