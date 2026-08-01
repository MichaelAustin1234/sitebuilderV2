import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface AgricultureTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartFarmItem {
  produk: Produk;
  weightLabel: string;
  weightInKg: number;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const AgricultureTemplate: React.FC<AgricultureTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [selectedWeights, setSelectedWeights] = useState<Record<number, { label: string; kg: number }>>({});
  const [cart, setCart] = useState<CartFarmItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#15803D';

  const heroTitle = layout.teks_kustom?.hero_title || 'Sayur & Buah Segar Panen Pagi Bebas Pestisida';
  const aboutUs = layout.teks_kustom?.about_us || 'Hasil panen segar langsung dari perkebunan organik Lembang, dipetik jam 06:00 pagi dan siap dikirim ke rumah Anda.';
  const whatsapp = layout.kontak?.whatsapp || '081399887766';
  const alamat = layout.kontak?.alamat || 'Lembang, Bandung Barat';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const handleSelectWeight = (produkId: number, label: string, kg: number) => {
    setSelectedWeights((prev) => ({ ...prev, [produkId]: { label, kg } }));
  };

  const addToCart = (produk: Produk) => {
    const selected = selectedWeights[produk.id] || { label: '1 Kg', kg: 1.0 };
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.produk.id === produk.id && item.weightLabel === selected.label
      );
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id && item.weightLabel === selected.label
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevCart,
        { produk, weightLabel: selected.label, weightInKg: selected.kg, quantity: 1 },
      ];
    });
  };

  const updateQuantity = (produkId: number, weightLabel: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.produk.id === produkId && item.weightLabel === weightLabel) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartFarmItem[]
    );
  };

  const totalKg = cart.reduce((sum, item) => sum + item.weightInKg * item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.weightInKg * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk hasil panen berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.weightInKg * item.quantity;
      const unitPrice = item.produk.harga * item.weightInKg;
      message += `${index + 1}. *${item.produk.nama}* [Takaran: ${item.weightLabel}] x ${item.quantity} @ Rp ${unitPrice.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*TOTAL HARGA PESANAN*: Rp ${totalPrice.toLocaleString('id-ID')} (${totalKg.toFixed(1)} Kg)\n\nMohon info untuk proses pembayaran dan pengirimannya. Terima kasih!`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    window.open(`https://wa.me/${formattedPhone}?text=${encodedMessage}`, '_blank');
  };

  const handleDirectWhatsAppChat = () => {
    const cleanPhone = whatsapp.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk hasil panen Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#166534] font-sans pb-32 relative">
      
      {/* Top Organic Harvest Header */}
      <header className="bg-[#166534] text-[#F0FDF4] py-4 px-6 border-b-4 sticky top-0 z-30 shadow-md" style={{ borderColor: accentColor }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-9 w-9 object-cover rounded-full border border-emerald-300 shadow-xs" />
            ) : (
              <span className="h-3 w-3 rounded-full bg-emerald-300 animate-ping"></span>
            )}
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{toko.nama_toko}</h1>
            <span className="text-[10px] font-bold text-slate-900 px-2.5 py-0.5 rounded-full uppercase" style={{ backgroundColor: accentColor }}>
              ORGANIC HARVEST MARKET
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-100 font-medium">
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
      <section className="bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4] border-b border-[#BBF7D0] py-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {bannerUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-[#BBF7D0]">
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-52 md:h-64 object-cover" />
            </div>
          )}
          <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-white text-xs font-bold rounded-full shadow-xs mb-3 border border-emerald-300" style={{ color: accentColor }}>
            🌱 PETIK HARI INI • DIKIRIM SEGAR HARI INI
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#166534] mb-3">{heroTitle}</h2>
          <p className="text-xs md:text-sm text-stone-800 font-medium max-w-xl mx-auto leading-relaxed">{aboutUs}</p>
        </div>
      </section>

      {/* --- MAIN CATALOG GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 pb-4 border-b border-[#BBF7D0]">
          <button
            onClick={() => setSelectedKategoriId(null)}
            className="px-4 py-2 text-xs font-bold rounded-full transition"
            style={
              selectedKategoriId === null
                ? { backgroundColor: '#166534', color: '#FFFFFF' }
                : { backgroundColor: '#DCFCE7', color: '#166534' }
            }
          >
            Semua Hasil Panen ({toko.produks.length})
          </button>
          {toko.kategoris.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategoriId(kat.id)}
              className="px-4 py-2 text-xs font-bold rounded-full transition"
              style={
                selectedKategoriId === kat.id
                  ? { backgroundColor: '#166534', color: '#FFFFFF' }
                  : { backgroundColor: '#DCFCE7', color: '#166534' }
              }
            >
              {kat.nama}
            </button>
          ))}
        </div>

        {/* Harvest Items Cards Grid */}
        {filteredProduks.length === 0 ? (
          <div className="bg-[#DCFCE7] p-12 text-center text-xs font-semibold rounded-2xl text-[#166534]">Belum ada hasil panen di kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProduks.map((produk) => {
              const currentWeight = selectedWeights[produk.id] || { label: '1 Kg', kg: 1.0 };
              const itemPrice = produk.harga * currentWeight.kg;
              const inCart = cart.find(
                (item) => item.produk.id === produk.id && item.weightLabel === currentWeight.label
              );

              return (
                <div
                  key={produk.id}
                  className="bg-white border-2 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition"
                  style={{ borderColor: `${accentColor}30` }}
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

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                        {produk.kategori_nama || 'ORGANIK'}
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        🌅 PANEN 06:00 PAGI
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedProdukDetail(produk)}
                      className="text-lg font-bold text-[#166534] hover:opacity-80 cursor-pointer transition mb-1"
                    >
                      {produk.nama}
                    </h4>

                    {produk.deskripsi && (
                      <p className="text-xs text-stone-800 font-medium line-clamp-2 leading-relaxed mb-4">
                        {produk.deskripsi}
                      </p>
                    )}

                    {/* Weight Selector Pills */}
                    <div className="pt-3 border-t border-emerald-100">
                      <span className="text-[10px] font-bold uppercase text-stone-700 block mb-1.5">PILIH TAKARAN PANEN:</span>
                      <div className="flex gap-2">
                        {[
                          { label: '500g', kg: 0.5 },
                          { label: '1 Kg', kg: 1.0 },
                          { label: '2 Kg', kg: 2.0 },
                        ].map((w) => (
                          <button
                            key={w.label}
                            onClick={() => handleSelectWeight(produk.id, w.label, w.kg)}
                            className="px-3 py-1 text-xs font-bold rounded-lg transition border"
                            style={
                              currentWeight.label === w.label
                                ? { backgroundColor: '#166534', color: '#FFFFFF', borderColor: '#166534' }
                                : { backgroundColor: '#F0FDF4', color: '#166534', borderColor: '#BBF7D0' }
                            }
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-100 mt-4">
                    <div>
                      <span className="text-[10px] text-stone-600 block font-bold uppercase">ESTIMASI HARGA ({currentWeight.label})</span>
                      <span className="text-base font-black font-mono" style={{ color: accentColor }}>
                        Rp {itemPrice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-[#166534] text-white px-3 py-1.5 rounded-lg font-mono">
                        <button onClick={() => updateQuantity(produk.id, currentWeight.label, -1)} className="font-bold hover:opacity-80">-</button>
                        <span className="text-xs font-bold px-1">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, currentWeight.label, 1)} className="font-bold hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow transition"
                        style={{ backgroundColor: accentColor }}
                      >
                        + Panen
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

      {/* Floating Cart Bar */}
      {totalKg > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#166534] text-[#F0FDF4] border-t-2 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-[#166534] font-mono font-black rounded-full flex items-center justify-center text-xs shadow" style={{ backgroundColor: '#DCFCE7' }}>
                {totalKg.toFixed(1)}kg
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase font-bold text-emerald-200">TOTAL HASIL PANEN TERPILIH</p>
                <p className="text-lg font-mono font-bold text-white">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-slate-900 text-xs font-bold uppercase rounded-lg shadow transition font-mono"
                style={{ backgroundColor: '#DCFCE7' }}
              >
                💬 PESAN PANEN SEGAR WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F0FDF4] rounded-2xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-[#166534]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-800 font-medium my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-emerald-200">
              <span className="text-base font-black font-mono" style={{ color: accentColor }}>
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')} / Kg
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-white text-xs font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                + Tambah Panen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
