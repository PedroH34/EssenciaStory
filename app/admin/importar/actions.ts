'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import { requireAdmin } from '@/services/admin-auth';

type Marketplace = 'mercado_livre' | 'shopee';

export type ImportPreview = {
  ok: boolean;
  message: string;
  marketplace?: Marketplace;
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

function nullableString(value: FormDataEntryValue | null) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text.length ? text : null;
}

function nullableNumber(value: FormDataEntryValue | null) {
  const text =
    typeof value === 'string'
      ? value
          .replace(/[^\d,.]/g, '')
          .replace(',', '.')
          .trim()
      : '';
  if (!text.length) {
    return null;
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function checkbox(value: FormDataEntryValue | null) {
  return value === 'on';
}

function detectMarketplace(url: string): Marketplace | null {
  const host = new URL(url).hostname.toLowerCase();

  if (host.includes('mercadolivre') || host.includes('mercadolibre') || host.includes('meli.la')) {
    return 'mercado_livre';
  }

  if (host.includes('shopee')) {
    return 'shopee';
  }

  return null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function findMeta(html: string, names: string[]) {
  for (const name of names) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${escapedName}["'][^>]+content=["']([^"']+)["'][^>]*>`,
        'i',
      ),
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapedName}["'][^>]*>`,
        'i',
      ),
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

function findTitle(html: string) {
  return (
    findMeta(html, ['og:title', 'twitter:title']) ||
    decodeHtml(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? '')
  );
}

function findImage(html: string) {
  return findMeta(html, ['og:image', 'twitter:image', 'image']);
}

function findDescription(html: string) {
  return findMeta(html, ['og:description', 'twitter:description', 'description']);
}

function findPrice(html: string) {
  const metaPrice = findMeta(html, [
    'product:price:amount',
    'og:price:amount',
    'twitter:data1',
    'price',
  ]);

  if (metaPrice) {
    const parsed = nullableNumber(metaPrice);
    if (parsed) {
      return String(parsed).replace('.', ',');
    }
  }

  const text = html.replace(/\s+/g, ' ');
  const matches = [...text.matchAll(/R\$\s?(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/gi)];
  const first = matches[0]?.[1];

  return first ? first.replace(/\./g, '') : '';
}

async function uploadImportedImage(file: FormDataEntryValue | null) {
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

  const originalUrl = nullableString(formData.get('url'));
  if (!originalUrl) {
    return { ok: false, message: 'Cole o link da oferta.' };
  }

  let marketplace: Marketplace | null = null;
  try {
    marketplace = detectMarketplace(originalUrl);
  } catch {
    return { ok: false, message: 'Link invalido.' };
  }

  if (!marketplace) {
    return { ok: false, message: 'Use um link do Mercado Livre ou da Shopee.' };
  }

  try {
    const response = await fetch(originalUrl, {
      redirect: 'follow',
      headers: {
        accept: 'text/html,application/xhtml+xml',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      },
    });
    const html = await response.text();
    const finalUrl = response.url || originalUrl;

    return {
      ok: true,
      message:
        'Dados encontrados. Revise as informacoes antes de criar o produto, principalmente preco e imagem.',
      marketplace,
      originalUrl,
      finalUrl,
      nome: findTitle(html)
        .replace(/\s+\|\s+Mercado Livre.*$/i, '')
        .trim(),
      descricao: findDescription(html),
      imagem: findImage(html),
      preco: findPrice(html),
    };
  } catch {
    return {
      ok: true,
      message: 'Nao consegui ler a pagina automaticamente. Complete os dados manualmente.',
      marketplace,
      originalUrl,
      finalUrl: originalUrl,
    };
  }
}

export async function createImportedProduct(
  _state: ImportCreateState,
  formData: FormData,
): Promise<ImportCreateState> {
  await requireAdmin();

  const nome = nullableString(formData.get('nome'));
  const marketplace = nullableString(formData.get('marketplace')) as Marketplace | null;
  const affiliateUrl = nullableString(formData.get('affiliate_url'));

  if (!nome || !marketplace || !affiliateUrl) {
    return { ok: false, message: 'Informe nome, marketplace e link afiliado.' };
  }

  try {
    const supabase = await createClient();
    const uploadedImage = await uploadImportedImage(formData.get('image_file'));
    const imagem = uploadedImage ?? nullableString(formData.get('imagem'));
    const preco = nullableNumber(formData.get('preco'));
    const precoAntigo = nullableNumber(formData.get('preco_antigo'));
    const desconto =
      preco && precoAntigo && precoAntigo > preco
        ? Math.round(((precoAntigo - preco) / precoAntigo) * 100)
        : null;

    const payload = {
      nome,
      descricao: nullableString(formData.get('descricao')),
      categoria: nullableString(formData.get('categoria')),
      imagem,
      galeria: imagem ? [imagem] : [],
      preco,
      preco_antigo: precoAntigo,
      desconto,
      mercado_livre_link: marketplace === 'mercado_livre' ? affiliateUrl : null,
      shopee_link: marketplace === 'shopee' ? affiliateUrl : null,
      ativo: checkbox(formData.get('ativo')),
      destaque: checkbox(formData.get('destaque')),
      slug: slugify(nome),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('products').insert(payload).select('id').single();

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin');

    return {
      ok: true,
      message: 'Produto criado com sucesso.',
      productId: data.id as string,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Nao foi possivel criar o produto.',
    };
  }
}
