import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { Toko } from '../../types/produk';

interface TemplateItem {
  id: number;
  nama: string;
  deskripsi: string;
  thumbnail_path: string;
  token_desain: {
    warna_aksen?: string;
    warna_latar?: string;
    warna_teks?: string;
    font_heading?: string;
    font_body?: string;
    signature_element?: string;
  };
}

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToko: Toko;
  onTemplateSelected: (updatedToko: Toko) => void;
}

const TEMPLATE_META: Record<
  number,
  {
    category: string;
    icon: string;
    imageUrl: string;
    demoSlug: string;
    accentHex: string;
    tagline: string;
  }
> = {
  1: {
    category: 'Kuliner & F&B',
    icon: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'dapur-sambal-bu-nani',
    accentHex: '#E69500',
    tagline: 'Warm Bistro • 65:35 Split Screen • Receipt Order Pad',
  },
  2: {
    category: 'Fashion & Butik',
    icon: '👗',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'tenun-ikat-nusantara',
    accentHex: '#D4AF37',
    tagline: 'Editorial Lookbook • 280px Left Sidebar • Size Selector',
  },
  3: {
    category: 'Kerajinan Tangan',
    icon: '🪵',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'kriya-kayu-perhutani',
    accentHex: '#556B2F',
    tagline: 'Earthy Storybook • Wood Craft Journal • Typewriter Stamp',
  },
  4: {
    category: 'Skincare & Kecantikan',
    icon: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1608248597263-00079e96447c?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'glow-apothecary-herbal',
    accentHex: '#E8A598',
    tagline: 'Botanical Lab • Routine Wizard • Step-by-Step 1-2-3',
  },
  5: {
    category: 'Jasa Profesional',
    icon: '📷',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'lensa-grafika-studio',
    accentHex: '#0EA5E9',
    tagline: 'Studio Photography • Package Feature Matrix • Booking',
  },
  6: {
    category: 'Pertanian & Produk Segar',
    icon: '🌿',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'kebun-organik-lembang',
    accentHex: '#15803D',
    tagline: 'Organic Harvest • 06:00 Morning Petik • Weight Counter (Kg)',
  },
  7: {
    category: 'Kelontong & Sembako',
    icon: '🛒',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'toko-sembako-barokah',
    accentHex: '#DC2626',
    tagline: 'Pantry Grocery • Direct Table Counter • Wholesale Tier',
  },
  8: {
    category: 'Produk Digital & Print',
    icon: '⚡',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'pixel-print-studio',
    accentHex: '#06B6D4',
    tagline: 'Cyber Digital Lab • 300 DPI Print Spec • Format Selector',
  },
  9: {
    category: 'Dekorasi & Furnitur',
    icon: '🛋️',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'nordic-living-studio',
    accentHex: '#C87D55',
    tagline: 'Nordic Scandinavian • Spatial Room Hotspot • Oak Material',
  },
  10: {
    category: 'Olahraga & Outdoor',
    icon: '🧗‍♂️',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&auto=format&fit=crop&q=80',
    demoSlug: 'summit-trail-outdoor',
    accentHex: '#EA580C',
    tagline: 'Tactical Basecamp • 3.000 MDPL Tested • Waterproof Rating',
  },
};

