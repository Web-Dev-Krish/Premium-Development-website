import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export default function SafeImage({ src, alt, fallback, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-neutral-800 text-neutral-500 ${className || ''}`}>
        {fallback || <span className="text-xs">No image</span>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
