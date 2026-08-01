<?php

namespace App\Http\Requests\Kategori;

use Illuminate\Foundation\Http\FormRequest;

class StoreKategoriRequest extends FormRequest
{
    public function authorize(): bool
    {
        $toko = $this->route('toko');
        return $toko && $toko->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'min:2', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required' => 'Nama kategori wajib diisi.',
            'nama.min' => 'Nama kategori minimal 2 karakter.',
            'nama.max' => 'Nama kategori maksimal 50 karakter.',
        ];
    }
}
