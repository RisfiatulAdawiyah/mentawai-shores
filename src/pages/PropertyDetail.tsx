import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Maximize, Bed, Bath } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      // Try to fetch by ID first, if fails try as slug
      try {
        const response = await api.getProperty(id);
        return response.data;
      } catch (err: unknown) {
        // If 404, property might not exist
        console.error('Error fetching property:', err);
        throw err;
      }
    },
    enabled: !!id,
    retry: false,
  });

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setIsSubmitting(true);
    try {
      await api.createLead(data.id, leadForm);
      toast.success("Your inquiry has been sent successfully!");
      setLeadForm({ name: "", email: "", phone: "", message: "" });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to send inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-muted rounded-2xl" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
            Property Not Found
          </h1>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const property = data;
  
  // Get all images with fallback
  const getPropertyImages = () => {
    const images: string[] = [];
    
    // Add primary image first
    if (property.primary_image?.image_url) {
      images.push(property.primary_image.image_url);
    }
    
    // Add other images
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach((img: { image_url?: string }) => {
        if (img.image_url && !images.includes(img.image_url)) {
          images.push(img.image_url);
        }
      });
    }
    
    // If no images, add fallback images
    if (images.length === 0) {
      const fallbackImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      ];
      return fallbackImages;
    }
    
    return images;
  };
  
  const propertyImages = getPropertyImages();
  const currentImage = propertyImages[selectedImageIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image Gallery */}
      <div className="relative h-[60vh] min-h-[500px] bg-muted">
        <img
          src={currentImage}
          alt={`${property.title} - Image ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        
        {/* Image Navigation */}
        {propertyImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm text-white rounded-full font-body text-sm">
              {selectedImageIndex + 1} / {propertyImages.length}
            </div>
          </>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full font-body text-sm font-medium mb-4">
              {property.price_type === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-primary-foreground/90">
              <MapPin size={18} />
              <span className="font-body text-lg">{property.island?.name}, Mentawai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {propertyImages.length > 1 && (
        <div className="bg-secondary border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary">
              {propertyImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary shadow-lg scale-105'
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=200&auto=format&fit=crop';
                    }}
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Price & Key Info */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-heading text-4xl font-bold text-primary">
                  {property.formatted_price || `Rp ${property.price.toLocaleString('id-ID')}`}
                </span>
                {property.price_type !== 'sale' && (
                  <span className="font-body text-muted-foreground">
                    / {property.price_type.replace('rent_', '')}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.land_area && (
                  <div className="flex items-center gap-2">
                    <Maximize size={20} className="text-accent" />
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Land Area</p>
                      <p className="font-body text-sm font-medium">{property.land_area} m²</p>
                    </div>
                  </div>
                )}
                {property.building_area && (
                  <div className="flex items-center gap-2">
                    <Maximize size={20} className="text-accent" />
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Building</p>
                      <p className="font-body text-sm font-medium">{property.building_area} m²</p>
                    </div>
                  </div>
                )}
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed size={20} className="text-accent" />
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Bedrooms</p>
                      <p className="font-body text-sm font-medium">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath size={20} className="text-accent" />
                    <div>
                      <p className="font-body text-xs text-muted-foreground">Bathrooms</p>
                      <p className="font-body text-sm font-medium">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                About This Property
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Facilities */}
            {property.facilities && property.facilities.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  Facilities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="font-body text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                Location
              </h2>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={20} className="mt-0.5 flex-shrink-0" />
                <p className="font-body">{property.address}</p>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                Interested in this property?
              </h3>
              <p className="font-body text-sm text-muted-foreground mb-6">
                Send us your details and we'll get back to you shortly.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={leadForm.message}
                    onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                    disabled={isSubmitting}
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>

              {property.user && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-body text-xs text-muted-foreground mb-3">Listed by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="font-heading text-primary-foreground font-semibold">
                        {property.user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium">{property.user.name}</p>
                      <p className="font-body text-xs text-muted-foreground capitalize">
                        {property.user.role}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
