export interface MockTemplate {
  id: number;
  nama: string;
  deskripsi: string;
  thumbnail_path: string;
  token_desain: {
    warna_aksen: string;
    warna_latar?: string;
    warna_teks?: string;
    font_heading?: string;
    font_body?: string;
    signature_element: string;
  };
}

export interface MockKategori {
  id: number;
  toko_id: number;
  nama: string;
}

export interface MockProduk {
  id: number;
  toko_id: number;
  kategori_id: number | null;
  nama: string;
  harga: number;
  deskripsi: string;
  foto_path: string;
  kategori?: MockKategori;
}

export interface MockToko {
  id: number;
  user_id: number;
  template_id: number;
  nama_toko: string;
  slug: string;
  status: 'draft' | 'published';
  konfigurasi_layout: {
    warna_aksen: string;
    logo_path?: string | null;
    banner_path?: string | null;
    teks_kustom: {
      hero_title?: string;
      about_us?: string;
    };
    kontak: {
      whatsapp?: string;
      alamat?: string;
    };
  };
  template?: MockTemplate;
  produk?: MockProduk[];
  kategori?: MockKategori[];
}

export const INITIAL_MOCK_USER = {
  id: 1,
  name: 'Budi Prasetyo',
  email: 'pemilik@umkmsitebuilder.test',
};

