import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Maximize } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Property, PropertyFilters, PaginationMeta } from "@/lib/types";
import { Link } from "react-router-dom";

const Properties = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    page: 1,
    per_page: 12,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters: PropertyFilters = {
      page: 1,
      per_page: 12,
      sort_by: 'created_at',
      sort_order: 'desc',
    };

    // Read filters from URL
    const search = searchParams.get('search');
    const island_id = searchParams.get('island_id');
    const category_id = searchParams.get('category_id');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const price_type = searchParams.get('price_type');

    if (search) {
      urlFilters.search = search;
      setSearchQuery(search);
    }
    if (island_id) urlFilters.island_id = Number(island_id);
    if (category_id) urlFilters.category_id = Number(category_id);
    if (min_price) urlFilters.min_price = Number(min_price);
    if (max_price) urlFilters.max_price = Number(max_price);
    if (price_type) urlFilters.price_type = price_type as 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly';

    setFilters(urlFilters);
    window.scrollTo(0, 0);
  }, [searchParams]);

  const { data: queryData, isLoading, error, refetch } = useQuery<{
    data: Property[];
    meta: PaginationMeta | null;
  }>({
    queryKey: ['properties', filters],
    queryFn: async () => {
      try {
        console.log('Fetching properties with filters:', filters);
        const response = await api.getProperties(filters);
        console.log('Properties API Response:', response);
        
        // API returns PaginatedResponse<Property> which has structure:
        // { success: boolean, data: Property[], meta: {...} }
        if (!response || typeof response !== 'object') {
          console.error('Invalid response format:', response);
          return { data: [], meta: null };
        }
        
        return {
          data: Array.isArray(response.data) ? response.data : [],
          meta: response.meta || null,
        };
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: { data?: null } }; message?: string };
        console.error('Properties API Error:', err);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        
        // Don't throw error, return empty data instead to show "No Properties Found"
        // This prevents the error screen from showing for search with no results
        if (error.response?.status === 404 || error.response?.data?.data === null) {
          return { data: [], meta: null };
        }
        
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000,
    // Don't show error for empty results
    throwOnError: false,
  });

  const properties = Array.isArray(queryData?.data) ? queryData.data : [];
  const meta = queryData?.meta;

  const getPropertyImage = (property: Property): string => {
    if (property.primary_image?.image_url) {
      return property.primary_image.image_url;
    }
    if (property.images && property.images.length > 0 && property.images[0]?.image_url) {
      return property.images[0].image_url;
    }
    // Fallback images based on category or island
    const fallbackImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800&auto=format&fit=crop',
    ];
    return fallbackImages[property.id % fallbackImages.length];
  };

  const formatPrice = (price: number, priceType: string) => {
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);

    const period = {
      sale: '',
      rent_daily: '/hari',
      rent_monthly: '/bulan',
      rent_yearly: '/tahun',
    }[priceType] || '';

    return `${formatted}${period}`;
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-primary py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="font-heading text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl">
              {t('properties.title')}
            </h1>
            <p className="mt-4 font-body text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              {t('properties.subtitle')}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-white/20">
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('properties.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white font-body text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-body font-semibold hover:bg-primary/90 transition-all shadow-lg"
                >
                  {t('properties.searchButton')}
                </button>
              </div>
              
              {/* Quick Filters Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                    showFilters 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showFilters ? t('properties.hideFilters') : t('properties.moreFilters')}
                </button>
                
                {filters.price_type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    {filters.price_type === 'sale' ? t('filters.sale') : 
                     filters.price_type === 'rent_daily' ? t('filters.rentDaily') :
                     filters.price_type === 'rent_monthly' ? t('filters.rentMonthly') : t('filters.rentYearly')}
                  </span>
                )}
                
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {t('common.search')}: {filters.search}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-b from-secondary/50 to-background py-8 px-4 border-b"
        >
          <div className="container mx-auto max-w-6xl">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                {t('filters.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground">
                    {t('filters.propertyType')}
                  </label>
                  <select
                    value={filters.price_type || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilters({ 
                        ...filters, 
                        price_type: value === '' ? undefined : value as 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly', 
                        page: 1 
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="">{t('filters.allTypes')}</option>
                    <option value="sale">{t('filters.sale')}</option>
                    <option value="rent_daily">{t('filters.rentDaily')}</option>
                    <option value="rent_monthly">{t('filters.rentMonthly')}</option>
                    <option value="rent_yearly">{t('filters.rentYearly')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground">
                    {t('filters.sortBy')}
                  </label>
                  <select
                    value={filters.sort_by || 'created_at'}
                    onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as 'created_at' | 'price' | 'land_area' | 'views_count' | 'featured', page: 1 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="created_at">{t('filters.newestFirst')}</option>
                    <option value="price">{t('filters.price')}</option>
                    <option value="land_area">{t('properties.landArea')}</option>
                    <option value="views_count">{t('filters.mostViewed')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground">
                    {t('filters.order')}
                  </label>
                  <select
                    value={filters.sort_order || 'desc'}
                    onChange={(e) => setFilters({ ...filters, sort_order: e.target.value as 'asc' | 'desc', page: 1 })}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="desc">{t('filters.highToLow')}</option>
                    <option value="asc">{t('filters.lowToHigh')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-body text-sm font-medium text-foreground opacity-0">
                    Action
                  </label>
                  <button
                    onClick={() => {
                      setFilters({ page: 1, per_page: 12, sort_by: 'created_at', sort_order: 'desc' });
                      setSearchQuery("");
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all font-body font-semibold"
                  >
                    {t('filters.resetAll')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Properties Grid */}
      <section className="py-16 px-4 min-h-[60vh]">
        <div className="container mx-auto">
          {isLoading ? (
            <>
              <div className="mb-6">
                <div className="h-5 bg-muted rounded w-48 animate-pulse" />
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-t-2xl" />
                    <div className="p-4 bg-white rounded-b-2xl shadow-card">
                      <div className="h-6 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                      <div className="h-8 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  {t('properties.errorTitle')}
                </h3>
                <p className="text-muted-foreground font-body mb-6">
                  {t('properties.errorDesc')}
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => refetch()}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-body font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t('properties.tryAgain')}
                  </button>
                  <button
                    onClick={() => {
                      setFilters({ page: 1, per_page: 12, sort_by: 'created_at', sort_order: 'desc' });
                      setSearchQuery("");
                    }}
                    className="px-6 py-3 bg-secondary text-foreground rounded-xl font-body font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    {t('properties.resetFilters')}
                  </button>
                </div>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">🏝️</div>
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
                  {t('properties.noResults')}
                </h3>
                <p className="text-muted-foreground font-body mb-6">
                  {t('properties.noResultsDesc')}
                </p>
                <button
                  onClick={() => {
                    setFilters({ page: 1, per_page: 12, sort_by: 'created_at', sort_order: 'desc' });
                    setSearchQuery("");
                  }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-body font-semibold hover:bg-primary/90 transition-colors"
                >
                  {t('properties.clearFilters')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-body text-foreground font-medium">
                    {meta?.total || 0} {t('properties.found')}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {t('properties.showing')} {meta?.from || 0} - {meta?.to || 0}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-muted-foreground">{t('common.view')}:</span>
                  <button className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property: Property, index: number) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link to={`/property/${property.slug || property.id}`}>
                      <div className="group relative overflow-hidden rounded-2xl bg-white shadow-card hover:shadow-premium transition-all duration-500 border border-border hover:border-primary/30">
                        {/* Property Image */}
                        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                          <img
                            src={getPropertyImage(property)}
                            alt={property.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {property.is_featured && (
                              <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                                ⭐ {t('properties.featured')}
                              </div>
                            )}
                            {property.price_type === 'sale' && (
                              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                                {t('properties.forSale')}
                              </div>
                            )}
                            {property.price_type !== 'sale' && (
                              <div className="bg-secondary text-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
                                {t('properties.forRent')}
                              </div>
                            )}
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* View Details Button on Hover */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full text-sm font-semibold shadow-lg">
                              {t('properties.viewDetails')} →
                            </span>
                          </div>
                        </div>

                        {/* Property Info */}
                        <div className="p-5">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {property.title}
                          </h3>
                          
                          <div className="flex items-center gap-1 text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <p className="font-body text-sm line-clamp-1">{property.island?.name}</p>
                          </div>

                          {/* Property Details */}
                          {(property.bedrooms || property.bathrooms || property.land_area) && (
                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
                          )}

                          {/* Price */}
                          <div className="pt-4 border-t border-border">
                            <p className="font-heading text-xl font-bold text-primary">
                              {formatPrice(property.price, property.price_type)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(meta.current_page - 1)}
                    disabled={meta.current_page === 1}
                    className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-body"
                  >
                    {t('properties.previous')}
                  </button>
                  
                  {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors font-body ${
                          meta.current_page === page
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(meta.current_page + 1)}
                    disabled={meta.current_page === meta.last_page}
                    className="px-4 py-2 rounded-lg border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-body"
                  >
                    {t('properties.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
