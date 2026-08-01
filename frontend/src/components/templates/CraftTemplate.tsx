import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface CraftTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartCraftItem {
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

export const CraftTemplate: React.FC<CraftTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [cart, setCart] = useState<CartCraftItem[]>([]);

  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#556B2F';

  const heroTitle = layout.teks_kustom?.hero_title || 'Sentuhan Hangat Kayu Jati Asli di Hunian Anda';
  const aboutUs = layout.teks_kustom?.about_us || 'Produk perlengkapan dapur dan dekorasi rumah berbahan kayu jati pilihan bersertifikasi perhutani.';
  const whatsapp = layout.kontak?.whatsapp || '085711223344';
  const alamat = layout.kontak?.alamat || 'Jepara, Jawa Tengah';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

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
        .filter(Boolean) as CartCraftItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk kerajinan berikut (sesuai harga di website Anda):\n\n`;
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
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan kerajinan tangan Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#3E2723] font-serif pb-32 relative">
      
      {/* --- ARTISAN STORYBOOK JOURNAL BOOKLET --- */}
      <div className="max-w-4xl mx-auto border-x border-[#D6CDBC] bg-[#FAF8F3] min-h-screen shadow-xl">
        
        {/* Storybook Header Banner */}
        <header className="p-8 md:p-12 text-center border-b-2 border-dashed bg-[#EBE5D8]" style={{ borderColor: accentColor }}>
          {logoUrl && (
            <img src={logoUrl} alt={toko.nama_toko} className="h-20 w-20 object-cover rounded-full border-2 border-[#3E2723] mx-auto mb-4 shadow" />
          )}
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: accentColor }}>
            📖 JURNAL BENGKEL KRIYA KAYU • EDISI 2026
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#3E2723] mb-3">{toko.nama_toko}</h1>
          <p className="text-xs md:text-sm font-sans text-stone-800 font-medium max-w-lg mx-auto leading-relaxed">
            {aboutUs}
          </p>

          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs font-mono">
            <span className="text-white px-3 py-1 rounded-full shadow font-bold" style={{ backgroundColor: accentColor }}>📍 {alamat}</span>
            <button
              onClick={handleDirectWhatsAppChat}
              className="px-3.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow"
            >
              <span>💬</span>
              <span>Hubungi WhatsApp: {whatsapp}</span>
            </button>
          </div>
        </header>

        {/* Storybook Category Filters */}
        <div className="p-6 border-b border-[#D6CDBC] flex flex-wrap justify-center gap-2 bg-[#F4F1EA]">
          <button
            onClick={() => setSelectedKategoriId(null)}
            className="px-4 py-1.5 text-xs font-mono font-bold rounded-full transition"
            style={
              selectedKategoriId === null
                ? { backgroundColor: '#3E2723', color: '#F4F1EA' }
                : { backgroundColor: '#EBE5D8', color: '#3E2723' }
            }
          >
            Semua Karya ({toko.produks.length})
          </button>
          {toko.kategoris.map((kat) => (
            <button
              key={kat.id}
              onClick={() => setSelectedKategoriId(kat.id)}
              className="px-4 py-1.5 text-xs font-mono font-bold rounded-full transition"
              style={
                selectedKategoriId === kat.id
                  ? { backgroundColor: '#3E2723', color: '#F4F1EA' }
                  : { backgroundColor: '#EBE5D8', color: '#3E2723' }
              }
            >
              {kat.nama}
            </button>
          ))}
        </div>

        {/* Storybook Journal Timeline & Products Feed */}
        <div className="p-6 md:p-10 space-y-12">
          
          {/* Banner Image */}
          {bannerUrl && (
            <div className="rounded-2xl overflow-hidden shadow-md border-2 border-dashed" style={{ borderColor: accentColor }}>
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-56 md:h-72 object-cover" />
            </div>
          )}

          {/* Artisan Process Story Card #1 */}
          <div className="bg-[#EBE5D8] border-2 border-dashed p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6" style={{ borderColor: accentColor }}>
            <div className="h-16 w-16 text-white font-mono font-bold rounded-full flex items-center justify-center text-xl shrink-0 shadow" style={{ backgroundColor: accentColor }}>
              01
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest block" style={{ color: accentColor }}>TAHAP PERTAMA</span>
              <h3 className="text-lg font-bold text-[#3E2723]">"{heroTitle}"</h3>
              <p className="text-xs font-sans text-stone-800 font-medium mt-1 leading-relaxed">
                Kayu dipilah secara ketat berdasarkan umur kayu tua (minimal 20 tahun) dan densitas serat untuk menjamin ketahanan terhadap retak dan lembab.
              </p>
            </div>
          </div>

          {/* Product Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProduks.map((produk) => {
              const batchNo = `BATCH-JKP-${(produk.id * 17) % 900 + 100}`;
              const inCart = cart.find((item) => item.produk.id === produk.id);

              return (
                <div
                  key={produk.id}
                  className="bg-[#EBE5D8] border border-[#D6CDBC] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
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

                    <span className="text-[10px] font-mono uppercase font-bold block mb-1" style={{ color: accentColor }}>
                      {batchNo} • BEESWAX FINISH
                    </span>

                    <h4
                      onClick={() => setSelectedProdukDetail(produk)}
                      className="text-lg font-bold text-[#3E2723] hover:opacity-80 cursor-pointer transition mb-2"
                    >
                      {produk.nama}
                    </h4>

                    {produk.deskripsi && (
                      <p className="text-xs font-sans text-stone-800 font-medium line-clamp-2 leading-relaxed mb-4">
                        {produk.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#D6CDBC] flex justify-between items-center">
                    <span className="text-base font-bold font-mono" style={{ color: accentColor }}>
                      Rp {produk.harga.toLocaleString('id-ID')}
                    </span>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-[#3E2723] text-white px-2 py-1 rounded font-mono text-xs">
                        <button onClick={() => updateQuantity(produk.id, -1)} className="hover:opacity-80">-</button>
                        <span className="font-bold">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, 1)} className="hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2 text-white text-xs font-mono font-bold rounded-lg transition shadow"
                        style={{ backgroundColor: accentColor }}
                      >
                        + Pesan Karya
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
        <div className="fixed bottom-0 inset-x-0 bg-[#3E2723] text-[#F4F1EA] border-t-2 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 text-white font-mono font-bold rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </span>
              <span className="text-base font-bold text-white font-mono">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2 text-white text-xs font-mono font-bold uppercase rounded shadow"
                style={{ backgroundColor: accentColor }}
              >
                💬 PESAN KARYA VIA WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FAF8F3] rounded-2xl max-w-md w-full p-6 border-2 border-[#3E2723]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-[#3E2723]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs font-sans text-stone-800 my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-[#D6CDBC]">
              <span className="text-base font-bold font-mono" style={{ color: accentColor }}>
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
                + Pesan Karya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
