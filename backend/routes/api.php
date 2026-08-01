<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\PublicStoreController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\TokoController;
use Illuminate\Support\Facades\Route;

// Public Store & Templates Routes
Route::get('/public/toko/{slug}', [PublicStoreController::class, 'show']);
Route::get('/templates', [TemplateController::class, 'index']);

// Auth Routes
Route::prefix('auth')->middleware(['throttle:5,1'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::get('/my-toko', [TokoController::class, 'index']);
    Route::post('/toko', [TokoController::class, 'store']);

    Route::prefix('toko/{toko}')->group(function () {
        Route::get('/', [TokoController::class, 'show']);
        Route::post('/customization', [TokoController::class, 'updateCustomization']);
        Route::put('/customization', [TokoController::class, 'updateCustomization']);
        Route::post('/select-template', [TokoController::class, 'selectTemplate']);
        Route::post('/publish', [TokoController::class, 'publish']);
        Route::post('/unpublish', [TokoController::class, 'unpublish']);

        // Kategori Routes
        Route::get('/kategori', [KategoriController::class, 'index']);
        Route::post('/kategori', [KategoriController::class, 'store']);
        Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy']);

        // Produk Routes
        Route::get('/produk', [ProdukController::class, 'index']);
        Route::post('/produk', [ProdukController::class, 'store']);
        Route::get('/produk/{produk}', [ProdukController::class, 'show']);
        Route::post('/produk/{produk}', [ProdukController::class, 'update']);
        Route::put('/produk/{produk}', [ProdukController::class, 'update']);
        Route::delete('/produk/{produk}', [ProdukController::class, 'destroy']);
    });
});
