import Link from 'next/link';
import type { Category } from '@/types/database';

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section id="categorias" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">Categorias</h2>
          <Link href="/" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            Ver todas
          </Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?categoria=${category.id}`}
              className="whitespace-nowrap rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
            >
              {category.nome}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
