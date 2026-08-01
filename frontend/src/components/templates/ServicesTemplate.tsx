import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface ServicesTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartServiceItem {
  produk: Produk;
  durationHours: number;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const ServicesTemplate: React.FC<ServicesTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [cart, setCart] = useState<CartServiceItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#0EA5E9';

  const heroTitle = layout.teks_kustom?.hero_title || 'Abadikan Momen Berharga dalam Karya Visual Presisi High-Resolution';
  const aboutUs = layout.teks_kustom?.about_us || 'Studio fotografi dan dokumentasi profesional berspesialisasi dalam sesi foto pernikahan, wisuda, dan komersial.';
  const whatsapp = layout.kontak?.whatsapp || '087711223344';
  const alamat = layout.kontak?.alamat || 'Jakarta Selatan';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const addToCart = (produk: Produk, durationHours = 2) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.produk.id === produk.id);
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { produk, durationHours, quantity: 1 }];
    });
  };

  const updateQuantity = (produkId: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.produk.id === produkId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartServiceItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin memesan / reservasi jasa berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* x ${item.quantity} Paket @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*TOTAL HARGA PESANAN*: Rp ${totalPrice.toLocaleString('id-ID')}\n\nMohon info untuk proses pembayaran dan penjadwalannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  const handleDirectWhatsAppChat = () => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan jasa Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-32 relative">
      
      {/* Top Architectural Studio Header */}
      <header className="bg-[#1E293B] text-white border-b-4 py-5 px-8 sticky top-0 z-30 shadow-md" style={{ borderColor: accentColor }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-10 w-10 object-cover rounded-lg border border-slate-700 shadow-xs" />
            ) : (
              <div className="h-10 w-10 text-white font-black text-lg flex items-center justify-center rounded-lg shadow" style={{ backgroundColor: accentColor }}>
                📷
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest block font-bold" style={{ color: accentColor }}>
                PROFESSIONAL STUDIO & CREATIVE AGENCY
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

      {/* --- PORTFOLIO SHOWCASE HERO WITH CLIENT STATS --- */}
      <section className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white py-14 px-6 border-b border-slate-700">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            {bannerUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border border-slate-700">
                <img src={bannerUrl} alt="Banner Toko" className="w-full h-56 md:h-64 object-cover" />
              </div>
            )}
            <span className="text-xs font-mono font-bold bg-slate-800 px-3 py-1 rounded-md uppercase tracking-widest border border-slate-700" style={{ color: accentColor }}>
              HIGH RESOLUTION CREATIVE PRODUCTION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4 leading-tight">
              "{heroTitle}"
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
              {aboutUs}
            </p>
          </div>

          {/* Client Satisfaction Stats Counters */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-700 p-6 rounded-2xl space-y-4 text-center">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-3xl font-black font-mono" style={{ color: accentColor }}>150+</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">SESI FOTO PORTFOLIO SELESAI</p>
            </div>
            <div>
              <span className="text-3xl font-black font-mono text-[#F59E0B]">99.8%</span>
              <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">TINGKAT KEPUASAN KLIEN</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PACKAGE FEATURE COMPARISON MATRIX --- */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-slate-200 pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: accentColor }}>
              SERVICE MATRIX & PACKAGES
            </span>
            <h3 className="text-2xl font-bold text-[#0F172A]">Matriks Paket Jasa & Reservasi Sesi</h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedKategoriId(null)}
              className="px-4 py-2 text-xs font-mono font-bold rounded-lg transition"
              style={
                selectedKategoriId === null
                  ? { backgroundColor: '#1E293B', color: accentColor }
                  : { backgroundColor: '#F1F5F9', color: '#334155' }
              }
            >
              Semua Paket Jasa ({toko.produks.length})
            </button>
            {toko.kategoris.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setSelectedKategoriId(kat.id)}
                className="px-4 py-2 text-xs font-mono font-bold rounded-lg transition"
                style={
                  selectedKategoriId === kat.id
                    ? { backgroundColor: '#1E293B', color: accentColor }
                    : { backgroundColor: '#F1F5F9', color: '#334155' }
                }
              >
                {kat.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Service Package Cards Grid */}
        {filteredProduks.length === 0 ? (
          <div className="bg-[#F1F5F9] p-16 text-center text-slate-700 rounded-2xl border border-slate-200 text-xs font-medium">
            Belum ada paket jasa dalam kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProduks.map((produk) => {
              const inCart = cart.find((item) => item.produk.id === produk.id);

              return (
                <div
                  key={produk.id}
                  className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition duration-500 flex flex-col justify-between group"
                >
                  <div>
                    {/* Portfolio Preview Image */}
                    {produk.foto_url && (
                      <div
                        className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProdukDetail(produk)}
                      >
                        <img
                          src={produk.foto_url}
                          alt={produk.alt_text}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-[#1E293B] text-[10px] font-mono uppercase px-2.5 py-1 font-bold rounded" style={{ color: accentColor }}>
                          {produk.kategori_nama || 'PAKET UTAMA'}
                        </span>
                      </div>
                    )}

                    {/* Service Package Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-slate-700 uppercase font-bold">
                          ESTIMASI DURASI: 2-3 JAM
                        </span>
                        <span className="text-amber-600 text-xs font-bold">★★★★★ 5.0</span>
                      </div>

                      <h4
                        onClick={() => setSelectedProdukDetail(produk)}
                        className="text-xl font-bold text-[#0F172A] hover:opacity-80 cursor-pointer transition mb-2"
                      >
                        {produk.nama}
                      </h4>

                      {produk.deskripsi && (
                        <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-3 mb-6">
                          {produk.deskripsi}
                        </p>
                      )}

                      {/* Benefit Checklist Matrix */}
                      <div className="p-4 bg-[#F1F5F9] rounded-xl border border-slate-200 text-xs space-y-2 font-medium text-slate-800">
                        <p className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span> Sesi Foto Studio & Equipment Pro
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span> Retouched Photos & All High-Res Softfiles
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-emerald-600 font-bold">✓</span> Cetak Bingkai Eksklusif 10R / 8R
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Button */}
                  <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-600 block font-bold">INVESTASI PAKET</span>
                      <span className="text-lg font-mono font-black" style={{ color: accentColor }}>
                        Rp {produk.harga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-[#1E293B] text-white px-3 py-1.5 rounded-lg font-mono text-xs">
                        <button onClick={() => updateQuantity(produk.id, -1)} className="hover:opacity-80">-</button>
                        <span className="font-bold">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, 1)} className="hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2.5 text-white text-xs font-mono font-bold rounded-lg shadow transition"
                        style={{ backgroundColor: accentColor }}
                      >
                        + Pilih Paket
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

      {/* --- FLOATING WHATSAPP RESERVATION CART DRAWER --- */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#1E293B] text-white border-t-2 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-white font-mono font-bold rounded-full flex items-center justify-center text-sm shadow" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest font-bold" style={{ color: accentColor }}>RESERVASI JASA TERPILIH</p>
                <p className="text-lg font-mono font-bold text-white">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg shadow transition"
                style={{ backgroundColor: accentColor }}
              >
                💬 JADWALKAN VIA WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-300">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-[#0F172A]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold text-[#0F172A]">✕</button>
            </div>
            <p className="text-xs text-slate-800 font-medium my-4 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-lg font-mono font-bold" style={{ color: accentColor }}>
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-white text-xs font-mono font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                + Pilih Paket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
