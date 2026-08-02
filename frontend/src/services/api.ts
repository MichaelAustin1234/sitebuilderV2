import { ApiErrorResponse } from '../types/auth';
import { clientStorage } from './clientStorage';
import { INITIAL_MOCK_USER } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Try real network fetch first if backend is available
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    // If server responded with 5xx or server error / bad gateway, fallback to client data engine
    if (response.status >= 500) {
      console.warn(`[Client-Data Engine] Server returned ${response.status}. Falling back to local data store.`);
      return handleClientStorageFallback<T>(endpoint, options);
    }

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      const message = errorData.message || `Terjadi kesalahan (Kode: ${response.status})`;
      throw new ApiError(response.status, message, errorData.errors);
    }

    return data as T;
  } catch (err: any) {
    // If it's an explicit 4xx ApiError from a healthy backend, rethrow it
    if (err instanceof ApiError && err.status < 500) {
      throw err;
    }

    // Otherwise (Network Error / 502 Bad Gateway / CORS / Server Down), fallback to Client Data Engine
    console.warn(`[Client-Data Engine] Network fetch failed for ${endpoint}. Falling back to local data store.`);
    return handleClientStorageFallback<T>(endpoint, options);
  }
}

// Client Storage Mock Handler
function handleClientStorageFallback<T>(endpoint: string, options: RequestInit): T {
  const method = (options.method || 'GET').toUpperCase();
  const url = endpoint.split('?')[0];

  // Auth Endpoints
  if (url === '/auth/login' || url === '/auth/register') {
    localStorage.setItem('auth_token', 'mock-demo-token-12345');
    return {
      user: INITIAL_MOCK_USER,
      token: 'mock-demo-token-12345',
      message: 'Berhasil masuk (Demo Mode)',
    } as unknown as T;
  }

  if (url === '/auth/me') {
    return {
      user: INITIAL_MOCK_USER,
    } as unknown as T;
  }

  if (url === '/auth/logout') {
    localStorage.removeItem('auth_token');
    return { message: 'Berhasil keluar' } as unknown as T;
  }

  // Templates
  if (url === '/templates' && method === 'GET') {
    return { data: clientStorage.getTemplates() } as unknown as T;
  }

  // User Stores List
  if (url === '/toko' && method === 'GET') {
    return { data: clientStorage.getStores() } as unknown as T;
  }

  // Create Store
  if (url === '/toko' && method === 'POST') {
    let bodyData: any = {};
    if (options.body) {
      bodyData = typeof options.body === 'string' ? JSON.parse(options.body) : {};
    }
    const store = clientStorage.createStore(bodyData);
    return { data: store, message: 'Toko berhasil dibuat' } as unknown as T;
  }

  // Public Store Detail by Slug: /public/toko/{slug}
  const publicStoreMatch = url.match(/^\/public\/toko\/([^/]+)$/);
  if (publicStoreMatch && method === 'GET') {
    const slug = publicStoreMatch[1];
    const store = clientStorage.getStoreBySlug(slug);
    if (!store) {
      throw new ApiError(404, 'Toko tidak ditemukan.');
    }
    return { data: store } as unknown as T;
  }

  // Public Store Products: /public/toko/{slug}/produk
  const publicProductsMatch = url.match(/^\/public\/toko\/([^/]+)\/produk$/);
  if (publicProductsMatch && method === 'GET') {
    const slug = publicProductsMatch[1];
    const store = clientStorage.getStoreBySlug(slug);
    if (!store) {
      return { data: [] } as unknown as T;
    }
    const products = clientStorage.getProducts(store.id);
    return { data: products } as unknown as T;
  }

  // Store Customization: /toko/{id}/customization
  const customMatch = url.match(/^\/toko\/(\d+)\/customization$/);
  if (customMatch && (method === 'PUT' || method === 'POST')) {
    const id = Number(customMatch[1]);
    let bodyData: any = {};
    if (options.body instanceof FormData) {
      options.body.forEach((val, key) => {
        bodyData[key] = val;
      });
    } else if (typeof options.body === 'string') {
      bodyData = JSON.parse(options.body);
    }
    const updated = clientStorage.updateStoreCustomization(id, bodyData);
    return { data: updated, message: 'Kustomisasi toko berhasil disimpan' } as unknown as T;
  }

  // Publish Store: /toko/{id}/publish
  const publishMatch = url.match(/^\/toko\/(\d+)\/publish$/);
  if (publishMatch && method === 'POST') {
    const id = Number(publishMatch[1]);
    const published = clientStorage.publishStore(id);
    return { data: published, message: 'Toko berhasil diterbitkan' } as unknown as T;
  }

  // Store Products List: /toko/{id}/produk
  const storeProductsMatch = url.match(/^\/toko\/(\d+)\/produk$/);
  if (storeProductsMatch && method === 'GET') {
    const id = Number(storeProductsMatch[1]);
    const products = clientStorage.getProducts(id);
    return { data: products } as unknown as T;
  }

  // Create Product: /toko/{id}/produk
  if (storeProductsMatch && method === 'POST') {
    const id = Number(storeProductsMatch[1]);
    let bodyData: any = {};
    if (options.body instanceof FormData) {
      options.body.forEach((val, key) => {
        bodyData[key] = val;
      });
    } else if (typeof options.body === 'string') {
      bodyData = JSON.parse(options.body);
    }
    const newProduct = clientStorage.createProduct(id, bodyData);
    return { data: newProduct, message: 'Produk berhasil ditambahkan' } as unknown as T;
  }

  // Update Product: /toko/{id}/produk/{productId}
  const productItemMatch = url.match(/^\/toko\/(\d+)\/produk\/(\d+)$/);
  if (productItemMatch && (method === 'PUT' || method === 'POST')) {
    const tokoId = Number(productItemMatch[1]);
    const productId = Number(productItemMatch[2]);
    let bodyData: any = {};
    if (options.body instanceof FormData) {
      options.body.forEach((val, key) => {
        bodyData[key] = val;
      });
    } else if (typeof options.body === 'string') {
      bodyData = JSON.parse(options.body);
    }
    const updated = clientStorage.updateProduct(tokoId, productId, bodyData);
    return { data: updated, message: 'Produk berhasil diperbarui' } as unknown as T;
  }

  // Delete Product: /toko/{id}/produk/{productId}
  if (productItemMatch && method === 'DELETE') {
    const productId = Number(productItemMatch[2]);
    clientStorage.deleteProduct(productId);
    return { message: 'Produk berhasil dihapus' } as unknown as T;
  }

  // Categories List: /toko/{id}/kategori
  const storeCategoriesMatch = url.match(/^\/toko\/(\d+)\/kategori$/);
  if (storeCategoriesMatch && method === 'GET') {
    const id = Number(storeCategoriesMatch[1]);
    const categories = clientStorage.getCategories(id);
    return { data: categories } as unknown as T;
  }

  // Create Category: /toko/{id}/kategori
  if (storeCategoriesMatch && method === 'POST') {
    const id = Number(storeCategoriesMatch[1]);
    let bodyData: any = {};
    if (typeof options.body === 'string') {
      bodyData = JSON.parse(options.body);
    }
    const newCat = clientStorage.createCategory(id, bodyData.nama || 'Kategori Baru');
    return { data: newCat, message: 'Kategori berhasil ditambahkan' } as unknown as T;
  }

  // Delete Category: /toko/{id}/kategori/{catId}
  const categoryItemMatch = url.match(/^\/toko\/(\d+)\/kategori\/(\d+)$/);
  if (categoryItemMatch && method === 'DELETE') {
    const catId = Number(categoryItemMatch[2]);
    clientStorage.deleteCategory(catId);
    return { message: 'Kategori berhasil dihapus' } as unknown as T;
  }

  // Fallback default response
  return { message: 'Operasi berhasil (Client Engine)' } as unknown as T;
}
