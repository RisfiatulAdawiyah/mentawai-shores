import { Skeleton } from "@/components/ui/skeleton";

const PropertyCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      {/* Image Skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <Skeleton className="h-6 w-32" />
        
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        {/* Details */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
