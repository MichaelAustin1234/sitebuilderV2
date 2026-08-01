import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface FashionTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartFashionItem {
  produk: Produk;
  size: string;
  quantity: number;
}

const getStorageUrl = (urlOrPath?: string | null) => {
  if (!urlOrPath) return null;
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  return `http://localhost:8000/storage/${urlOrPath}`;
};

export const FashionTemplate: React.FC<FashionTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [cart, setCart] = useState<CartFashionItem[]>([]);

  // Layout config
  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#D4AF37';
  const heroTitle = layout.teks_kustom?.hero_title || 'Kemewahan Wastra Nusantara dalam Potongan Modern';
  const aboutUs = layout.teks_kustom?.about_us || 'Atelier busana tenun ikat dan batik tulis eksklusif dengan kurasi material sutra dan katun primissima.';
  const whatsapp = layout.kontak?.whatsapp || '081298765432';
  const alamat = layout.kontak?.alamat || 'Surakarta, Jawa Tengah';

  const logoUrl = getStorageUrl(layout.logo_url || layout.logo_path);
  const bannerUrl = getStorageUrl(layout.banner_url || layout.banner_path);

  const filteredProduks = selectedKategoriId
    ? toko.produks.filter((p) => p.kategori_id === selectedKategoriId)
    : toko.produks;

  const handleSelectSize = (produkId: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [produkId]: size }));
  };

  const addToCart = (produk: Produk) => {
    const size = selectedSizes[produk.id] || 'M';
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.produk.id === produk.id && item.size === size);
      if (existing) {
        return prevCart.map((item) =>
          item.produk.id === produk.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { produk, size, quantity: 1 }];
    });
  };

  const updateQuantity = (produkId: number, size: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.produk.id === produkId && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartFashionItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk fashion berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* [Ukuran: ${item.size}] x ${item.quantity} Pcs @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
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
    const text = encodeURIComponent(`Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan koleksi fashion Anda dan ingin bertanya.`);
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-[#121212] flex flex-col md:flex-row font-sans relative">
      
      {/* --- FIXED LEFT SIDEBAR NAVIGATION --- */}
      <aside className="w-full md:w-72 bg-[#121212] text-[#F8F6F0] p-8 md:fixed md:inset-y-0 md:left-0 z-30 flex flex-col justify-between border-r" style={{ borderColor: `${accentColor}60` }}>
        <div>
          {logoUrl ? (
            <img src={logoUrl} alt={toko.nama_toko} className="h-14 w-14 object-cover rounded-xl border border-stone-700 mb-3 shadow-xs" />
          ) : (
            <span className="text-[10px] font-mono tracking-widest uppercase block mb-1" style={{ color: accentColor }}>
              HAUTE COUTURE ATELIER
            </span>
          )}
          <h1 className="text-2xl font-serif tracking-widest uppercase text-[#F8F6F0] mb-8 border-b border-stone-800 pb-4">
            {toko.nama_toko}
          </h1>

          {/* Vertical Category Menu */}
          <div className="space-y-3 mb-8">
            <span className="text-[10px] font-mono text-stone-300 uppercase tracking-widest block mb-2 font-bold">
              KOLEKSI BUSANA
            </span>
            <button
              onClick={() => setSelectedKategoriId(null)}
              className="w-full text-left text-xs font-serif uppercase tracking-wider py-1.5 px-3 rounded transition"
              style={
                selectedKategoriId === null
                  ? { backgroundColor: accentColor, color: '#121212', fontWeight: 'bold' }
                  : { color: '#E5E7EB' }
              }
            >
              Semua Koleksi ({toko.produks.length})
            </button>
            {toko.kategoris.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setSelectedKategoriId(kat.id)}
                className="w-full text-left text-xs font-serif uppercase tracking-wider py-1.5 px-3 rounded transition"
                style={
                  selectedKategoriId === kat.id
                    ? { backgroundColor: accentColor, color: '#121212', fontWeight: 'bold' }
                    : { color: '#E5E7EB' }
                }
              >
                {kat.nama}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 text-xs font-mono text-stone-300 space-y-2">
          <p>📍 {alamat}</p>
          <button
            onClick={handleDirectWhatsAppChat}
            className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <span>💬</span>
            <span>Hubungi WhatsApp: {whatsapp}</span>
          </button>
        </div>
      </aside>

      {/* --- RIGHT MAIN LOOKBOOK FEED --- */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pb-32">
        {/* Banner Image */}
        {bannerUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-md border border-stone-300">
            <img src={bannerUrl} alt="Banner Toko" className="w-full h-56 md:h-72 object-cover" />
          </div>
        )}

        {/* Lookbook Hero Title */}
        <div className="mb-12 border-b border-[#E2DDD5] pb-8">
          <span className="text-xs font-mono tracking-widest uppercase text-stone-700 font-bold block mb-2">
            EDITORIAL LOOKBOOK 2026
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#121212] leading-tight mb-3">
            "{heroTitle}"
          </h2>
          <p className="text-xs md:text-sm text-stone-800 font-medium max-w-2xl leading-relaxed">
            {aboutUs}
          </p>
        </div>

        {/* Lookbook Product Grid */}
        {filteredProduks.length === 0 ? (
          <div className="bg-[#EFECE6] p-16 text-center text-xs font-serif text-stone-700 uppercase tracking-widest rounded-2xl">
            Koleksi tidak ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProduks.map((produk) => {
              const currentSize = selectedSizes[produk.id] || 'M';
              const inCart = cart.find(
                (item) => item.produk.id === produk.id && item.size === currentSize
              );

              return (
                <div
                  key={produk.id}
                  className="group bg-white border border-[#E2DDD5] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition duration-500 flex flex-col justify-between"
                >
                  <div>
                    {produk.foto_url && (
                      <div
                        className="relative h-80 bg-stone-100 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProdukDetail(produk)}
                      >
                        <img
                          src={produk.foto_url}
                          alt={produk.alt_text}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
                        />
                        <span className="absolute top-4 left-4 bg-[#121212] text-xs font-mono uppercase px-3 py-1 font-bold tracking-widest rounded shadow" style={{ color: accentColor }}>
                          {produk.kategori_nama || 'LIMITED ATELIER'}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3
                        onClick={() => setSelectedProdukDetail(produk)}
                        className="text-xl font-serif text-[#121212] hover:opacity-80 cursor-pointer transition mb-2 font-bold"
                      >
                        {produk.nama}
                      </h3>
                      {produk.deskripsi && (
                        <p className="text-xs text-stone-800 line-clamp-2 leading-relaxed mb-4">
                          {produk.deskripsi}
                        </p>
                      )}

                      {/* Size Selector Pills */}
                      <div className="flex items-center gap-2 mb-4 font-mono text-xs">
                        <span className="text-[11px] text-stone-800 uppercase font-bold">SIZE:</span>
                        {['S', 'M', 'L', 'XL'].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleSelectSize(produk.id, sz)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded transition border"
                            style={
                              currentSize === sz
                                ? { backgroundColor: '#121212', color: accentColor, borderColor: '#121212' }
                                : { backgroundColor: '#F8F6F0', color: '#121212', borderColor: '#E2DDD5' }
                            }
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex justify-between items-center border-t border-stone-100 mt-2">
                    <span className="text-base font-serif font-bold text-[#121212]">
                      Rp {produk.harga.toLocaleString('id-ID')}
                    </span>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-[#121212] text-white px-3 py-1.5 rounded font-mono text-xs">
                        <button onClick={() => updateQuantity(produk.id, currentSize, -1)} className="hover:opacity-80">-</button>
                        <span className="font-bold">{inCart.quantity}</span>
                        <button onClick={() => updateQuantity(produk.id, currentSize, 1)} className="hover:opacity-80">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(produk)}
                        className="px-4 py-2 bg-[#121212] text-white text-xs font-mono font-bold uppercase tracking-wider rounded shadow hover:opacity-90 transition"
                      >
                        + Koleksi
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
        aria-label="Chat via WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold font-sans">Chat Atelier WA</span>
      </button>

      {/* Floating Lookbook Order Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 inset-x-0 md:left-72 bg-[#121212] text-[#F8F6F0] border-t-2 shadow-2xl z-40 p-4" style={{ borderColor: accentColor }}>
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 text-[#121212] font-mono font-bold rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: accentColor }}>
                {totalItems}
              </span>
              <span className="text-base font-serif text-white">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSendWhatsAppOrder}
                className="px-5 py-2.5 text-[#121212] text-xs font-mono font-bold uppercase tracking-widest rounded shadow transition"
                style={{ backgroundColor: accentColor }}
              >
                💬 PESAN KOLEKSI VIA WA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#F8F6F0] rounded-2xl max-w-md w-full p-6 border-2 border-[#121212]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-serif text-[#121212] font-bold">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-800 my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex justify-between items-center pt-4 border-t border-[#E2DDD5]">
              <span className="text-base font-serif font-bold text-[#121212]">
                Rp {selectedProdukDetail.harga.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => {
                  addToCart(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="px-4 py-2 bg-[#121212] text-white text-xs font-mono font-bold uppercase rounded"
              >
                + Tambah Koleksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FLOATING DIRECT WHATSAPP BUTTON --- */}
      <button
        onClick={handleDirectWhatsAppChat}
        aria-label="Hubungi WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white font-sans"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold">Hubungi WhatsApp</span>
      </button>
    </div>
  );
};
