'use client';

import { useActionState } from 'react';
import type { Category, Product, ProductFormState } from '@/types/database';
import { saveProduct } from '@/app/admin/actions';

const initialState: ProductFormState = { ok: false, message: '' };

export function ProductForm({
  product,
  categories,
}: {
  product?: Product | null;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(saveProduct, initialState);

  return (
    <form action={action} className="grid gap-5 rounded-md border border-slate-200 bg-white p-5">
      <input type="hidden" name="id" defaultValue={product?.id} />
      <input type="hidden" name="current_imagem" defaultValue={product?.imagem ?? ''} />
      <input
        type="hidden"
        name="current_galeria"
        defaultValue={(product?.galeria ?? []).join('\n')}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Nome</span>
          <input
            name="nome"
            required
            defaultValue={product?.nome}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Slug</span>
          <input
            name="slug"
            defaultValue={product?.slug}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Descrição</span>
        <textarea
          name="descricao"
          rows={5}
          defaultValue={product?.descricao ?? ''}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-4">
        <label className="grid gap-2 lg:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Categoria</span>
          <select
            name="categoria"
            defaultValue={product?.categoria ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Preço</span>
          <input
            name="preco"
            type="number"
            step="0.01"
            defaultValue={product?.preco ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Preço antigo</span>
          <input
            name="preco_antigo"
            type="number"
            step="0.01"
            defaultValue={product?.preco_antigo ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Link Mercado Livre</span>
          <input
            name="mercado_livre_link"
            type="url"
            defaultValue={product?.mercado_livre_link ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Link Shopee</span>
          <input
            name="shopee_link"
            type="url"
            defaultValue={product?.shopee_link ?? ''}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Galeria por URL, uma por linha</span>
        <textarea
          name="galeria"
          rows={4}
          defaultValue={(product?.galeria ?? []).join('\n')}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Upload de imagens</span>
        <input
          name="images"
          type="file"
          multiple
          accept="image/*"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </label>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input name="ativo" type="checkbox" defaultChecked={product?.ativo ?? true} />
          Produto ativo
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input name="destaque" type="checkbox" defaultChecked={product?.destaque ?? false} />
          Produto em destaque
        </label>
      </div>

      {state.message ? (
        <p
          className={
            state.ok ? 'text-sm font-semibold text-teal-700' : 'text-sm font-semibold text-red-700'
          }
        >
          {state.message}
        </p>
      ) : null}

      <button
        disabled={pending}
        className="w-fit rounded-md bg-teal-700 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {pending ? 'Salvando...' : 'Salvar produto'}
      </button>
    </form>
  );
}
