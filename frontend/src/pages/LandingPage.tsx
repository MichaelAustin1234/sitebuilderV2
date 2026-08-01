import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DEMO_TEMPLATES = [
  {
    id: 1,
    category: 'Kuliner & F&B',
    name: 'Selera Rempah Nusantara',
    slug: 'dapur-sambal-bu-nani',
    accentColor: '#E69500',
    bgColor: '#FCFAEE',
    textColor: '#3B1E19',
    fontPair: 'Outfit + Plus Jakarta Sans',
    signature: 'Fixed Live Receipt Order Pad (65:35 Split) + Indikator Pedas 🌶️',
    description: 'Layout hangat dan menggugah selera untuk warung makan, sambal botolan, dan makanan rumahan.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    icon: '🍲',
  },
  {
    id: 2,
    category: 'Fashion & Butik',
    name: 'Wastra Couture Atelier',
    slug: 'tenun-ikat-nusantara',
    accentColor: '#D4AF37',
    bgColor: '#F8F6F0',
    textColor: '#121212',
    fontPair: 'Cinzel + Inter',
    signature: 'Fixed Left Sidebar Navigation (280px) + Interactive Size Selector (S/M/L/XL)',
    description: 'Layout majalah editorial minimalis dan elegan khusus busana tenun, batik, & aksesoris mewah.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
    icon: '👗',
  },
  {
    id: 3,
    category: 'Kerajinan Tangan',
    name: 'Earthy Craft Heritage',
    slug: 'kriya-kayu-perhutani',
    accentColor: '#556B2F',
    bgColor: '#F4F1EA',
    textColor: '#3E2723',
    fontPair: 'Lora + Outfit',
    signature: 'Artisan Process Storybook Booklet + Batch Typewriter Stamp',
    description: 'Layout natural bertekstur earthy untuk pengrajin kriya kayu, anyaman, dan produk buatan tangan.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80',
    icon: '🪵',
  },
  {
    id: 4,
    category: 'Skincare & Kecantikan',
    name: 'Botanical Glow Apothecary',
    slug: 'glow-apothecary-herbal',
    accentColor: '#E8A598',
    bgColor: '#FAF8F5',
    textColor: '#4A2E35',
    fontPair: 'Bodoni Moda + Outfit',
    signature: 'Interactive Routine Step-by-Step Wizard (Step 1-2-3)',
    description: 'Layout luminous & higienis untuk klinik kecantikan, serum botanical, dan perawatan kulit.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597263-00079e96447c?w=700&auto=format&fit=crop&q=80',
    icon: '✨',
  },
  {
    id: 5,
    category: 'Jasa Profesional',
    name: 'Monochrome Studio Agency',
    slug: 'lensa-grafika-studio',
    accentColor: '#0EA5E9',
    bgColor: '#F8FAFC',
    textColor: '#0F172A',
    fontPair: 'Syne + Inter',
    signature: 'Package Feature Comparison Matrix + Session Booking Slot Calculator',
    description: 'Layout arsitektural presisi khusus studio fotografi, percetakan, dan konsultan profesional.',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=700&auto=format&fit=crop&q=80',
    icon: '📷',
  },
  {
    id: 6,
    category: 'Pertanian & Produk Segar',
    name: 'Harvest Fresh Organic Market',
    slug: 'kebun-organik-lembang',
    accentColor: '#15803D',
    bgColor: '#F0FDF4',
    textColor: '#166534',
    fontPair: 'Fraunces + DM Sans',
    signature: 'Harvest Weight Selector (500g/1kg) + Total Weight Counter (Kg)',
    description: 'Layout segar dan alami untuk sayur hidroponik, buah petik pagi, dan madu hutan murni.',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&auto=format&fit=crop&q=80',
    icon: '🌿',
  },
  {
    id: 7,
    category: 'Kelontong & Sembako',
    name: 'Pasar Tetangga Sembako',
    slug: 'toko-sembako-barokah',
    accentColor: '#DC2626',
    bgColor: '#FFFFFF',
    textColor: '#1F2937',
    fontPair: 'Rubik + Open Sans',
    signature: 'Quick Bulk Quantity Counter (+1/-1 Direct Table) + Wholesale Tier Badge',
    description: 'Layout praktis berkerapatan tinggi untuk toko sembako harian, minyak goreng, dan grosir beras.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80',
    icon: '🛒',
  },
  {
    id: 8,
    category: 'Produk Digital & Print',
    name: 'Digital & Custom Print Lab',
    slug: 'pixel-print-studio',
    accentColor: '#06B6D4',
    bgColor: '#090D16',
    textColor: '#F8FAFC',
    fontPair: 'Space Grotesk + Inter',
    signature: 'File Format Selector (.PNG/.PDF/.SVG) + 300 DPI Print Spec',
    description: 'Layout modern tech-creative untuk template digital Canva/Figma & cetak stiker custom.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&auto=format&fit=crop&q=80',
    icon: '⚡',
  },
  {
    id: 9,
    category: 'Dekorasi & Furnitur',
    name: 'Nordic Home Living',
    slug: 'nordic-living-studio',
    accentColor: '#C87D55',
    bgColor: '#E5E0D8',
    textColor: '#2C3531',
    fontPair: 'Tenor Sans + Plus Jakarta Sans',
    signature: 'Spatial Room Hotspot Pins + Dimension Configurator (PxLxT cm)',
    description: 'Layout Skandinavia lapang untuk furnitur kayu oak solid, sofa minimalis, & dekorasi ruang tamu.',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop&q=80',
    icon: '🛋️',
  },
  {
    id: 10,
    category: 'Olahraga & Outdoor',
    name: 'Summit Trail Expedition',
    slug: 'summit-trail-outdoor',
    accentColor: '#EA580C',
    bgColor: '#111827',
    textColor: '#F9FAFB',
    fontPair: 'Barlow Condensed + Inter',
    signature: 'Tactical Spec Sheet + Waterproof Rating (10.000 mm) + Altitude Tested Badge',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&auto=format&fit=crop&q=80',
    description: 'Layout tactical tangguh khusus perlengkapan pendakian gunung, tenda dome, & outdoor gear.',
    icon: '🧗‍♂️',
  },
];