export const INITIAL_MOCK_TEMPLATES: MockTemplate[] = [
  {
    id: 1,
    nama: 'Selera Rempah Nusantara',
    deskripsi: 'Layout hangat, ramah, dan menggugah selera khusus usaha kuliner, warung makan, dan produk makanan rumahan.',
    thumbnail_path: '/templates/previews/kuliner-rempah.png',
    token_desain: {
      warna_aksen: '#E69500',
      warna_latar: '#FCFAEE',
      warna_teks: '#3B1E19',
      font_heading: 'Outfit',
      font_body: 'Plus Jakarta Sans',
      signature_element: 'Fixed Live Receipt Order Pad (65:35 Split) + Indikator Pedas 🌶️',
    },
  },
  {
    id: 2,
    nama: 'Wastra Couture Atelier',
    deskripsi: 'Layout majalah editorial minimalis, tajam, dan elegan cocok untuk brand fashion, busana tenun, dan aksesoris mewah.',
    thumbnail_path: '/templates/previews/fashion-editorial.png',
    token_desain: {
      warna_aksen: '#D4AF37',
      warna_latar: '#F8F6F0',
      warna_teks: '#121212',
      font_heading: 'Cinzel',
      font_body: 'Inter',
      signature_element: 'Fixed Left Sidebar Navigation (280px) + Interactive Size Selector (S/M/L/XL)',
    },
  },
  {
    id: 3,
    nama: 'Earthy Craft Heritage',
    deskripsi: 'Layout natural bertekstur earthy untuk pengrajin lokal, kriya kayu, dan anyaman tradisional.',
    thumbnail_path: '/templates/previews/craft-earthy.png',
    token_desain: {
      warna_aksen: '#556B2F',
      warna_latar: '#F4F1EA',
      warna_teks: '#3E2723',
      font_heading: 'Lora',
      font_body: 'Outfit',
      signature_element: 'Artisan Process Storybook Booklet + Batch Typewriter Stamp',
    },
  },
  {
    id: 4,
    nama: 'Botanical Glow Apothecary',
    deskripsi: 'Layout luminous, higienis, dan menenangkan khusus klinik kecantikan, perawatan kulit, dan serum botanical.',
    thumbnail_path: '/templates/previews/skincare-botanical.png',
    token_desain: {
      warna_aksen: '#E8A598',
      warna_latar: '#FAF8F5',
      warna_teks: '#4A2E35',
      font_heading: 'Bodoni Moda',
      font_body: 'Outfit',
      signature_element: 'Interactive Routine Step-by-Step Wizard (Step 1-2-3)',
    },
  },
  {
    id: 5,
    nama: 'Monochrome Studio Agency',
    deskripsi: 'Layout arsitektural, presisi, dan profesional khusus studio fotografi, konsultan, dan percetakan.',
    thumbnail_path: '/templates/previews/service-studio.png',
    token_desain: {
      warna_aksen: '#0EA5E9',
      warna_latar: '#F8FAFC',
      warna_teks: '#0F172A',
      font_heading: 'Syne',
      font_body: 'Inter',
      signature_element: 'Package Feature Comparison Matrix + Session Booking Slot Calculator',
    },
  },
  {
    id: 6,
    nama: 'Harvest Fresh Organic Market',
    deskripsi: 'Layout segar, alami, dan ramah lingkungan khusus sayur hidroponik, buah segar, dan madu murni langsung dari kebun.',
    thumbnail_path: '/templates/previews/agriculture-fresh.png',
    token_desain: {
      warna_aksen: '#15803D',
      warna_latar: '#F0FDF4',
      warna_teks: '#166534',
      font_heading: 'Fraunces',
      font_body: 'DM Sans',
      signature_element: 'Harvest Weight Selector (500g/1kg) + Total Weight Counter (Kg) + Morning Harvest Badge',
    },
  },
  {
    id: 7,
    nama: 'Pasar Tetangga Sembako',
    deskripsi: 'Layout praktis, cepat, dan efisien khusus toko kelontong, sembako harian, dan grosir kebutuhan dapur.',
    thumbnail_path: '/templates/previews/grocer-sembako.png',
    token_desain: {
      warna_aksen: '#DC2626',
      warna_latar: '#FFFFFF',
      warna_teks: '#1F2937',
      font_heading: 'Rubik',
      font_body: 'Open Sans',
      signature_element: 'Quick Bulk Quantity Counter (+1/-1 Direct Table) + Wholesale Tier Badge',
    },
  },
  {
    id: 8,
    nama: 'Digital & Custom Print Lab',
    deskripsi: 'Layout modern tech-creative khusus produk digital, e-book, template Canva/Figma, dan percetakan stiker/banner custom.',
    thumbnail_path: '/templates/previews/digital-print.png',
    token_desain: {
      warna_aksen: '#06B6D4',
      warna_latar: '#090D16',
      warna_teks: '#F8FAFC',
      font_heading: 'Space Grotesk',
      font_body: 'Inter',
      signature_element: 'File Format Selector (.PNG/.PDF/.SVG) + 300 DPI Print Spec + Direct Drive Link Input',
    },
  },
  {
    id: 9,
    nama: 'Nordic Home Living & Room Spatial Showcase',
    deskripsi: 'Layout arsitektural Skandinavia yang lapang khusus toko furnitur, sofa minimalis, lampu hias, dan dekorasi ruang tamu.',
    thumbnail_path: '/templates/previews/furniture-scandi.png',
    token_desain: {
      warna_aksen: '#C87D55',
      warna_latar: '#E5E0D8',
      warna_teks: '#2C3531',
      font_heading: 'Tenor Sans',
      font_body: 'Plus Jakarta Sans',
      signature_element: 'Spatial Room Hotspot Pins + Dimension Configurator (PxLxT cm) + Material Selector',
    },
  },
  {
    id: 10,
    nama: 'Summit Trail Expedition & Performance Gear',
    deskripsi: 'Layout tactical, tangguh, dan berenergi tinggi khusus perlengkapan pendakian gunung, camping, dan alat olahraga outdoor.',
    thumbnail_path: '/templates/previews/outdoor-summit.png',
    token_desain: {
      warna_aksen: '#EA580C',
      warna_latar: '#111827',
      warna_teks: '#F9FAFB',
      font_heading: 'Barlow Condensed',
      font_body: 'Inter',
      signature_element: 'Tactical Spec Sheet + Waterproof Rating mm + Capacity Liters + Altitude MDPL Tested Badge',
    },
  },
];

