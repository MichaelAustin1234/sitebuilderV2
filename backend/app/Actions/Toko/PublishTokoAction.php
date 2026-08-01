<?php

namespace App\Actions\Toko;

use App\Models\Toko;

class PublishTokoAction
{
    public function execute(Toko $toko): Toko
    {
        $toko->status = 'published';
        $toko->save();

        return $toko;
    }
}
