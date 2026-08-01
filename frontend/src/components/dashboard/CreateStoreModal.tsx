import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { Toko } from '../../types/produk';

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreCreated: (newToko: Toko) => void;
}

export const CreateStoreModal: React.FC<CreateStoreModalProps> = ({
  isOpen,
  onClose,
  onStoreCreated,
}) => {
  const [namaToko, setNamaToko] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const slugPreview = namaToko
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await apiFetch<{ toko: Toko; message: string }>('/toko', {
        method: 'POST',
        body: JSON.stringify({ nama_toko: namaToko }),
      });

      setNamaToko('');
      onStoreCreated(res.toko);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal membuat toko baru.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
        <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-[#ECFDF5] text-[#047857] rounded-xl flex items-center justify-center text-xl font-bold border border-[#A7F3D0]">
              🏪
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#047857] tracking-wider">
                TOKO ONLINE BARU
              </span>
              <h3 className="text-xl font-bold text-[#1E2923]">Buat Toko UMKM Baru</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Nama Toko Anda *
            </label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={50}
              value={namaToko}
              onChange={(e) => setNamaToko(e.target.value)}
              placeholder="Misal: Dapur Bebek Bu Nani"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-[#047857] focus:bg-white focus:outline-none"
              autoFocus
            />
            <p className="text-[10px] text-stone-500 mt-1">Nama toko wajib 3-50 karakter.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Pratinjau URL Slug Toko:
            </label>
            <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-xs font-mono text-[#047857] font-semibold break-all">
              /toko/{slugPreview || 'nama-toko-anda'}
            </div>
            <p className="text-[10px] text-stone-500 mt-1">
              Slug URL dibuat otomatis dari nama toko. Anda dapat mengeditnya kapan saja sebelum publish.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || namaToko.trim().length < 3}
              className="px-5 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition disabled:opacity-50"
            >
              {submitting ? 'Membuat Toko...' : '🚀 Buat Toko Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