export const INITIAL_MOCK_STORES: MockToko[] = [
  {
    id: 1,
    user_id: 1,
    template_id: 1,
    nama_toko: 'Dapur Sambal Bu Nani',
    slug: 'dapur-sambal-bu-nani',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#E69500',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Cita Rasa Resep Sambal Warisan Keluarga',
        about_us: 'Dapur Sambal Bu Nani menyajikan aneka sambal botolan dan lauk pauk olahan asli tanpa bahan pengawet sintesis.',
      },
      kontak: {
        whatsapp: '081234567890',
        alamat: 'Jl. Malioboro No. 45, Yogyakarta',
      },
    },
  },
  {
    id: 2,
    user_id: 1,
    template_id: 2,
    nama_toko: 'Tenun Ikat Nusantara',
    slug: 'tenun-ikat-nusantara',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#D4AF37',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Keindahan Wastra Nusantara dalam Busana Modern',
        about_us: 'Koleksi busana bergaya haute-couture berbahan dasar kain tenun asli buatan pengrajin pilihan.',
      },
      kontak: {
        whatsapp: '082198765432',
        alamat: 'Jl. Solo-Yogya KM 10, Surakarta',
      },
    },
  },
  {
    id: 3,
    user_id: 1,
    template_id: 3,
    nama_toko: 'Kriya Kayu Perhutani',
    slug: 'kriya-kayu-perhutani',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#556B2F',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Sentuhan Hangat Kayu Jati Asli di Hunian Anda',
        about_us: 'Produk perlengkapan dapur dan dekorasi rumah berbahan kayu jati pilihan bersertifikasi perhutani.',
      },
      kontak: {
        whatsapp: '085711223344',
        alamat: 'Kawasan Industri Kreatif No. 8, Jepara',
      },
    },
  },
  {
    id: 4,
    user_id: 1,
    template_id: 4,
    nama_toko: 'Glow Apothecary Herbal',
    slug: 'glow-apothecary-herbal',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#E8A598',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Pancarkan Kilau Sehat Alami Kulit Anda',
        about_us: 'Rangkaian perawatan wajah alami dengan formulasi bebas alkohol dan paraben, teruji secara dermatologis.',
      },
      kontak: {
        whatsapp: '089988776655',
        alamat: 'Bandung Beauty Hub No. 12, Bandung',
      },
    },
  },
  {
    id: 5,
    user_id: 1,
    template_id: 5,
    nama_toko: 'Lensa Grafika Studio',
    slug: 'lensa-grafika-studio',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#0EA5E9',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Abadikan Momen Berharga dalam Karya Visual Presisi High-Resolution',
        about_us: 'Studio fotografi dan dokumentasi profesional berspesialisasi dalam sesi foto pernikahan, wisuda, dan komersial.',
      },
      kontak: {
        whatsapp: '087711223344',
        alamat: 'Gedung Kresta Tower Lt. 3, Jakarta Selatan',
      },
    },
  },
  {
    id: 6,
    user_id: 1,
    template_id: 6,
    nama_toko: 'Kebun Organik Lembang',
    slug: 'kebun-organik-lembang',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#15803D',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Sayur & Buah Segar Panen Pagi Bebas Pestisida',
        about_us: 'Hasil panen segar langsung dari perkebunan organik Lembang, dipetik jam 06:00 pagi dan siap dikirim ke rumah Anda.',
      },
      kontak: {
        whatsapp: '081399887766',
        alamat: 'Jl. Perkebunan Maribaya No. 18, Lembang, Bandung Barat',
      },
    },
  },
  {
    id: 7,
    user_id: 1,
    template_id: 7,
    nama_toko: 'Toko Sembako Barokah',
    slug: 'toko-sembako-barokah',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#DC2626',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Grosir & Eceran Sembako Murah Siap Antar Langsung',
        about_us: 'Pusat kebutuhan dapur harian tetangga lengkap: minyak goreng, beras premium, gula, dan bumbu dapur harga grosir.',
      },
      kontak: {
        whatsapp: '081299001122',
        alamat: 'Jl. Pasar Ciamis No. 12, Ciamis',
      },
    },
  },
  {
    id: 8,
    user_id: 1,
    template_id: 8,
    nama_toko: 'Pixel Print Studio',
    slug: 'pixel-print-studio',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#06B6D4',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Aset Digital & Percetakan Stiker Custom High-Resolution 300 DPI',
        about_us: 'Studio kreatif penyedia template desain Canva/Figma, e-book panduan bisnis, dan cetak stiker vinyl waterproof custom.',
      },
      kontak: {
        whatsapp: '083811223344',
        alamat: 'Digital Creative Park Block B-5, BSD City',
      },
    },
  },
  {
    id: 9,
    user_id: 1,
    template_id: 9,
    nama_toko: 'Nordic Living Studio',
    slug: 'nordic-living-studio',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#C87D55',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Kehangatan Interior Skandinavia untuk Hunian Modern',
        about_us: 'Koleksi furnitur minimalis bergaya Nordic dari kayu oak solid dan kain berkualitas tinggi.',
      },
      kontak: {
        whatsapp: '081544332211',
        alamat: 'Kawasan Design District No. 9, Tangerang',
      },
    },
  },
  {
    id: 10,
    user_id: 1,
    template_id: 10,
    nama_toko: 'Summit Trail Outdoor',
    slug: 'summit-trail-outdoor',
    status: 'published',
    konfigurasi_layout: {
      warna_aksen: '#EA580C',
      logo_path: null,
      banner_path: null,
      teks_kustom: {
        hero_title: 'Peralatan Pendakian & Ekspedisi Outdoor Tangguh Tested 3.000 MDPL',
        about_us: 'Perlengkapan gunung profesional: tas carrier ergonomis, tenda dome waterproof 10.000mm, dan alat camping berkualitas tinggi.',
      },
      kontak: {
        whatsapp: '089677889900',
        alamat: 'Jl. Rayapunclak No. 45, Malang, Jawa Timur',
      },
    },
  },
];

