export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Category = {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: string | null;
  imagem: string | null;
  galeria: string[];
  preco: number | null;
  preco_antigo: number | null;
  desconto: number | null;
  mercado_livre_link: string | null;
  shopee_link: string | null;
  ativo: boolean;
  destaque: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, 'nome' | 'slug'> | null;
};

export type Click = {
  id: string;
  product_id: string | null;
  marketplace: 'mercado_livre' | 'shopee';
  destination_url: string;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
};

export type FeaturedProduct = {
  id: string;
  product_id: string;
  position: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type AdminUser = {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
};

export type ProductFormState = {
  ok: boolean;
  message: string;
  slug?: string;
};
