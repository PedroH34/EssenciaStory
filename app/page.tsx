import { CategoryStrip } from '@/components/site/CategoryStrip';
import { Footer } from '@/components/site/Footer';
import { Header } from '@/components/site/Header';
import { Hero } from '@/components/site/Hero';
import { ProductGrid } from '@/components/products/ProductGrid';
import { getCategories, getFeaturedProducts, getProducts } from '@/services/products';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const [categories, featuredProducts, recentProducts, searchedProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getProducts({ limit: 12 }),
    params.q || params.categoria
      ? getProducts({ query: params.q, category: params.categoria, limit: 24 })
      : Promise.resolve(null),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero query={params.q} />
        <CategoryStrip categories={categories} />

        {searchedProducts ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
                  Resultado
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#33291f]">Produtos encontrados</h2>
              </div>
            </div>
            <ProductGrid products={searchedProducts} />
          </section>
        ) : null}

        <section id="destaques" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
              Seleção especial
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#33291f]">Produtos em destaque</h2>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>

        <section id="recentes" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c684f]">
              Novidades
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#33291f]">Produtos recentes</h2>
          </div>
          <ProductGrid products={recentProducts} />
        </section>
      </main>
      <Footer />
    </>
  );
}
