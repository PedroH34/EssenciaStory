import Link from 'next/link';
import type { Category } from '@/types/database';

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return null;
  }

  return (
    <section id="categorias" className="border-b border-[#d8cbb8] bg-[#fffaf4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-[#33291f]">Categorias</h2>
          <Link href="/" className="text-sm font-semibold text-[#7c684f] hover:text-[#4d4032]">
            Ver todas
          </Link>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/?categoria=${category.id}`}
              className="whitespace-nowrap rounded-md border border-[#d8cbb8] px-4 py-2 text-sm font-semibold text-[#5f503f] transition hover:border-[#7c684f] hover:text-[#4d4032]"
            >
              {category.nome}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
