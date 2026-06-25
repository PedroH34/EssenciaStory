import Link from 'next/link';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black text-slate-950">
          EssenciaStory
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link className="hover:text-teal-700" href="/#categorias">
            Categorias
          </Link>
          <Link className="hover:text-teal-700" href="/#destaques">
            Destaques
          </Link>
          <Link className="hover:text-teal-700" href="/#recentes">
            Recentes
          </Link>
        </nav>
        <Link
          href="/?q="
          aria-label="Pesquisar"
          className="rounded-md border border-slate-200 p-2 text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
        >
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
