'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductImage({ src, alt, ...rest }) {
  const [hasError, setHasError] = useState(false);
  const finalSrc = hasError || !src ? '/images/placeholder.svg' : src;

  return (
    <Image
      src={finalSrc}
      alt={alt || 'Product image'}
      onError={() => setHasError(true)}
      {...rest}
    />
  );
}