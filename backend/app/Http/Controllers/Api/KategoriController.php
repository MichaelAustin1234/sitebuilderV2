<?php

namespace App\Http\Controllers\Api;

use App\Actions\Kategori\CreateKategoriAction;
use App\Actions\Kategori\DeleteKategoriAction;
use App\Actions\Kategori\ListKategoriAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Kategori\StoreKategoriRequest;
use App\Http\Resources\KategoriResource;
use App\Models\Kategori;
use App\Models\Toko;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class KategoriController extends Controller
{
    public function index(Request $request, Toko $toko, ListKategoriAction $action): AnonymousResourceCollection
    {
        if ($toko->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke toko ini.');
        }

        $kategoriList = $action->execute($toko);

        return KategoriResource::collection($kategoriList);
    }

    public function store(StoreKategoriRequest $request, Toko $toko, CreateKategoriAction $action): JsonResponse
    {
        $kategori = $action->execute($toko, $request->validated());

        return response()->json([
            'message' => 'Kategori berhasil ditambahkan.',
            'kategori' => new KategoriResource($kategori),
        ], 201);
    }

    public function destroy(Request $request, Toko $toko, Kategori $kategori, DeleteKategoriAction $action): JsonResponse
    {
        if ($toko->user_id !== $request->user()->id || $kategori->toko_id !== $toko->id) {
            abort(403, 'Aksi tidak diizinkan.');
        }

        $action->execute($kategori);

        return response()->json([
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
