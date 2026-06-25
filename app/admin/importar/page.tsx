import { AdminShell } from '@/components/admin/AdminShell';
import { OfferImporter } from '@/components/admin/OfferImporter';
import { SetupNotice } from '@/components/admin/SetupNotice';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { requireAdmin } from '@/services/admin-auth';
import { getCategories } from '@/services/products';

export default async function ImportOfferPage() {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  await requireAdmin();
  const categories = await getCategories({ onlyActive: false });

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-black text-slate-950">Importar oferta</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Cole um link do Mercado Livre ou da Shopee. O sistema tenta buscar imagem, nome e preço;
          quando algum dado vier bloqueado, complete manualmente antes de criar o produto.
        </p>
      </div>
      <div className="mt-6">
        <OfferImporter categories={categories} />
      </div>
    </AdminShell>
  );
}