export const INITIAL_MOCK_CATEGORIES: MockKategori[] = [
  { id: 1, toko_id: 1, nama: 'Sambal Botolan' },
  { id: 2, toko_id: 1, nama: 'Lauk Siap Saji' },
  { id: 3, toko_id: 1, nama: 'Minuman Rempah' },
  { id: 4, toko_id: 2, nama: 'Kain Tenun' },
  { id: 5, toko_id: 2, nama: 'Batik & Outer' },
  { id: 6, toko_id: 2, nama: 'Aksesoris Wastra' },
  { id: 7, toko_id: 3, nama: 'Dapur & Makan' },
  { id: 8, toko_id: 3, nama: 'Dekorasi Kayu' },
  { id: 9, toko_id: 4, nama: 'Serum & Essence' },
  { id: 10, toko_id: 4, nama: 'Pembersih Wajah' },
  { id: 11, toko_id: 4, nama: 'Pelembab & Masker' },
  { id: 12, toko_id: 5, nama: 'Sesi Foto Studio' },
  { id: 13, toko_id: 5, nama: 'Dokumentasi Acara' },
  { id: 14, toko_id: 6, nama: 'Sayur Hidroponik' },
  { id: 15, toko_id: 6, nama: 'Madu & Herbal' },
  { id: 16, toko_id: 6, nama: 'Buah Organik' },
  { id: 17, toko_id: 7, nama: 'Minyak & Gula' },
  { id: 18, toko_id: 7, nama: 'Beras & Sembako Utuh' },
  { id: 19, toko_id: 7, nama: 'Bumbu Dapur' },
  { id: 20, toko_id: 8, nama: 'Aset Digital & Template' },
  { id: 21, toko_id: 8, nama: 'Cetak Stiker Custom' },
  { id: 22, toko_id: 9, nama: 'Sofa & Kursi Santai' },
  { id: 23, toko_id: 9, nama: 'Meja & Dekorasi' },
  { id: 24, toko_id: 10, nama: 'Tas Carrier & Daypack' },
  { id: 25, toko_id: 10, nama: 'Tenda & Matras' },
  { id: 26, toko_id: 10, nama: 'Alat Masak & Apparel' },
];

