<?php

namespace App\Http\Controllers\Api;

use App\Actions\Produk\CreateProdukAction;
use App\Actions\Produk\DeleteProdukAction;
use App\Actions\Produk\ListProdukAction;
use App\Actions\Produk\UpdateProdukAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Produk\StoreProdukRequest;
use App\Http\Requests\Produk\UpdateProdukRequest;
use App\Http\Resources\ProdukResource;
use App\Models\Produk;
use App\Models\Toko;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProdukController extends Controller
{
    public function index(Request $request, Toko $toko, ListProdukAction $action): AnonymousResourceCollection
    {
        if ($toko->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke toko ini.');
        }

        $kategoriId = $request->query('kategori_id') ? (int) $request->query('kategori_id') : null;
        $search = $request->query('search') ? (string) $request->query('search') : null;
        $perPage = $request->query('per_page') ? (int) $request->query('per_page') : 12;

        $paginatedProduk = $action->execute($toko, $kategoriId, $search, $perPage);

        return ProdukResource::collection($paginatedProduk);
    }

    public function store(StoreProdukRequest $request, Toko $toko, CreateProdukAction $action): JsonResponse
    {
        $produk = $action->execute($toko, $request->validated());

        return response()->json([
            'message' => 'Produk berhasil ditambahkan.',
            'produk' => new ProdukResource($produk),
        ], 201);
    }

    public function show(Request $request, Toko $toko, Produk $produk): JsonResponse
    {
        if ($toko->user_id !== $request->user()->id || $produk->toko_id !== $toko->id) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        return response()->json([
            'produk' => new ProdukResource($produk->load('kategori')),
        ]);
    }

    public function update(UpdateProdukRequest $request, Toko $toko, Produk $produk, UpdateProdukAction $action): JsonResponse
    {
        if ($toko->user_id !== $request->user()->id || $produk->toko_id !== $toko->id) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $updatedProduk = $action->execute($produk, $request->validated());

        return response()->json([
            'message' => 'Produk berhasil diperbarui.',
            'produk' => new ProdukResource($updatedProduk),
        ]);
    }

    public function destroy(Request $request, Toko $toko, Produk $produk, DeleteProdukAction $action): JsonResponse
    {
        if ($toko->user_id !== $request->user()->id || $produk->toko_id !== $toko->id) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $action->execute($produk);

        return response()->json([
            'message' => 'Produk berhasil dihapus.',
        ]);
    }
}
