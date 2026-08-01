<?php

namespace Database\Seeders;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Template;
use App\Models\Toko;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Pemilik Demo Utama
        $demoUser = User::firstOrCreate(
            ['email' => 'pemilik@umkmsitebuilder.test'],
            [
                'name' => 'Budi Prasetyo',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Template Utama dengan Identitas Visual Berbeda (Sesuai AGENTS.md)
        $templateKuliner = Template::create([
            'nama' => 'Selera Rempah Nusantara',
            'deskripsi' => 'Layout hangat, ramah, dan menggugah selera khusus usaha kuliner, warung makan, dan produk makanan rumahan.',
            'thumbnail_path' => '/templates/previews/kuliner-rempah.png',
            'token_desain' => [
                'warna_aksen' => '#E69500',
                'warna_latar' => '#FCFAEE',
                'warna_teks' => '#3B1E19',
                'font_heading' => 'Outfit',
                'font_body' => 'Plus Jakarta Sans',
                'signature_element' => 'Fixed Live Receipt Order Pad (65:35 Split) + Indikator Pedas 🌶️',
            ],
        ]);

        $templateFashion = Template::create([
            'nama' => 'Wastra Couture Atelier',
            'deskripsi' => 'Layout majalah editorial minimalis, tajam, dan elegan cocok untuk brand fashion, busana tenun, dan aksesoris mewah.',
            'thumbnail_path' => '/templates/previews/fashion-editorial.png',
            'token_desain' => [
                'warna_aksen' => '#D4AF37',
                'warna_latar' => '#F8F6F0',
                'warna_teks' => '#121212',
                'font_heading' => 'Cinzel',
                'font_body' => 'Inter',
                'signature_element' => 'Fixed Left Sidebar Navigation (280px) + Interactive Size Selector (S/M/L/XL)',
            ],
        ]);

        $templateKerajinan = Template::create([
            'nama' => 'Earthy Craft Heritage',
            'deskripsi' => 'Layout natural bertekstur earthy untuk pengrajin lokal, kriya kayu, dan anyaman tradisional.',
            'thumbnail_path' => '/templates/previews/craft-earthy.png',
            'token_desain' => [
                'warna_aksen' => '#556B2F',
                'warna_latar' => '#F4F1EA',
                'warna_teks' => '#3E2723',
                'font_heading' => 'Lora',
                'font_body' => 'Outfit',
                'signature_element' => 'Artisan Process Storybook Booklet + Batch Typewriter Stamp',
            ],
        ]);

        $templateSkincare = Template::create([
            'nama' => 'Botanical Glow Apothecary',
            'deskripsi' => 'Layout luminous, higienis, dan menenangkan khusus klinik kecantikan, perawatan kulit, dan serum botanical.',
            'thumbnail_path' => '/templates/previews/skincare-botanical.png',
            'token_desain' => [
                'warna_aksen' => '#E8A598',
                'warna_latar' => '#FAF8F5',
                'warna_teks' => '#4A2E35',
                'font_heading' => 'Bodoni Moda',
                'font_body' => 'Outfit',
                'signature_element' => 'Interactive Routine Step-by-Step Wizard (Step 1-2-3)',
            ],
        ]);

        $templateJasa = Template::create([
            'nama' => 'Monochrome Studio Agency',
            'deskripsi' => 'Layout arsitektural, presisi, dan profesional khusus studio fotografi, konsultan, dan percetakan.',
            'thumbnail_path' => '/templates/previews/service-studio.png',
            'token_desain' => [
                'warna_aksen' => '#0EA5E9',
                'warna_latar' => '#F8FAFC',
                'warna_teks' => '#0F172A',
                'font_heading' => 'Syne',
                'font_body' => 'Inter',
                'signature_element' => 'Package Feature Comparison Matrix + Session Booking Slot Calculator',
            ],
        ]);

        $templatePertanian = Template::create([
            'nama' => 'Harvest Fresh Organic Market',
            'deskripsi' => 'Layout segar, alami, dan ramah lingkungan khusus sayur hidroponik, buah segar, dan madu murni langsung dari kebun.',
            'thumbnail_path' => '/templates/previews/agriculture-fresh.png',
            'token_desain' => [
                'warna_aksen' => '#15803D',
                'warna_latar' => '#F0FDF4',
                'warna_teks' => '#166534',
                'font_heading' => 'Fraunces',
                'font_body' => 'DM Sans',
                'signature_element' => 'Harvest Weight Selector (500g/1kg) + Total Weight Counter (Kg) + Morning Harvest Badge',
            ],
        ]);

        $templateSembako = Template::create([
            'nama' => 'Pasar Tetangga Sembako',
            'deskripsi' => 'Layout praktis, cepat, dan efisien khusus toko kelontong, sembako harian, dan grosir kebutuhan dapur.',
            'thumbnail_path' => '/templates/previews/grocer-sembako.png',
            'token_desain' => [
                'warna_aksen' => '#DC2626',
                'warna_latar' => '#FFFFFF',
                'warna_teks' => '#1F2937',
                'font_heading' => 'Rubik',
                'font_body' => 'Open Sans',
                'signature_element' => 'Quick Bulk Quantity Counter (+1/-1 Direct Table) + Wholesale Tier Badge',
            ],
        ]);

        $templateDigital = Template::create([
            'nama' => 'Digital & Custom Print Lab',
            'deskripsi' => 'Layout modern tech-creative khusus produk digital, e-book, template Canva/Figma, dan percetakan stiker/banner custom.',
            'thumbnail_path' => '/templates/previews/digital-print.png',
            'token_desain' => [
                'warna_aksen' => '#06B6D4',
                'warna_latar' => '#090D16',
                'warna_teks' => '#F8FAFC',
                'font_heading' => 'Space Grotesk',
                'font_body' => 'Inter',
                'signature_element' => 'File Format Selector (.PNG/.PDF/.SVG) + 300 DPI Print Spec + Direct Drive Link Input',
            ],
        ]);

        $templateFurniture = Template::create([
            'nama' => 'Nordic Home Living & Room Spatial Showcase',
            'deskripsi' => 'Layout arsitektural Skandinavia yang lapang khusus toko furnitur, sofa minimalis, lampu hias, dan dekorasi ruang tamu.',
            'thumbnail_path' => '/templates/previews/furniture-scandi.png',
            'token_desain' => [
                'warna_aksen' => '#C87D55',
                'warna_latar' => '#E5E0D8',
                'warna_teks' => '#2C3531',
                'font_heading' => 'Tenor Sans',
                'font_body' => 'Plus Jakarta Sans',
                'signature_element' => 'Spatial Room Hotspot Pins + Dimension Configurator (PxLxT cm) + Material Selector',
            ],
        ]);

        $templateOutdoor = Template::create([
            'nama' => 'Summit Trail Expedition & Performance Gear',
            'deskripsi' => 'Layout tactical, tangguh, dan berenergi tinggi khusus perlengkapan pendakian gunung, camping, dan alat olahraga outdoor.',
            'thumbnail_path' => '/templates/previews/outdoor-summit.png',
            'token_desain' => [
                'warna_aksen' => '#EA580C',
                'warna_latar' => '#111827',
                'warna_teks' => '#F9FAFB',
                'font_heading' => 'Barlow Condensed',
                'font_body' => 'Inter',
                'signature_element' => 'Tactical Spec Sheet + Waterproof Rating mm + Capacity Liters + Altitude MDPL Tested Badge',
            ],
        ]);

        // 3. Toko Dummy 1: Kuliner (5 Produk)
        $tokoKuliner = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateKuliner->id,
            'nama_toko' => 'Dapur Sambal Bu Nani',
            'slug' => 'dapur-sambal-bu-nani',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#E69500',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Cita Rasa Resep Sambal Warisan Keluarga',
                    'about_us' => 'Dapur Sambal Bu Nani menyajikan aneka sambal botolan dan lauk pauk olahan asli tanpa bahan pengawet sintesis.',
                ],
                'kontak' => [
                    'whatsapp' => '081234567890',
                    'alamat' => 'Jl. Malioboro No. 45, Yogyakarta',
                ],
            ],
        ]);

        $katSambal = Kategori::create(['toko_id' => $tokoKuliner->id, 'nama' => 'Sambal Botolan']);
        $katLauk = Kategori::create(['toko_id' => $tokoKuliner->id, 'nama' => 'Lauk Siap Saji']);
        $katMinuman = Kategori::create(['toko_id' => $tokoKuliner->id, 'nama' => 'Minuman Rempah']);

        Produk::create([
            'toko_id' => $tokoKuliner->id,
            'kategori_id' => $katSambal->id,
            'nama' => 'Sambal Cumi Ciamik 200g',
            'harga' => 35000,
            'deskripsi' => 'Sambal cumi asin melimpah dengan tingkat kepedasan sedang. Dimasak lama hingga bumbu meresap sempurna.',
            'foto_path' => 'produk/sambal_cumi_200g_1785541363036.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKuliner->id,
            'kategori_id' => $katSambal->id,
            'nama' => 'Sambal Bawang Extra Pedas 180g',
            'harga' => 28000,
            'deskripsi' => 'Dibuat dari cabai rawit merah pilihan dan bawang merah segar. Pedas gurih menggugah selera.',
            'foto_path' => 'produk/sambal_bawang_180g_1785541379396.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKuliner->id,
            'kategori_id' => $katLauk->id,
            'nama' => 'Rendang Daging Sapi Mande 250g',
            'harga' => 75000,
            'deskripsi' => 'Rendang sapi hitam kaya rempah khas Minang, empuk dan tahan hingga 1 bulan dalam kemasan vakum.',
            'foto_path' => 'produk/rendang_daging_sapi_1785541390316.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKuliner->id,
            'kategori_id' => $katLauk->id,
            'nama' => 'Ayam Goreng Lengkuas Rempah 1 Ekor',
            'harga' => 65000,
            'deskripsi' => 'Ayam ungkep rempah lengkuas komplit dengan kremesan renyah dan sambal terasi gurih.',
            'foto_path' => 'produk/ayam_goreng_lengkuas_1785583097069.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKuliner->id,
            'kategori_id' => $katMinuman->id,
            'nama' => 'Es Kunyit Asam Segar Botol 350ml',
            'harga' => 15000,
            'deskripsi' => 'Minuman herbal kunyit asam dingin kaya antioksidan murni racikan asam jawa asli.',
            'foto_path' => 'produk/es_kunyit_asam_1785583110650.png',
        ]);

        // 4. Toko Dummy 2: Fashion (5 Produk)
        $tokoFashion = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateFashion->id,
            'nama_toko' => 'Tenun Ikat Nusantara',
            'slug' => 'tenun-ikat-nusantara',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#D4AF37',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Keindahan Wastra Nusantara dalam Busana Modern',
                    'about_us' => 'Koleksi busana bergaya haute-couture berbahan dasar kain tenun asli buatan pengrajin pilihan.',
                ],
                'kontak' => [
                    'whatsapp' => '082198765432',
                    'alamat' => 'Jl. Solo-Yogya KM 10, Surakarta',
                ],
            ],
        ]);

        $katTenun = Kategori::create(['toko_id' => $tokoFashion->id, 'nama' => 'Kain Tenun']);
        $katBusana = Kategori::create(['toko_id' => $tokoFashion->id, 'nama' => 'Batik & Outer']);
        $katAksesoris = Kategori::create(['toko_id' => $tokoFashion->id, 'nama' => 'Aksesoris Wastra']);

        Produk::create([
            'toko_id' => $tokoFashion->id,
            'kategori_id' => $katTenun->id,
            'nama' => 'Kain Tenun Troso Jepara Motif Sumba',
            'harga' => 185000,
            'deskripsi' => 'Kain tenun ATBM (Alat Tenun Bukan Mesin) halus ukuran 240cm x 115cm dengan pewarnaan alami.',
            'foto_path' => 'produk/kain_tenun_troso_1785541518829.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFashion->id,
            'kategori_id' => $katBusana->id,
            'nama' => 'Outer Kimono Tenun Blanket',
            'harga' => 245000,
            'deskripsi' => 'Outer bergaya ala kimono modern, unisex dan nyaman dipakai untuk acara formal maupun santai.',
            'foto_path' => 'produk/outer_kimono_tenun_1785541530951.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFashion->id,
            'kategori_id' => $katBusana->id,
            'nama' => 'Kemeja Batik Tulis Pria Motif Parang',
            'harga' => 320000,
            'deskripsi' => 'Kemeja batik tulis pria berbahan katun primisima dengan lapisan furing lembut dan potongan slim-fit.',
            'foto_path' => 'produk/kemeja_batik_pria_1785583124762.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFashion->id,
            'kategori_id' => $katBusana->id,
            'nama' => 'Dress Tenun Etnik Vintage Asimetris',
            'harga' => 380000,
            'deskripsi' => 'Gaun wanita bergaya etnik dengan perpaduan tenun ikat dan aksen potongan asimetris modern.',
            'foto_path' => 'produk/dress_tenun_etnik_1785583140354.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFashion->id,
            'kategori_id' => $katAksesoris->id,
            'nama' => 'Tas Slingbag Aksen Kain Tenun Shibori',
            'harga' => 125000,
            'deskripsi' => 'Tas selempang kulit sintetis eksklusif berornamen kain tenun shibori buatan tangan.',
            'foto_path' => 'produk/tas_slingbag_tenun_1785583155506.png',
        ]);

        // 5. Toko Dummy 3: Kerajinan (5 Produk)
        $tokoKerajinan = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateKerajinan->id,
            'nama_toko' => 'Kriya Kayu Perhutani',
            'slug' => 'kriya-kayu-perhutani',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#556B2F',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Sentuhan Hangat Kayu Jati Asli di Hunian Anda',
                    'about_us' => 'Produk perlengkapan dapur dan dekorasi rumah berbahan kayu jati pilihan bersertifikasi perhutani.',
                ],
                'kontak' => [
                    'whatsapp' => '085711223344',
                    'alamat' => 'Kawasan Industri Kreatif No. 8, Jepara',
                ],
            ],
        ]);

        $katDapur = Kategori::create(['toko_id' => $tokoKerajinan->id, 'nama' => 'Dapur & Makan']);
        $katDekorasi = Kategori::create(['toko_id' => $tokoKerajinan->id, 'nama' => 'Dekorasi Kayu']);

        Produk::create([
            'toko_id' => $tokoKerajinan->id,
            'kategori_id' => $katDapur->id,
            'nama' => 'Talenan Kayu Jati Solid Natural Finish',
            'harga' => 85000,
            'deskripsi' => 'Talenan tebal 3cm dari potongan utuh kayu jati tua. Dilapisi beeswax food grade aman untuk makanan.',
            'foto_path' => 'produk/talenan_kayu_jati_1785541795414.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKerajinan->id,
            'kategori_id' => $katDapur->id,
            'nama' => 'Set Mangkuk & Sendok Kayu Mahoni (Set of 4)',
            'harga' => 120000,
            'deskripsi' => 'Mangkuk saji buatan tangan berdiameter 15cm lengkap dengan sendok kayu bertekstur halus.',
            'foto_path' => 'produk/mangkuk_kayu_mahoni_1785541806214.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKerajinan->id,
            'kategori_id' => $katDapur->id,
            'nama' => 'Cangkir Cangkringan Kayu Sonokeling Utuh',
            'harga' => 45000,
            'deskripsi' => 'Gelas cangkir kopi dari kayu sonokeling gelap alami yang tahan panas dan memiliki serat kayu mewah.',
            'foto_path' => 'produk/cangkir_kayu_sonokeling_1785583170581.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKerajinan->id,
            'kategori_id' => $katDekorasi->id,
            'nama' => 'Jam Dinding Kayu Jati Minimalis Round',
            'harga' => 195000,
            'deskripsi' => 'Jam dinding berbentuk bulat dari potongan kayu jati pilihan berdiameter 30cm dengan mesin sweep silent.',
            'foto_path' => 'produk/jam_dinding_kayu_1785583182411.png',
        ]);

        Produk::create([
            'toko_id' => $tokoKerajinan->id,
            'kategori_id' => $katDapur->id,
            'nama' => 'Nampan Saji Kayu Pinus Pegangan Kuningan',
            'harga' => 95000,
            'deskripsi' => 'Nampan kayu berdesain vintage dengan pegangan kuningan kokoh untuk menyajikan teh atau sarapan.',
            'foto_path' => 'produk/nampan_kayu_pinus_1785583194483.png',
        ]);

        // 6. Toko Dummy 4: Skincare (5 Produk)
        $tokoSkincare = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateSkincare->id,
            'nama_toko' => 'Glow Apothecary Herbal',
            'slug' => 'glow-apothecary-herbal',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#E8A598',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Pancarkan Kilau Sehat Alami Kulit Anda',
                    'about_us' => 'Rangkaian perawatan wajah alami dengan formulasi bebas alkohol dan paraben, teruji secara dermatologis.',
                ],
                'kontak' => [
                    'whatsapp' => '089988776655',
                    'alamat' => 'Bandung Beauty Hub No. 12, Bandung',
                ],
            ],
        ]);

        $katSerum = Kategori::create(['toko_id' => $tokoSkincare->id, 'nama' => 'Serum & Essence']);
        $katPembersih = Kategori::create(['toko_id' => $tokoSkincare->id, 'nama' => 'Pembersih Wajah']);
        $katMasker = Kategori::create(['toko_id' => $tokoSkincare->id, 'nama' => 'Pelembab & Masker']);

        Produk::create([
            'toko_id' => $tokoSkincare->id,
            'kategori_id' => $katSerum->id,
            'nama' => 'Botanical Niacinamide Glow Serum 30ml',
            'harga' => 115000,
            'deskripsi' => 'Serum pencerah dengan 5% Niacinamide dan ekstrak Centella Asiatica untuk menyamarkan noda hitam dan mencerahkan kulit.',
            'foto_path' => 'produk/serum_glow_niacinamide_1785541976370.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSkincare->id,
            'kategori_id' => $katPembersih->id,
            'nama' => 'Gentle Centella Cleansing Foam 100ml',
            'harga' => 78000,
            'deskripsi' => 'Pembersih wajah lembut pH seimbang yang membersihkan pori-pori tanpa membuat kulit terasa kering atau ditarik.',
            'foto_path' => 'produk/cleansing_foam_centella_1785541988192.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSkincare->id,
            'kategori_id' => $katMasker->id,
            'nama' => 'Moisturizer Gel Aloe & Hydrating Rose 50g',
            'harga' => 95000,
            'deskripsi' => 'Pelembab gel ringan berkandungan aloe vera dan mawar murni untuk hidrasi mengunci kelembaban 24 jam.',
            'foto_path' => 'produk/moisturizer_gel_aloe_1785583208518.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSkincare->id,
            'kategori_id' => $katMasker->id,
            'nama' => 'Mugwort Clarifying Clay Mask 80g',
            'harga' => 89000,
            'deskripsi' => 'Masker lumpur alami tanaman mugwort untuk menenangkan jerawat dan membersihkan komedo hingga ke dalam pori.',
            'foto_path' => 'produk/mugwort_clay_mask_1785583221295.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSkincare->id,
            'kategori_id' => $katSerum->id,
            'nama' => 'Sunscreen Sunshield SPF 50 PA++++ 50ml',
            'harga' => 105000,
            'deskripsi' => 'Tabir surya tekstur cair transparan bebas whitecast dengan perlindungan maksimal dari sinar UV-A & UV-B.',
            'foto_path' => 'produk/sunscreen_spf50_1785583232833.png',
        ]);

        // 7. Toko Dummy 5: Jasa Profesional (5 Produk)
        $tokoJasa = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateJasa->id,
            'nama_toko' => 'Lensa Grafika Studio',
            'slug' => 'lensa-grafika-studio',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#0EA5E9',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Abadikan Momen Berharga dalam Karya Visual Presisi High-Resolution',
                    'about_us' => 'Studio fotografi dan dokumentasi profesional berspesialisasi dalam sesi foto pernikahan, wisuda, dan komersial.',
                ],
                'kontak' => [
                    'whatsapp' => '087711223344',
                    'alamat' => 'Gedung Kresta Tower Lt. 3, Jakarta Selatan',
                ],
            ],
        ]);

        $katFoto = Kategori::create(['toko_id' => $tokoJasa->id, 'nama' => 'Sesi Foto Studio']);
        $katDoc = Kategori::create(['toko_id' => $tokoJasa->id, 'nama' => 'Dokumentasi Acara']);

        Produk::create([
            'toko_id' => $tokoJasa->id,
            'kategori_id' => $katFoto->id,
            'nama' => 'Paket Foto Wedding & Prewedding Studio',
            'harga' => 1500000,
            'deskripsi' => 'Sesi foto prewedding 3 jam di studio dengan 2 gaun pilihan, 50 foto retouched, cetak album eksklusif 10R, & seluruh softfiles.',
            'foto_path' => 'produk/foto_wedding_studio_1785542615364.png',
        ]);

        Produk::create([
            'toko_id' => $tokoJasa->id,
            'kategori_id' => $katDoc->id,
            'nama' => 'Paket Sesi Foto Wisuda & Portofolio Personal',
            'harga' => 450000,
            'deskripsi' => 'Sesi foto studio 1 jam untuk lulusan wisuda / portofolio bisnis, 15 foto teredit, cetak bingkai 8R, & softfiles via Google Drive.',
            'foto_path' => 'produk/foto_wisuda_personal_1785542629443.png',
        ]);

        Produk::create([
            'toko_id' => $tokoJasa->id,
            'kategori_id' => $katFoto->id,
            'nama' => 'Paket Katalog Foto Produk UMKM (10 Produk)',
            'harga' => 650000,
            'deskripsi' => 'Sesi pemotretan produk profesional di studio dengan background polos dan pencahayaan softbox komersial.',
            'foto_path' => 'produk/foto_katalog_produk_1785583245414.png',
        ]);

        Produk::create([
            'toko_id' => $tokoJasa->id,
            'kategori_id' => $katDoc->id,
            'nama' => 'Jasa Liputan Video Cinematic Acara 1 Hari',
            'harga' => 2200000,
            'deskripsi' => 'Pengambilan video dokumentasi acara dengan kamera sinema 4K, gimbal stabilizer, & editing teaser video 1 menit.',
            'foto_path' => 'produk/video_cinematic_event_1785583259823.png',
        ]);

        Produk::create([
            'toko_id' => $tokoJasa->id,
            'kategori_id' => $katFoto->id,
            'nama' => 'Paket Foto Family & Maternity Studio 1.5 Jam',
            'harga' => 550000,
            'deskripsi' => 'Foto keluarga dan kehamilan hangat di studio dengan kostum bebas, 20 foto teredit, dan cetak bingkai kayu 10R.',
            'foto_path' => 'produk/foto_wedding_studio_1785542615364.png',
        ]);

        // 8. Toko Dummy 6: Pertanian / Produk Segar (5 Produk)
        $tokoPertanian = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templatePertanian->id,
            'nama_toko' => 'Kebun Organik Lembang',
            'slug' => 'kebun-organik-lembang',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#15803D',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Sayur & Buah Segar Panen Pagi Bebas Pestisida',
                    'about_us' => 'Hasil panen segar langsung dari perkebunan organik Lembang, dipetik jam 06:00 pagi dan siap dikirim ke rumah Anda.',
                ],
                'kontak' => [
                    'whatsapp' => '081399887766',
                    'alamat' => 'Jl. Perkebunan Maribaya No. 18, Lembang, Bandung Barat',
                ],
            ],
        ]);

        $katSayur = Kategori::create(['toko_id' => $tokoPertanian->id, 'nama' => 'Sayur Hidroponik']);
        $katMadu = Kategori::create(['toko_id' => $tokoPertanian->id, 'nama' => 'Madu & Herbal']);
        $katBuah = Kategori::create(['toko_id' => $tokoPertanian->id, 'nama' => 'Buah Organik']);

        Produk::create([
            'toko_id' => $tokoPertanian->id,
            'kategori_id' => $katSayur->id,
            'nama' => 'Bayam & Kangkung Hidroponik Petik Pagi',
            'harga' => 15000,
            'deskripsi' => 'Bayam hijau dan kangkung segar dipetik pagi hari dari greenhouse hidroponik. Bebas pestisida kimia 100%.',
            'foto_path' => 'produk/sayur_hidroponik_segar_1785542809125.png',
        ]);

        Produk::create([
            'toko_id' => $tokoPertanian->id,
            'kategori_id' => $katMadu->id,
            'nama' => 'Madu Hutan Murni Baduy 500ml',
            'harga' => 125000,
            'deskripsi' => 'Madu mentah (raw honey) murni dari lebah liar hutan Baduy. Kaya enzim alami tanpa campuran gula sintesis.',
            'foto_path' => 'produk/madu_hutan_murni_1785542821175.png',
        ]);

        Produk::create([
            'toko_id' => $tokoPertanian->id,
            'kategori_id' => $katBuah->id,
            'nama' => 'Stroberi Organik Lembang Manis 250g',
            'harga' => 35000,
            'deskripsi' => 'Buah stroberi manis matang pohon dari perkebunan tinggi Lembang. Dikemas rapi bebas memar.',
            'foto_path' => 'produk/sayur_hidroponik_segar_1785542809125.png',
        ]);

        Produk::create([
            'toko_id' => $tokoPertanian->id,
            'kategori_id' => $katSayur->id,
            'nama' => 'Tomat Cherry Organik Red & Yellow 300g',
            'harga' => 22000,
            'deskripsi' => 'Tomat cherry mini renyah rasanya manis asam segar untuk salad buah dan masakan lezat.',
            'foto_path' => 'produk/sayur_hidroponik_segar_1785542809125.png',
        ]);

        Produk::create([
            'toko_id' => $tokoPertanian->id,
            'kategori_id' => $katBuah->id,
            'nama' => 'Alpukat Mentega Super Lembang 1kg',
            'harga' => 45000,
            'deskripsi' => 'Alpukat mentega daging tebal berbiji kecil, gurih pulen cocok untuk jus sehat dan camilan.',
            'foto_path' => 'produk/madu_hutan_murni_1785542821175.png',
        ]);

        // 9. Toko Dummy 7: Kelontong / Sembako (5 Produk)
        $tokoSembako = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateSembako->id,
            'nama_toko' => 'Toko Sembako Barokah',
            'slug' => 'toko-sembako-barokah',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#DC2626',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Grosir & Eceran Sembako Murah Siap Antar Langsung',
                    'about_us' => 'Pusat kebutuhan dapur harian tetangga lengkap: minyak goreng, beras premium, gula, dan bumbu dapur harga grosir.',
                ],
                'kontak' => [
                    'whatsapp' => '081299001122',
                    'alamat' => 'Jl. Pasar Ciamis No. 12, Ciamis',
                ],
            ],
        ]);

        $katSembakoMinyak = Kategori::create(['toko_id' => $tokoSembako->id, 'nama' => 'Minyak & Gula']);
        $katBeras = Kategori::create(['toko_id' => $tokoSembako->id, 'nama' => 'Beras & Sembako Utuh']);
        $katBumbu = Kategori::create(['toko_id' => $tokoSembako->id, 'nama' => 'Bumbu Dapur']);

        Produk::create([
            'toko_id' => $tokoSembako->id,
            'kategori_id' => $katSembakoMinyak->id,
            'nama' => 'Minyak Goreng Sawit Pouch 2 Liter',
            'harga' => 34000,
            'deskripsi' => 'Minyak goreng kelapa sawit jernih ganda. Cocok untuk gorengan renyah dan hemat kebutuhan dapur harian.',
            'foto_path' => 'produk/minyak_goreng.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSembako->id,
            'kategori_id' => $katBeras->id,
            'nama' => 'Beras Premium Raja Super 5kg',
            'harga' => 68000,
            'deskripsi' => 'Beras putih bersih rasa pulen alami tanpa pemutih dan pengawet. Kemasan karung 5kg praktis.',
            'foto_path' => 'produk/beras_premium.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSembako->id,
            'kategori_id' => $katSembakoMinyak->id,
            'nama' => 'Gula Pasir Kristal Putih Premium 1kg',
            'harga' => 17500,
            'deskripsi' => 'Gula kristal putih manis murni olahan tebu asli untuk pemanis minuman dan olahan kue.',
            'foto_path' => 'produk/minyak_goreng.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSembako->id,
            'kategori_id' => $katBumbu->id,
            'nama' => 'Tepung Terigu Serbaguna Protein Sedang 1kg',
            'harga' => 12000,
            'deskripsi' => 'Tepung terigu serbaguna untuk aneka gorengan, mie, dan kue kering tekstur lembut.',
            'foto_path' => 'produk/beras_premium.png',
        ]);

        Produk::create([
            'toko_id' => $tokoSembako->id,
            'kategori_id' => $katBeras->id,
            'nama' => 'Telur Ayam Negeri Segar Pack 1kg (16 Butir)',
            'harga' => 28500,
            'deskripsi' => 'Telur ayam peternakan segar cangkang tebal bebas retak, diambil segar tiap hari.',
            'foto_path' => 'produk/minyak_goreng.png',
        ]);

        // 10. Toko Dummy 8: Produk Digital (5 Produk)
        $tokoDigital = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateDigital->id,
            'nama_toko' => 'Pixel Print Studio',
            'slug' => 'pixel-print-studio',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#06B6D4',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Aset Digital & Percetakan Stiker Custom High-Resolution 300 DPI',
                    'about_us' => 'Studio kreatif penyedia template desain Canva/Figma, e-book panduan bisnis, dan cetak stiker vinyl waterproof custom.',
                ],
                'kontak' => [
                    'whatsapp' => '083811223344',
                    'alamat' => 'Digital Creative Park Block B-5, BSD City',
                ],
            ],
        ]);

        $katDigitalAsset = Kategori::create(['toko_id' => $tokoDigital->id, 'nama' => 'Aset Digital & Template']);
        $katCustomPrint = Kategori::create(['toko_id' => $tokoDigital->id, 'nama' => 'Cetak Stiker Custom']);

        Produk::create([
            'toko_id' => $tokoDigital->id,
            'kategori_id' => $katDigitalAsset->id,
            'nama' => 'Bundle 50+ Template Canva IG Feed Aesthetic',
            'harga' => 49000,
            'deskripsi' => 'File template Canva fully editable untuk promosi UMKM kuliner & fashion. Lisensi komersial seumur hidup.',
            'foto_path' => 'produk/template_digital.png',
        ]);

        Produk::create([
            'toko_id' => $tokoDigital->id,
            'kategori_id' => $katCustomPrint->id,
            'nama' => 'Cetak Stiker Vinyl Waterproof (A3+ Sheet)',
            'harga' => 25000,
            'deskripsi' => 'Stiker vinyl anti air & minyak resolusi 300 DPI tajam. Sudah termasuk Kiss-Cut potong bentuk sesuai desain Anda.',
            'foto_path' => 'produk/stiker_custom.png',
        ]);

        Produk::create([
            'toko_id' => $tokoDigital->id,
            'kategori_id' => $katCustomPrint->id,
            'nama' => 'Cetak Kartu Nama Full Color Box 100 Pcs',
            'harga' => 35000,
            'deskripsi' => 'Kartu nama kertas Art Carton 260gsm cetak 2 sisi tajam lengkap laminasi doff / glossy.',
            'foto_path' => 'produk/stiker_custom.png',
        ]);

        Produk::create([
            'toko_id' => $tokoDigital->id,
            'kategori_id' => $katDigitalAsset->id,
            'nama' => 'E-Book Panduan Branding & Marketing UMKM',
            'harga' => 39000,
            'deskripsi' => 'Buku panduan digital 120 halaman strategi membesarkan brand UMKM di era sosial media & marketplace.',
            'foto_path' => 'produk/template_digital.png',
        ]);

        Produk::create([
            'toko_id' => $tokoDigital->id,
            'kategori_id' => $katCustomPrint->id,
            'nama' => 'Cetak Banner Spanduk Flexy 280gsm 2x1 Meter',
            'harga' => 45000,
            'deskripsi' => 'Spanduk banner luar ruangan bahan flexy tahan hujan & panas lengkap mata ayam di 4 sudut.',
            'foto_path' => 'produk/stiker_custom.png',
        ]);

        // 11. Toko Dummy 9: Dekorasi Rumah & Furnitur (5 Produk)
        $tokoFurniture = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateFurniture->id,
            'nama_toko' => 'Nordic Living Studio',
            'slug' => 'nordic-living-studio',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#C87D55',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Kehangatan Interior Skandinavia untuk Hunian Modern',
                    'about_us' => 'Koleksi furnitur minimalis bergaya Nordic dari kayu oak solid dan kain berkualitas tinggi.',
                ],
                'kontak' => [
                    'whatsapp' => '081544332211',
                    'alamat' => 'Kawasan Design District No. 9, Tangerang',
                ],
            ],
        ]);

        $katSofa = Kategori::create(['toko_id' => $tokoFurniture->id, 'nama' => 'Sofa & Kursi Santai']);
        $katMeja = Kategori::create(['toko_id' => $tokoFurniture->id, 'nama' => 'Meja & Dekorasi']);

        Produk::create([
            'toko_id' => $tokoFurniture->id,
            'kategori_id' => $katSofa->id,
            'nama' => 'Sofa Minimalis Nordic 2-Seater Fabric',
            'harga' => 3200000,
            'deskripsi' => 'Sofa 2 dudukan dengan busa empuk tidak mudah gembos. Rangka kayu oak solid dengan dudukan kain fabric lembut.',
            'foto_path' => 'produk/sofa_nordic.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFurniture->id,
            'kategori_id' => $katMeja->id,
            'nama' => 'Meja Kopi Jati Scandinavian Oval',
            'harga' => 1450000,
            'deskripsi' => 'Meja tamu berdesain oval Skandinavia dari kayu jati olahan halus. Ukuran 120cm x 60cm x 45cm.',
            'foto_path' => 'produk/meja_kopi.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFurniture->id,
            'kategori_id' => $katSofa->id,
            'nama' => 'Kursi Makan Minimalis Kayu Oak Seat Cushioned',
            'harga' => 650000,
            'deskripsi' => 'Kursi makan kayu oak berkualitas tinggi dengan bantalan busa empuk dilapisi kain linen tahan kotor.',
            'foto_path' => 'produk/sofa_nordic.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFurniture->id,
            'kategori_id' => $katMeja->id,
            'nama' => 'Lampu Meja Standing Warm Wood Aesthetic',
            'harga' => 380000,
            'deskripsi' => 'Lampu baca meja berkaki kayu jati dengan kap kain linen krem memberi nuansa hangat interior kamar.',
            'foto_path' => 'produk/meja_kopi.png',
        ]);

        Produk::create([
            'toko_id' => $tokoFurniture->id,
            'kategori_id' => $katMeja->id,
            'nama' => 'Rak Buku Dinding Minimalis Wood Floating 80cm',
            'harga' => 290000,
            'deskripsi' => 'Rak gantung dinding serbaguna untuk hiasan tanaman dan buku favorit berbahan kayu lapis kuat.',
            'foto_path' => 'produk/meja_kopi.png',
        ]);

        // 12. Toko Dummy 10: Olahraga & Outdoor (5 Produk)
        $tokoOutdoor = Toko::create([
            'user_id' => $demoUser->id,
            'template_id' => $templateOutdoor->id,
            'nama_toko' => 'Summit Trail Outdoor',
            'slug' => 'summit-trail-outdoor',
            'status' => 'published',
            'konfigurasi_layout' => [
                'warna_aksen' => '#EA580C',
                'logo_path' => null,
                'banner_path' => null,
                'teks_kustom' => [
                    'hero_title' => 'Peralatan Pendakian & Ekspedisi Outdoor Tangguh Tested 3.000 MDPL',
                    'about_us' => 'Perlengkapan gunung profesional: tas carrier ergonomis, tenda dome waterproof 10.000mm, dan alat camping berkualitas tinggi.',
                ],
                'kontak' => [
                    'whatsapp' => '089677889900',
                    'alamat' => 'Jl. Rayapunclak No. 45, Malang, Jawa Timur',
                ],
            ],
        ]);

        $katTas = Kategori::create(['toko_id' => $tokoOutdoor->id, 'nama' => 'Tas Carrier & Daypack']);
        $katTenda = Kategori::create(['toko_id' => $tokoOutdoor->id, 'nama' => 'Tenda & Matras']);
        $katAlat = Kategori::create(['toko_id' => $tokoOutdoor->id, 'nama' => 'Alat Masak & Apparel']);

        Produk::create([
            'toko_id' => $tokoOutdoor->id,
            'kategori_id' => $katTas->id,
            'nama' => 'Tas Carrier Expedition 65+10 Liters Waterproof',
            'harga' => 890000,
            'deskripsi' => 'Tas ransel gunung 65L ergonomis dengan jahitan bar-tack kuat, raincover bawaan, & backsystem sirkulasi udara dingin.',
            'foto_path' => 'produk/tas_carrier.png',
        ]);

        Produk::create([
            'toko_id' => $tokoOutdoor->id,
            'kategori_id' => $katTenda->id,
            'nama' => 'Tenda Dome Double Layer 4-Person Waterproof 10.000mm',
            'harga' => 1150000,
            'deskripsi' => 'Tenda kemping 4 orang dengan frame aluminium alloy ultralight, tahan terpaan angin kencang & hujan badai.',
            'foto_path' => 'produk/tas_carrier.png',
        ]);

        Produk::create([
            'toko_id' => $tokoOutdoor->id,
            'kategori_id' => $katTenda->id,
            'nama' => 'Sleeping Bag Ultralight Polar Thermal -5°C',
            'harga' => 245000,
            'deskripsi' => 'Kantong tidur gunung hangat berlapis dacron polar thermal, dapat dilipat ringkas seukuran botol air.',
            'foto_path' => 'produk/tas_carrier.png',
        ]);

        Produk::create([
            'toko_id' => $tokoOutdoor->id,
            'kategori_id' => $katAlat->id,
            'nama' => 'Kompor Camping Portable Mini Windproof',
            'harga' => 135000,
            'deskripsi' => 'Kompor mini outdoor berbahan bakar tabung kaleng dengan pelindung angin lipat stainless steel.',
            'foto_path' => 'produk/tas_carrier.png',
        ]);

        Produk::create([
            'toko_id' => $tokoOutdoor->id,
            'kategori_id' => $katAlat->id,
            'nama' => 'Nesting Cooking Set Anodized Aluminum 4 in 1',
            'harga' => 185000,
            'deskripsi' => 'Panci dan wajan masak kemping aluminium anti lengket lengkap dengan teko mini dan mangkuk plastik.',
            'foto_path' => 'produk/tas_carrier.png',
        ]);
    }
}
