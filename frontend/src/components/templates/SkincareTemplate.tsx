import React, { useState } from 'react';
import { Produk, Toko } from '../../types/produk';

interface SkincareTemplateProps {
  toko: Toko & {
    kategoris: any[];
    produks: Produk[];
  };
}

interface CartSkincareItem {
  produk: Produk;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const SkincareTemplate: React.FC<SkincareTemplateProps> = ({ toko }) => {
  const [activeRoutineMode, setActiveRoutineMode] = useState<'pagi' | 'malam'>('pagi');
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [cart, setCart] = useState<CartSkincareItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#E8A598';

  const heroTitle = layout.teks_kustom?.hero_title || 'Pancarkan Kilau Sehat Alami Kulit Anda';
  const aboutUs = layout.teks_kustom?.about_us || 'Rangkaian perawatan wajah alami dengan formulasi bebas alkohol dan paraben, teruji secara dermatologis.';
  const whatsapp = layout.kontak?.whatsapp || '089988776655';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const addToCart = (produk: Produk) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.produk.id === produk.id);
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { produk, quantity: 1 }];
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
        .filter(Boolean) as CartSkincareItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk skincare berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* x ${item.quantity} Pcs @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
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
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk skincare Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#4A2E35] font-sans pb-32 relative">
      
      {/* Top Header */}
      <header className="bg-[#4A2E35] text-[#FAF8F5] py-6 px-6 border-b-4" style={{ borderColor: accentColor }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} alt={toko.nama_toko} className="h-12 w-12 object-cover rounded-full border-2 border-rose-200 shadow-xs" />
            )}
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase block" style={{ color: accentColor }}>CLINICAL BOTANICAL LAB</span>
              <h1 className="text-2xl md:text-3xl font-serif text-white">{toko.nama_toko}</h1>
            </div>
          </div>

          <button
            onClick={handleDirectWhatsAppChat}
            className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full text-xs flex items-center gap-2 shadow"
          >
            <span>💬</span>
            <span>Hubungi WhatsApp: {whatsapp}</span>
          </button>
        </div>
      </header>

      {/* --- INTERACTIVE SKINCARE ROUTINE WIZARD BUILDER --- */}
      <main className="max-w-4xl mx-auto p-6 md:p-10">
        {/* Banner Image */}
        {bannerUrl && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-md border-2 border-[#E5DACE]">
            <img src={bannerUrl} alt="Banner Toko" className="w-full h-52 md:h-64 object-cover" />
          </div>
        )}

        {/* Routine Mode Switcher Toggle */}
        <div className="bg-[#F2EBE4] p-3 rounded-full border border-[#E5DACE] flex justify-center gap-3 mb-10 max-w-md mx-auto shadow-inner">
          <button
            onClick={() => setActiveRoutineMode('pagi')}
            className="flex-1 py-2.5 px-4 text-xs font-serif font-bold rounded-full transition flex items-center justify-center gap-2"
            style={
              activeRoutineMode === 'pagi'
                ? { backgroundColor: '#4A2E35', color: accentColor }
                : { color: '#4A2E35' }
            }
          >
            <span>☀️</span> Rutinitas Pagi (Glow)
          </button>
          <button
            onClick={() => setActiveRoutineMode('malam')}
            className="flex-1 py-2.5 px-4 text-xs font-serif font-bold rounded-full transition flex items-center justify-center gap-2"
            style={
              activeRoutineMode === 'malam'
                ? { backgroundColor: '#4A2E35', color: accentColor }
                : { color: '#4A2E35' }
            }
          >
            <span>🌙</span> Rutinitas Malam (Barrier)
          </button>
        </div>

        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2D5A27] bg-[#D4E8D1] px-3.5 py-1 rounded-full border border-[#B8DAB3]">
            {activeRoutineMode === 'pagi' ? 'PANCARKAN KILAU HARIAN' : 'PEMULIHAN LAYER KULIT MALAM'}
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-[#4A2E35] mt-3 font-bold">
            Urutan Rutinitas Skincare {activeRoutineMode === 'pagi' ? 'Pagi Hari' : 'Malam Hari'}
          </h2>
          <p className="text-xs text-stone-800 font-semibold mt-1 max-w-md mx-auto mb-1">{heroTitle}</p>
          <p className="text-xs text-stone-700 font-medium italic max-w-lg mx-auto">{aboutUs}</p>
        </div>

        {/* Sequential Step Cards */}
        <div className="space-y-8">
          {toko.produks.map((produk, index) => {
            const stepNum = index + 1;
            const inCart = cart.find((item) => item.produk.id === produk.id);
            const bpomCode = `BPOM NA${(produk.id * 892) % 900000 + 100000}`;

            return (
              <div
                key={produk.id}
                className="bg-white border-2 border-[#E5DACE] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xs hover:shadow-md transition"
              >
                {/* Step Circle Badge */}
                <div className="h-16 w-16 rounded-full text-[#4A2E35] font-serif font-black flex items-center justify-center text-xl shrink-0 shadow" style={{ backgroundColor: accentColor }}>
                  0{stepNum}
                </div>

                {/* Product Image */}
                {produk.foto_url && (
                  <img
                    src={produk.foto_url}
                    alt={produk.alt_text}
                    onClick={() => setSelectedProdukDetail(produk)}
                    className="h-32 w-32 object-cover rounded-2xl cursor-pointer shrink-0"
                  />
                )}

                {/* Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full" style={{ backgroundColor: accentColor }}>
                      STEP {stepNum}: {produk.kategori_nama || 'PERAWATAN'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-700 font-bold">{bpomCode}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedProdukDetail(produk)}
                    className="text-lg font-serif font-bold text-[#4A2E35] hover:opacity-80 cursor-pointer transition mb-1"
                  >
                    {produk.nama}
                  </h3>
                  <p className="text-xs text-stone-800 font-medium line-clamp-2 leading-relaxed">{produk.deskripsi}</p>
                  
                  <div className="mt-3 text-xs font-mono font-bold text-[#4A2E35]">
                    Rp {produk.harga.toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Step Action Button */}
                <div className="shrink-0">
                  {inCart ? (
                    <div className="flex items-center gap-2 bg-[#4A2E35] text-white px-3 py-1.5 rounded-full">
                      <button onClick={() => updateQuantity(produk.id, -1)} className="font-bold hover:opacity-80">-</button>
                      <span className="text-xs font-bold font-mono px-1">{inCart.quantity}</span>
                      <button onClick={() => updateQuantity(produk.id, 1)} className="font-bold hover:opacity-80">+</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(produk)}
                      className="px-5 py-2.5 bg-[#4A2E35] hover:opacity-90 text-white text-xs font-bold rounded-full transition shadow"
                    >
                      + Tambah Step 0{stepNum}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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

      {/* Floating Skincare Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#4A2E35] text-[#FAF8F5] border-t-2 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 text-[#4A2E35] font-bold rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </span>
              <span className="text-lg font-serif font-bold text-white font-mono">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-[#4A2E35] text-xs font-bold uppercase rounded-full shadow transition shrink-0 font-mono"
                style={{ backgroundColor: accentColor }}
              >
                💬 PESAN ROUTINE WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-serif font-bold text-[#4A2E35]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-800 font-medium my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-[#E5DACE]">
              <span className="text-base font-serif font-bold text-[#4A2E35] font-mono">
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-white text-xs font-bold rounded-full"
                style={{ backgroundColor: accentColor }}
              >
                + Tambah Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
