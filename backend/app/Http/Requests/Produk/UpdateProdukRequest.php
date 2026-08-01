<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        $toko = $this->route('toko');
        return $toko && $toko->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        $toko = $this->route('toko');

        return [
            'nama' => ['required', 'string', 'min:3', 'max:100'],
            'harga' => ['required', 'numeric', 'gt:0'],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'kategori_id' => [
                'nullable',
                Rule::exists('kategori', 'id')->where('toko_id', $toko?->id),
            ],
            'foto' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'hapus_foto' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama produk wajib diisi.',
            'nama.min' => 'Nama produk minimal 3 karakter.',
            'nama.max' => 'Nama produk maksimal 100 karakter.',
            'harga.required' => 'Harga produk wajib diisi.',
            'harga.numeric' => 'Harga produk harus berupa angka.',
            'harga.gt' => 'Harga produk harus lebih dari 0.',
            'deskripsi.max' => 'Deskripsi produk maksimal 500 karakter.',
            'kategori_id.exists' => 'Kategori yang dipilih tidak valid untuk toko ini.',
            'foto.image' => 'File yang diunggah harus berupa gambar (JPG/PNG/WEBP).',
            'foto.mimes' => 'Format tidak didukung, gunakan JPG, PNG, atau WEBP.',
            'foto.max' => 'Ukuran file melebihi 2MB.',
        ];
    }
}
