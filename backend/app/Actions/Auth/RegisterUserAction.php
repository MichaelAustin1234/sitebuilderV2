<?php

namespace App\Actions\Auth;

use App\Actions\Toko\CreateTokoAction;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(private CreateTokoAction $createTokoAction)
    {
    }

    /**
     * @param array{name: string, email: string, password: string, nama_toko?: string|null} $data
     * @return array{user: User, token: string}
     */
    public function execute(array $data): array
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower(trim($data['email'])),
            'password' => Hash::make($data['password']),
        ]);

        // Auto create first store if nama_toko provided
        if (!empty($data['nama_toko'])) {
            $this->createTokoAction->execute($user, [
                'nama_toko' => $data['nama_toko'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }
}
