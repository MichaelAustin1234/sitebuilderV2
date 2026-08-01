<?php

namespace Tests\Feature;

use App\Models\Template;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TokoPublishAndCustomizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Toko $toko;
    protected Template $template;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->template = Template::factory()->create(['nama' => 'Selera Rempah']);
        $this->toko = Toko::factory()->create([
            'user_id' => $this->user->id,
            'template_id' => $this->template->id,
            'nama_toko' => 'Warung Sambal Bu Nani',
            'slug' => 'warung-sambal-bu-nani',
            'status' => 'draft',
        ]);
    }

    public function test_can_list_all_available_templates(): void
    {
        Template::factory()->count(3)->create();

        $response = $this->getJson('/api/templates');

        $response->assertStatus(200)
            ->assertJsonStructure(['templates']);
    }

    public function test_user_can_select_template_for_toko(): void
    {
        Sanctum::actingAs($this->user);

        $newTemplate = Template::factory()->create(['nama' => 'Wastra Atelier']);

        $response = $this->postJson("/api/toko/{$this->toko->id}/select-template", [
            'template_id' => $newTemplate->id,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('toko.template_id', $newTemplate->id);

        $this->assertDatabaseHas('toko', [
            'id' => $this->toko->id,
            'template_id' => $newTemplate->id,
        ]);
    }

    public function test_user_can_update_toko_customization(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/toko/{$this->toko->id}/customization", [
            'nama_toko' => 'Warung Sambal Mantap',
            'slug' => 'warung-sambal-mantap',
            'warna_aksen' => '#E69500',
            'hero_title' => 'Resep Sambal Warisan',
            'about_us' => 'Sambal botolan berkualitas tinggi.',
            'whatsapp' => '081234567890',
            'alamat' => 'Jl. Malioboro No. 45',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('toko.nama_toko', 'Warung Sambal Mantap')
            ->assertJsonPath('toko.slug', 'warung-sambal-mantap')
            ->assertJsonPath('toko.konfigurasi_layout.warna_aksen', '#E69500')
            ->assertJsonPath('toko.konfigurasi_layout.teks_kustom.hero_title', 'Resep Sambal Warisan');
    }

    public function test_customization_fails_when_slug_is_duplicate(): void
    {
        Sanctum::actingAs($this->user);

        Toko::factory()->create(['slug' => 'slug-sudah-ada']);

        $response = $this->postJson("/api/toko/{$this->toko->id}/customization", [
            'slug' => 'slug-sudah-ada',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_user_can_upload_logo_and_banner(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->user);

        $logo = UploadedFile::fake()->create('logo.jpg', 100, 'image/jpeg');
        $banner = UploadedFile::fake()->create('banner.png', 200, 'image/png');

        $response = $this->postJson("/api/toko/{$this->toko->id}/customization", [
            'logo' => $logo,
            'banner' => $banner,
        ]);

        $response->assertStatus(200);

        $tokoRefreshed = $this->toko->fresh();
        $this->assertNotNull($tokoRefreshed->konfigurasi_layout['logo_path']);
        $this->assertNotNull($tokoRefreshed->konfigurasi_layout['banner_path']);

        Storage::disk('public')->assertExists($tokoRefreshed->konfigurasi_layout['logo_path']);
        Storage::disk('public')->assertExists($tokoRefreshed->konfigurasi_layout['banner_path']);
    }

    public function test_upload_fails_when_file_size_exceeds_2mb(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->user);

        $largeLogo = UploadedFile::fake()->create('huge_logo.jpg', 2500, 'image/jpeg');

        $response = $this->postJson("/api/toko/{$this->toko->id}/customization", [
            'logo' => $largeLogo,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['logo']);
    }

    public function test_user_can_publish_toko(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/toko/{$this->toko->id}/publish");

        $response->assertStatus(200)
            ->assertJsonPath('toko.status', 'published');

        $this->assertDatabaseHas('toko', [
            'id' => $this->toko->id,
            'status' => 'published',
        ]);
    }

    public function test_public_store_access_flow(): void
    {
        // 1. Toko Draft tanpa preview parameter -> 403
        $responseDraft = $this->getJson("/api/public/toko/{$this->toko->slug}");
        $responseDraft->assertStatus(403)
            ->assertJsonPath('status', 'draft');

        // 2. Toko Draft dengan preview parameter -> 200
        $responsePreview = $this->getJson("/api/public/toko/{$this->toko->slug}?preview=true");
        $responsePreview->assertStatus(200)
            ->assertJsonPath('toko.slug', $this->toko->slug);

        // 3. Publish toko & akses publik tanpa preview parameter -> 200
        Sanctum::actingAs($this->user);
        $this->postJson("/api/toko/{$this->toko->id}/publish");

        $responsePublished = $this->getJson("/api/public/toko/{$this->toko->slug}");
        $responsePublished->assertStatus(200)
            ->assertJsonPath('toko.status', 'published');

        // 4. Slug tidak ada -> 404
        $responseNotFound = $this->getJson("/api/public/toko/toko-tidak-ada-12345");
        $responseNotFound->assertStatus(404);
    }
}
