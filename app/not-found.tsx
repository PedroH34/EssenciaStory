import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">404</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Página não encontrada</h1>
      <p className="mt-4 text-slate-600">
        A oferta pode ter sido removida, desativada ou ainda não foi publicada.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
      >
        Voltar para a vitrine
      </Link>
    </main>
  );
}
