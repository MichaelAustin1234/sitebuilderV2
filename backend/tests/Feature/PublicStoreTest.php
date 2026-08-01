<?php

namespace Tests\Feature;

use App\Models\Produk;
use App\Models\Toko;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_access_published_store_by_slug(): void
    {
        $toko = Toko::factory()->create([
            'nama_toko' => 'Warung Bebek Goreng',
            'slug' => 'warung-bebek-goreng',
            'status' => 'published',
        ]);

        Produk::factory()->count(3)->create(['toko_id' => $toko->id]);

        $response = $this->getJson('/api/public/toko/warung-bebek-goreng');

        $response->assertStatus(200)
            ->assertJsonPath('toko.nama_toko', 'Warung Bebek Goreng')
            ->assertJsonCount(3, 'toko.produks');
    }

    public function test_public_user_cannot_access_draft_store_without_preview(): void
    {
        $toko = Toko::factory()->create([
            'slug' => 'toko-draft',
            'status' => 'draft',
        ]);

        $response = $this->getJson('/api/public/toko/toko-draft');

        $response->assertStatus(403)
            ->assertJsonPath('status', 'draft');
    }

    public function test_public_user_gets_404_for_non_existent_store_slug(): void
    {
        $response = $this->getJson('/api/public/toko/toko-gaib');

        $response->assertStatus(404);
    }
}
