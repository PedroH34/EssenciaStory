import { Search } from 'lucide-react';

export function Hero({ query }: { query?: string }) {
  return (
    <section className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-300">
            Curadoria de ofertas
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Produtos selecionados para comprar com praticidade.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Uma vitrine preparada para afiliados, SEO, milhares de produtos e gestão online via
            Supabase.
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
                placeholder="Buscar por produto, marca ou benefício"
                className="h-12 w-full rounded-md border border-white/15 bg-white pl-11 pr-4 text-slate-950 outline-none ring-teal-400 transition focus:ring-2"
              />
            </label>
            <button className="h-12 rounded-md bg-teal-500 px-6 text-sm font-bold text-white transition hover:bg-teal-400">
              Pesquisar
            </button>
          </form>
        </div>
        <div className="min-h-72 rounded-md border border-white/10 bg-[linear-gradient(135deg,#0f766e_0%,#111827_48%,#f59e0b_100%)] p-6 shadow-2xl">
          <div className="grid h-full content-end gap-4">
            <div className="rounded-md bg-white p-4 text-slate-950 shadow-xl">
              <div className="aspect-[16/10] rounded bg-slate-100" />
              <div className="mt-4 h-3 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-8 w-1/2 rounded bg-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
