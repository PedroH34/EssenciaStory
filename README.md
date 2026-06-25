# EssenciaStory

Plataforma profissional de ofertas para afiliados do Mercado Livre e Shopee, criada com Next.js 15, TypeScript, TailwindCSS e Supabase.

## Recursos

- Vitrine pública com banner, busca, categorias, produtos em destaque e produtos recentes.
- Página individual de produto com SEO, Open Graph e produtos relacionados.
- Botões de compra exibidos somente quando `mercado_livre_link` ou `shopee_link` estiver preenchido.
- Painel protegido para cadastrar, editar, excluir, ativar/desativar e destacar produtos.
- Upload de imagens no Supabase Storage.
- Cadastro e edição de categorias.
- Sitemap, robots, manifest e ícones.
- Estrutura preparada para futuras integrações com APIs e automações.

## Configuração

1. Crie um projeto no Supabase.
2. Rode `supabase/migrations/001_initial_schema.sql` no SQL Editor.
3. Opcionalmente rode `supabase/seed.sql`.
4. Crie um usuário em Supabase Auth.
5. Adicione o usuário à tabela `admin_users`:

```sql
insert into public.admin_users (user_id, email)
values ('UUID_DO_USUARIO_AUTH', 'email@exemplo.com');
```

6. Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-server-admin-tasks
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Deploy

Configure as mesmas variáveis de ambiente na Vercel e publique a branch `main`.

## Estrutura

- `app/`: rotas públicas, SEO, admin e ações de servidor.
- `components/`: componentes de site, produtos e administração.
- `lib/`: utilitários e clientes Supabase.
- `services/`: consultas e serviços de domínio.
- `types/`: tipos TypeScript compartilhados.
- `supabase/`: migrações e seed do banco.
- `public/`: assets públicos.
