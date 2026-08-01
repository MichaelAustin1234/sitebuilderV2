import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import { Toko } from '../../types/produk';

interface StoreCustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  toko: Toko;
  onTokoUpdated: (updatedToko: Toko) => void;
}

const ACCENT_PALETTES = [
  { name: 'Kunyit Gold', hex: '#E69500' },
  { name: 'Champagne Gold', hex: '#D4AF37' },
  { name: 'Sage Olive', hex: '#556B2F' },
  { name: 'Blush Rose', hex: '#E8A598' },
  { name: 'Electric Cyan', hex: '#0EA5E9' },
  { name: 'Panen Hijau', hex: '#15803D' },
  { name: 'Merah Sembako', hex: '#DC2626' },
  { name: 'Neon Cyan', hex: '#06B6D4' },
  { name: 'Terracotta Warm', hex: '#C87D55' },
  { name: 'Expedition Orange', hex: '#EA580C' },
];

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const StoreCustomizerDrawer: React.FC<StoreCustomizerDrawerProps> = ({
  isOpen,
  onClose,
  toko,
  onTokoUpdated,
}) => {
  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const defaultTemplateHex = token.warna_aksen || '#0EA5E9';

  const [namaToko, setNamaToko] = useState(toko.nama_toko || '');
  const [slug, setSlug] = useState(toko.slug || '');
  const [warnaAksen, setWarnaAksen] = useState(layout.warna_aksen || defaultTemplateHex);
  const [heroTitle, setHeroTitle] = useState(layout.teks_kustom?.hero_title || '');
  const [aboutUs, setAboutUs] = useState(layout.teks_kustom?.about_us || '');
  const [whatsapp, setWhatsapp] = useState(layout.kontak?.whatsapp || '');
  const [alamat, setAlamat] = useState(layout.kontak?.alamat || '');
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveCustomization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append('nama_toko', namaToko);
      formData.append('slug', slug);
      formData.append('warna_aksen', warnaAksen);
      formData.append('hero_title', heroTitle);
      formData.append('about_us', aboutUs);
      formData.append('whatsapp', whatsapp);
      formData.append('alamat', alamat);

      if (logoFile) {
        formData.append('logo', logoFile);
      }
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      const res = await apiFetch<{ toko: Toko; message: string }>(`/toko/${toko.id}/customization`, {
        method: 'POST',
        body: formData,
      });

      setSuccessMessage('Kustomisasi toko berhasil disimpan!');
      onTokoUpdated(res.toko);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan kustomisasi.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishStore = async () => {
    setPublishing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await apiFetch<{ toko: Toko; message: string }>(`/toko/${toko.id}/publish`, {
        method: 'POST',
      });
      setSuccessMessage(res.message);
      onTokoUpdated(res.toko);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menerbitkan toko.');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublishStore = async () => {
    setPublishing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await apiFetch<{ toko: Toko; message: string }>(`/toko/${toko.id}/unpublish`, {
        method: 'POST',
      });
      setSuccessMessage(res.message);
      onTokoUpdated(res.toko);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengubah status toko.');
    } finally {
      setPublishing(false);
    }
  };

  const handlePreviewStore = () => {
    window.open(`/toko/${slug}?preview=true`, '_blank');
  };

  const activeLogoUrl = logoFile
    ? URL.createObjectURL(logoFile)
    : getStorageUrl(layout.logo_url || layout.logo_path);

  const activeBannerUrl = bannerFile
    ? URL.createObjectURL(bannerFile)
    : getStorageUrl(layout.banner_url || layout.banner_path);

  return (
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex justify-end z-50 overflow-hidden">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-widest">
                EDITOR KUSTOMISASI TOKO
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  toko.status === 'published'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 text-slate-900'
                }`}
              >
                {toko.status === 'published' ? '● TERBIT (PUBLISHED)' : '○ DRAF (DRAFT)'}
              </span>
            </div>
            <h3 className="text-xl font-bold">{toko.nama_toko}</h3>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full flex items-center justify-center font-bold text-base transition"
          >
            ✕
          </button>
        </div>

        {/* Drawer Action Header (Preview & Publish) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePreviewStore}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-2"
          >
            👁️ PRATINJAU REAL-TIME (PREVIEW)
          </button>

          {toko.status === 'published' ? (
            <button
              onClick={handleUnpublishStore}
              disabled={publishing}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              {publishing ? 'Memproses...' : 'UBAH KE DRAF'}
            </button>
          ) : (
            <button
              onClick={handlePublishStore}
              disabled={publishing}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition tracking-wide"
            >
              {publishing ? 'Menerbitkan...' : '🚀 TERBITKAN TOKO SEKARANG'}
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveCustomization} className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-xl border border-red-200">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold p-4 rounded-xl border border-emerald-200">
              {successMessage}
            </div>
          )}

          {/* Section 1: Identitas Toko & Slug */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              1. Identitas Toko & URL Slug
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Toko *</label>
              <input
                type="text"
                value={namaToko}
                onChange={(e) => setNamaToko(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Slug Toko (Domain Subpath) *
              </label>
              <div className="flex items-center">
                <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs text-slate-500 font-mono rounded-l-lg">
                  /toko/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Hanya huruf kecil, angka, dan tanda strip (-). Mengubah slug toko berstatus terbit akan mengubah URL publik toko Anda.
              </p>
            </div>
          </div>

          {/* Section 2: Skema Warna Aksen */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              2. Skema Warna Aksen Toko
            </h4>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700">
                  Pilih Palette Warna Harmonis
                </label>
                <button
                  type="button"
                  onClick={() => setWarnaAksen(defaultTemplateHex)}
                  className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 underline font-mono flex items-center gap-1"
                >
                  ↺ Reset ke Warna Default
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {/* 1. Default Option Card */}
                <button
                  type="button"
                  onClick={() => setWarnaAksen(defaultTemplateHex)}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 col-span-1 relative ${
                    warnaAksen.toLowerCase() === defaultTemplateHex.toLowerCase()
                      ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-600/20 font-bold'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <span className="text-[7px] font-extrabold uppercase px-1 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono tracking-tighter">
                    DEFAULT
                  </span>
                  <span
                    className="h-5 w-5 rounded-full border border-slate-300 shadow-xs"
                    style={{ backgroundColor: defaultTemplateHex }}
                  ></span>
                  <span className="text-[9px] font-mono text-slate-700 truncate w-full">
                    {defaultTemplateHex}
                  </span>
                </button>

                {/* Other Palettes */}
                {ACCENT_PALETTES.filter((p) => p.hex.toLowerCase() !== defaultTemplateHex.toLowerCase()).map((pal) => (
                  <button
                    key={pal.hex}
                    type="button"
                    onClick={() => setWarnaAksen(pal.hex)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      warnaAksen.toLowerCase() === pal.hex.toLowerCase()
                        ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-600/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-slate-300 shadow-xs mt-1"
                      style={{ backgroundColor: pal.hex }}
                    ></span>
                    <span className="text-[9px] font-mono text-slate-700 truncate w-full">
                      {pal.hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Upload Asset Logo & Banner */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              3. Asset Visual (Logo & Banner)
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Logo Toko (JPG, PNG, WEBP, Max 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {activeLogoUrl && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <img src={activeLogoUrl} alt="Logo Toko" className="h-12 w-12 object-cover rounded-lg border border-slate-300 shadow-xs" />
                  <span className="text-[11px] text-slate-600 font-medium">Pratinjau Logo Toko</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Banner Toko (JPG, PNG, WEBP, Max 2MB)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {activeBannerUrl && (
                <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <img src={activeBannerUrl} alt="Banner Toko" className="h-24 w-full object-cover rounded-lg border border-slate-300 shadow-xs" />
                  <span className="text-[11px] text-slate-600 font-medium block mt-1">Pratinjau Banner Toko</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Teks Kustom & Kontak */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-2">
              4. Teks Kustom Hero & Kontak
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Slogan / Judul Hero</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Misal: Cita Rasa Resep Sambal Warisan..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi / Tentang Kami (Maks 500 Karakter)
              </label>
              <textarea
                rows={3}
                value={aboutUs}
                onChange={(e) => setAboutUs(e.target.value)}
                placeholder="Ceritakan keunikan produk dan usaha Anda..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp Toko</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Toko / Kota</label>
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Yogyakarta"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              {saving ? 'Menyimpan Kustomisasi...' : 'SIMPAN PERUBAHAN KUSTOMISASI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
