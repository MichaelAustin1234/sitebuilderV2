import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface OutdoorTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartOutdoorItem {
  produk: Produk;
  trailType: string;
  waterproofRating: string;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const OutdoorTemplate: React.FC<OutdoorTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [selectedTrails, setSelectedTrails] = useState<Record<number, string>>({});
  const [cart, setCart] = useState<CartOutdoorItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#EA580C';

  const heroTitle = layout.teks_kustom?.hero_title || 'Peralatan Pendakian & Ekspedisi Outdoor Tangguh Tested 3.000 MDPL';
  const aboutUs = layout.teks_kustom?.about_us || 'Perlengkapan gunung profesional: tas carrier ergonomis, tenda dome waterproof 10.000mm, dan alat camping berkualitas tinggi.';
  const whatsapp = layout.kontak?.whatsapp || '089677889900';
  const alamat = layout.kontak?.alamat || 'Malang, Jawa Timur';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const handleSelectTrail = (produkId: number, trail: string) => {
    setSelectedTrails((prev) => ({ ...prev, [produkId]: trail }));
  };

  const getWaterproofRating = (id: number) => {
    if (id % 2 === 0) return '10.000 mm Hydrostatic Head';
    return '8.000 mm Water Resistance';
  };

  const addToCart = (produk: Produk) => {
    const trail = selectedTrails[produk.id] || 'High Altitude 3.000 MDPL';
    const wp = getWaterproofRating(produk.id);

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.produk.id === produk.id && item.trailType === trail
      );
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id && item.trailType === trail
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { produk, trailType: trail, waterproofRating: wp, quantity: 1 }];
    });
  };

  const updateQuantity = (produkId: number, trail: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.produk.id === produkId && item.trailType === trail) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartOutdoorItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk outdoor / pendakian berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* [Spec: ${item.trailType}] x ${item.quantity} Unit @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
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
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk outdoor Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#111827] text-[#F9FAFB] font-sans pb-32 relative">
      
      {/* Top Tactical Expedition Header */}
      <header className="bg-[#1F2937] border-b-4 border-slate-800 py-4 px-6 sticky top-0 z-30 shadow-2xl font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-10 w-10 object-cover rounded border border-slate-700 shadow-xs" />
            ) : (
              <span className="h-3 w-3 rounded-full animate-ping" style={{ backgroundColor: accentColor }}></span>
            )}
            <h1 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white">{toko.nama_toko}</h1>
            <span className="text-[10px] font-mono font-bold text-slate-950 px-2.5 py-0.5 rounded uppercase" style={{ backgroundColor: accentColor }}>
              TACTICAL TRAIL EXPEDITION
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-200">
            <span className="hidden md:inline font-semibold">📍 {alamat}</span>
            <button
              onClick={handleDirectWhatsAppChat}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded text-xs flex items-center gap-1.5 shadow"
            >
              <span>💬</span>
              <span>Hubungi WhatsApp: {whatsapp}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO TACTICAL BASECAMP --- */}
      <section className="bg-gradient-to-b from-[#1F2937] to-[#111827] py-12 px-6 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          {bannerUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-60 md:h-72 object-cover" />
            </div>
          )}
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 bg-slate-900 border rounded mb-3 shadow-xs" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
            🧗‍♂️ TESTED & CERTIFIED 3.000 MDPL HIGH ALTITUDE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">{heroTitle}</h2>
          <p className="text-xs md:text-sm text-slate-200 font-medium max-w-xl mx-auto leading-relaxed">{aboutUs}</p>
        </div>
      </section>

      {/* --- MAIN TACTICAL OUTDOOR CATALOG --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 pb-4 border-b border-slate-800 font-mono">
          <button
            onClick={() => setSelectedKategoriId(null)}
            className="px-4 py-2 text-xs font-bold rounded-lg transition"
            style={
              selectedKategoriId === null
                ? { backgroundColor: accentColor, color: '#111827' }
                : { backgroundColor: '#1F2937', color: '#F9FAFB' }
            }
          >
            Semua Perlengkapan ({toko.produks.length})
          </button>
          {toko.kategoris.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategoriId(kat.id)}
              className="px-4 py-2 text-xs font-bold rounded-lg transition"
              style={
                selectedKategoriId === kat.id
                  ? { backgroundColor: accentColor, color: '#111827' }
                  : { backgroundColor: '#1F2937', color: '#F9FAFB' }
              }
            >
              {kat.nama}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProduks.length === 0 ? (
          <div className="bg-[#1F2937] p-12 text-center text-xs font-mono text-slate-300 font-bold rounded-xl border border-slate-800">
            Belum ada perlengkapan outdoor di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProduks.map((produk) => {
              const currentTrail = selectedTrails[produk.id] || 'High Altitude 3.000 MDPL';
              const wpRating = getWaterproofRating(produk.id);
              const inCart = cart.find(
                (item) => item.produk.id === produk.id && item.trailType === currentTrail
              );

              return (
                <div
                  key={produk.id}
                  className="bg-[#1F2937] border-2 rounded-2xl p-5 flex flex-col justify-between hover:border-orange-500 transition"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  <div>
                    {produk.foto_url && (
                      <img
                        src={produk.foto_url}
                        alt={produk.alt_text}
                        onClick={() => setSelectedProdukDetail(produk)}
                        className="w-full h-44 object-cover rounded-xl mb-4 cursor-pointer"
                      />
                    )}

                    <div className="flex justify-between items-center mb-1 font-mono">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                        {produk.kategori_nama || 'OUTDOOR GEAR'}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/50">
                        🌧️ {wpRating}
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedProdukDetail(produk)}
                      className="text-lg font-bold text-white hover:opacity-80 cursor-pointer transition mb-1"
                    >
                      {produk.nama}
                    </h4>

                    {produk.deskripsi && (
                      <p className="text-xs text-slate-200 leading-relaxed mb-4">
                        {produk.deskripsi}
                      </p>
                    )}

                    {/* Spec Selector */}
                    <div className="pt-3 border-t border-slate-800 font-mono space-y-1.5">
                      <span className="text-[11px] font-bold uppercase text-slate-300 block mb-1">TACTICAL SPEC RATING:</span>
                      <div className="flex gap-1.5">
                        {['Alpine 3.000 MDPL', 'Ultra Lightweight'].map((trail) => (
                          <button
                            key={trail}
                            onClick={() => handleSelectTrail(produk.id, trail)}
                            className="px-2 py-1 text-[10px] font-bold rounded transition border"
                            style={
                              currentTrail === trail
                                ? { backgroundColor: accentColor, color: '#111827', borderColor: accentColor }
                                : { backgroundColor: '#111827', color: '#F9FAFB', borderColor: '#374151' }
                            }
                          >
                            {trail}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4 font-mono">
                    <div>
                      <span className="text-[10px] font-bold text-slate-300 block uppercase">HARGA PERLENGKAPAN</span>
                      <span className="text-base font-black" style={{ color: accentColor }}>
                        Rp {produk.harga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg border border-slate-700">
                        <button onClick={() => updateQuantity(produk.id, currentTrail, -1)} className="font-bold hover:opacity-80">-</button>
                        <span className="text-xs font-bold font-mono px-1">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, currentTrail, 1)} className="font-bold hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2 text-slate-950 text-xs font-bold rounded-lg shadow transition"
                        style={{ backgroundColor: accentColor }}
                      >
                        + Beli Gear
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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white font-mono"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold">Hubungi WhatsApp</span>
      </button>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#1F2937] text-[#F9FAFB] border-t-2 shadow-2xl z-40 p-4 font-mono" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-slate-950 font-mono font-black rounded-full flex items-center justify-center text-xs shadow" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase font-bold text-slate-300">TOTAL PERLENGKAPAN GLOBLAL</p>
                <p className="text-lg font-mono font-bold text-white">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-slate-950 text-xs font-bold uppercase rounded-lg shadow transition"
                style={{ backgroundColor: accentColor }}
              >
                💬 ORDER EKSPEDISI WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] rounded-2xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold text-white">✕</button>
            </div>
            <p className="text-xs text-slate-200 my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-800 font-mono">
              <span className="text-base font-black" style={{ color: accentColor }}>
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-slate-950 text-xs font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                + Beli Gear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
