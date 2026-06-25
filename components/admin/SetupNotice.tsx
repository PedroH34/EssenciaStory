export function SetupNotice() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">Configuração</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950">Conecte o Supabase</h1>
      <p className="mt-4 leading-7 text-slate-700">
        Defina as variáveis do arquivo `.env.example` no ambiente local ou na Vercel para liberar o
        painel, o catálogo e o upload de imagens.
      </p>
    </main>
  );
}
