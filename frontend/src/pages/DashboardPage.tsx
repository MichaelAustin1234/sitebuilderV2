import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateStoreModal } from '../components/dashboard/CreateStoreModal';
import { StoreCustomizerDrawer } from '../components/dashboard/StoreCustomizerDrawer';
import { TemplateGalleryModal } from '../components/dashboard/TemplateGalleryModal';
import { useAuth } from '../context/AuthContext';
import { ApiError, apiFetch } from '../services/api';
import { Kategori, PaginatedResponse, Produk, Toko } from '../types/produk';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Stores state
  const [tokos, setTokos] = useState<Toko[]>([]);
  const [selectedToko, setSelectedToko] = useState<Toko | null>(null);
  const [loadingTokos, setLoadingTokos] = useState(true);

  // Store Creation Modal State
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);

  // Template Modal & Customizer Drawer State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCustomizerDrawer, setShowCustomizerDrawer] = useState(false);

  // Categories state
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [showKategoriModal, setShowKategoriModal] = useState(false);
  const [newKategoriNama, setNewKategoriNama] = useState('');
  const [submittingKategori, setSubmittingKategori] = useState(false);

  // Inline Category Creation inside Product Modal
  const [showInlineKategoriAdd, setShowInlineKategoriAdd] = useState(false);
  const [inlineKategoriNama, setInlineKategoriNama] = useState('');
  const [submittingInlineKategori, setSubmittingInlineKategori] = useState(false);

  // Products state
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProduk, setTotalProduk] = useState(0);
  const [selectedKategoriId, setSelectedKategoriId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProduk, setLoadingProduk] = useState(false);

  // Modal Product Form state
  const [showProdukModal, setShowProdukModal] = useState(false);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formHarga, setFormHarga] = useState('');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formKategoriId, setFormKategoriId] = useState('');
  const [formFoto, setFormFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [submittingProduk, setSubmittingProduk] = useState(false);

  // Delete Product state
  const [deletingProduk, setDeletingProduk] = useState<Produk | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert/Feedback state
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
  const [alertError, setAlertError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // 1. Fetch User Toko
  const fetchTokos = async () => {
    try {
      const res = await apiFetch<{ tokos: Toko[] }>('/my-toko');
      const storeArray = res?.tokos || [];
      setTokos(storeArray);
      if (storeArray.length > 0) {
        setSelectedToko((prev) => {
          if (!prev) return storeArray[0];
          const found = storeArray.find((t) => t.id === prev.id);
          return found || storeArray[0];
        });
      } else {
        setSelectedToko(null);
      }
    } catch (err) {
      console.error('Gagal mengambil daftar toko:', err);
    } finally {
      setLoadingTokos(false);
    }
  };

  useEffect(() => {
    fetchTokos();
  }, []);

  const handleStoreCreated = (newToko: Toko) => {
    setTokos((prev) => [...prev, newToko]);
    setSelectedToko(newToko);
    setAlertSuccess(`Toko "${newToko.nama_toko}" berhasil dibuat! Silakan tambahkan produk atau pilih template.`);
  };

  const handleTokoUpdated = (updatedToko: Toko) => {
    setSelectedToko(updatedToko);
    setTokos((prev) => prev.map((t) => (t.id === updatedToko.id ? updatedToko : t)));
    setAlertSuccess('Data toko berhasil diperbarui.');
  };

  // 2. Fetch Categories & Products when selectedToko changes
  const fetchKategori = async (tokoId: number) => {
    try {
      const res = await apiFetch<any>(`/toko/${tokoId}/kategori`);
      const list = Array.isArray(res) ? res : res?.data || [];
      setKategoriList(list);
    } catch (err) {
      console.error('Gagal mengambil kategori:', err);
      setKategoriList([]);
    }
  };

  const fetchProduk = async (tokoId: number, currentPage = 1, katId = '', search = '') => {
    setLoadingProduk(true);
    try {
      let queryParams = `?page=${currentPage}&per_page=12`;
      if (katId) queryParams += `&kategori_id=${katId}`;
      if (search) queryParams += `&search=${encodeURIComponent(search)}`;

      const res = await apiFetch<PaginatedResponse<Produk>>(`/toko/${tokoId}/produk${queryParams}`);
      setProdukList(res?.data || []);
      setPage(res?.meta?.current_page || 1);
      setLastPage(res?.meta?.last_page || 1);
      setTotalProduk(res?.meta?.total || 0);
    } catch (err) {
      console.error('Gagal mengambil daftar produk:', err);
      setProdukList([]);
    } finally {
      setLoadingProduk(false);
    }
  };

  useEffect(() => {
    if (selectedToko?.id) {
      fetchKategori(selectedToko.id);
      fetchProduk(selectedToko.id, 1, selectedKategoriId, searchQuery);
    }
  }, [selectedToko, selectedKategoriId]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedToko?.id) {
      fetchProduk(selectedToko.id, 1, selectedKategoriId, searchQuery);
    }
  };

  // Open Create Product Modal
  const openCreateModal = () => {
    setEditingProduk(null);
    setFormNama('');
    setFormHarga('');
    setFormDeskripsi('');
    setFormKategoriId('');
    setFormFoto(null);
    setFotoPreview(null);
    setFieldErrors({});
    setAlertError(null);
    setShowProdukModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (produk: Produk) => {
    setEditingProduk(produk);
    setFormNama(produk.nama);
    setFormHarga(produk.harga.toString());
    setFormDeskripsi(produk.deskripsi || '');
    setFormKategoriId(produk.kategori_id ? produk.kategori_id.toString() : '');
    setFormFoto(null);
    setFotoPreview(produk.foto_url);
    setFieldErrors({});
    setAlertError(null);
    setShowProdukModal(true);
  };

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setAlertError('Ukuran file melebihi 2MB.');
        return;
      }

      setFormFoto(file);
      setFotoPreview(URL.createObjectURL(file));
      setAlertError(null);
    }
  };

  // Handle Product Form Submit
  const handleSaveProduk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToko) return;

    setSubmittingProduk(true);
    setFieldErrors({});
    setAlertError(null);

    const formData = new FormData();
    formData.append('nama', formNama);
    formData.append('harga', formHarga);
    if (formDeskripsi) formData.append('deskripsi', formDeskripsi);
    if (formKategoriId) formData.append('kategori_id', formKategoriId);
    if (formFoto) formData.append('foto', formFoto);

    try {
      if (editingProduk) {
        formData.append('_method', 'PUT');
        await apiFetch(`/toko/${selectedToko.id}/produk/${editingProduk.id}`, {
          method: 'POST',
          body: formData,
        });
        setAlertSuccess('Produk berhasil diperbarui.');
      } else {
        await apiFetch(`/toko/${selectedToko.id}/produk`, {
          method: 'POST',
          body: formData,
        });
        setAlertSuccess('Produk baru berhasil ditambahkan.');
      }

      setShowProdukModal(false);
      fetchProduk(selectedToko.id, page, selectedKategoriId, searchQuery);
    } catch (err) {
      if (err instanceof ApiError) {
        setAlertError(err.message);
        if (err.errors) {
          setFieldErrors(err.errors);
        }
      } else {
        setAlertError('Terjadi kesalahan saat menyimpan produk.');
      }
    } finally {
      setSubmittingProduk(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduk = async () => {
    if (!selectedToko || !deletingProduk) return;

    setIsDeleting(true);
    try {
      await apiFetch(`/toko/${selectedToko.id}/produk/${deletingProduk.id}`, {
        method: 'DELETE',
      });
      setAlertSuccess(`Produk "${deletingProduk.nama}" berhasil dihapus.`);
      setDeletingProduk(null);
      fetchProduk(selectedToko.id, page, selectedKategoriId, searchQuery);
    } catch (err) {
      setAlertError('Gagal menghapus produk.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Create Category
  const handleAddKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToko || !newKategoriNama.trim()) return;

    setSubmittingKategori(true);
    try {
      await apiFetch(`/toko/${selectedToko.id}/kategori`, {
        method: 'POST',
        body: JSON.stringify({ nama: newKategoriNama }),
      });
      setNewKategoriNama('');
      fetchKategori(selectedToko.id);
      setAlertSuccess('Kategori baru berhasil dibuat.');
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      }
    } finally {
      setSubmittingKategori(false);
    }
  };

  // Handle Inline Create Category inside Product Modal
  const handleCreateInlineKategori = async () => {
    if (!selectedToko || !inlineKategoriNama.trim()) return;

    setSubmittingInlineKategori(true);
    try {
      const res = await apiFetch<any>(`/toko/${selectedToko.id}/kategori`, {
        method: 'POST',
        body: JSON.stringify({ nama: inlineKategoriNama.trim() }),
      });
      const created = res?.kategori || res?.data || res;
      setInlineKategoriNama('');
      setShowInlineKategoriAdd(false);
      await fetchKategori(selectedToko.id);
      if (created?.id) {
        setFormKategoriId(created.id.toString());
      }
      setAlertSuccess(`Kategori "${created?.nama || 'baru'}" berhasil dibuat dan dipilih!`);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      }
    } finally {
      setSubmittingInlineKategori(false);
    }
  };

  // Handle Delete Category
  const handleDeleteKategori = async (katId: number) => {
    if (!selectedToko || !confirm('Hapus kategori ini? Produk yang menggunakan kategori ini akan dikosongkan kategorinya.')) return;

    try {
      await apiFetch(`/toko/${selectedToko.id}/kategori/${katId}`, {
        method: 'DELETE',
      });
      fetchKategori(selectedToko.id);
      fetchProduk(selectedToko.id, page, selectedKategoriId, searchQuery);
      setAlertSuccess('Kategori berhasil dihapus.');
    } catch (err) {
      alert('Gagal menghapus kategori.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCopyStoreUrl = () => {
    if (!selectedToko) return;
    const fullUrl = `${window.location.origin}/toko/${selectedToko.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setAlertSuccess(`URL Toko (${fullUrl}) berhasil disalin ke clipboard!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-[#047857] text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#047857]/20 group-hover:scale-105 transition">
              U
            </div>
            <div>
              <span className="text-base font-extrabold text-[#1E2923] tracking-tight block leading-none">
                UMKM<span className="text-[#047857]">Sitebuilder</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">Dashboard Manajemen Toko</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            {/* Store Switcher Dropdown & Create New Store Button */}
            {tokos.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Toko Aktif:</span>
                <select
                  id="store-select"
                  value={selectedToko?.id || ''}
                  onChange={(e) => {
                    const found = tokos.find((t) => t.id === Number(e.target.value));
                    if (found) setSelectedToko(found);
                  }}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {tokos.map((toko) => (
                    <option key={toko.id} value={toko.id}>
                      {toko.nama_toko} ({(toko.status || 'draft').toUpperCase()})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowCreateStoreModal(true)}
                  className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-300 text-xs font-bold rounded-lg transition"
                >
                  + Toko Baru
                </button>
              </div>
            )}

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800">{user?.name || 'Pengguna'}</p>
              <p className="text-[10px] text-slate-500">{user?.email || ''}</p>
            </div>

            <button
              id="logout-btn"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1">
        {/* Global Success / Error Banners */}
        {alertSuccess && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex justify-between items-center shadow-xs">
            <span>{alertSuccess}</span>
            <button onClick={() => setAlertSuccess(null)} className="text-emerald-600 font-bold ml-2">✕</button>
          </div>
        )}

        {alertError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex justify-between items-center shadow-xs">
            <span>{alertError}</span>
            <button onClick={() => setAlertError(null)} className="text-red-600 font-bold ml-2">✕</button>
          </div>
        )}

        {loadingTokos ? (
          <div className="p-12 text-center text-slate-500 text-sm">Memuat data toko...</div>
        ) : !selectedToko ? (
          /* Empty Store State with Prominent "+ Buat Toko Pertama Anda" CTA Button */
          <div className="bg-white rounded-3xl shadow-sm p-10 md:p-14 text-center border border-slate-200 max-w-xl mx-auto space-y-4 my-8">
            <div className="h-20 w-20 bg-cyan-100 text-cyan-700 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
              🏪
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Belum Memiliki Toko Online</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selamat datang, <strong>{user?.name}</strong>! Anda belum memiliki toko terdaftar. Buat toko pertama Anda dalam 30 detik tanpa keahlian coding.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowCreateStoreModal(true)}
                className="px-6 py-3.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-600/20 transition transform hover:-translate-y-0.5"
              >
                🚀 Buat Toko Pertama Anda Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Store Information & Actions Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800">{selectedToko.nama_toko}</h2>
                  <span className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-full ${
                    selectedToko.status === 'published' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {selectedToko.status === 'published' ? '● PUBLISHED (LIVE)' : '○ DRAFT (DRAF)'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                  <p>
                    Template Aktif:{' '}
                    <strong className="text-cyan-700 font-semibold">
                      {selectedToko.template?.nama || 'Selera Rempah'}
                    </strong>
                  </p>
                  <span>•</span>
                  <p className="flex items-center gap-1.5">
                    <span>URL Publik:</span>
                    <a
                      href={`/toko/${selectedToko.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-cyan-50 hover:bg-cyan-100 px-2 py-0.5 rounded text-cyan-800 font-mono underline font-medium"
                    >
                      /toko/{selectedToko.slug}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyStoreUrl}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold border border-slate-300 flex items-center gap-1 transition"
                      title="Salin URL lengkap toko ke clipboard"
                    >
                      📋 Salin Link
                    </button>
                  </p>
                </div>
              </div>

              {/* Action Buttons for Customizer, Template Gallery, Add Product */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  🎨 GANTI TEMPLATE (10 PILIHAN)
                </button>
                <button
                  onClick={() => setShowCustomizerDrawer(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  ⚙️ KUSTOMISASI & TERBITKAN
                </button>
              </div>
            </div>

            {/* Sub-Bar for Category & Add Product */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  id="open-kategori-modal-btn"
                  onClick={() => setShowKategoriModal(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  Kelola Kategori Toko ({kategoriList.length})
                </button>
              </div>

              <button
                id="add-product-btn"
                onClick={openCreateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <span>+</span> Tambah Produk Baru
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto flex-1 max-w-md">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Cari nama produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition"
                >
                  Cari
                </button>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-500">Filter Kategori:</span>
                <select
                  id="category-filter"
                  value={selectedKategoriId}
                  onChange={(e) => setSelectedKategoriId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full md:w-auto"
                >
                  <option value="">Semua Kategori</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>
                      {kat.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Table / List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {loadingProduk ? (
                <div className="p-12 text-center text-slate-500 text-sm">Memuat daftar produk...</div>
              ) : produkList.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="h-12 w-12 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    📦
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Produk</h3>
                  <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
                    {searchQuery || selectedKategoriId
                      ? 'Tidak ditemukan produk yang sesuai dengan filter pencarian Anda.'
                      : 'Belum ada produk yang ditambahkan ke toko ini. Tambahkan produk pertama Anda.'}
                  </p>
                  {!searchQuery && !selectedKategoriId && (
                    <button
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition"
                    >
                      Tambah Produk Pertama
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Gambar</th>
                        <th className="py-3 px-4">Nama Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga (Rp)</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {produkList.map((produk) => (
                        <tr key={produk.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4">
                            {produk.foto_url ? (
                              <img
                                src={produk.foto_url}
                                alt={produk.alt_text || produk.nama}
                                className="h-12 w-12 object-cover rounded-lg border border-slate-200"
                              />
                            ) : (
                              <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center text-[10px] font-medium border border-slate-200">
                                Tanpa Foto
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            <div>{produk.nama}</div>
                            {produk.deskripsi && (
                              <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                                {produk.deskripsi}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {produk.kategori_nama ? (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                                {produk.kategori_nama}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Tanpa kategori</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-cyan-800">
                            Rp {(produk.harga || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(produk)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px] transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeletingProduk(produk)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded font-medium text-[11px] transition"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {lastPage > 1 && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    Menampilkan Halaman <strong>{page}</strong> dari <strong>{lastPage}</strong> (Total <strong>{totalProduk}</strong> produk)
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      disabled={page <= 1}
                      onClick={() => fetchProduk(selectedToko.id, page - 1, selectedKategoriId, searchQuery)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded font-medium disabled:opacity-40 hover:bg-slate-100 transition"
                    >
                      Sebelumnya
                    </button>
                    <button
                      disabled={page >= lastPage}
                      onClick={() => fetchProduk(selectedToko.id, page + 1, selectedKategoriId, searchQuery)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded font-medium disabled:opacity-40 hover:bg-slate-100 transition"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- CREATE STORE MODAL --- */}
      <CreateStoreModal
        isOpen={showCreateStoreModal}
        onClose={() => setShowCreateStoreModal(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* --- TEMPLATE GALLERY MODAL --- */}
      {selectedToko && (
        <TemplateGalleryModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          currentToko={selectedToko}
          onTemplateSelected={handleTokoUpdated}
        />
      )}

      {/* --- STORE CUSTOMIZER DRAWER --- */}
      {selectedToko && (
        <StoreCustomizerDrawer
          isOpen={showCustomizerDrawer}
          onClose={() => setShowCustomizerDrawer(false)}
          toko={selectedToko}
          onTokoUpdated={handleTokoUpdated}
        />
      )}

      {/* --- MODAL TAMBAH / EDIT PRODUK --- */}
      {showProdukModal && selectedToko && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">
                {editingProduk ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setShowProdukModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {alertError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {alertError}
              </div>
            )}

            <form onSubmit={handleSaveProduk} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Sambal Cumi 200g"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                {fieldErrors.nama && <p className="text-red-600 mt-1">{fieldErrors.nama[0]}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="35000"
                    value={formHarga}
                    onChange={(e) => setFormHarga(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                  {fieldErrors.harga && <p className="text-red-600 mt-1">{fieldErrors.harga[0]}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider">
                      Kategori
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowInlineKategoriAdd(!showInlineKategoriAdd)}
                      className="text-[11px] text-cyan-600 font-bold hover:underline"
                    >
                      {showInlineKategoriAdd ? '✕ Batal' : '+ Tambah Kategori'}
                    </button>
                  </div>

                  {showInlineKategoriAdd && (
                    <div className="flex gap-2 mb-2 p-2 bg-cyan-50 rounded-lg border border-cyan-200">
                      <input
                        type="text"
                        placeholder="Nama kategori baru..."
                        value={inlineKategoriNama}
                        onChange={(e) => setInlineKategoriNama(e.target.value)}
                        className="flex-1 px-2.5 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCreateInlineKategori}
                        disabled={submittingInlineKategori || !inlineKategoriNama.trim()}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded transition disabled:opacity-50"
                      >
                        {submittingInlineKategori ? '...' : 'Simpan'}
                      </button>
                    </div>
                  )}

                  <select
                    value={formKategoriId}
                    onChange={(e) => setFormKategoriId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="">Tanpa Kategori</option>
                    {kategoriList.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.nama}
                      </option>
                    ))}
                  </select>
                  {kategoriList.length === 0 && !showInlineKategoriAdd && (
                    <p className="text-[10px] text-slate-500 mt-1">
                      Belum ada kategori. Klik <strong>"+ Tambah Kategori"</strong> di atas untuk membuat kategori baru.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Produk (Maks. 500 karakter)
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  placeholder="Penjelasan singkat mengenai keunggulan produk..."
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                {fieldErrors.deskripsi && <p className="text-red-600 mt-1">{fieldErrors.deskripsi[0]}</p>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Foto Produk (JPG, PNG, WEBP — Maks. 2MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="w-full text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                />
                {fieldErrors.foto && <p className="text-red-600 mt-1">{fieldErrors.foto[0]}</p>}

                {fotoPreview && (
                  <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <img src={fotoPreview} alt="Preview" className="h-16 w-16 object-cover rounded border border-slate-300" />
                    <span className="text-[11px] text-slate-500">Pratinjau Foto Produk (Alt text otomatis dari nama produk)</span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowProdukModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingProduk}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {submittingProduk ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL KELOLA KATEGORI --- */}
      {showKategoriModal && selectedToko && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 text-base">Kelola Kategori Toko</h3>
              <button
                onClick={() => setShowKategoriModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Add Category Form */}
            <form onSubmit={handleAddKategori} className="flex gap-2 mb-4">
              <input
                type="text"
                required
                placeholder="Nama kategori baru..."
                value={newKategoriNama}
                onChange={(e) => setNewKategoriNama(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingKategori}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                + Tambah
              </button>
            </form>

            {/* Category List */}
            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {kategoriList.length === 0 ? (
                <p className="text-slate-400 italic text-center py-4">Belum ada kategori yang dibuat.</p>
              ) : (
                kategoriList.map((kat) => (
                  <div key={kat.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">{kat.nama}</span>
                    <button
                      onClick={() => handleDeleteKategori(kat.id)}
                      className="text-red-600 hover:text-red-800 font-semibold px-2 py-0.5 rounded text-[11px]"
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowKategoriModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS PRODUK --- */}
      {deletingProduk && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-sm w-full p-6 text-center">
            <h3 className="font-bold text-slate-800 text-base mb-2">Konfirmasi Hapus</h3>
            <p className="text-xs text-slate-600 mb-6">
              Apakah Anda yakin ingin menghapus produk <strong>"{deletingProduk.nama}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingProduk(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteProduk}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
