import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EssenciaStory | Ofertas selecionadas',
    template: '%s | EssenciaStory',
  },
  description:
    'Ofertas selecionadas do Mercado Livre e Shopee, organizadas por categorias para compras rápidas e seguras.',
  openGraph: {
    title: 'EssenciaStory',
    description: 'Produtos em destaque, ofertas recentes e curadoria para afiliados.',
    url: siteUrl,
    siteName: 'EssenciaStory',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
