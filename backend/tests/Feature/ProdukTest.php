<?php

namespace Tests\Feature;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProdukTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_paginated_products_for_own_toko(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        Produk::factory()->count(15)->create(['toko_id' => $toko->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/toko/{$toko->id}/produk");

        $response->assertStatus(200)
            ->assertJsonCount(12, 'data')
            ->assertJsonPath('meta.per_page', 12)
            ->assertJsonPath('meta.total', 15);
    }

    public function test_user_can_create_product_with_image_upload_and_auto_alt_text(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $kategori = Kategori::factory()->create(['toko_id' => $toko->id]);

        $file = UploadedFile::fake()->create('produk-1.jpg', 1500, 'image/jpeg');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Sambal Cumi Mantap',
                'harga' => 35000,
                'deskripsi' => 'Sambal gurih pedas khas dapur rumahan.',
                'kategori_id' => $kategori->id,
                'foto' => $file,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('produk.nama', 'Sambal Cumi Mantap')
            ->assertJsonPath('produk.harga', 35000)
            ->assertJsonPath('produk.alt_text', 'Foto produk Sambal Cumi Mantap');

        $produk = Produk::first();
        $this->assertNotNull($produk->foto_path);
        Storage::disk('public')->assertExists($produk->foto_path);
    }

    public function test_user_can_update_product(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $produk = Produk::factory()->create(['toko_id' => $toko->id, 'nama' => 'Produk Lama', 'harga' => 10000]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk/{$produk->id}", [
                'nama' => 'Produk Baru Terupdate',
                'harga' => 25000,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('produk.nama', 'Produk Baru Terupdate')
            ->assertJsonPath('produk.harga', 25000);
    }

    public function test_user_can_delete_product_and_file_is_removed_from_storage(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $file = UploadedFile::fake()->create('foto.jpg', 500, 'image/jpeg');
        $path = $file->store('produk', 'public');

        $produk = Produk::factory()->create([
            'toko_id' => $toko->id,
            'foto_path' => $path,
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/toko/{$toko->id}/produk/{$produk->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('produk', ['id' => $produk->id]);
        Storage::disk('public')->assertMissing($path);
    }

    public function test_validation_fails_when_price_is_less_than_or_equal_to_zero(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Produk Gratisan',
                'harga' => 0,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['harga']);
    }

    public function test_validation_fails_when_product_name_is_too_short(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Ab',
                'harga' => 10000,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama']);
    }

    public function test_validation_fails_when_description_exceeds_500_chars(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Kemeja Batik Saja',
                'harga' => 50000,
                'deskripsi' => str_repeat('a', 501),
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['deskripsi']);
    }

    public function test_validation_fails_when_file_upload_exceeds_2mb(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $largeFile = UploadedFile::fake()->create('heavy-image.png', 3000, 'image/png'); // 3MB > 2MB limit

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Kemeja Batik Saja',
                'harga' => 50000,
                'foto' => $largeFile,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['foto']);
    }

    public function test_validation_fails_when_file_format_is_invalid(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $invalidFile = UploadedFile::fake()->create('document.pdf', 500, 'application/pdf');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/produk", [
                'nama' => 'Kemeja Batik Saja',
                'harga' => 50000,
                'foto' => $invalidFile,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['foto']);
    }

    public function test_user_cannot_manage_products_of_other_users_toko(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $tokoA = Toko::factory()->create(['user_id' => $userA->id]);

        $response = $this->actingAs($userB, 'sanctum')
            ->getJson("/api/toko/{$tokoA->id}/produk");

        $response->assertStatus(403);
    }
}
