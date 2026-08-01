import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError, apiFetch } from '../services/api';
import { AuthResponse } from '../types/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(response);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setGeneralError('Terlalu banyak percobaan login. Harap tunggu 1 menit.');
        } else {
          setGeneralError(err.message);
          if (err.errors) {
            setFieldErrors(err.errors);
          }
        }
      } else {
        setGeneralError('Gagal terhubung ke server. Pastikan koneksi server backend aktif.');
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
            to="/register"
            className="text-xs font-bold text-white bg-[#047857] hover:bg-[#065F46] px-4 py-2 rounded-xl transition shadow-xs"
          >
            Daftar Toko Gratis →
          </Link>
        </div>
      </header>

      {/* Main Form Center Card */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/50">
          {/* Header text */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2923] tracking-tight">
              Masuk ke Toko Anda
            </h1>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Kelola toko online, produk, dan kustomisasi desain UMKM Anda dalam satu dashboard.
            </p>
          </div>

          {generalError && (
            <div
              id="login-error-alert"
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium shadow-xs"
            >
              ⚠️ {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-2"
              >
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                  ✉️
                </span>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pemilik@toko.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-[11px] font-mono font-bold uppercase tracking-wider text-stone-600 mb-2"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 pointer-events-none text-sm">
                  🔒
                </span>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#047857] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 text-xs"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition shadow-md shadow-[#047857]/20 disabled:opacity-50 mt-2"
            >
              {submitting ? 'Memproses Login...' : 'Masuk ke Dashboard'}
            </button>
          </form>



          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-stone-600">
            Belum memiliki toko?{' '}
            <Link to="/register" className="font-bold text-[#047857] hover:underline">
              Buat Akun & Toko Baru
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
