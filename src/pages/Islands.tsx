import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MapPin, Home, Waves, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import type { Island } from "@/lib/types";

// Island images mapping - SETIAP PULAU PUNYA GAMBAR YANG SANGAT BERBEDA
const islandImages: Record<string, string> = {
  // Siberut - Dense tropical rainforest with mountains (HIJAU LEBAT)
  'siberut': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Sipora - Crystal clear turquoise water with white sand (BIRU JERNIH)
  'sipora': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Pagai Utara - Big waves and surf breaks (OMBAK BESAR)
  'pagai-utara': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Pagai Selatan - Sunset beach with palm trees (SUNSET PANTAI)
  'pagai-selatan': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  
  // Alternative slugs (fallback) - case insensitive
  'pagai': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'north-pagai': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'south-pagai': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Siberut': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Sipora': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Pagai Utara': 'https://images.unsplash.com/photo-1502933691298-84fc14542831?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
  'Pagai Selatan': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
};

const Islands = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['islands'],
    queryFn: async () => {
      const response = await api.getIslands();
      return response.data || [];
    },
  });

  const getIslandImage = (island: Island): string => {
    // Priority: 1. Check slug (lowercase), 2. Check name, 3. Database image_url, 4. Fallback
    const slugLower = island.slug?.toLowerCase() || '';
    const nameLower = island.name?.toLowerCase() || '';
    
    // Try slug first (case insensitive)
    if (islandImages[slugLower]) return islandImages[slugLower];
    if (islandImages[island.slug]) return islandImages[island.slug];
    
    // Try name (case insensitive)
    if (islandImages[nameLower]) return islandImages[nameLower];
    if (islandImages[island.name]) return islandImages[island.name];
    
    // Database image
    if (island.image_url) return island.image_url;
    
    // Final fallback
    return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary-foreground" />
              <span className="font-body text-sm font-medium uppercase tracking-widest text-primary-foreground/90">
                {t('islands.exploreTitle')}
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {t('islands.title')}
            </h1>
            <p className="font-body text-lg text-primary-foreground/90 leading-relaxed">
              {t('islands.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Islands Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/10] bg-muted rounded-2xl mb-4" />
                  <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('properties.errorDesc')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {(data || []).map((island: Island, index: number) => (
                <motion.div
                  key={island.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
                >
                  {/* Island Image */}
                  <Link to={`/properties?island_id=${island.id}`}>
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={getIslandImage(island)}
                        alt={island.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Island Info */}
                  <div className="p-6">
                    <Link to={`/properties?island_id=${island.id}`}>
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {island.name}
                      </h2>
                    </Link>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Home className="w-4 h-4" />
                        <span className="font-body text-sm">
                          {island.approved_properties_count || 0} {t('islands.properties')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Waves className="w-4 h-4" />
                        <span className="font-body text-sm">{t('islands.beachfront')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TreePine className="w-4 h-4" />
                        <span className="font-body text-sm">{t('islands.nature')}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {island.description && (
                      <p className="font-body text-muted-foreground leading-relaxed mb-6">
                        {t(`islands.descriptions.${island.slug?.toLowerCase()}`, { defaultValue: island.description })}
                      </p>
                    )}

                    {/* CTA Button */}
                    <Link to={`/properties?island_id=${island.id}`}>
                      <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-body font-semibold hover:brightness-110 transition-all">
                        {t('islands.viewProperties', { count: island.approved_properties_count || 0 })}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Mentawai Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('islands.whyInvest')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t('islands.whyInvestDesc')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: t('islands.worldClassSurfing.title'),
                  description: t('islands.worldClassSurfing.description'),
                },
                {
                  title: t('islands.pristineNature.title'),
                  description: t('islands.pristineNature.description'),
                },
                {
                  title: t('islands.growingTourism.title'),
                  description: t('islands.growingTourism.description'),
                },
                {
                  title: t('islands.richCulture.title'),
                  description: t('islands.richCulture.description'),
                },
                {
                  title: t('islands.strategicLocation.title'),
                  description: t('islands.strategicLocation.description'),
                },
                {
                  title: t('islands.investmentPotential.title'),
                  description: t('islands.investmentPotential.description'),
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Islands;
