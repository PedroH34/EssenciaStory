insert into public.categories (nome, slug, descricao)
values
  ('Casa e cozinha', 'casa-e-cozinha', 'Produtos úteis para rotina, organização e conforto.'),
  ('Tecnologia', 'tecnologia', 'Eletrônicos, acessórios e gadgets em oferta.'),
  ('Beleza e cuidado', 'beleza-e-cuidado', 'Itens de autocuidado, beleza e bem-estar.')
on conflict (slug) do nothing;
