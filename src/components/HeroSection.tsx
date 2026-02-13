import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useStats } from "@/hooks/useStats";
import type { Island, Category } from "@/lib/types";
import heroImg from "@/assets/hero-mentawai.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { propertiesCount, islandsCount } = useStats();
  const [searchParams, setSearchParams] = useState({
    search: "",
    island_id: "",
    category_id: "",
    price_type: "",
  });

  // Fetch islands and categories
  const { data: islands } = useQuery({
    queryKey: ["islands"],
    queryFn: async () => {
      const response = await api.getIslands();
      return response.data || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.getCategories();
      return response.data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query params
    const params = new URLSearchParams();

    if (searchParams.search) {
      params.append("search", searchParams.search);
    }

    if (searchParams.island_id) {
      params.append("island_id", searchParams.island_id);
    }

    if (searchParams.category_id) {
      params.append("category_id", searchParams.category_id);
    }

    if (searchParams.price_type) {
      params.append("price_type", searchParams.price_type);
    }

    // Navigate to properties page with filters
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-[85vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Aerial view of Mentawai Islands tropical beach with villa"
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay - Darker for better text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.75) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[90vh] sm:min-h-[85vh] items-start lg:items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 xl:py-14">
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 lg:space-y-7">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center space-y-2.5 sm:space-y-3 lg:space-y-3.5"
            >
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight px-2">
                {t('hero.title')}
              </h1>
              <p className="font-body text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl text-white/90 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Search Box - Elevated Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="px-2 sm:px-0"
            >
              <form
                onSubmit={handleSearch}
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-5 border border-white/20 space-y-3 sm:space-y-3.5"
              >
                {/* Search Input - Full Width */}
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('hero.searchPlaceholder')}
                    value={searchParams.search}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        search: e.target.value,
                      })
                    }
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 lg:py-3.5 rounded-xl border border-border bg-white font-body text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <select
                      value={searchParams.island_id}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          island_id: e.target.value,
                        })
                      }
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      {islands?.map((island: Island) => (
                        <option key={island.id} value={island.id}>
                          {island.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Property Type Filter */}
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <select
                      value={searchParams.category_id}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Property Types</option>
                      {categories?.map((category: Category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Type Filter */}
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <select
                      value={searchParams.price_type}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          price_type: e.target.value,
                        })
                      }
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Buy or Rent</option>
                      <option value="sale">For Sale</option>
                      <option value="rent_daily">Daily Rent</option>
                      <option value="rent_monthly">Monthly Rent</option>
                      <option value="rent_yearly">Yearly Rent</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2.5 sm:py-3 lg:py-3.5 rounded-xl font-body font-semibold text-sm sm:text-base hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]"
                >
                  {t('hero.searchButton')}
                </button>
              </form>
            </motion.div>

            {/* Quick Stats - Dynamic & Credible */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 lg:gap-12 xl:gap-16 text-center pt-1"
            >
              <div className="flex flex-col items-center space-y-1">
                <p className="font-heading text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-white">
                  {propertiesCount > 0 ? `${propertiesCount}+` : "..."}
                </p>
                <p className="font-body text-xs sm:text-sm lg:text-xs xl:text-sm text-white/90 leading-tight">
                  {t('about.verifiedProperties')}
                </p>
              </div>
              
              <div className="hidden sm:block h-10 lg:h-12 w-px bg-white/30"></div>
              
              <div className="flex flex-col items-center space-y-1">
                <p className="font-heading text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-white">
                  {islandsCount || "4"}
                </p>
                <p className="font-body text-xs sm:text-sm lg:text-xs xl:text-sm text-white/90 leading-tight">
                  {t('nav.islands')}
                </p>
              </div>
              
              <div className="hidden sm:block h-10 lg:h-12 w-px bg-white/30"></div>
              
              <div className="flex flex-col items-center space-y-1">
                <p className="font-heading text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold text-white">
                  24/7
                </p>
                <p className="font-body text-xs sm:text-sm lg:text-xs xl:text-sm text-white/90 leading-tight">
                  {t('about.customerSupport')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
