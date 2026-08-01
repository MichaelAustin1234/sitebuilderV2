import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface SembakoTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartSembakoItem {
  produk: Produk;
  isGrosir: boolean;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const SembakoTemplate: React.FC<SembakoTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [cart, setCart] = useState<CartSembakoItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#DC2626';

  const heroTitle = layout.teks_kustom?.hero_title || 'Grosir & Eceran Sembako Murah Siap Antar Langsung';
  const aboutUs = layout.teks_kustom?.about_us || 'Pusat kebutuhan dapur harian tetangga lengkap: minyak goreng, beras premium, gula, dan bumbu dapur harga grosir.';
  const whatsapp = layout.kontak?.whatsapp || '081299001122';
  const alamat = layout.kontak?.alamat || 'Ciamis, Jawa Barat';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const updateQuantity = (produk: Produk, delta: number, isGrosir = false) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.produk.id === produk.id && item.isGrosir === isGrosir);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prevCart.filter((item) => !(item.produk.id === produk.id && item.isGrosir === isGrosir));
        }
        return prevCart.map((item) =>
          item.produk.id === produk.id && item.isGrosir === isGrosir
            ? { ...item, quantity: newQty }
            : item
        );
      }
      if (delta > 0) {
        return [...prevCart, { produk, isGrosir, quantity: 1 }];
      }
      return prevCart;
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const unitPrice = item.isGrosir ? Math.round(item.produk.harga * 0.9) : item.produk.harga;
    return sum + unitPrice * item.quantity;
  }, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk sembako berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const unitPrice = item.isGrosir ? Math.round(item.produk.harga * 0.9) : item.produk.harga;
      const subtotal = unitPrice * item.quantity;
      const tierLabel = item.isGrosir ? '[Grosir]' : '[Eceran]';
      message += `${index + 1}. *${item.produk.nama}* ${tierLabel} x ${item.quantity} Pcs @ Rp ${unitPrice.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*TOTAL HARGA PESANAN*: Rp ${totalPrice.toLocaleString('id-ID')}\n\nMohon info untuk proses pembayaran dan pengirimannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  const handleDirectWhatsAppChat = () => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk sembako Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-32 relative">
      
      {/* Top Pantry Store Header */}
      <header className="bg-slate-900 text-white py-4 px-6 border-b-4 sticky top-0 z-30 shadow-md" style={{ borderColor: accentColor }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-10 w-10 object-cover rounded-xl border border-slate-700 shadow-xs" />
            ) : (
              <div className="h-10 w-10 text-white font-black text-xl flex items-center justify-center rounded-xl shadow" style={{ backgroundColor: accentColor }}>
                🛒
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold block" style={{ color: accentColor }}>
                PASAR TETANGGA & GROSIR SEMBAKO
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{toko.nama_toko}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="hidden md:inline">📍 {alamat}</span>
            <button
              onClick={handleDirectWhatsAppChat}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
            >
              <span>💬</span>
              <span>Hubungi WhatsApp: {whatsapp}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO BANNER --- */}
      <section className="bg-white border-b border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {bannerUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-48 md:h-60 object-cover" />
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-xs" style={{ backgroundColor: accentColor }}>
                🛒 SEMBAKO DAPUR LENGKAP & HARGA PASAR
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">{heroTitle}</h2>
              <p className="text-xs text-slate-700 font-medium mt-2 max-w-xl leading-relaxed">{aboutUs}</p>
            </div>

            <div className="bg-slate-50 border-2 border-dashed p-4 rounded-2xl text-center shrink-0" style={{ borderColor: accentColor }}>
              <span className="text-[10px] font-mono uppercase font-bold text-slate-700 block">DISKON GROSIR</span>
              <span className="text-2xl font-black font-mono" style={{ color: accentColor }}>HEMAT 10%</span>
              <p className="text-[10px] text-slate-800 font-mono font-bold mt-0.5">Untuk Pembelian &gt;= 5 Pcs</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN PANTRY CHECKLIST TABLE --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-slate-200">
          <button
            onClick={() => setSelectedKategoriId(null)}
            className="px-4 py-2 text-xs font-bold rounded-lg transition"
            style={
              selectedKategoriId === null
                ? { backgroundColor: '#0F172A', color: accentColor }
                : { backgroundColor: '#E2E8F0', color: '#1E293B' }
            }
          >
            Semua Sembako ({toko.produks.length})
          </button>
          {toko.kategoris.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategoriId(kat.id)}
              className="px-4 py-2 text-xs font-bold rounded-lg transition"
              style={
                selectedKategoriId === kat.id
                  ? { backgroundColor: '#0F172A', color: accentColor }
                  : { backgroundColor: '#E2E8F0', color: '#1E293B' }
              }
            >
              {kat.nama}
            </button>
          ))}
        </div>

        {/* High-Density Checklist Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {filteredProduks.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-700 font-semibold">Belum ada sembako dalam kategori ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] font-mono font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Produk Sembako</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Harga Eceran</th>
                    <th className="py-3.5 px-4">Harga Grosir (≥5)</th>
                    <th className="py-3.5 px-4 text-center">Jumlah Beli Direct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {filteredProduks.map((produk) => {
                    const itemEcer = cart.find((item) => item.produk.id === produk.id && !item.isGrosir);
                    const hargaGrosir = Math.round(produk.harga * 0.9);

                    return (
                      <tr key={produk.id} className="hover:bg-slate-50 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {produk.foto_url && (
                              <img
                                src={produk.foto_url}
                                alt={produk.alt_text}
                                onClick={() => setSelectedProdukDetail(produk)}
                                className="h-12 w-12 object-cover rounded-lg border border-slate-200 cursor-pointer"
                              />
                            )}
                            <div>
                              <p
                                onClick={() => setSelectedProdukDetail(produk)}
                                className="font-bold text-slate-900 hover:opacity-80 cursor-pointer transition"
                              >
                                {produk.nama}
                              </p>
                              {produk.deskripsi && (
                                <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5 font-normal">{produk.deskripsi}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-700">
                          <span className="px-2.5 py-1 bg-slate-100 font-mono text-[10px] font-bold rounded text-slate-800 border border-slate-200">
                            {produk.kategori_nama || 'SEMBAKO'}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          Rp {produk.harga.toLocaleString('id-ID')}
                        </td>

                        <td className="py-4 px-4 font-mono font-bold" style={{ color: accentColor }}>
                          Rp {hargaGrosir.toLocaleString('id-ID')}{' '}
                          <span className="text-[9px] bg-red-100 px-1.5 py-0.5 rounded font-mono font-bold" style={{ color: accentColor }}>-10%</span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Counter Button */}
                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-300">
                              <button
                                onClick={() => updateQuantity(produk, -1, false)}
                                className="h-7 w-7 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded flex items-center justify-center text-xs shadow-xs border border-slate-300"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-mono font-bold text-slate-900">
                                {itemEcer?.quantity || 0}
                              </span>
                              <button
                                onClick={() => updateQuantity(produk, 1, false)}
                                className="h-7 w-7 text-white font-bold rounded flex items-center justify-center text-xs shadow-xs"
                                style={{ backgroundColor: accentColor }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- FLOATING DIRECT WHATSAPP BUTTON --- */}
      <button
        onClick={handleDirectWhatsAppChat}
        aria-label="Hubungi WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold">Hubungi WhatsApp</span>
      </button>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t-4 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-white font-mono font-bold rounded-full flex items-center justify-center text-xs shadow" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase font-bold" style={{ color: accentColor }}>TOTAL BELANJA SEMBAKO</p>
                <p className="text-lg font-mono font-bold text-white">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-white text-xs font-bold uppercase rounded-lg shadow transition font-mono"
                style={{ backgroundColor: accentColor }}
              >
                💬 KIRIM ORDER KE WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-900">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-800 font-medium my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-base font-mono font-bold" style={{ color: accentColor }}>
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  updateQuantity(selectedProdukDetail, 1, false);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-white text-xs font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                + Beli 1 Pcs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
