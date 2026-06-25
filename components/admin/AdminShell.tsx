import Image from 'next/image';
import Link from 'next/link';
import { Package, Tags, WandSparkles } from 'lucide-react';
import { signOut } from '@/app/admin/actions';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f1e8]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#d8cbb8] bg-[#fffaf4] p-5 md:block">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/essencia-store-logo.png"
            alt="Essência Store"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full border border-[#d8cbb8] object-cover"
          />
          <span className="font-black text-[#4d4032]">Essência Store</span>
        </Link>
        <nav className="mt-8 grid gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#5f503f] hover:bg-[#f2e7d8]"
          >
            <Package size={18} /> Produtos
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#5f503f] hover:bg-[#f2e7d8]"
          >
            <Tags size={18} /> Categorias
          </Link>
          <Link
            href="/admin/importar"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-[#5f503f] hover:bg-[#f2e7d8]"
          >
            <WandSparkles size={18} /> Importar oferta
          </Link>
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-[#d8cbb8] bg-[#fffaf4]">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="md:hidden">
              <Link href="/admin" className="font-black text-[#4d4032]">
                Essência Store
              </Link>
            </div>
            <div className="hidden text-sm text-slate-600 md:block">Painel administrativo</div>
            <form action={signOut}>
              <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400">
                Sair
              </button>
            </form>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
