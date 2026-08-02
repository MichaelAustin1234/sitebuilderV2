import {
  INITIAL_MOCK_STORES,
  INITIAL_MOCK_TEMPLATES,
  INITIAL_MOCK_CATEGORIES,
  INITIAL_MOCK_PRODUCTS,
  MockToko,
  MockTemplate,
  MockKategori,
  MockProduk,
} from './mockData';

const STORES_KEY = 'umkm_mock_stores_v2';
const TEMPLATES_KEY = 'umkm_mock_templates_v2';
const CATEGORIES_KEY = 'umkm_mock_categories_v2';
const PRODUCTS_KEY = 'umkm_mock_products_v2';

// Helper to initialize local storage
function initLocalStorage() {
  const existingTemplates = localStorage.getItem(TEMPLATES_KEY);
  if (!existingTemplates || existingTemplates === '[]') {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_MOCK_TEMPLATES));
  }

  const existingStores = localStorage.getItem(STORES_KEY);
  if (!existingStores || existingStores === '[]') {
    localStorage.setItem(STORES_KEY, JSON.stringify(INITIAL_MOCK_STORES));
  }

  const existingCategories = localStorage.getItem(CATEGORIES_KEY);
  if (!existingCategories || existingCategories === '[]') {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(INITIAL_MOCK_CATEGORIES));
  }

  const existingProducts = localStorage.getItem(PRODUCTS_KEY);
  if (!existingProducts || existingProducts === '[]') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_MOCK_PRODUCTS));
  }
}

// Call init on file import
initLocalStorage();

