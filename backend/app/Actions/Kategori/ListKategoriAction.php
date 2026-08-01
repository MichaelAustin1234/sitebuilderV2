<?php

namespace App\Actions\Kategori;

use App\Models\Toko;
use Illuminate\Database\Eloquent\Collection;

class ListKategoriAction
{
    public function execute(Toko $toko): Collection
    {
        return $toko->kategoris()->orderBy('nama', 'asc')->get();
    }
}
