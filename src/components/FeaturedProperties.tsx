import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import type { Property } from "@/lib/types";
import PropertyCardSkeleton from "./PropertyCardSkeleton";
import OptimizedImage from "./OptimizedImage";

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: async () => {
      try {
        const response = await api.getFeaturedProperties();
        return response.data || [];
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        throw err;
      }
    },
  });

  const getPropertyImage = (property: Property): string => {
    if (property.primary_image?.image_url) {
      return property.primary_image.image_url;
    }
    if (property.images && property.images.length > 0 && property.images[0]?.image_url) {
      return property.images[0].image_url;
    }
    const fallbackImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    ];
    return fallbackImages[property.id % fallbackImages.length];
  };

  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    const period = {
      sale: '',
      rent_daily: '/night',
      rent_monthly: '/month',
      rent_yearly: '/year',
    }[priceType] || '';

    return `${formatted}${period}`;
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              {t('featured.title')}
            </h2>
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !data || data.length === 0) {
    return null;
  }

  const properties = data.slice(0, 3); // Only show 3 properties

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        {/* Simple Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {t('featured.title')}
          </h2>
          <Link 
            to="/properties"
            className="font-body text-sm text-primary hover:underline"
          >
            {t('featured.viewAll')}
          </Link>
        </div>

        {/* Property Grid - Clean & Minimal */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: Property, index: number) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/property/${property.slug || property.id}`}>
                <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                  {/* Property Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <OptimizedImage
                      src={getPropertyImage(property)}
                      alt={property.title}
                      aspectRatio="4/3"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                    {property.is_featured && (
                      <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                        {t('properties.featured')}
                      </div>
                    )}
                  </div>

                  {/* Property Info - Minimal */}
                  <div className="p-4">
                    {/* Price */}
                    <p className="font-heading text-xl font-bold text-foreground mb-2">
                      {formatPrice(property.price, property.price_type)}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <p className="font-body text-sm truncate">{property.island?.name}</p>
                    </div>

                    {/* Property Details - Compact */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
                      {property.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span className="font-body">{property.bedrooms}</span>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span className="font-body">{property.bathrooms}</span>
                        </div>
                      )}
                      {property.land_area && (
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          <span className="font-body">{property.land_area}m²</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
