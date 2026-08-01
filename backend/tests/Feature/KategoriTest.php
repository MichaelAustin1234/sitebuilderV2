<?php

namespace Tests\Feature;

use App\Models\Kategori;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KategoriTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_categories_for_own_toko(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        Kategori::factory()->count(3)->create(['toko_id' => $toko->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/toko/{$toko->id}/kategori");

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_user_can_create_category(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/kategori", [
                'nama' => 'Minuman Dingin',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('kategori.nama', 'Minuman Dingin');

        $this->assertDatabaseHas('kategori', [
            'toko_id' => $toko->id,
            'nama' => 'Minuman Dingin',
        ]);
    }

    public function test_user_can_delete_category(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);
        $kategori = Kategori::factory()->create(['toko_id' => $toko->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/toko/{$toko->id}/kategori/{$kategori->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('kategori', ['id' => $kategori->id]);
    }

    public function test_user_cannot_access_other_users_toko_categories(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $tokoA = Toko::factory()->create(['user_id' => $userA->id]);

        $response = $this->actingAs($userB, 'sanctum')
            ->getJson("/api/toko/{$tokoA->id}/kategori");

        $response->assertStatus(403);
    }

    public function test_validation_fails_for_empty_category_name(): void
    {
        $user = User::factory()->create();
        $toko = Toko::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/toko/{$toko->id}/kategori", [
                'nama' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama']);
    }
}
