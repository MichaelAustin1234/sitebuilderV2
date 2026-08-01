<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KategoriResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'toko_id' => $this->toko_id,
            'nama' => $this->nama,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
