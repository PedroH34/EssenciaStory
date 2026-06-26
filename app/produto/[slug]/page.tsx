import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BuyButtons } from '@/components/products/BuyButtons';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { formatCurrency } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/services/products';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produto nao encontrado | Essencia Store',
    };
  }

  const description =
    product.descricao ??
    `Confira ${product.nome} na Essencia Store e escolha a melhor oferta disponivel.`;

  return {
    title: `${product.nome} | Essencia Store`,
    description,
    openGraph: {
      title: product.nome,
      description,
      images: product.imagem ? [{ url: product.imagem }] : [],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product, 4);

  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <ProductGallery
            productName={product.nome}
            image={product.imagem}
            gallery={product.galeria}
          />

          <div className="flex flex-col justify-center">
            <Link
              href="/"
              className="mb-6 w-fit text-sm font-semibold text-[#7c684f] hover:text-[#4d4032]"
            >
              Voltar para ofertas
            </Link>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7c684f]">
              {product.categories?.nome ?? 'Oferta'}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#080b1d] sm:text-5xl">
              {product.nome}
            </h1>

            <div className="mt-6">
              <p className="text-3xl font-black text-[#080b1d]">{formatCurrency(product.preco)}</p>
              {product.preco_antigo ? (
                <p className="mt-1 text-base text-slate-500 line-through">
                  {formatCurrency(product.preco_antigo)}
                </p>
              ) : null}
              {product.desconto ? (
                <p className="mt-2 w-fit rounded bg-amber-500 px-2 py-1 text-xs font-bold text-slate-950">
                  {product.desconto}% de desconto
                </p>
              ) : null}
            </div>

            <p className="mt-6 max-w-xl leading-7 text-slate-700">
              {product.descricao ??
                'Visite a pagina da oferta para conferir detalhes, tamanhos, condicoes e prazo de entrega.'}
            </p>

            <div className="mt-7 max-w-sm">
              <BuyButtons product={product} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
              Continue vendo
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#33291f]">Produtos relacionados</h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
