export interface Toko {
  id: number;
  user_id: number;
  template_id: number | null;
  nama_toko: string;
  slug: string;
  status: 'draft' | 'published';
  konfigurasi_layout?: Record<string, any> | null;
  template?: {
    id: number;
    nama: string;
    deskripsi?: string;
    token_desain?: Record<string, any>;
  } | null;
  created_at: string;
}

export interface Kategori {
  id: number;
  toko_id: number;
  nama: string;
  created_at: string;
}

export interface Produk {
  id: number;
  toko_id: number;
  kategori_id: number | null;
  kategori_nama?: string | null;
  nama: string;
  harga: number;
  deskripsi: string | null;
  foto_path: string | null;
  foto_url: string | null;
  alt_text: string;
  created_at: string;
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}
