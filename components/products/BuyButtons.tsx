import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types/database';

export function BuyButtons({ product }: { product: Product }) {
  const links = [
    product.mercado_livre_link
      ? {
          label: 'Comprar no Mercado Livre',
          href: `/oferta/${product.id}/mercado-livre`,
        }
      : null,
    product.shopee_link
      ? {
          label: 'Comprar na Shopee',
          href: `/oferta/${product.id}/shopee`,
        }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  if (!links.length) {
    return null;
  }

  return (
    <div className="grid gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#7c684f] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#4d4032]"
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
        >
          <ShoppingCart size={18} />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
