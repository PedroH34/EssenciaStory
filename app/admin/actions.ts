'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils';
import { getCurrentAdmin, requireAdmin } from '@/services/admin-auth';
import type { ProductFormState } from '@/types/database';

function nullableString(value: FormDataEntryValue | null) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text.length ? text : null;
}

function nullableNumber(value: FormDataEntryValue | null) {
  const text = typeof value === 'string' ? value.replace(',', '.').trim() : '';
  if (!text.length) {
    return null;
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function checkbox(value: FormDataEntryValue | null) {
  return value === 'on';
}

async function uploadProductImages(formData: FormData) {
  const supabase = await createClient();
  const files = formData
    .getAll('images')
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (!files.length) {
    return [];
  }

  const urls: string[] = [];

  for (const file of files) {
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
    urls.push(publicUrl);
  }

  return urls;
}

export async function signIn(_state: { message: string }, formData: FormData) {
  const supabase = await createClient();
  const email = nullableString(formData.get('email'));
  const password = nullableString(formData.get('password'));

  if (!email || !password) {
    return { message: 'Informe e-mail e senha.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: 'Login inválido ou usuário sem acesso.' };
  }

  const admin = await getCurrentAdmin();

  if (!admin) {
    await supabase.auth.signOut();
    return { message: 'Usuário autenticado, mas sem permissão administrativa.' };
  }

  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function saveProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const supabase = await createClient();
  const id = nullableString(formData.get('id'));
  const nome = nullableString(formData.get('nome'));

  if (!nome) {
    return { ok: false, message: 'Informe o nome do produto.' };
  }

  try {
    const uploadedImages = await uploadProductImages(formData);
    const currentImage = nullableString(formData.get('current_imagem'));
    const currentGallery = nullableString(formData.get('current_galeria'));
    const galleryFromInput = nullableString(formData.get('galeria'))
      ?.split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
    const existingGallery = currentGallery ? currentGallery.split('\n').filter(Boolean) : [];
    const galeria = [...(galleryFromInput ?? existingGallery), ...uploadedImages];
    const slug = nullableString(formData.get('slug')) || slugify(nome);
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
      imagem: uploadedImages[0] ?? currentImage,
      galeria,
      preco,
      preco_antigo: precoAntigo,
      desconto,
      mercado_livre_link: nullableString(formData.get('mercado_livre_link')),
      shopee_link: nullableString(formData.get('shopee_link')),
      ativo: checkbox(formData.get('ativo')),
      destaque: checkbox(formData.get('destaque')),
      slug,
      updated_at: new Date().toISOString(),
    };

    const { error } = id
      ? await supabase.from('products').update(payload).eq('id', id)
      : await supabase.from('products').insert(payload);

    if (error) {
      return { ok: false, message: error.message };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { ok: true, message: 'Produto salvo com sucesso.', slug };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Não foi possível salvar o produto.',
    };
  }
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = nullableString(formData.get('id'));

  if (!id) {
    return;
  }

  const supabase = await createClient();
  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const id = nullableString(formData.get('id'));
  const nome = nullableString(formData.get('nome'));

  if (!nome) {
    return;
  }

  const payload = {
    nome,
    slug: nullableString(formData.get('slug')) || slugify(nome),
    descricao: nullableString(formData.get('descricao')),
    ativo: checkbox(formData.get('ativo')),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase.from('categories').update(payload).eq('id', id);
  } else {
    await supabase.from('categories').insert(payload);
  }

  revalidatePath('/');
  revalidatePath('/admin/categorias');
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = nullableString(formData.get('id'));

  if (!id) {
    return;
  }

  const supabase = await createClient();
  await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/');
  revalidatePath('/admin/categorias');
}
