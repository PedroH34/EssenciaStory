import { AdminShell } from '@/components/admin/AdminShell';
import { CategoryForm } from '@/components/admin/CategoryForm';
import { SetupNotice } from '@/components/admin/SetupNotice';
import { hasSupabaseConfig } from '@/lib/supabase/config';
import { getCategories } from '@/services/products';
import { requireAdmin } from '@/services/admin-auth';

export default async function CategoriesPage() {
  if (!hasSupabaseConfig()) {
    return <SetupNotice />;
  }

  await requireAdmin();
  const categories = await getCategories({ onlyActive: false });

  return (
    <AdminShell>
      <div>
        <h1 className="text-2xl font-black text-slate-950">Categorias</h1>
        <p className="mt-1 text-sm text-slate-600">Crie e organize grupos para a vitrine.</p>
      </div>
      <div className="mt-6 grid gap-4">
        <CategoryForm />
        {categories.map((category) => (
          <CategoryForm key={category.id} category={category} />
        ))}
      </div>
    </AdminShell>
  );
}