export const LandingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentTemplate = DEMO_TEMPLATES[activeTab];
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      tabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E2923] font-sans selection:bg-[#047857] selection:text-white">
      
      {/* Top Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-[#047857] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#047857]/20 group-hover:scale-105 transition">
              U
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-[#1E2923] block leading-none">
                UMKM<span className="text-[#047857]">Sitebuilder</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">Platform No-Code Multi-Tenant</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-600">
            <a href="#templates" className="hover:text-[#047857] transition">10 Template Berkarakter</a>
            <a href="#features" className="hover:text-[#047857] transition">Fitur Platform</a>
            <a href="#how-it-works" className="hover:text-[#047857] transition">Cara Kerja</a>
            <a href="#demo-account" className="hover:text-[#047857] transition">Akun Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-stone-700 hover:text-[#047857] transition"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xl shadow-md shadow-[#047857]/20 transition transform hover:-translate-y-0.5"
            >
              Buat Toko Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="py-16 sm:py-24 px-6 border-b border-stone-200 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-[#047857] text-xs font-mono font-bold mb-6">
            <span>🌿 PLATFORM TOKO ONLINE KHUSUS UMKM INDONESIA</span>
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1E2923] tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            Buat Website Toko Online Tanpa Coding dengan{' '}
            <span className="text-[#047857] underline decoration-[#A7F3D0] decoration-wavy underline-offset-8">
              10 Desain Berkarakter Utuh
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Setiap usaha UMKM memiliki keunikan sendiri. Pilih template yang dirancang khusus untuk bidang usaha Anda, kustomisasi logo & produk, lalu publikasikan langsung via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-sm rounded-2xl shadow-xl shadow-[#047857]/25 transition transform hover:-translate-y-0.5"
            >
              🚀 Buat Toko Online Sekarang (Gratis)
            </Link>
            <a
              href="#templates"
              className="w-full sm:w-auto px-8 py-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm rounded-2xl border border-stone-300 transition"
            >
              🎨 Lihat 10 Desain Template
            </a>
          </div>

          {/* Interactive Live Template Previewer Showcase */}
          <div className="bg-[#FAF8F5] border-2 border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xl text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-200 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#047857] tracking-widest font-bold block mb-1">
                  INTERACTIVE LIVE TEMPLATE PREVIEWER
                </span>
                <h3 className="text-xl font-bold text-[#1E2923]">
                  Pratinjau Karakter 10 Template Toko UMKM
                </h3>
              </div>
              <a
                href={`/toko/${currentTemplate.slug}?preview=true`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
              >
                👁️ BUKA LIVE DEMO WEBSITE (`/toko/${currentTemplate.slug}`)
              </a>
            </div>

            {/* Template Tabs with Left & Right Arrow Buttons for smooth scrolling */}
            <div className="relative flex items-center gap-2 mb-6">
              <button
                type="button"
                onClick={() => scrollTabs('left')}
                className="h-9 w-9 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold shadow-xs shrink-0 cursor-pointer transition active:scale-95 z-10"
                title="Geser Kategori ke Kiri"
              >
                ◀
              </button>

              <div
                ref={tabsRef}
                className="flex gap-2 overflow-x-auto py-1 scroll-smooth flex-1 scrollbar-none"
              >
                {DEMO_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={tpl.id}
                    onClick={() => setActiveTab(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border shrink-0 ${
                      activeTab === idx
                        ? 'bg-[#047857] text-white border-[#047857] shadow-md'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{tpl.icon}</span>
                    <span>{tpl.category}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollTabs('right')}
                className="h-9 w-9 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold shadow-xs shrink-0 cursor-pointer transition active:scale-95 z-10"
                title="Geser Kategori ke Kanan"
              >
                ▶
              </button>
            </div>

            {/* Template Active Card details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#ECFDF5] text-[#047857] text-xs font-mono font-bold rounded-full border border-[#A7F3D0]">
                    {currentTemplate.category}
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-semibold">
                    Font: {currentTemplate.fontPair}
                  </span>
                </div>

                <h4 className="text-2xl font-bold text-[#1E2923]">{currentTemplate.name}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{currentTemplate.description}</p>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500">Warna Aksen Bawaan:</span>
                    <div className="flex items-center gap-2 font-bold text-stone-800">
                      <span className="h-3.5 w-3.5 rounded-full border border-stone-300 shadow-xs" style={{ backgroundColor: currentTemplate.accentColor }}></span>
                      <span>{currentTemplate.accentColor}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-700">
                    <span className="text-[#047857] font-bold">✨ Signature Feature: </span>
                    {currentTemplate.signature}
                  </div>
                </div>
              </div>

              {/* Template Image Showcase */}
              <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-md border border-stone-200 aspect-[16/10]">
                <img src={currentTemplate.imageUrl} alt={currentTemplate.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] font-mono uppercase bg-[#047857] px-2 py-0.5 rounded font-bold self-start mb-1">
                    LIVE DEMO READY
                  </span>
                  <p className="text-sm font-bold truncate">{currentTemplate.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- GALLERY 10 TEMPLATES SHOWCASE --- */}
      <section id="templates" className="py-20 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <div className="text-center mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#047857] font-bold block mb-2">
            GALERI DESAIN UTUH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2923]">
            10 Template dengan Identitas Visual Berbeda Total
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto mt-3">
            Bukan sekadar ganti warna dari struktur yang sama. Setiap template memiliki perlakuan tipografi, macro-layout, dan elemen khasnya sendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEMO_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden hover:border-[#047857] hover:shadow-xl transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                  <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1.5">
                    <span>{tpl.icon}</span>
                    <span>{tpl.category}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-[#1E2923] group-hover:text-[#047857] transition">
                      {tpl.name}
                    </h3>
                    <span className="h-4 w-4 rounded-full border border-stone-300 shrink-0 shadow-xs" style={{ backgroundColor: tpl.accentColor }}></span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{tpl.description}</p>

                  <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-[11px] font-mono border border-stone-200">
                    <div className="flex justify-between text-stone-600">
                      <span>Tipografi:</span>
                      <span className="font-bold text-stone-800">{tpl.fontPair}</span>
                    </div>
                    <div className="pt-1.5 border-t border-stone-200 text-[10px] text-stone-700">
                      <span className="text-[#047857] font-bold">✨ Signature: </span>
                      {tpl.signature}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a
                  href={`/toko/${tpl.slug}?preview=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2.5 bg-stone-100 hover:bg-[#047857] hover:text-white text-stone-800 text-xs font-bold text-center rounded-xl transition border border-stone-200"
                >
                  👁️ Buka Toko Live Demo →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <div className="text-center mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#047857] font-bold block mb-2">
            KEUNGGULAN PLATFORM
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2923]">
            Fitur Utama Dirancang Khusus untuk Pelaku UMKM
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="h-12 w-12 bg-[#ECFDF5] text-[#047857] text-2xl rounded-2xl flex items-center justify-center border border-[#A7F3D0]">
              💬
            </div>
            <h3 className="text-lg font-bold text-[#1E2923]">Instant WhatsApp Order</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pembeli dapat langsung memesan produk lengkap dengan rincian varian, spesifikasi, dan estimasi total ke WhatsApp pemilik toko.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="h-12 w-12 bg-amber-50 text-amber-700 text-2xl rounded-2xl flex items-center justify-center border border-amber-200">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[#1E2923]">SEO & Open Graph Otomatis</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Setiap toko publik otomatis dilengkapi meta title, meta description, dan Open Graph tags agar link toko tampil cantik saat dibagikan ke WA/Medsos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="h-12 w-12 bg-[#ECFDF5] text-[#047857] text-2xl rounded-2xl flex items-center justify-center border border-[#A7F3D0]">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-[#1E2923]">1-Click Publish & Slug Unik</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Mode Pratinjau (Preview) untuk menguji toko secara privat sebelum diterbitkan ke publik dengan URL unik pilihan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-b border-stone-200">
        <div className="text-center mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#047857] font-bold block mb-2">
            LANGKAH PRAKTIS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E2923]">
            3 Langkah Mudah Membuat Toko Online
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <span className="h-10 w-10 bg-[#047857] text-white font-bold rounded-full flex items-center justify-center text-base mx-auto mb-6 shadow">
              1
            </span>
            <h3 className="text-lg font-bold text-[#1E2923] mb-2">Daftar Akun & Toko</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Buat akun dalam 30 detik dan tentukan nama toko serta URL slug unik milik Anda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <span className="h-10 w-10 bg-[#047857] text-white font-bold rounded-full flex items-center justify-center text-base mx-auto mb-6 shadow">
              2
            </span>
            <h3 className="text-lg font-bold text-[#1E2923] mb-2">Pilih Template & Produk</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pilih dari 10 template berkarakter, upload logo/banner, dan tambahkan foto produk Anda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative">
            <span className="h-10 w-10 bg-[#047857] text-white font-bold rounded-full flex items-center justify-center text-base mx-auto mb-6 shadow">
              3
            </span>
            <h3 className="text-lg font-bold text-[#1E2923] mb-2">Terbitkan (Publish) Toko</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Klik Terbitkan dan bagikan link toko Anda ke calon pembeli di WhatsApp dan media sosial!
            </p>
          </div>
        </div>
      </section>

      {/* --- PUBLIC CALL TO ACTION BANNER --- */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="bg-[#1E2923] text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-stone-800 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-mono text-[#A7F3D0] uppercase font-bold tracking-widest block mb-2">
              SEKARANG SAATNYA GO DIGITAL
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Siap Mengembangkan Usaha UMKM Anda?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
              Buat toko online resmi Anda dalam hitungan menit, pilih dari 10 template berkarakter, dan terima pesanan pelanggan langsung via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0 w-full sm:w-auto">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-xl shadow-xl transition text-center"
            >
              🚀 Buat Toko Gratis
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl transition text-center border border-stone-700"
            >
              🔑 Masuk Akun
            </Link>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-stone-200 py-12 px-6 bg-white text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-[#047857] text-white font-bold flex items-center justify-center rounded-lg">
              U
            </div>
            <div>
              <p className="text-[#1E2923] font-bold">UMKM Sitebuilder v2 Platform</p>
              <p className="text-[10px] text-stone-500">Multi-Tenant No-Code Website Store Builder</p>
            </div>
          </div>

          <div className="flex gap-6 font-semibold text-stone-700">
            <Link to="/login" className="hover:text-[#047857] transition">Login</Link>
            <Link to="/register" className="hover:text-[#047857] transition">Daftar Toko</Link>
            <a href="#templates" className="hover:text-[#047857] transition">Galeri Template</a>
          </div>

          <p>© 2026 UMKM Sitebuilder. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};
