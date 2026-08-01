<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'UMKM Sitebuilder API Server Live',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::get('/up', function () {
    return response()->json(['status' => 'up']);
});
