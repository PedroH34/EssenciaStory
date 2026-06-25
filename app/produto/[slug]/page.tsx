import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { BuyButtons } from '@/components/products/BuyButtons';
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
    return {};
  }

  const description =
    product.descricao?.slice(0, 155) ??
    `Veja detalhes e links de compra para ${product.nome} na Essência Store.`;

  return {
    title: product.nome,
    description,
    alternates: {
      canonical: `/produto/${product.slug}`,
    },
    openGraph: {
      title: product.nome,
      description,
      images: product.imagem ? [{ url: product.imagem, alt: product.nome }] : [],
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

  const relatedProducts = await getRelatedProducts(product);
  const gallery = [product.imagem, ...(product.galeria ?? [])].filter(Boolean) as string[];

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[#d8cbb8] bg-[#fffaf4]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div className="grid gap-4">
              <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
                {product.imagem ? (
                  <Image src={product.imagem} alt={product.nome} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500">
                    Imagem em breve
                  </div>
                )}
              </div>
              {gallery.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((image) => (
                    <div
                      key={image}
                      className="relative aspect-square overflow-hidden rounded bg-slate-100"
                    >
                      <Image src={image} alt={product.nome} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
                {product.categories?.nome ?? 'Oferta'}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                {product.nome}
              </h1>
              <div className="mt-6">
                <p className="text-3xl font-black text-slate-950">
                  {formatCurrency(product.preco)}
                </p>
                {product.preco_antigo ? (
                  <p className="mt-1 text-base text-slate-500 line-through">
                    {formatCurrency(product.preco_antigo)}
                  </p>
                ) : null}
              </div>
              {product.desconto ? (
                <p className="mt-4 inline-flex w-fit rounded bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                  {product.desconto}% de desconto
                </p>
              ) : null}
              <p className="mt-6 leading-7 text-slate-700">
                {product.descricao ?? 'Produto selecionado pela curadoria Essência Store.'}
              </p>
              <div className="mt-8 max-w-sm">
                <BuyButtons product={product} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
              Continue vendo
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Produtos relacionados</h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
