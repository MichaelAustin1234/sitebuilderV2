<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Toko extends Model
{
    use HasFactory;

    protected $table = 'toko';

    protected $fillable = [
        'user_id',
        'template_id',
        'nama_toko',
        'slug',
        'status',
        'konfigurasi_layout',
    ];

    protected $casts = [
        'konfigurasi_layout' => 'array',
    ];

    public function getKonfigurasiLayoutAttribute($value): array
    {
        $config = is_string($value) ? json_decode($value, true) : ($value ?? []);
        if (is_array($config)) {
            if (!empty($config['logo_path']) && empty($config['logo_url'])) {
                $config['logo_url'] = asset('storage/' . $config['logo_path']);
            }
            if (!empty($config['banner_path']) && empty($config['banner_url'])) {
                $config['banner_url'] = asset('storage/' . $config['banner_path']);
            }
        } else {
            $config = [];
        }

        return $config;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'template_id');
    }

    public function kategoris(): HasMany
    {
        return $this->hasMany(Kategori::class, 'toko_id');
    }

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'toko_id');
    }
}
