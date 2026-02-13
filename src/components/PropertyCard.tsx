import { MapPin, Maximize, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: string;
  size: string;
  status: "For Sale" | "For Rent";
}

const PropertyCard = ({ id, image, title, location, price, size, status }: PropertyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <Link
        to={`/property/${id}`}
        className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 font-body text-xs font-medium text-primary-foreground">
            {status}
          </span>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="font-heading text-lg font-semibold text-foreground leading-snug">
            {title}
          </p>
          <div className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin size={14} />
            <span className="font-body text-sm">{location}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="font-heading text-xl font-bold text-primary">{price}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Maximize size={14} />
              <span className="font-body text-sm">{size}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 font-body text-sm font-medium text-accent transition-colors group-hover:text-accent/80">
            View Details <ChevronRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
