'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? '');

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md bg-slate-100 text-slate-500">
        Imagem em breve
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-slate-100">
        <Image src={selectedImage} alt={name} fill className="object-cover" priority />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.slice(0, 10).map((image, index) => {
            const isActive = image === selectedImage;

            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Ver imagem ${index + 1} de ${name}`}
                className={
                  isActive
                    ? 'relative aspect-square overflow-hidden rounded-md border-2 border-[#7c684f] bg-slate-100 ring-2 ring-[#d8cbb8]'
                    : 'relative aspect-square overflow-hidden rounded-md border border-[#d8cbb8] bg-slate-100 transition hover:border-[#7c684f]'
                }
              >
                <Image
                  src={image}
                  alt={`${name} - imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
