<?php

namespace Tests\Feature;

use App\Models\Template;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateTokoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Template::factory()->create(['nama' => 'Selera Rempah']);
    }

    public function test_authenticated_user_can_create_new_toko(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/toko', [
            'nama_toko' => 'Warung Bebek Mikel',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('toko.nama_toko', 'Warung Bebek Mikel')
            ->assertJsonPath('toko.slug', 'warung-bebek-mikel')
            ->assertJsonPath('toko.status', 'draft');

        $this->assertDatabaseHas('toko', [
            'user_id' => $user->id,
            'nama_toko' => 'Warung Bebek Mikel',
            'slug' => 'warung-bebek-mikel',
        ]);
    }

    public function test_create_toko_fails_when_slug_collides(): void
    {
        $existingUser = User::factory()->create();
        Toko::factory()->create([
            'user_id' => $existingUser->id,
            'slug' => 'warung-bebek-mikel',
        ]);

        $newUser = User::factory()->create();
        Sanctum::actingAs($newUser);

        $response = $this->postJson('/api/toko', [
            'nama_toko' => 'Warung Bebek Mikel',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['nama_toko']);
    }

    public function test_registration_with_nama_toko_creates_user_and_toko(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Mikel',
            'email' => 'mikel@gmail.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nama_toko' => 'Toko Kelontong Mikel',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', ['email' => 'mikel@gmail.com']);
        $this->assertDatabaseHas('toko', [
            'nama_toko' => 'Toko Kelontong Mikel',
            'slug' => 'toko-kelontong-mikel',
        ]);
    }
}
