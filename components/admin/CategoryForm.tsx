import type { Category } from '@/types/database';
import { deleteCategory, saveCategory } from '@/app/admin/actions';

export function CategoryForm({ category }: { category?: Category }) {
  return (
    <form
      action={saveCategory}
      className="grid gap-3 rounded-md border border-slate-200 bg-white p-4"
    >
      <input type="hidden" name="id" defaultValue={category?.id} />
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          name="nome"
          required
          placeholder="Nome da categoria"
          defaultValue={category?.nome}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          name="slug"
          placeholder="slug-da-categoria"
          defaultValue={category?.slug}
          className="rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <textarea
        name="descricao"
        placeholder="Descrição"
        rows={2}
        defaultValue={category?.descricao ?? ''}
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input name="ativo" type="checkbox" defaultChecked={category?.ativo ?? true} />
          Ativa
        </label>
        <div className="flex gap-2">
          {category ? (
            <button
              formAction={deleteCategory}
              className="rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              Excluir
            </button>
          ) : null}
          <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800">
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}
