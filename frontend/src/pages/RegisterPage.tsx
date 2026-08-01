import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError, apiFetch } from '../services/api';
import { AuthResponse } from '../types/auth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [namaToko, setNamaToko] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setFieldErrors({
        password_confirmation: ['Konfirmasi kata sandi tidak cocok.'],
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          nama_toko: namaToko.trim() ? namaToko.trim() : undefined,
        }),
      });

      login(response);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setGeneralError('Terlalu banyak percobaan registrasi. Harap tunggu 1 menit.');
        } else {
          setGeneralError(err.message);
          if (err.errors) {
            setFieldErrors(err.errors);
          }
        }
      } else {
        setGeneralError('Gagal terhubung ke server. Pastikan server backend berjalan.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#1E2923] flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto w-full flex justify-between items-center py-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 bg-[#047857] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#047857]/20 group-hover:scale-105 transition">
            U
          </div>
          <span className="text-base font-extrabold text-[#1E2923] tracking-tight">
            UMKM<span className="text-[#047857]">Sitebuilder</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-bold text-stone-600 hover:text-[#047857] transition flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-stone-200/60"
          >
            ← Kembali ke Beranda
          </Link>
          <Link
            to="/login"
            className="text-xs font-bold text-stone-700 hover:text-[#047857] bg-white border border-stone-200 px-4 py-2 rounded-xl transition shadow-xs"
          >
            Masuk Akun →
          </Link>
        </div>
      </header>

      {/* Main Form Card */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/50">
          {/* Header text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2923] tracking-tight">
              Mulai Buat Toko Online
            </h1>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed max-w-md mx-auto">
              Daftar akun gratis dan buat website toko instan Anda lengkap dengan galeri 10 template berkarakter.
            </p>
          </div>

          {generalError && (
            <div
              id="register-error-alert"
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium shadow-xs"
            >
              ⚠️ {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="name-input"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  Nama Pemilik *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                    👤
                  </span>
                  <input
                    id="name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Prasetyo"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.name[0]}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="register-email-input"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  Alamat Email *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                    ✉️
                  </span>
                  <input
                    id="register-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@toko.com"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.email[0]}</p>
                )}
              </div>
            </div>

            {/* Optional Store Name */}
            <div>
              <label
                htmlFor="nama-toko-input"
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5"
              >
                Nama Toko Pertama <span className="text-[#047857] font-normal lowercase">(opsional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                  🏪
                </span>
                <input
                  id="nama-toko-input"
                  type="text"
                  value={namaToko}
                  onChange={(e) => setNamaToko(e.target.value)}
                  placeholder="Misal: Dapur Sambal Bu Nani"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                Jika diisi, toko pertama Anda akan langsung dibuatkan otomatis saat mendaftar.
              </p>
              {fieldErrors.nama_toko && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.nama_toko[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label
                  htmlFor="register-password-input"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  Kata Sandi *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                    🔒
                  </span>
                  <input
                    id="register-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password[0]}</p>
                )}
              </div>

              {/* Password Confirmation */}
              <div>
                <label
                  htmlFor="password-confirmation-input"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5"
                >
                  Ulangi Kata Sandi *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                    🔒
                  </span>
                  <input
                    id="password-confirmation-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                  />
                </div>
                {fieldErrors.password_confirmation && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {fieldErrors.password_confirmation[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-stone-300 bg-stone-50 text-[#047857] focus:ring-[#047857]"
                />
                Tampilkan kata sandi
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="register-submit-button"
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-[#047857]/20 disabled:opacity-50 mt-2"
            >
              {submitting ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru Sekarang'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-stone-600">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="font-bold text-[#047857] hover:underline">
              Masuk di Sini
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-stone-500 py-2">
        © 2026 UMKM Sitebuilder • Platform No-Code Website Toko Online Multi-Tenant
      </footer>
    </div>
  );
};
