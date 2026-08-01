<?php

namespace App\Http\Controllers\Api;

use App\Actions\Toko\CreateTokoAction;
use App\Actions\Toko\PublishTokoAction;
use App\Actions\Toko\UpdateTokoCustomizationAction;
use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Models\Toko;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $tokos = $request->user()->tokos()->with('template')->get();

        return response()->json([
            'tokos' => $tokos,
        ]);
    }

    public function store(Request $request, CreateTokoAction $action): JsonResponse
    {
        $validated = $request->validate([
            'nama_toko' => 'required|string|min:3|max:50',
        ]);

        $toko = $action->execute($request->user(), $validated);

        return response()->json([
            'message' => 'Toko baru berhasil dibuat!',
            'toko' => $toko,
        ], 201);
    }

    public function show(Request $request, Toko $toko): JsonResponse
    {
        $this->authorizeOwner($request, $toko);

        $toko->load(['template', 'kategoris', 'produks']);

        return response()->json([
            'toko' => $toko,
        ]);
    }

    public function updateCustomization(
        Request $request,
        Toko $toko,
        UpdateTokoCustomizationAction $action
    ): JsonResponse {
        $this->authorizeOwner($request, $toko);

        $updatedToko = $action->execute($request, $toko);
        $updatedToko->load('template');

        return response()->json([
            'message' => 'Kustomisasi toko berhasil diperbarui.',
            'toko' => $updatedToko,
        ]);
    }

    public function selectTemplate(Request $request, Toko $toko): JsonResponse
    {
        $this->authorizeOwner($request, $toko);

        $validated = $request->validate([
            'template_id' => 'required|exists:template,id',
        ]);

        $toko->template_id = $validated['template_id'];
        $toko->save();
        $toko->load('template');

        return response()->json([
            'message' => 'Template toko berhasil diperbarui.',
            'toko' => $toko,
        ]);
    }

    public function publish(Request $request, Toko $toko, PublishTokoAction $action): JsonResponse
    {
        $this->authorizeOwner($request, $toko);

        $publishedToko = $action->execute($toko);
        $publishedToko->load('template');

        return response()->json([
            'message' => 'Toko berhasil diterbitkan! Toko Anda sekarang dapat diakses secara publik.',
            'toko' => $publishedToko,
        ]);
    }

    public function unpublish(Request $request, Toko $toko): JsonResponse
    {
        $this->authorizeOwner($request, $toko);

        $toko->status = 'draft';
        $toko->save();
        $toko->load('template');

        return response()->json([
            'message' => 'Toko diubah kembali menjadi draf.',
            'toko' => $toko,
        ]);
    }

    private function authorizeOwner(Request $request, Toko $toko): void
    {
        if ($toko->user_id !== $request->user()->id) {
            abort(403, 'Anda tidak memiliki akses ke toko ini.');
        }
    }
}
