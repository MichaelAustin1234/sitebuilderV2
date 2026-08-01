<?php

namespace App\Actions\Produk;

use App\Models\Produk;
use Illuminate\Support\Facades\Storage;

class DeleteProdukAction
{
    public function execute(Produk $produk): void
    {
        if ($produk->foto_path) {
            Storage::disk('public')->delete($produk->foto_path);
        }

        $produk->delete();
    }
}
