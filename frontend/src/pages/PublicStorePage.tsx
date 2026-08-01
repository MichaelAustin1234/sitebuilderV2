import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AgricultureTemplate } from '../components/templates/AgricultureTemplate';
import { CraftTemplate } from '../components/templates/CraftTemplate';
import { DigitalPrintTemplate } from '../components/templates/DigitalPrintTemplate';
import { FashionTemplate } from '../components/templates/FashionTemplate';
import { FurnitureTemplate } from '../components/templates/FurnitureTemplate';
import { KulinerTemplate } from '../components/templates/KulinerTemplate';
import { OutdoorTemplate } from '../components/templates/OutdoorTemplate';
import { SembakoTemplate } from '../components/templates/SembakoTemplate';
import { ServicesTemplate } from '../components/templates/ServicesTemplate';
import { SkincareTemplate } from '../components/templates/SkincareTemplate';
import { apiFetch } from '../services/api';
import { Kategori, Produk, Toko } from '../types/produk';

interface FullStoreData extends Toko {
  kategoris: Kategori[];
  produks: Produk[];
  template: {
    id: number;
    nama: string;
    deskripsi: string;
    token_desain: Record<string, any>;
  } | null;
}

export const PublicStorePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPreview = searchParams.get('preview') === 'true';

  const [tokoData, setTokoData] = useState<FullStoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicStore = async () => {
      if (!slug) return;
      setLoading(true);
      setErrorStatus(null);
      setErrorMessage(null);

      try {
        const endpoint = isPreview
          ? `/public/toko/${slug}?preview=true`
          : `/public/toko/${slug}`;
        const response = await apiFetch<{ toko: FullStoreData }>(endpoint);
        setTokoData(response.toko);
      } catch (err: any) {
        setErrorStatus(err.status || 500);
        setErrorMessage(err.message || 'Toko tidak ditemukan atau belum diterbitkan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStore();
  }, [slug, isPreview]);

  // SEO & Open Graph Tags Injection
  useEffect(() => {
    if (tokoData) {
      const layout = tokoData.konfigurasi_layout || {};
      const storeName = tokoData.nama_toko;
      const aboutUsText = layout.teks_kustom?.about_us || `${storeName} - Toko Online Resmi UMKM. Belanja produk berkualitas dengan transaksi mudah.`;
      const metaDescription = aboutUsText.length > 150 ? aboutUsText.substring(0, 147) + '...' : aboutUsText;

      // 1. Dynamic Page Title
      document.title = `${storeName} - Toko Online Official`;

      // Helper function to set or update meta tag
      const setMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
        let element = document.querySelector(selector);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attributeName, attributeValue);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      // 2. Standard Meta Description
      setMetaTag('meta[name="description"]', 'name', 'description', metaDescription);

      // 3. Open Graph Tags
      setMetaTag('meta[property="og:title"]', 'property', 'og:title', `${storeName} - Toko Online Official`);
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription);
      setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
      setMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);

      // Set Open Graph Image (logo/banner or fallback)
      let imageUrl = 'http://localhost:8000/storage/default-og.png';
      if (layout.logo_path) {
        imageUrl = `http://localhost:8000/storage/${layout.logo_path}`;
      } else if (layout.banner_path) {
        imageUrl = `http://localhost:8000/storage/${layout.banner_path}`;
      }
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    }
  }, [tokoData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400 text-sm font-mono font-semibold">
        Memuat toko...
      </div>
    );
  }

  // Active tone Error States (AGENTS.md)
  if (errorStatus || !tokoData) {
    const isDraftError = errorStatus === 403;

    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-800 p-8 max-w-md w-full text-center space-y-4">
          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-lg border ${
            isDraftError
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {isDraftError ? '🔒' : '🔍'}
          </div>

          <h1 className="text-xl font-bold text-white">
            {isDraftError ? 'Toko Masih Dalam Status Draf' : 'Toko Tidak Ditemukan'}
          </h1>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isDraftError
              ? 'Pemilik toko belum menerbitkan toko ini secara publik. Jika Anda adalah pemilik toko, silakan login ke dashboard dan klik Terbitkan Toko.'
              : errorMessage || 'URL toko yang Anda cari tidak terdaftar atau telah diubah slug-nya oleh pemilik toko. Periksa kembali alamat link yang Anda tuju.'}
          </p>

          <div className="pt-2">
            <a
              href="/"
              className="inline-block px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition"
            >
              Kembali ke Beranda Platform
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Determine template to render
  const templateName = tokoData.template?.nama?.toLowerCase() || '';

  const renderTemplateComponent = () => {
    if (templateName.includes('outdoor') || templateName.includes('summit') || templateName.includes('trail') || tokoData.slug.includes('summit') || tokoData.slug.includes('outdoor')) {
      return <OutdoorTemplate toko={tokoData} />;
    }

    if (templateName.includes('nordic') || templateName.includes('furniture') || templateName.includes('dekorasi') || tokoData.slug.includes('nordic') || tokoData.slug.includes('living')) {
      return <FurnitureTemplate toko={tokoData} />;
    }

    if (templateName.includes('digital') || templateName.includes('print') || tokoData.slug.includes('pixel') || tokoData.slug.includes('digital')) {
      return <DigitalPrintTemplate toko={tokoData} />;
    }

    if (templateName.includes('sembako') || templateName.includes('kelontong') || tokoData.slug.includes('barokah') || tokoData.slug.includes('sembako')) {
      return <SembakoTemplate toko={tokoData} />;
    }

    if (templateName.includes('harvest') || templateName.includes('agriculture') || templateName.includes('segar') || tokoData.slug.includes('lembang') || tokoData.slug.includes('organik')) {
      return <AgricultureTemplate toko={tokoData} />;
    }

    if (templateName.includes('service') || templateName.includes('studio') || templateName.includes('jasa') || tokoData.slug.includes('studio') || tokoData.slug.includes('grafika')) {
      return <ServicesTemplate toko={tokoData} />;
    }

    if (templateName.includes('skincare') || templateName.includes('botanical') || tokoData.slug.includes('glow') || tokoData.slug.includes('apothecary')) {
      return <SkincareTemplate toko={tokoData} />;
    }

    if (templateName.includes('craft') || templateName.includes('kriya') || tokoData.slug.includes('kriya') || tokoData.slug.includes('kayu')) {
      return <CraftTemplate toko={tokoData} />;
    }

    if (templateName.includes('fashion') || templateName.includes('wastra') || tokoData.slug.includes('tenun')) {
      return <FashionTemplate toko={tokoData} />;
    }

    // Default to KulinerTemplate
    return <KulinerTemplate toko={tokoData} />;
  };

  return (
    <>
      {/* Draft Mode Preview Banner */}
      {isPreview && (
        <div className="bg-amber-500 text-slate-950 text-xs font-mono font-bold py-2.5 px-4 sticky top-0 z-50 shadow-md border-b border-amber-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>⚠️ MODE PRATINJAU (PREVIEW MODE) — Tampilan ini menyesuaikan perubahan draf toko Anda sebelum diterbitkan.</span>
          <a
            href="/dashboard"
            className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[11px] hover:bg-slate-800 transition font-sans font-bold shrink-0"
          >
            ← Kembali ke Dashboard
          </a>
        </div>
      )}

      {renderTemplateComponent()}
    </>
  );
};
