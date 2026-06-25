'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import { requireAdmin } from '@/services/admin-auth';

export type ImportPreview = {
  ok: boolean;
  message: string;
  marketplace?: 'mercado_livre' | 'shopee';
  originalUrl?: string;
  finalUrl?: string;
  nome?: string;
  descricao?: string;
  imagem?: string;
  preco?: string;
};

export type ImportCreateState = {
  ok: boolean;
  message: string;
  productId?: string;
};

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function nullableText(formData: FormData, key: string) {
  const value = formText(formData, key);
  return value.length ? value : null;
}

function parsePrice(value: string) {
  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function detectMarketplace(url: string): 'mercado_livre' | 'shopee' | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (
      hostname.includes('mercadolivre') ||
      hostname.includes('mercadolibre') ||
      hostname.includes('meli.la')
    ) {
      return 'mercado_livre';
    }

    if (hostname.includes('shopee') || hostname.includes('s.shopee')) {
      return 'shopee';
    }

    return null;
  } catch {
    return null;
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickMeta(html: string, keys: string[]) {
  for (const key of keys) {
    const patterns = [
      new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
      new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["'][^>]*>`, 'i'),
      new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["'][^>]*>`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        return decodeHtml(match[1]);
      }
    }
  }

  return '';
}

function pickTitle(html: string) {
  const metaTitle = pickMeta(html, ['og:title', 'twitter:title']);
  if (metaTitle) {
    return metaTitle;
  }

  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1]) : '';
}

function pickPrice(html: string) {
  const metaPrice = pickMeta(html, [
    'product:price:amount',
    'og:price:amount',
    'twitter:data1',
    'price',
  ]);

  if (metaPrice) {
    return metaPrice;
  }

  const jsonPrice = html.match(/"price"\s*:\s*"?(\d+(?:[.,]\d{1,2})?)"?/i);
  return jsonPrice?.[1] ?? '';
}

function cleanTitle(title: string, marketplace: 'mercado_livre' | 'shopee') {
  const suffixes =
    marketplace === 'mercado_livre'
      ? [/ \| Mercado Livre$/i, / - Mercado Livre$/i]
      : [/ \| Shopee Brasil$/i, / \| Shopee$/i, / - Shopee$/i];

  return suffixes.reduce((value, suffix) => value.replace(suffix, ''), title).trim();
}

async function uploadImage(formData: FormData) {
  const file = formData.get('image_file');

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const supabase = await createClient();
  const extension = file.name.split('.').pop() ?? 'webp';
  const path = `products/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(path);

  return publicUrl;
}

export async function previewOffer(
  _state: ImportPreview,
  formData: FormData,
): Promise<ImportPreview> {
  await requireAdmin();

  const originalUrl = formText(formData, 'url');

  if (!originalUrl) {
    return { ok: false, message: 'Cole o link afiliado ou o link do produto.' };
  }

  const marketplace = detectMarketplace(originalUrl);

  if (!marketplace) {
    return {
      ok: false,
      message: 'Não reconheci o marketplace. Use um link do Mercado Livre ou da Shopee.',
      originalUrl,
    };
  }

  try {
    const response = await fetch(originalUrl, {
      redirect: 'follow',
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    const html = await response.text();
    const title = cleanTitle(pickTitle(html), marketplace);
    const description = pickMeta(html, ['og:description', 'description', 'twitter:description']);
    const image = pickMeta(html, ['og:image', 'twitter:image', 'image']);
    const price = pickPrice(html);

    return {
      ok: true,
      message: title
        ? 'Dados encontrados. Revise antes de criar o rascunho.'
        : 'Link reconhecido, mas o marketplace não liberou todos os dados. Complete manualmente.',
      marketplace,
      originalUrl,
      finalUrl: response.url,
      nome: title,
      descricao: description,
      imagem: image,
      preco: price,
    };
  } catch {
    return {
      ok: true,
      message: 'Link reconhecido, mas não consegui buscar os dados. Complete manualmente.',
      marketplace,
      originalUrl,
    };
  }
}

export async function createImportedProduct(
  _state: ImportCreateState,
  formData: FormData,
): Promise<ImportCreateState> {
  await requireAdmin();

  const marketplace = formText(formData, 'marketplace') as 'mercado_livre' | 'shopee';
  const link = formText(formData, 'affiliate_url');
  const nome = formText(formData, 'nome');

  if (!nome || !link || !['mercado_livre', 'shopee'].includes(marketplace)) {
    return { ok: false, message: 'Informe link, marketplace e nome do produto.' };
  }

  try {
    const supabase = await createClient();
    const uploadedImage = await uploadImage(formData);
    const imageUrl = uploadedImage ?? nullableText(formData, 'imagem');
    const preco = parsePrice(formText(formData, 'preco'));
    const precoAntigo = parsePrice(formText(formData, 'preco_antigo'));
    const desconto =
      preco && precoAntigo && precoAntigo > preco
        ? Math.round(((precoAntigo - preco) / precoAntigo) * 100)
        : null;
    const slugBase = slugify(nome);

    const { data, error } = await supabase
      .from('products')
      .insert({
        nome,
        descricao: nullableText(formData, 'descricao'),
        categoria: nullableText(formData, 'categoria'),
        imagem: imageUrl,
        galeria: imageUrl ? [imageUrl] : [],
        preco,
        preco_antigo: precoAntigo,
        desconto,
        mercado_livre_link: marketplace === 'mercado_livre' ? link : null,
        shopee_link: marketplace === 'shopee' ? link : null,
        ativo: formData.get('ativo') === 'on',
        destaque: formData.get('destaque') === 'on',
        slug: `${slugBase}-${Date.now().toString(36)}`,
      })
      .select('id')
      .single();

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return {
      ok: true,
      message: 'Produto importado como rascunho. Você já pode revisar no painel.',
      productId: data.id,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Não foi possível importar a oferta.',
    };
  }
}
