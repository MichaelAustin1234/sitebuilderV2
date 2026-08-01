import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface FurnitureTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartFurnitureItem {
  produk: Produk;
  selectedMaterial: string;
  dimensionSpec: string;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const FurnitureTemplate: React.FC<FurnitureTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<number, string>>({});
  const [cart, setCart] = useState<CartFurnitureItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#C87D55';

  const heroTitle = layout.teks_kustom?.hero_title || 'Kehangatan Interior Skandinavia untuk Hunian Modern';
  const aboutUs = layout.teks_kustom?.about_us || 'Koleksi furnitur minimalis bergaya Nordic dari kayu oak solid dan kain berkualitas tinggi.';
  const whatsapp = layout.kontak?.whatsapp || '081544332211';
  const alamat = layout.kontak?.alamat || 'Tangerang';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const handleSelectMaterial = (produkId: number, mat: string) => {
    setSelectedMaterials((prev) => ({ ...prev, [produkId]: mat }));
  };

  const getDimensionSpec = (id: number) => {
    if (id % 2 === 0) return '160 cm x 85 cm x 75 cm';
    return '120 cm x 60 cm x 45 cm';
  };

  const addToCart = (produk: Produk) => {
    const mat = selectedMaterials[produk.id] || 'Kayu Oak Solid';
    const dim = getDimensionSpec(produk.id);

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.produk.id === produk.id && item.selectedMaterial === mat
      );
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id && item.selectedMaterial === mat
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { produk, selectedMaterial: mat, dimensionSpec: dim, quantity: 1 }];
    });
  };

  const updateQuantity = (produkId: number, mat: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.produk.id === produkId && item.selectedMaterial === mat) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartFurnitureItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk furnitur berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* [Material: ${item.selectedMaterial} | Dimensi: ${item.dimensionSpec}] x ${item.quantity} Unit @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
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
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk furnitur Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#E5E0D8] text-[#2C3531] font-sans pb-32 relative">
      
      {/* Top Header */}
      <header className="bg-[#2C3531] text-[#E5E0D8] py-5 px-8 border-b-4 sticky top-0 z-30 shadow-md" style={{ borderColor: accentColor }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-10 w-10 object-cover rounded-xl border border-stone-600 shadow-xs" />
            ) : (
              <div className="h-10 w-10 text-white font-bold text-lg flex items-center justify-center rounded-xl shadow" style={{ backgroundColor: accentColor }}>
                🛋️
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono tracking-widest block font-bold uppercase" style={{ color: accentColor }}>
                NORDIC ROOM SPATIAL SHOWCASE
              </span>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">{toko.nama_toko}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="hidden md:inline font-semibold">📍 {alamat}</span>
            <button
              onClick={handleDirectWhatsAppChat}
              className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
            >
              <span>💬</span>
              <span>Hubungi WhatsApp: {whatsapp}</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO NORDIC STUDIO --- */}
      <section className="bg-[#DCD5CB] border-b border-[#C2B7A7] py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {bannerUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border border-[#C2B7A7]">
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-60 md:h-72 object-cover" />
            </div>
          )}
          <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 bg-[#2C3531] rounded-md mb-3" style={{ color: accentColor }}>
            🛋️ SPATIAL ROOM CONFIGURATOR
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#2C3531] tracking-tight mb-4 font-bold">{heroTitle}</h2>
          <p className="text-xs md:text-sm text-stone-900 font-medium max-w-xl mx-auto leading-relaxed">{aboutUs}</p>
        </div>
      </section>

      {/* --- MAIN FURNITURE SHOWCASE --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 pb-4 border-b border-[#C2B7A7]">
          <button
            onClick={() => setSelectedKategoriId(null)}
            className="px-4 py-2 text-xs font-mono font-bold rounded-lg transition"
            style={
              selectedKategoriId === null
                ? { backgroundColor: '#2C3531', color: accentColor }
                : { backgroundColor: '#DCD5CB', color: '#2C3531' }
            }
          >
            Semua Furnitur ({toko.produks.length})
          </button>
          {toko.kategoris.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategoriId(kat.id)}
              className="px-4 py-2 text-xs font-mono font-bold rounded-lg transition"
              style={
                selectedKategoriId === kat.id
                  ? { backgroundColor: '#2C3531', color: accentColor }
                  : { backgroundColor: '#DCD5CB', color: '#2C3531' }
              }
            >
              {kat.nama}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProduks.length === 0 ? (
          <div className="bg-[#DCD5CB] p-12 text-center text-xs font-mono text-stone-900 font-bold rounded-xl border border-[#C2B7A7]">
            Belum ada furnitur dalam kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProduks.map((produk) => {
              const currentMat = selectedMaterials[produk.id] || 'Kayu Oak Solid';
              const dimSpec = getDimensionSpec(produk.id);
              const inCart = cart.find(
                (item) => item.produk.id === produk.id && item.selectedMaterial === currentMat
              );

              return (
                <div
                  key={produk.id}
                  className="bg-white border-2 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl transition"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  <div>
                    {produk.foto_url && (
                      <img
                        src={produk.foto_url}
                        alt={produk.alt_text}
                        onClick={() => setSelectedProdukDetail(produk)}
                        className="w-full h-48 object-cover rounded-xl mb-4 cursor-pointer"
                      />
                    )}

                    <div className="flex justify-between items-center mb-1 font-mono">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2C3531]" style={{ color: accentColor }}>
                        {produk.kategori_nama || 'FURNITUR'}
                      </span>
                      <span className="text-[10px] font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
                        📐 {dimSpec}
                      </span>
                    </div>

                    <h4
                      onClick={() => setSelectedProdukDetail(produk)}
                      className="text-lg font-bold text-[#2C3531] hover:opacity-80 cursor-pointer transition mb-1"
                    >
                      {produk.nama}
                    </h4>

                    {produk.deskripsi && (
                      <p className="text-xs text-stone-800 font-medium line-clamp-2 leading-relaxed mb-4">
                        {produk.deskripsi}
                      </p>
                    )}

                    {/* Material Selector Pills */}
                    <div className="pt-3 border-t border-stone-200 font-mono space-y-1.5">
                      <span className="text-[10px] uppercase text-stone-700 font-bold block">PILIH MATERIAL OAK:</span>
                      <div className="flex gap-1.5">
                        {['Kayu Oak Solid', 'Mahoni Warm', 'Teak Natural'].map((mat) => (
                          <button
                            key={mat}
                            onClick={() => handleSelectMaterial(produk.id, mat)}
                            className="px-2 py-1 text-[10px] font-bold rounded transition border"
                            style={
                              currentMat === mat
                                ? { backgroundColor: '#2C3531', color: accentColor, borderColor: '#2C3531' }
                                : { backgroundColor: '#E5E0D8', color: '#2C3531', borderColor: '#C2B7A7' }
                            }
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-stone-200 mt-4 font-mono">
                    <div>
                      <span className="text-[10px] text-stone-600 block font-bold">INVESTASI NORDIC</span>
                      <span className="text-base font-black" style={{ color: accentColor }}>
                        Rp {produk.harga.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-2 bg-[#2C3531] text-white px-3 py-1.5 rounded-lg">
                        <button onClick={() => updateQuantity(produk.id, currentMat, -1)} className="font-bold hover:opacity-80">-</button>
                        <span className="text-xs font-bold font-mono px-1">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, currentMat, 1)} className="font-bold hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow transition"
                        style={{ backgroundColor: accentColor }}
                      >
                        + Beli Furnitur
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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white font-sans"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold">Hubungi WhatsApp</span>
      </button>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[#2C3531] text-white border-t-2 shadow-2xl z-40 p-4 font-mono" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 text-[#2C3531] font-mono font-black rounded-full flex items-center justify-center text-xs shadow" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase font-bold text-slate-300">ESTIMASI TOTAL FURNITUR</p>
                <p className="text-lg font-mono font-bold text-white">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-[#2C3531] text-xs font-bold uppercase rounded-lg shadow transition"
                style={{ backgroundColor: accentColor }}
              >
                💬 KONSULTASI FURNITUR WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#E5E0D8] rounded-2xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-[#2C3531]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-800 font-medium my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-[#C2B7A7]">
              <span className="text-base font-black font-mono" style={{ color: accentColor }}>
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 text-white text-xs font-bold rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                + Tambah Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
