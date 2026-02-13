import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop",
  aspectRatio,
  objectFit = "cover",
  className,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  // Convert image URL to WebP if supported
  const getOptimizedSrc = (url: string): string => {
    // Check if URL is from Unsplash
    if (url.includes("unsplash.com")) {
      // Add WebP format and quality parameters
      const separator = url.includes("?") ? "&" : "?";
      return `${url}${separator}fm=webp&q=80`;
    }
    return url;
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)} style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={getOptimizedSrc(imageSrc)}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        className={cn(
          "w-full h-full transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down"
        )}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <p className="text-xs text-muted-foreground">Image unavailable</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
