<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KategoriResource;
use App\Http\Resources\ProdukResource;
use App\Models\Toko;
use Illuminate\Http\JsonResponse;

class PublicStoreController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $toko = Toko::where('slug', $slug)
            ->with(['template', 'kategoris'])
            ->first();

        if (!$toko) {
            return response()->json([
                'message' => 'Toko tidak ditemukan atau belum tersedia.',
            ], 404);
        }

        if ($toko->status !== 'published' && !request()->has('preview')) {
            return response()->json([
                'message' => 'Toko ini sedang dalam status draf dan belum diterbitkan.',
                'status' => 'draft',
            ], 403);
        }

        $produks = $toko->produks()->with('kategori')->latest()->get();

        return response()->json([
            'toko' => [
                'id' => $toko->id,
                'nama_toko' => $toko->nama_toko,
                'slug' => $toko->slug,
                'status' => $toko->status,
                'konfigurasi_layout' => $toko->konfigurasi_layout,
                'template' => $toko->template,
                'kategoris' => KategoriResource::collection($toko->kategoris),
                'produks' => ProdukResource::collection($produks),
            ],
        ]);
    }
}
