import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useStats = () => {
  const { data: properties } = useQuery({
    queryKey: ["properties-count"],
    queryFn: async () => {
      try {
        const response = await api.getProperties({ per_page: 1 });
        return response.meta?.total || 0;
      } catch (error) {
        return 0;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: islands } = useQuery({
    queryKey: ["islands-count"],
    queryFn: async () => {
      try {
        const response = await api.getIslands();
        return response.data?.length || 0;
      } catch (error) {
        return 0;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    propertiesCount: properties || 0,
    islandsCount: islands || 0,
  };
};
