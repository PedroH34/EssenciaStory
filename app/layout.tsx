import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Essência Store | Ofertas selecionadas',
    template: '%s | Essência Store',
  },
  description:
    'Ofertas selecionadas de moda feminina e masculina, organizadas para compras rápidas e seguras.',
  openGraph: {
    title: 'Essência Store',
    description:
      'Moda feminina e masculina em destaque, ofertas recentes e curadoria para afiliados.',
    url: siteUrl,
    siteName: 'Essência Store',
    images: [
      {
        url: '/essencia-store-logo.png',
        alt: 'Essência Store',
      },
    ],
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
