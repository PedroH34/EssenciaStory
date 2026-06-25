'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Search, Upload } from 'lucide-react';
import {
  createImportedProduct,
  previewOffer,
  type ImportCreateState,
  type ImportPreview,
} from '@/app/admin/importar/actions';
import type { Category } from '@/types/database';

const initialPreview: ImportPreview = {
  ok: false,
  message: '',
};

const initialCreate: ImportCreateState = {
  ok: false,
  message: '',
};

const marketplaceLabels = {
  mercado_livre: 'Mercado Livre',
  shopee: 'Shopee',
};

export function OfferImporter({ categories }: { categories: Category[] }) {
  const [preview, previewAction, previewPending] = useActionState(previewOffer, initialPreview);
  const [createState, createAction, createPending] = useActionState(
    createImportedProduct,
    initialCreate,
  );

  return (
    <div className="grid gap-6">
      <form action={previewAction} className="rounded-md border border-[#d8cbb8] bg-[#fffaf4] p-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-[#5f503f]">
            Link afiliado ou link do produto
          </span>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              name="url"
              type="url"
              required
              placeholder="https://meli.la/... ou https://s.shopee.com.br/..."
              defaultValue={preview.originalUrl}
              className="h-12 flex-1 rounded-md border border-[#d8cbb8] bg-white px-3 text-[#33291f] outline-none ring-[#b79b6a] transition focus:ring-2"
            />
            <button
              disabled={previewPending}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#7c684f] px-5 text-sm font-bold text-white hover:bg-[#4d4032] disabled:opacity-60"
            >
              <Search size={18} />
              {previewPending ? 'Buscando...' : 'Buscar dados'}
            </button>
          </div>
        </label>

        {preview.message ? (
          <p
            className={
              preview.ok
                ? 'mt-4 text-sm font-semibold text-[#7c684f]'
                : 'mt-4 text-sm font-semibold text-red-700'
            }
          >
            {preview.message}
          </p>
        ) : null}
      </form>

      {preview.ok && preview.marketplace ? (
        <form
          action={createAction}
          className="grid gap-5 rounded-md border border-[#d8cbb8] bg-[#fffaf4] p-5"
        >
          <input type="hidden" name="marketplace" value={preview.marketplace} />

          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative aspect-square w-full overflow-hidden rounded-md border border-[#d8cbb8] bg-[#f3e8d9] lg:w-64">
              {preview.imagem ? (
                <Image
                  src={preview.imagem}
                  alt={preview.nome ?? 'Oferta importada'}
                  fill
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[#766857]">
                  Imagem não encontrada. Use URL ou upload abaixo.
                </div>
              )}
            </div>

            <div className="grid flex-1 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c684f]">
                  {marketplaceLabels[preview.marketplace]}
                </p>
                {preview.finalUrl ? (
                  <Link
                    href={preview.finalUrl}
                    target="_blank"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#5f503f] hover:text-[#4d4032]"
                  >
                    Ver página detectada <ExternalLink size={14} />
                  </Link>
                ) : null}
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-[#5f503f]">Link afiliado</span>
                <input
                  name="affiliate_url"
                  type="url"
                  required
                  defaultValue={preview.originalUrl}
                  className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 lg:col-span-2">
              <span className="text-sm font-semibold text-[#5f503f]">Nome</span>
              <input
                name="nome"
                required
                defaultValue={preview.nome}
                className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#5f503f]">Preço</span>
              <input
                name="preco"
                defaultValue={preview.preco}
                placeholder="21,97"
                className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#5f503f]">Preço antigo</span>
              <input
                name="preco_antigo"
                placeholder="Opcional"
                className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-[#5f503f]">Categoria</span>
              <select
                name="categoria"
                className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
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
              <span className="text-sm font-semibold text-[#5f503f]">Imagem por URL</span>
              <input
                name="imagem"
                type="url"
                defaultValue={preview.imagem}
                className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#5f503f]">Descrição</span>
            <textarea
              name="descricao"
              rows={4}
              defaultValue={preview.descricao}
              className="rounded-md border border-[#d8cbb8] bg-white px-3 py-2"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#5f503f]">
              Upload de imagem, se preferir
            </span>
            <span className="inline-flex items-center gap-2 rounded-md border border-dashed border-[#c9b99f] bg-white px-3 py-3 text-sm text-[#766857]">
              <Upload size={16} />
              <input name="image_file" type="file" accept="image/*" className="w-full" />
            </span>
          </label>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#5f503f]">
              <input name="ativo" type="checkbox" />
              Publicar agora
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#5f503f]">
              <input name="destaque" type="checkbox" />
              Destacar produto
            </label>
          </div>

          {createState.message ? (
            <p
              className={
                createState.ok
                  ? 'text-sm font-semibold text-[#7c684f]'
                  : 'text-sm font-semibold text-red-700'
              }
            >
              {createState.message}
              {createState.productId ? (
                <>
                  {' '}
                  <Link href={`/admin/produtos/${createState.productId}`} className="underline">
                    Revisar produto
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}

          <button
            disabled={createPending}
            className="w-fit rounded-md bg-[#7c684f] px-5 py-3 text-sm font-bold text-white hover:bg-[#4d4032] disabled:opacity-60"
          >
            {createPending ? 'Criando...' : 'Criar produto'}
          </button>
        </form>
      ) : null}
    </div>
  );
}
