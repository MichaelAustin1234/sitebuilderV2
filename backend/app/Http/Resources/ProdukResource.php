<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProdukResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'toko_id' => $this->toko_id,
            'kategori_id' => $this->kategori_id,
            'kategori_nama' => $this->kategori?->nama,
            'nama' => $this->nama,
            'harga' => (float) $this->harga,
            'deskripsi' => $this->deskripsi,
            'foto_path' => $this->foto_path,
            'foto_url' => $this->foto_path ? asset('storage/' . $this->foto_path) : null,
            'alt_text' => 'Foto produk ' . $this->nama,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
