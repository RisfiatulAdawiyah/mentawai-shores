import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Island, Category } from "@/lib/types";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    island_id: "",
    category_id: "",
    price_range: "",
  });

  // Fetch islands and categories
  const { data: islands } = useQuery({
    queryKey: ['islands'],
    queryFn: async () => {
      const response = await api.getIslands();
      return response.data || [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.getCategories();
      return response.data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    
    if (searchParams.island_id) {
      params.append('island_id', searchParams.island_id);
    }
    
    if (searchParams.category_id) {
      params.append('category_id', searchParams.category_id);
    }
    
    // Handle price range
    if (searchParams.price_range) {
      const priceRanges: Record<string, { min?: number; max?: number }> = {
        'under_500m': { max: 500000000 },
        '500m_1b': { min: 500000000, max: 1000000000 },
        '1b_5b': { min: 1000000000, max: 5000000000 },
        'above_5b': { min: 5000000000 },
      };
      
      const range = priceRanges[searchParams.price_range];
      if (range) {
        if (range.min) params.append('min_price', range.min.toString());
        if (range.max) params.append('max_price', range.max.toString());
      }
    }
    
    // Navigate to properties page with filters
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-10 px-4">
      <div className="container mx-auto">
        <form onSubmit={handleSearch} className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-4 shadow-lg sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground">
                Location
              </label>
              <select 
                value={searchParams.island_id}
                onChange={(e) => setSearchParams({ ...searchParams, island_id: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">All Islands</option>
                {islands?.map((island: Island) => (
                  <option key={island.id} value={island.id}>
                    {island.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground">
                Property Type
              </label>
              <select 
                value={searchParams.category_id}
                onChange={(e) => setSearchParams({ ...searchParams, category_id: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">All Types</option>
                {categories?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-medium text-muted-foreground">
                Price Range
              </label>
              <select 
                value={searchParams.price_range}
                onChange={(e) => setSearchParams({ ...searchParams, price_range: e.target.value })}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Any Price</option>
                <option value="under_500m">Under Rp 500 Juta</option>
                <option value="500m_1b">Rp 500 Juta – 1 Miliar</option>
                <option value="1b_5b">Rp 1 – 5 Miliar</option>
                <option value="above_5b">Above Rp 5 Miliar</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:brightness-110"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchBar;
