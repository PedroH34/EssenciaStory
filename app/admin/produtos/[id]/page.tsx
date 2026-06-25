import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ProductForm } from '@/components/admin/ProductForm';
import { SetupNotice } from '@/components/admin/SetupNotice';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { getAdminProductById, getCategories } from '@/services/products';
import { requireAdmin } from '@/services/admin-auth';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategories({ onlyActive: false }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <AdminShell>
      <Link href="/admin" className="text-sm font-semibold text-[#7c684f] hover:text-[#4d4032]">
        Voltar
      </Link>
      <h1 className="mt-3 text-2xl font-black text-slate-950">Editar produto</h1>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </AdminShell>
  );
}
