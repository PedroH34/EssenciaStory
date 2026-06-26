'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

function uniqueImages(images: (string | null | undefined)[]) {
  return images.filter((image, index): image is string => {
    if (!image) {
      return false;
    }

    return images.indexOf(image) === index;
  });
}

export function ProductGallery({
  productName,
  image,
  gallery,
}: {
  productName: string;
  image?: string | null;
  gallery?: string[] | null;
}) {
  const images = useMemo(() => uniqueImages([image, ...(gallery ?? [])]), [image, gallery]);
  const [selectedImage, setSelectedImage] = useState(images[0] ?? '');

  if (!images.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-md border border-[#d8cbb8] bg-[#efe4d5] px-6 text-center text-sm text-[#766857]">
        Imagem em breve
      </div>
    );
  }

  const activeImage = images.includes(selectedImage) ? selectedImage : images[0];

  return (
    <div className="grid gap-4">
      <div className="relative aspect-square overflow-hidden rounded-md border border-[#d8cbb8] bg-[#efe4d5]">
        <Image src={activeImage} alt={productName} fill priority className="object-contain p-2" />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((galleryImage, index) => {
            const isSelected = galleryImage === activeImage;

            return (
              <button
                key={`${galleryImage}-${index}`}
                type="button"
                onClick={() => setSelectedImage(galleryImage)}
                aria-label={`Ver imagem ${index + 1}`}
                className={`relative aspect-square overflow-hidden rounded-md border bg-[#efe4d5] transition ${
                  isSelected
                    ? 'border-[#7c684f] ring-2 ring-[#7c684f]'
                    : 'border-[#d8cbb8] hover:border-[#7c684f]'
                }`}
              >
                <Image
                  src={galleryImage}
                  alt={`${productName} - imagem ${index + 1}`}
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
