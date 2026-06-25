import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-[#d8cbb8] bg-[#fffaf4]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/essencia-store-logo.png"
            alt="Essência Store"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border border-[#d8cbb8] object-cover"
            priority
          />
          <span className="text-lg font-black tracking-wide text-[#4d4032]">Essência Store</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-[#766857] md:flex">
          <Link className="hover:text-[#4d4032]" href="/#categorias">
            Categorias
          </Link>
          <Link className="hover:text-[#4d4032]" href="/#destaques">
            Destaques
          </Link>
          <Link className="hover:text-[#4d4032]" href="/#recentes">
            Recentes
          </Link>
        </nav>
        <Link
          href="/?q="
          aria-label="Pesquisar"
          className="rounded-md border border-[#d8cbb8] p-2 text-[#5f503f] transition hover:border-[#7c684f] hover:text-[#4d4032]"
        >
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
