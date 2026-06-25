'use client';

import { useActionState } from 'react';
import { Lock } from 'lucide-react';
import { signIn } from '../actions';

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, { message: '' });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f1e8] px-4">
      <form
        action={action}
        className="w-full max-w-md rounded-md border border-[#d8cbb8] bg-[#fffaf4] p-6 shadow-sm"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#f2e7d8] text-[#7c684f]">
          <Lock size={22} />
        </div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">Entrar no painel</h1>
        <p className="mt-2 text-sm text-slate-600">Use uma conta cadastrada no Supabase Auth.</p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">E-mail</span>
            <input
              name="email"
              type="email"
              required
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Senha</span>
            <input
              name="password"
              type="password"
              required
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        {state.message ? (
          <p className="mt-4 text-sm font-semibold text-red-700">{state.message}</p>
        ) : null}

        <button
          disabled={pending}
          className="mt-6 w-full rounded-md bg-[#7c684f] px-4 py-3 text-sm font-bold text-white hover:bg-[#4d4032] disabled:opacity-60"
        >
          {pending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
