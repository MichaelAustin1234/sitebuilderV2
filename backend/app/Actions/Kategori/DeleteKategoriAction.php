<?php

namespace App\Actions\Kategori;

use App\Models\Kategori;

class DeleteKategoriAction
{
    public function execute(Kategori $kategori): void
    {
        $kategori->delete();
    }
}
