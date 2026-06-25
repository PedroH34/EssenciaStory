import Link from 'next/link';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { AdminShell } from '@/components/admin/AdminShell';
import { SetupNotice } from '@/components/admin/SetupNotice';
import { deleteProduct } from '@/app/admin/actions';
import { formatCurrency } from '@/lib/utils';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { getProducts } from '@/services/products';
import { requireAdmin } from '@/services/admin-auth';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  await requireAdmin();
  const params = await searchParams;
  const products = await getProducts({ query: params.q, onlyActive: false, limit: 200 });

  return (
    <AdminShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-950">Produtos</h1>
          <p className="mt-1 text-sm text-slate-600">
            Cadastre, edite, destaque e publique ofertas.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#7c684f] px-4 py-3 text-sm font-bold text-white hover:bg-[#4d4032]"
        >
          <Plus size={18} /> Novo produto
        </Link>
      </div>

      <form className="mt-6 flex max-w-lg gap-2">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Pesquisar produtos"
            className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3"
          />
        </label>
        <button className="rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-white">
          Buscar
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Destaque</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-950">{product.nome}</div>
                    <div className="text-xs text-slate-500">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(product.preco)}</td>
                  <td className="px-4 py-3">
                    <span className={product.ativo ? 'text-[#7c684f]' : 'text-slate-500'}>
                      {product.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.destaque ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        aria-label="Editar produto"
                        className="rounded-md border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
                      >
                        <Edit size={16} />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          aria-label="Excluir produto"
                          className="rounded-md border border-red-200 p-2 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
