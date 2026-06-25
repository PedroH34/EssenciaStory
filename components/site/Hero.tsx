import Image from 'next/image';
import { Search } from 'lucide-react';

export function Hero({ query }: { query?: string }) {
  return (
    <section className="border-b border-[#d8cbb8] bg-[#f8f1e8] text-[#33291f]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
            Moda feminina e masculina
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Essência Store: ofertas selecionadas com estilo e praticidade.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#766857]">
            Uma vitrine elegante para moda, acessórios e achadinhos especiais do Mercado Livre e
            Shopee.
          </p>
          <form className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" action="/">
            <label className="relative flex-1">
              <span className="sr-only">Pesquisar produtos</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                name="q"
                defaultValue={query}
                placeholder="Buscar por peça, acessório ou estilo"
                className="h-12 w-full rounded-md border border-[#d8cbb8] bg-white pl-11 pr-4 text-[#33291f] outline-none ring-[#b79b6a] transition focus:ring-2"
              />
            </label>
            <button className="h-12 rounded-md bg-[#7c684f] px-6 text-sm font-bold text-white transition hover:bg-[#4d4032]">
              Pesquisar
            </button>
          </form>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded-md border border-[#d8cbb8] bg-[#fffaf4] shadow-2xl">
          <Image
            src="/essencia-store-logo.png"
            alt="Essência Store"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
