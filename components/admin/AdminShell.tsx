import Link from 'next/link';
import { Package, Tags } from 'lucide-react';
import { signOut } from '@/app/admin/actions';

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <Link href="/admin" className="text-xl font-black text-slate-950">
          EssenciaStory
        </Link>
        <nav className="mt-8 grid gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Package size={18} /> Produtos
          </Link>
          <Link
            href="/admin/categorias"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Tags size={18} /> Categorias
          </Link>
        </nav>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="md:hidden">
              <Link href="/admin" className="font-black text-slate-950">
                EssenciaStory
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
