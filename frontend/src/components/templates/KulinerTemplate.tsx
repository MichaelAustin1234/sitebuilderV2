import React, { useState } from 'react';
import { Kategori, Produk, Toko } from '../../types/produk';

interface KulinerTemplateProps {
  toko: Toko & {
    kategoris: Kategori[];
    produks: Produk[];
  };
}

interface CartItem {
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

export const KulinerTemplate: React.FC<KulinerTemplateProps> = ({ toko }) => {
  const [selectedKategoriId, setSelectedKategoriId] = useState<number | null>(null);
  const [selectedProdukDetail, setSelectedProdukDetail] = useState<Produk | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Layout config
  const layout = toko.konfigurasi_layout || {};
  const token = toko.template?.token_desain || {};
  const accentColor = layout.warna_aksen || token.warna_aksen || '#E69500';
  const heroTitle = layout.teks_kustom?.hero_title || 'Cita Rasa Resep Sambal Warisan Keluarga';
  const aboutUs = layout.teks_kustom?.about_us || 'Disajikan hangat dari bahan-bahan rempah pilihan berkualitas tinggi.';
  const whatsapp = layout.kontak?.whatsapp || '081234567890';
  const alamat = layout.kontak?.alamat || 'Yogyakarta, Indonesia';

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
        .filter(Boolean) as CartItem[]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.produk.harga * item.quantity, 0);

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  };

  const handleSendWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let message = `Halo ${toko.nama_toko}, saya ingin membeli produk kuliner berikut (sesuai harga di website Anda):\n\n`;
    cart.forEach((item, index) => {
      const subtotal = item.produk.harga * item.quantity;
      message += `${index + 1}. *${item.produk.nama}* x ${item.quantity} Pcs @ Rp ${item.produk.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    message += `\n*TOTAL HARGA PESANAN*: Rp ${totalPrice.toLocaleString('id-ID')}\n\nMohon info untuk proses pembayaran dan pengirimannya. Terima kasih!`;

    const formattedPhone = formatPhoneNumber(whatsapp);
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDirectWhatsAppChat = () => {
    const message = `Halo ${toko.nama_toko}, saya pengunjung toko Anda di website. Saya tertarik dengan produk kuliner Anda dan ingin bertanya lebih lanjut.`;
    const formattedPhone = formatPhoneNumber(whatsapp);
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDirectSingleProductWhatsAppOrder = (produk: Produk) => {
    const message = `Halo ${toko.nama_toko}, saya ingin membeli produk *${produk.nama}* sebanyak 1 Pcs dengan harga Rp ${produk.harga.toLocaleString('id-ID')} (sesuai harga di website).\n\nMohon info untuk kelanjutan pesanan ini. Terima kasih!`;
    const formattedPhone = formatPhoneNumber(whatsapp);
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getSpicyBadge = (id: number) => {
    const level = (id % 3) + 1;
    if (level === 1) return <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">🌶️ Pedas Sedang</span>;
    if (level === 2) return <span className="text-[11px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">🌶️🌶️ Pedas Mantap</span>;
    return <span className="text-[11px] font-bold text-red-900 bg-red-200 px-2 py-0.5 rounded">🌶️🌶️🌶️ Extra Pedas</span>;
  };

  return (
    <div className="min-h-screen bg-[#FCFAEE] text-[#3B1E19] font-sans relative">
      {/* Top Banner Header */}
      <header className="bg-[#3B1E19] text-[#FCFAEE] border-b-4 py-4 px-6 sticky top-0 z-30" style={{ borderColor: accentColor }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={toko.nama_toko} className="h-10 w-10 object-cover rounded-full border-2 shadow-xs" style={{ borderColor: accentColor }} />
            ) : (
              <span className="h-3 w-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
            )}
            <h1 className="text-xl md:text-2xl font-black font-serif tracking-tight">{toko.nama_toko}</h1>
            <span className="hidden sm:inline-block text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase" style={{ backgroundColor: accentColor }}>
              WARUNG BISTRO REMPAH
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs" style={{ color: accentColor }}>
            <span className="font-bold hidden md:inline">📍 {alamat}</span>
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

      {/* --- 65:35 BISTRO SPLIT SCREEN --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)]">
        
        {/* LEFT COLUMN (65%): MENU BOARD */}
        <div className="lg:col-span-8 p-6 lg:p-8 border-r border-[#E2D8C6]">
          {bannerUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-md border-2" style={{ borderColor: `${accentColor}30` }}>
              <img src={bannerUrl} alt="Banner Toko" className="w-full h-48 md:h-64 object-cover" />
            </div>
          )}

          <div className="bg-[#F3EDE0] border-2 rounded-2xl p-6 mb-8" style={{ borderColor: `${accentColor}40` }}>
            <h2 className="text-xl md:text-2xl font-bold text-[#3B1E19] mb-2">"{heroTitle}"</h2>
            <p className="text-xs text-stone-800 font-medium leading-relaxed">{aboutUs}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-[#E2D8C6]">
            <button
              onClick={() => setSelectedKategoriId(null)}
              className="px-4 py-2 text-xs font-bold rounded-lg transition"
              style={
                selectedKategoriId === null
                  ? { backgroundColor: '#3B1E19', color: accentColor }
                  : { backgroundColor: '#F3EDE0', color: '#3B1E19' }
              }
            >
              Semua Menu ({toko.produks.length})
            </button>
            {toko.kategoris.map((kat) => (
              <button
                key={kat.id}
                onClick={() => setSelectedKategoriId(kat.id)}
                className="px-4 py-2 text-xs font-bold rounded-lg transition"
                style={
                  selectedKategoriId === kat.id
                    ? { backgroundColor: '#3B1E19', color: accentColor }
                    : { backgroundColor: '#F3EDE0', color: '#3B1E19' }
                }
              >
                {kat.nama}
              </button>
            ))}
          </div>

          {filteredProduks.length === 0 ? (
            <div className="bg-[#F3EDE0] p-12 text-center text-xs font-semibold rounded-2xl text-stone-700">
              Belum ada menu kuliner dalam kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProduks.map((produk) => {
                const inCart = cart.find((item) => item.produk.id === produk.id);

                return (
                  <div
                    key={produk.id}
                    className="bg-[#F3EDE0] border-2 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition"
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
                          {produk.kategori_nama || 'KULINER'}
                        </span>
                        {getSpicyBadge(produk.id)}
                      </div>

                      <h4
                        onClick={() => setSelectedProdukDetail(produk)}
                        className="text-lg font-bold text-[#3B1E19] hover:opacity-80 cursor-pointer transition mb-1"
                      >
                        {produk.nama}
                      </h4>

                      {produk.deskripsi && (
                        <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed mb-4">
                          {produk.deskripsi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E2D8C6]">
                      <span className="text-base font-bold font-mono" style={{ color: accentColor }}>
                        Rp {produk.harga.toLocaleString('id-ID')}
                      </span>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-[#3B1E19] text-white px-3 py-1.5 rounded-lg">
                          <button onClick={() => updateQuantity(produk.id, -1)} className="font-bold hover:opacity-80">-</button>
                          <span className="text-xs font-bold font-mono px-1">{inCart.quantity}</span>
                          <button onClick={() => updateQuantity(produk.id, 1)} className="font-bold hover:opacity-80">+</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(produk)}
                          className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow transition"
                          style={{ backgroundColor: accentColor }}
                        >
                          + Pesan Menu
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (35%): ORDER & CONTACT SUMMARY */}
        <div className="lg:col-span-4 p-6 lg:p-8 bg-[#F3EDE0] flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#3B1E19] mb-4 pb-2 border-b border-[#E2D8C6]">
              🛒 Pesanan Anda
            </h3>

            {cart.length === 0 ? (
              <p className="text-xs text-stone-600 italic">Belum ada menu yang dipilih. Klik "+ Pesan Menu" untuk menambah.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.produk.id} className="flex justify-between items-center bg-[#FCFAEE] p-3 rounded-xl border border-[#E2D8C6] text-xs">
                    <div>
                      <p className="font-bold text-[#3B1E19]">{item.produk.nama}</p>
                      <p className="text-[10px] text-stone-600 font-mono">Rp {item.produk.harga.toLocaleString('id-ID')} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#3B1E19] text-white px-2 py-1 rounded">
                      <button onClick={() => updateQuantity(item.produk.id, -1)} className="hover:opacity-80">-</button>
                      <span className="font-bold font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.produk.id, 1)} className="hover:opacity-80">+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalItems > 0 && (
            <div className="pt-6 border-t border-[#E2D8C6] mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase text-stone-700">Total Pembayaran</span>
                <span className="text-lg font-bold font-mono text-[#3B1E19]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={handleSendWhatsAppOrder}
                className="w-full py-3 text-white font-bold text-xs uppercase rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                style={{ backgroundColor: accentColor }}
              >
                <span>💬</span>
                <span>PESAN SEKARANG VIA WA</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING DIRECT WHATSAPP BUTTON --- */}
      <button
        onClick={handleDirectWhatsAppChat}
        aria-label="Hubungi WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 group border-2 border-white"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:inline-block text-xs font-bold font-sans">Hubungi WhatsApp</span>
      </button>

      {/* Product Detail Modal */}
      {selectedProdukDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FCFAEE] rounded-2xl max-w-md w-full p-6 border-2" style={{ borderColor: accentColor }}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-serif font-bold text-[#3B1E19]">{selectedProdukDetail.nama}</h3>
              <button onClick={() => setSelectedProdukDetail(null)} className="font-bold">✕</button>
            </div>
            <p className="text-xs text-stone-800 my-3 leading-relaxed">{selectedProdukDetail.deskripsi}</p>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#E2D8C6]">
              <div className="flex justify-between items-center">
                <span className="text-base font-mono font-bold" style={{ color: accentColor }}>
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
                  + Pesan Menu
                </button>
              </div>

              <button
                onClick={() => {
                  handleDirectSingleProductWhatsAppOrder(selectedProdukDetail);
                  setSelectedProdukDetail(null);
                }}
                className="w-full py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow"
              >
                <span>💬</span>
                <span>Beli Langsung via WA (Rp {selectedProdukDetail.harga.toLocaleString('id-ID')})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
