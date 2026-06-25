import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import { BuyButtons } from './BuyButtons';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
      <Link href={`/produto/${product.slug}`} className="block bg-slate-100">
        <div className="relative aspect-square">
          {product.imagem ? (
            <Image src={product.imagem} alt={product.nome} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
              Imagem em breve
            </div>
          )}
          {product.desconto ? (
            <span className="absolute left-3 top-3 rounded bg-amber-500 px-2 py-1 text-xs font-bold text-slate-950">
              -{product.desconto}%
            </span>
          ) : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
          {product.categories?.nome ?? 'Oferta'}
        </p>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-bold text-slate-950">
            {product.nome}
          </h3>
        </Link>
        <div className="mt-3">
          <p className="text-xl font-black text-slate-950">{formatCurrency(product.preco)}</p>
          {product.preco_antigo ? (
            <p className="text-sm text-slate-500 line-through">
              {formatCurrency(product.preco_antigo)}
            </p>
          ) : null}
        </div>
        <div className="mt-auto pt-4">
          <BuyButtons product={product} />
        </div>
      </div>
    </article>
  );
}