const FILTER_TABS = [
  { id: 'all', label: 'Semua (10)' },
  { id: 'Kuliner & F&B', label: '🍲 Kuliner' },
  { id: 'Fashion & Butik', label: '👗 Fashion' },
  { id: 'Kerajinan Tangan', label: '🪵 Kerajinan' },
  { id: 'Skincare & Kecantikan', label: '✨ Skincare' },
  { id: 'Jasa Profesional', label: '📷 Jasa' },
  { id: 'Pertanian & Produk Segar', label: '🌿 Pertanian' },
  { id: 'Kelontong & Sembako', label: '🛒 Sembako' },
  { id: 'Produk Digital & Print', label: '⚡ Digital' },
  { id: 'Dekorasi & Furnitur', label: '🛋️ Furnitur' },
  { id: 'Olahraga & Outdoor', label: '🧗‍♂️ Outdoor' },
];

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  currentToko,
  onTemplateSelected,
}) => {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const modalTabsRef = React.useRef<HTMLDivElement>(null);

  const scrollModalTabs = (direction: 'left' | 'right') => {
    if (modalTabsRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      modalTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await apiFetch<{ templates: TemplateItem[] }>('/templates');
      setTemplates(res.templates || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat daftar template.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: number) => {
    if (currentToko.template_id === templateId || selectingId) return;

    setSelectingId(templateId);
    setErrorMessage(null);
    try {
      const res = await apiFetch<{ toko: Toko }>(`/toko/${currentToko.id}/select-template`, {
        method: 'POST',
        body: JSON.stringify({ template_id: templateId }),
      });
      onTemplateSelected(res.toko);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengganti template toko.');
    } finally {
      setSelectingId(null);
    }
  };

  if (!isOpen) return null;

  const filteredTemplates = activeCategoryFilter === 'all'
    ? templates
    : templates.filter((t) => {
        const meta = TEMPLATE_META[t.id];
        return meta?.category === activeCategoryFilter;
      });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
        
        {/* Sleek Minimalist Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 uppercase">
                GALERI DESAIN WEBSITES
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                10 DESAIN AUTENTIK
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pilih Layout Toko Online Anda
            </h3>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Minimalist Category Filter Pills with Scroll Arrows */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollModalTabs('left')}
            className="h-7 w-7 rounded-full bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs cursor-pointer transition active:scale-95"
            title="Geser ke Kiri"
          >
            ◀
          </button>

          <div
            ref={modalTabsRef}
            className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth flex-1 scrollbar-none"
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                  activeCategoryFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollModalTabs('right')}
            className="h-7 w-7 rounded-full bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs cursor-pointer transition active:scale-95"
            title="Geser ke Kanan"
          >
            ▶
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* Scrollable Gallery Cards */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/50">
          {loading ? (
            <div className="py-24 text-center text-slate-500 font-semibold text-sm">
              Memuat galeri desain template...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
              {filteredTemplates.map((tpl) => {
                const isCurrent = currentToko.template_id === tpl.id;
                const token = tpl.token_desain || {};
                const meta = TEMPLATE_META[tpl.id] || {
                  category: 'UMKM',
                  icon: '🏪',
                  imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&auto=format&fit=crop&q=80',
                  demoSlug: 'dapur-sambal-bu-nani',
                  accentHex: '#0EA5E9',
                  tagline: 'Standard Multi-Tenant Layout',
                };
                const isSelecting = selectingId === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className={`bg-white rounded-3xl border transition duration-300 flex flex-col justify-between overflow-hidden group shadow-xs ${
                      isCurrent
                        ? 'border-cyan-500 ring-4 ring-cyan-500/15 shadow-xl'
                        : 'border-slate-200/80 hover:border-slate-400 hover:shadow-xl'
                    }`}
                  >
                    <div>
                      {/* Ultra-Clean 16:9 Image Preview Frame */}
                      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                        <img
                          src={meta.imageUrl}
                          alt={tpl.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                        />

                        {/* Soft Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>

                        {/* Top Left Floating Category Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-md backdrop-blur-xs">
                          <span>{meta.icon}</span>
                          <span>{meta.category}</span>
                        </div>

                        {/* Active Badge */}
                        {isCurrent && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-mono font-bold shadow-md">
                            ✓ AKTIF SAAT INI
                          </div>
                        )}

                        {/* Bottom Tagline Overlay */}
                        <div className="absolute bottom-3 inset-x-3">
                          <span className="text-[10px] font-mono text-white/90 drop-shadow-sm font-semibold truncate block">
                            {meta.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Clean Card Body */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                            {tpl.nama}
                          </h4>
                          <span
                            className="h-4 w-4 rounded-full border border-slate-300 shrink-0 shadow-xs"
                            style={{ backgroundColor: token.warna_aksen || meta.accentHex }}
                            title={`Warna aksen: ${token.warna_aksen}`}
                          ></span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {tpl.deskripsi}
                        </p>

                        {/* Minimalist Signature Pill */}
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-mono font-medium border border-slate-200">
                            <span className="text-cyan-600 font-bold">✨</span>
                            <span className="truncate max-w-[240px]">{token.signature_element || 'Layout Khusus'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Footer: Live Demo + Select Template */}
                    <div className="p-6 pt-0 flex gap-2">
                      <a
                        href={`/toko/${meta.demoSlug}?preview=true`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-200"
                        title="Buka pratinjau live demo di tab baru"
                      >
                        <span>👁️</span> Demo
                      </a>

                      <button
                        type="button"
                        disabled={isCurrent || isSelecting}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 ${
                          isCurrent
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300 font-mono'
                            : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md cursor-pointer'
                        }`}
                      >
                        {isSelecting ? (
                          <>🔄 Menerapkan...</>
                        ) : isCurrent ? (
                          <>✓ Desain Aktif</>
                        ) : (
                          <>Gunakan Desain Ini</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
