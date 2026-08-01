<?php

namespace App\Actions\Toko;

use App\Models\Toko;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateTokoCustomizationAction
{
    public function execute(Request $request, Toko $toko): Toko
    {
        $validated = $request->validate([
            'nama_toko' => 'sometimes|required|string|min:3|max:50',
            'slug' => [
                'sometimes',
                'required',
                'string',
                'min:3',
                'max:60',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('toko', 'slug')->ignore($toko->id),
            ],
            'warna_aksen' => 'nullable|string|regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/',
            'hero_title' => 'nullable|string|max:150',
            'about_us' => 'nullable|string|max:500',
            'whatsapp' => 'nullable|string|max:30',
            'alamat' => 'nullable|string|max:255',
            'logo' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
            'banner' => 'nullable|file|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        if (isset($validated['nama_toko'])) {
            $toko->nama_toko = $validated['nama_toko'];
        }

        if (isset($validated['slug'])) {
            $toko->slug = Str::slug($validated['slug']);
        }

        $currentConfig = $toko->konfigurasi_layout ?? [];

        if (isset($validated['warna_aksen'])) {
            $currentConfig['warna_aksen'] = $validated['warna_aksen'];
        }

        $teksKustom = $currentConfig['teks_kustom'] ?? [];
        if (isset($validated['hero_title'])) {
            $teksKustom['hero_title'] = $validated['hero_title'];
        }
        if (isset($validated['about_us'])) {
            $teksKustom['about_us'] = $validated['about_us'];
        }
        $currentConfig['teks_kustom'] = $teksKustom;

        $kontak = $currentConfig['kontak'] ?? [];
        if (isset($validated['whatsapp'])) {
            $kontak['whatsapp'] = $validated['whatsapp'];
        }
        if (isset($validated['alamat'])) {
            $kontak['alamat'] = $validated['alamat'];
        }
        $currentConfig['kontak'] = $kontak;

        // File uploads for logo
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('toko_assets', 'public');
            $currentConfig['logo_path'] = $logoPath;
            $currentConfig['logo_url'] = asset('storage/' . $logoPath);
        }

        // File uploads for banner
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('toko_assets', 'public');
            $currentConfig['banner_path'] = $bannerPath;
            $currentConfig['banner_url'] = asset('storage/' . $bannerPath);
        }

        $toko->konfigurasi_layout = $currentConfig;
        $toko->save();

        return $toko;
    }
}
