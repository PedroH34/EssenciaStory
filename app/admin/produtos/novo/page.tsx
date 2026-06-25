import Link from 'next/link';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';
import { SetupNotice } from '@/components/admin/SetupNotice';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { getCategories } from '@/services/products';
import { requireAdmin } from '@/services/admin-auth';

export default async function NewProductPage() {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  await requireAdmin();
  const categories = await getCategories({ onlyActive: false });

  return (
    <AdminShell>
      <Link href="/admin" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
        Voltar
      </Link>
      <h1 className="mt-3 text-2xl font-black text-slate-950">Novo produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </AdminShell>
  );
}