export const INITIAL_MOCK_PRODUCTS: MockProduk[] = [
  // Toko 1: Dapur Sambal Bu Nani
  {
    id: 1,
    toko_id: 1,
    kategori_id: 1,
    nama: 'Sambal Cumi Ciamik 200g',
    harga: 35000,
    deskripsi: 'Sambal cumi asin melimpah dengan tingkat kepedasan sedang. Dimasak lama hingga bumbu meresap sempurna.',
    foto_path: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    toko_id: 1,
    kategori_id: 1,
    nama: 'Sambal Bawang Extra Pedas 180g',
    harga: 28000,
    deskripsi: 'Dibuat dari cabai rawit merah pilihan dan bawang merah segar. Pedas gurih menggugah selera.',
    foto_path: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    toko_id: 1,
    kategori_id: 2,
    nama: 'Rendang Daging Sapi Mande 250g',
    harga: 75000,
    deskripsi: 'Rendang sapi hitam kaya rempah khas Minang, empuk dan tahan hingga 1 bulan dalam kemasan vakum.',
    foto_path: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    toko_id: 1,
    kategori_id: 2,
    nama: 'Ayam Goreng Lengkuas Rempah 1 Ekor',
    harga: 65000,
    deskripsi: 'Ayam ungkep rempah lengkuas komplit dengan kremesan renyah dan sambal terasi gurih.',
    foto_path: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    toko_id: 1,
    kategori_id: 3,
    nama: 'Es Kunyit Asam Segar Botol 350ml',
    harga: 15000,
    deskripsi: 'Minuman herbal kunyit asam dingin kaya antioksidan murni racikan asam jawa asli.',
    foto_path: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 2: Tenun Ikat Nusantara
  {
    id: 6,
    toko_id: 2,
    kategori_id: 4,
    nama: 'Kain Tenun Troso Jepara Motif Sumba',
    harga: 185000,
    deskripsi: 'Kain tenun ATBM halus ukuran 240cm x 115cm dengan pewarnaan alami.',
    foto_path: 'https://images.unsplash.com/photo-1606744888344-49423b812d02?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    toko_id: 2,
    kategori_id: 5,
    nama: 'Outer Kimono Tenun Blanket',
    harga: 245000,
    deskripsi: 'Outer bergaya ala kimono modern, unisex dan nyaman dipakai untuk acara formal maupun santai.',
    foto_path: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    toko_id: 2,
    kategori_id: 5,
    nama: 'Kemeja Batik Tulis Pria Motif Parang',
    harga: 320000,
    deskripsi: 'Kemeja batik tulis pria berbahan katun primisima dengan lapisan furing lembut dan potongan slim-fit.',
    foto_path: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    toko_id: 2,
    kategori_id: 5,
    nama: 'Dress Tenun Etnik Vintage Asimetris',
    harga: 380000,
    deskripsi: 'Gaun wanita bergaya etnik dengan perpaduan tenun ikat dan aksen potongan asimetris modern.',
    foto_path: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    toko_id: 2,
    kategori_id: 6,
    nama: 'Tas Slingbag Aksen Kain Tenun Shibori',
    harga: 125000,
    deskripsi: 'Tas selempang kulit sintetis eksklusif berornamen kain tenun shibori buatan tangan.',
    foto_path: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 3: Kriya Kayu Perhutani
  {
    id: 11,
    toko_id: 3,
    kategori_id: 7,
    nama: 'Talenan Kayu Jati Solid Natural Finish',
    harga: 85000,
    deskripsi: 'Talenan tebal 3cm dari potongan utuh kayu jati tua. Dilapisi beeswax food grade aman untuk makanan.',
    foto_path: 'https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 12,
    toko_id: 3,
    kategori_id: 7,
    nama: 'Set Mangkuk & Sendok Kayu Mahoni (Set of 4)',
    harga: 120000,
    deskripsi: 'Mangkuk saji buatan tangan berdiameter 15cm lengkap dengan sendok kayu bertekstur halus.',
    foto_path: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 13,
    toko_id: 3,
    kategori_id: 7,
    nama: 'Cangkir Cangkringan Kayu Sonokeling Utuh',
    harga: 45000,
    deskripsi: 'Gelas cangkir kopi dari kayu sonokeling gelap alami yang tahan panas dan memiliki serat kayu mewah.',
    foto_path: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 14,
    toko_id: 3,
    kategori_id: 8,
    nama: 'Jam Dinding Kayu Jati Minimalis Round',
    harga: 195000,
    deskripsi: 'Jam dinding berbentuk bulat dari potongan kayu jati pilihan berdiameter 30cm dengan mesin sweep silent.',
    foto_path: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 15,
    toko_id: 3,
    kategori_id: 7,
    nama: 'Nampan Saji Kayu Pinus Pegangan Kuningan',
    harga: 95000,
    deskripsi: 'Nampan kayu berdesain vintage dengan pegangan kuningan kokoh untuk menyajikan teh atau sarapan.',
    foto_path: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 4: Glow Apothecary Herbal
  {
    id: 16,
    toko_id: 4,
    kategori_id: 9,
    nama: 'Botanical Niacinamide Glow Serum 30ml',
    harga: 115000,
    deskripsi: 'Serum pencerah dengan 5% Niacinamide dan ekstrak Centella Asiatica untuk menyamarkan noda hitam.',
    foto_path: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 17,
    toko_id: 4,
    kategori_id: 10,
    nama: 'Gentle Centella Cleansing Foam 100ml',
    harga: 78000,
    deskripsi: 'Pembersih wajah lembut pH seimbang yang membersihkan pori-pori tanpa membuat kulit terasa kering.',
    foto_path: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 18,
    toko_id: 4,
    kategori_id: 11,
    nama: 'Moisturizer Gel Aloe & Hydrating Rose 50g',
    harga: 95000,
    deskripsi: 'Pelembab gel ringan berkandungan aloe vera dan mawar murni untuk hidrasi mengunci kelembaban 24 jam.',
    foto_path: 'https://images.unsplash.com/photo-1608248597309-8472f7efb126?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 19,
    toko_id: 4,
    kategori_id: 11,
    nama: 'Mugwort Clarifying Clay Mask 80g',
    harga: 89000,
    deskripsi: 'Masker lumpur alami tanaman mugwort untuk menenangkan jerawat dan membersihkan komedo.',
    foto_path: 'https://images.unsplash.com/photo-1567928257905-21b64a275465?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 20,
    toko_id: 4,
    kategori_id: 9,
    nama: 'Sunscreen Sunshield SPF 50 PA++++ 50ml',
    harga: 105000,
    deskripsi: 'Tabir surya tekstur cair transparan bebas whitecast dengan perlindungan maksimal dari sinar UV-A & UV-B.',
    foto_path: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 5: Lensa Grafika Studio
  {
    id: 21,
    toko_id: 5,
    kategori_id: 12,
    nama: 'Paket Foto Wedding & Prewedding Studio',
    harga: 1500000,
    deskripsi: 'Sesi foto prewedding 3 jam di studio dengan 2 gaun pilihan, 50 foto retouched, & cetak album eksklusif.',
    foto_path: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 22,
    toko_id: 5,
    kategori_id: 13,
    nama: 'Paket Sesi Foto Wisuda & Portofolio Personal',
    harga: 450000,
    deskripsi: 'Sesi foto studio 1 jam untuk lulusan wisuda / portofolio bisnis, 15 foto teredit, & cetak bingkai 8R.',
    foto_path: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 23,
    toko_id: 5,
    kategori_id: 12,
    nama: 'Paket Katalog Foto Produk UMKM (10 Produk)',
    harga: 650000,
    deskripsi: 'Sesi pemotretan produk profesional di studio dengan background polos dan pencahayaan softbox komersial.',
    foto_path: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 24,
    toko_id: 5,
    kategori_id: 13,
    nama: 'Jasa Liputan Video Cinematic Acara 1 Hari',
    harga: 2200000,
    deskripsi: 'Pengambilan video dokumentasi acara dengan kamera sinema 4K, gimbal stabilizer, & editing teaser 1 menit.',
    foto_path: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 25,
    toko_id: 5,
    kategori_id: 12,
    nama: 'Paket Foto Family & Maternity Studio 1.5 Jam',
    harga: 550000,
    deskripsi: 'Foto keluarga dan kehamilan hangat di studio dengan kostum bebas, 20 foto teredit, dan cetak 10R.',
    foto_path: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 6: Kebun Organik Lembang
  {
    id: 26,
    toko_id: 6,
    kategori_id: 14,
    nama: 'Bayam & Kangkung Hidroponik Petik Pagi',
    harga: 15000,
    deskripsi: 'Bayam hijau dan kangkung segar dipetik pagi hari dari greenhouse hidroponik. Bebas pestisida kimia 100%.',
    foto_path: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 27,
    toko_id: 6,
    kategori_id: 15,
    nama: 'Madu Hutan Murni Baduy 500ml',
    harga: 125000,
    deskripsi: 'Madu mentah murni dari lebah liar hutan Baduy. Kaya enzim alami tanpa campuran gula sintesis.',
    foto_path: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 28,
    toko_id: 6,
    kategori_id: 16,
    nama: 'Stroberi Organik Lembang Manis 250g',
    harga: 35000,
    deskripsi: 'Buah stroberi manis matang pohon dari perkebunan tinggi Lembang. Dikemas rapi bebas memar.',
    foto_path: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 29,
    toko_id: 6,
    kategori_id: 14,
    nama: 'Tomat Cherry Organik Red & Yellow 300g',
    harga: 22000,
    deskripsi: 'Tomat cherry mini renyah rasanya manis asam segar untuk salad buah dan masakan lezat.',
    foto_path: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 30,
    toko_id: 6,
    kategori_id: 16,
    nama: 'Alpukat Mentega Super Lembang 1kg',
    harga: 45000,
    deskripsi: 'Alpukat mentega daging tebal berbiji kecil, gurih pulen cocok untuk jus sehat dan camilan.',
    foto_path: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 7: Toko Sembako Barokah
  {
    id: 31,
    toko_id: 7,
    kategori_id: 17,
    nama: 'Minyak Goreng Sawit Pouch 2 Liter',
    harga: 34000,
    deskripsi: 'Minyak goreng kelapa sawit jernih ganda. Cocok untuk gorengan renyah dan hemat kebutuhan dapur harian.',
    foto_path: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 32,
    toko_id: 7,
    kategori_id: 18,
    nama: 'Beras Premium Raja Super 5kg',
    harga: 68000,
    deskripsi: 'Beras putih bersih rasa pulen alami tanpa pemutih dan pengawet. Kemasan karung 5kg praktis.',
    foto_path: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 33,
    toko_id: 7,
    kategori_id: 17,
    nama: 'Gula Pasir Kristal Putih Premium 1kg',
    harga: 17500,
    deskripsi: 'Gula kristal putih manis murni olahan tebu asli untuk pemanis minuman dan olahan kue.',
    foto_path: 'https://images.unsplash.com/photo-1622484210800-8889988a8047?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 34,
    toko_id: 7,
    kategori_id: 19,
    nama: 'Tepung Terigu Serbaguna Protein Sedang 1kg',
    harga: 12000,
    deskripsi: 'Tepung terigu serbaguna untuk aneka gorengan, mie, dan kue kering tekstur lembut.',
    foto_path: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 35,
    toko_id: 7,
    kategori_id: 18,
    nama: 'Telur Ayam Negeri Segar Pack 1kg (16 Butir)',
    harga: 28500,
    deskripsi: 'Telur ayam peternakan segar cangkang tebal bebas retak, diambil segar tiap hari.',
    foto_path: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 8: Pixel Print Studio
  {
    id: 36,
    toko_id: 8,
    kategori_id: 20,
    nama: 'Bundle 50+ Template Canva IG Feed Aesthetic',
    harga: 49000,
    deskripsi: 'File template Canva fully editable untuk promosi UMKM kuliner & fashion. Lisensi komersial seumur hidup.',
    foto_path: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 37,
    toko_id: 8,
    kategori_id: 21,
    nama: 'Cetak Stiker Vinyl Waterproof (A3+ Sheet)',
    harga: 25000,
    deskripsi: 'Stiker vinyl anti air & minyak resolusi 300 DPI tajam. Sudah termasuk Kiss-Cut potong bentuk.',
    foto_path: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 38,
    toko_id: 8,
    kategori_id: 21,
    nama: 'Cetak Kartu Nama Full Color Box 100 Pcs',
    harga: 35000,
    deskripsi: 'Kartu nama kertas Art Carton 260gsm cetak 2 sisi tajam lengkap laminasi doff / glossy.',
    foto_path: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 39,
    toko_id: 8,
    kategori_id: 20,
    nama: 'E-Book Panduan Branding & Marketing UMKM',
    harga: 39000,
    deskripsi: 'Buku panduan digital 120 halaman strategi membesarkan brand UMKM di era sosial media & marketplace.',
    foto_path: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 40,
    toko_id: 8,
    kategori_id: 21,
    nama: 'Cetak Banner Spanduk Flexy 280gsm 2x1 Meter',
    harga: 45000,
    deskripsi: 'Spanduk banner luar ruangan bahan flexy tahan hujan & panas lengkap mata ayam di 4 sudut.',
    foto_path: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 9: Nordic Living Studio
  {
    id: 41,
    toko_id: 9,
    kategori_id: 22,
    nama: 'Sofa Minimalis Nordic 2-Seater Fabric',
    harga: 3200000,
    deskripsi: 'Sofa 2 dudukan dengan busa empuk tidak mudah gembos. Rangka kayu oak solid dengan dudukan kain fabric.',
    foto_path: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 42,
    toko_id: 9,
    kategori_id: 23,
    nama: 'Meja Kopi Jati Scandinavian Oval',
    harga: 1450000,
    deskripsi: 'Meja tamu berdesain oval Skandinavia dari kayu jati olahan halus. Ukuran 120cm x 60cm x 45cm.',
    foto_path: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 43,
    toko_id: 9,
    kategori_id: 22,
    nama: 'Kursi Makan Minimalis Kayu Oak Seat Cushioned',
    harga: 650000,
    deskripsi: 'Kursi makan kayu oak berkualitas tinggi dengan bantalan busa empuk dilapisi kain linen tahan kotor.',
    foto_path: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 44,
    toko_id: 9,
    kategori_id: 23,
    nama: 'Lampu Meja Standing Warm Wood Aesthetic',
    harga: 380000,
    deskripsi: 'Lampu baca meja berkaki kayu jati dengan kap kain linen krem memberi nuansa hangat interior kamar.',
    foto_path: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 45,
    toko_id: 9,
    kategori_id: 23,
    nama: 'Rak Buku Dinding Minimalis Wood Floating 80cm',
    harga: 290000,
    deskripsi: 'Rak gantung dinding serbaguna untuk hiasan tanaman dan buku favorit berbahan kayu lapis kuat.',
    foto_path: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
  },

  // Toko 10: Summit Trail Outdoor
  {
    id: 46,
    toko_id: 10,
    kategori_id: 24,
    nama: 'Tas Carrier Expedition 65+10 Liters Waterproof',
    harga: 890000,
    deskripsi: 'Tas ransel gunung 65L ergonomis dengan jahitan bar-tack kuat, raincover bawaan, & backsystem sirkulasi udara.',
    foto_path: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 47,
    toko_id: 10,
    kategori_id: 25,
    nama: 'Tenda Dome Double Layer 4-Person Waterproof 10.000mm',
    harga: 1150000,
    deskripsi: 'Tenda kemping 4 orang dengan frame aluminium alloy ultralight, tahan terpaan angin kencang & hujan badai.',
    foto_path: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 48,
    toko_id: 10,
    kategori_id: 25,
    nama: 'Sleeping Bag Ultralight Polar Thermal -5°C',
    harga: 245000,
    deskripsi: 'Kantong tidur gunung hangat berlapis dacron polar thermal, dapat dilipat ringkas seukuran botol air.',
    foto_path: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 49,
    toko_id: 10,
    kategori_id: 26,
    nama: 'Kompor Camping Portable Mini Windproof',
    harga: 135000,
    deskripsi: 'Kompor mini outdoor berbahan bakar tabung kaleng dengan pelindung angin lipat stainless steel.',
    foto_path: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 50,
    toko_id: 10,
    kategori_id: 26,
    nama: 'Nesting Cooking Set Anodized Aluminum 4 in 1',
    harga: 185000,
    deskripsi: 'Panci dan wajan masak kemping aluminium anti lengket lengkap dengan teko mini dan mangkuk plastik.',
    foto_path: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=600&q=80',
  },
];
