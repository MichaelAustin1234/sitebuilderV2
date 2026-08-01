<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    protected $table = 'template';

    protected $fillable = [
        'nama',
        'deskripsi',
        'thumbnail_path',
        'token_desain',
    ];

    protected $casts = [
        'token_desain' => 'array',
    ];

    public function tokos(): HasMany
    {
        return $this->hasMany(Toko::class, 'template_id');
    }
}
