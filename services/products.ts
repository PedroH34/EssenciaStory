import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import type { Category, Product } from '@/types/database';

const productSelect = `
  *,
  categories:categoria (
    nome,
    slug
  )
`;

export type ProductFilters = {
  query?: string;
  category?: string;
  limit?: number;
  onlyActive?: boolean;
  excludeIds?: string[];
};

export async function getProducts(filters: ProductFilters = {}) {
  noStore();

  if (!hasSupabaseConfig()) {
    return [] as Product[];
  }

  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select(productSelect)
    .order('created_at', { ascending: false });

  if (filters.onlyActive ?? true) {
    query = query.eq('ativo', true);
  }

  if (filters.query) {
    query = query.or(`nome.ilike.%${filters.query}%,descricao.ilike.%${filters.query}%`);
  }

  if (filters.category) {
    query = query.eq('categoria', filters.category);
  }

  if (filters.excludeIds?.length) {
    query = query.not('id', 'in', `(${filters.excludeIds.join(',')})`);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 8) {
  noStore();

  if (!hasSupabaseConfig()) {
    return [] as Product[];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('ativo', true)
    .eq('destaque', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string) {
  noStore();

  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('ativo', true)
    .single();

  if (error) {
    return null;
  }

  return data as Product;
}

export async function getAdminProductById(id: string) {
  noStore();

  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) {
    return null;
  }

  return data as Product;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  if (!product.categoria || !hasSupabaseConfig()) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('ativo', true)
    .eq('categoria', product.categoria)
    .neq('id', product.id)
    .limit(limit);

  if (error) {
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getCategories({ onlyActive = true } = {}) {
  noStore();

  if (!hasSupabaseConfig()) {
    return [] as Category[];
  }

  const supabase = await createClient();
  let query = supabase.from('categories').select('*').order('nome', { ascending: true });

  if (onlyActive) {
    query = query.eq('ativo', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Category[];
}
