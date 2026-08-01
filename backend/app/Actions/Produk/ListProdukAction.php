<?php

namespace App\Actions\Produk;

use App\Models\Toko;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListProdukAction
{
    public function execute(Toko $toko, ?int $kategoriId = null, ?string $search = null, int $perPage = 12): LengthAwarePaginator
    {
        $query = $toko->produks()->with('kategori');

        if ($kategoriId) {
            $query->where('kategori_id', $kategoriId);
        }

        if ($search) {
            $query->where('nama', 'like', '%' . trim($search) . '%');
        }

        return $query->latest()->paginate($perPage);
    }
}
