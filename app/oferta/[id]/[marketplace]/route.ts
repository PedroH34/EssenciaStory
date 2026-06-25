import { NextResponse } from 'next/server';
import { getAdminProductById } from '@/services/products';
import { registerClick } from '@/services/clicks';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; marketplace: string }> },
) {
  const { id, marketplace } = await params;
  const product = await getAdminProductById(id);

  if (!product || !product.ativo) {
    return NextResponse.redirect(new URL('/', _request.url));
  }

  if (marketplace === 'mercado-livre' && product.mercado_livre_link) {
    return registerClick({
      productId: product.id,
      marketplace: 'mercado_livre',
      url: product.mercado_livre_link,
    });
  }

  if (marketplace === 'shopee' && product.shopee_link) {
    return registerClick({
      productId: product.id,
      marketplace: 'shopee',
      url: product.shopee_link,
    });
  }

  return NextResponse.redirect(new URL(`/produto/${product.slug}`, _request.url));
}