export const clientStorage = {
  getTemplates(): MockTemplate[] {
    initLocalStorage();
    try {
      const data = localStorage.getItem(TEMPLATES_KEY);
      const res = data ? JSON.parse(data) : INITIAL_MOCK_TEMPLATES;
      return res.length ? res : INITIAL_MOCK_TEMPLATES;
    } catch {
      return INITIAL_MOCK_TEMPLATES;
    }
  },

  getStores(): MockToko[] {
    initLocalStorage();
    try {
      const data = localStorage.getItem(STORES_KEY);
      const stores: MockToko[] = data ? JSON.parse(data) : INITIAL_MOCK_STORES;
      const validStores = stores.length ? stores : INITIAL_MOCK_STORES;
      const templates = this.getTemplates();
      return validStores.map(store => ({
        ...store,
        template: templates.find(t => t.id === store.template_id),
      }));
    } catch {
      return INITIAL_MOCK_STORES;
    }
  },

  getStoreBySlug(slug: string): MockToko | null {
    const stores = this.getStores();
    const store = stores.find(s => s.slug.toLowerCase() === slug.toLowerCase());
    if (!store) return null;

    const products = this.getProducts(store.id);
    const categories = this.getCategories(store.id);

    return {
      ...store,
      produk: products,
      kategori: categories,
    };
  },

  createStore(data: { nama_toko: string; template_id: number }): MockToko {
    const stores = this.getStores();
    const slug = data.nama_toko
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    if (stores.some(s => s.slug === slug)) {
      throw new Error('Slug toko sudah digunakan. Pilih nama toko lain.');
    }

    const templates = this.getTemplates();
    const template = templates.find(t => t.id === Number(data.template_id));

    const newStore: MockToko = {
      id: Date.now(),
      user_id: 1,
      template_id: Number(data.template_id),
      nama_toko: data.nama_toko,
      slug,
      status: 'draft',
      konfigurasi_layout: {
        warna_aksen: template?.token_desain?.warna_aksen || '#0EA5E9',
        logo_path: null,
        banner_path: null,
        teks_kustom: {
          hero_title: `Selamat Datang di ${data.nama_toko}`,
          about_us: 'Toko kami menyediakan produk berkualitas tinggi untuk memenuhi kebutuhan Anda.',
        },
        kontak: {
          whatsapp: '081234567890',
          alamat: 'Indonesia',
        },
      },
      template,
      produk: [],
      kategori: [],
    };

    stores.unshift(newStore);
    localStorage.setItem(STORES_KEY, JSON.stringify(stores));
    return newStore;
  },

  updateStoreCustomization(id: number, data: any): MockToko {
    const stores = this.getStores();
    const index = stores.findIndex(s => s.id === Number(id));
    if (index === -1) throw new Error('Toko tidak ditemukan.');

    const store = stores[index];

    if (data.slug && data.slug !== store.slug) {
      const slugClean = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');
      if (stores.some(s => s.id !== store.id && s.slug === slugClean)) {
        throw new Error('Slug toko sudah digunakan oleh toko lain.');
      }
      store.slug = slugClean;
    }

    if (data.nama_toko) store.nama_toko = data.nama_toko;
    if (data.template_id) store.template_id = Number(data.template_id);

    const currentConfig = store.konfigurasi_layout || {};
    store.konfigurasi_layout = {
      ...currentConfig,
      warna_aksen: data.warna_aksen || currentConfig.warna_aksen || '#0EA5E9',
      logo_path: data.logo_path !== undefined ? data.logo_path : currentConfig.logo_path,
      banner_path: data.banner_path !== undefined ? data.banner_path : currentConfig.banner_path,
      teks_kustom: {
        ...currentConfig.teks_kustom,
        hero_title: data.hero_title || currentConfig.teks_kustom?.hero_title,
        about_us: data.about_us || currentConfig.teks_kustom?.about_us,
      },
      kontak: {
        ...currentConfig.kontak,
        whatsapp: data.whatsapp || currentConfig.kontak?.whatsapp,
        alamat: data.alamat || currentConfig.kontak?.alamat,
      },
    };

    const templates = this.getTemplates();
    store.template = templates.find(t => t.id === store.template_id);

    stores[index] = store;
    localStorage.setItem(STORES_KEY, JSON.stringify(stores));
    return store;
  },

  publishStore(id: number): MockToko {
    const stores = this.getStores();
    const index = stores.findIndex(s => s.id === Number(id));
    if (index === -1) throw new Error('Toko tidak ditemukan.');

    stores[index].status = 'published';
    localStorage.setItem(STORES_KEY, JSON.stringify(stores));
    return stores[index];
  },

  getCategories(tokoId: number): MockKategori[] {
    initLocalStorage();
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      const categories: MockKategori[] = data ? JSON.parse(data) : INITIAL_MOCK_CATEGORIES;
      const list = categories.length ? categories : INITIAL_MOCK_CATEGORIES;
      return list.filter(c => c.toko_id === Number(tokoId));
    } catch {
      return INITIAL_MOCK_CATEGORIES.filter(c => c.toko_id === Number(tokoId));
    }
  },

  createCategory(tokoId: number, nama: string): MockKategori {
    const data = localStorage.getItem(CATEGORIES_KEY);
    const categories: MockKategori[] = data ? JSON.parse(data) : INITIAL_MOCK_CATEGORIES;

    const newCat: MockKategori = {
      id: Date.now(),
      toko_id: Number(tokoId),
      nama: nama.trim(),
    };

    categories.push(newCat);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return newCat;
  },

  deleteCategory(id: number): void {
    const data = localStorage.getItem(CATEGORIES_KEY);
    const categories: MockKategori[] = data ? JSON.parse(data) : INITIAL_MOCK_CATEGORIES;
    const filtered = categories.filter(c => c.id !== Number(id));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
  },

  getProducts(tokoId: number, kategoriId?: number): MockProduk[] {
    initLocalStorage();
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      const products: MockProduk[] = data ? JSON.parse(data) : INITIAL_MOCK_PRODUCTS;
      const list = products.length ? products : INITIAL_MOCK_PRODUCTS;
      const categories = this.getCategories(tokoId);

      let result = list.filter(p => p.toko_id === Number(tokoId));
      if (kategoriId) {
        result = result.filter(p => p.kategori_id === Number(kategoriId));
      }

      return result.map(p => ({
        ...p,
        kategori: categories.find(c => c.id === p.kategori_id),
      }));
    } catch {
      return INITIAL_MOCK_PRODUCTS.filter(p => p.toko_id === Number(tokoId));
    }
  },

  createProduct(tokoId: number, data: any): MockProduk {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const products: MockProduk[] = raw ? JSON.parse(raw) : INITIAL_MOCK_PRODUCTS;

    let imageUri = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';
    if (data.foto && data.foto instanceof File) {
      imageUri = URL.createObjectURL(data.foto);
    } else if (data.foto_path) {
      imageUri = data.foto_path;
    }

    const newProduct: MockProduk = {
      id: Date.now(),
      toko_id: Number(tokoId),
      kategori_id: data.kategori_id ? Number(data.kategori_id) : null,
      nama: data.nama,
      harga: Number(data.harga),
      deskripsi: data.deskripsi || '',
      foto_path: imageUri,
    };

    products.unshift(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
  },

  updateProduct(tokoId: number, id: number, data: any): MockProduk {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const products: MockProduk[] = raw ? JSON.parse(raw) : INITIAL_MOCK_PRODUCTS;
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) throw new Error('Produk tidak ditemukan.');

    const existing = products[index];

    let imageUri = existing.foto_path;
    if (data.foto && data.foto instanceof File) {
      imageUri = URL.createObjectURL(data.foto);
    }

    const updated: MockProduk = {
      ...existing,
      nama: data.nama || existing.nama,
      harga: data.harga !== undefined ? Number(data.harga) : existing.harga,
      deskripsi: data.deskripsi !== undefined ? data.deskripsi : existing.deskripsi,
      kategori_id: data.kategori_id ? Number(data.kategori_id) : null,
      foto_path: imageUri,
    };

    products[index] = updated;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return updated;
  },

  deleteProduct(id: number): void {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const products: MockProduk[] = raw ? JSON.parse(raw) : INITIAL_MOCK_PRODUCTS;
    const filtered = products.filter(p => p.id !== Number(id));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },
};
