import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Essência Store',
    short_name: 'Essência Store',
    description: 'Ofertas selecionadas de moda feminina e masculina.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f1e8',
    theme_color: '#7c684f',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
