import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Island } from "@/lib/types";
import islandPagai from "@/assets/island-pagai.jpg";

// Mapping gambar unik untuk setiap island - SETIAP PULAU PUNYA GAMBAR YANG SANGAT BERBEDA
const defaultImages: Record<string, string> = {
  // Siberut - Dense tropical rainforest with mountains (HIJAU LEBAT)
  'siberut': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Sipora - Crystal clear turquoise water with white sand (BIRU JERNIH)
  'sipora': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Pagai Utara - Big waves and surf breaks (OMBAK BESAR)
  'pagai-utara': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Pagai Selatan - Sunset beach with palm trees (SUNSET PANTAI)
  'pagai-selatan': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Fallback untuk slug alternatif & case variations
  'pagai': islandPagai,
  'north-pagai': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  'south-pagai': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Siberut': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Sipora': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Pagai Utara': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Pagai Selatan': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3',
};

const ExploreIslands = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['islands'],
    queryFn: async () => {
      try {
        console.log('Fetching islands from:', import.meta.env.VITE_API_URL || 'https://mentawai.universitas-digital.web.id/api');
        const response = await api.getIslands();
        console.log('Islands response:', response);
        return response.data || [];
      } catch (err) {
        console.error('Error fetching islands:', err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <section id="islands" className="bg-secondary py-20 px-4">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <p className="font-body text-sm font-medium uppercase tracking-widest text-accent">
              Explore by Island
            </p>
            <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
              Find Your Perfect Island
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse aspect-[3/4] bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="islands" className="bg-secondary py-20 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">Failed to load islands</p>
        </div>
      </section>
    );
  }

  const islands = data || [];

  // Function to get image for island - dengan case insensitive matching
  const getIslandImage = (island: Island): string => {
    const slugLower = island.slug?.toLowerCase() || '';
    const nameLower = island.name?.toLowerCase() || '';
    
    // Priority: 1. Check slug (case insensitive), 2. Check name, 3. Database image_url, 4. Fallback
    if (defaultImages[slugLower]) return defaultImages[slugLower];
    if (defaultImages[island.slug]) return defaultImages[island.slug];
    if (defaultImages[nameLower]) return defaultImages[nameLower];
    if (defaultImages[island.name]) return defaultImages[island.name];
    if (island.image_url) return island.image_url;
    
    // Final fallback
    return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <section id="islands" className="bg-secondary py-20 px-4">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <p className="font-body text-sm font-medium uppercase tracking-widest text-accent">
            Explore by Island
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Find Your Perfect Island
          </h2>
          <p className="mt-3 max-w-2xl mx-auto font-body text-muted-foreground">
            Discover the unique beauty and opportunities across the Mentawai archipelago
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {islands.map((island: Island, i: number) => {
            const imageUrl = getIslandImage(island);
            
            return (
              <Link
                key={island.id}
                to={`/properties?island_id=${island.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-card hover:shadow-premium transition-all duration-500"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={`${island.name} - Mentawai Islands`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-heading text-2xl font-semibold text-primary-foreground mb-1">
                      {island.name}
                    </h3>
                    <p className="font-body text-sm text-primary-foreground/90 mb-3">
                      {island.approved_properties_count || 0} properties available
                    </p>
                    {island.description && (
                      <p className="font-body text-xs text-primary-foreground/75 line-clamp-2">
                        {island.description}
                      </p>
                    )}
                  </div>

                  {/* Hover Effect - View Properties Button */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <span className="font-body text-sm font-semibold text-primary">
                        Explore {island.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExploreIslands;
