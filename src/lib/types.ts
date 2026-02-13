// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Pagination Meta
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

// Paginated Response
export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta?: PaginationMeta;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// User Types

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'agent' | 'user';
  profile_photo?: string;
  profile_photo_url?: string | null;
  language: 'id' | 'en';
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Property Types

export interface Property {
  id: number;
  user_id: number;
  category_id: number;
  island_id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  price_type: 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly';
  land_area: number | null;
  building_area: number | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  facilities: string[] | null;
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  is_featured: boolean;
  rejection_reason?: string | null;
  views_count: number;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  island?: Island;
  user?: User;
  owner?: User;
  images?: PropertyImage[];
  primary_image?: PropertyImage;
  formatted_price?: string;
  price_with_period?: string;
}

export interface PropertyImage {
  id: number;
  property_id: number;
  image_url: string;
  cloudinary_public_id: string | null;
  is_primary: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  icon_url?: string | null;
  created_at: string;
  updated_at: string;
  properties_count?: number;
  approved_properties_count?: number;
}

export interface Island {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
  properties_count?: number;
  approved_properties_count?: number;
}

// Favorite Types

export interface Favorite {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  property?: Property;
}

// Lead Types

export interface Lead {
  id: number;
  property_id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  created_at: string;
  updated_at: string;
  property?: Property;
}

export interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

// Booking Types

export interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests: string | null;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  created_at: string;
  updated_at: string;
  property?: Property;
  user?: User;
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

// Form Types

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role?: 'user' | 'owner' | 'agent';
  language?: 'id' | 'en';
}

export interface PropertyFormData {
  title: string;
  description: string;
  category_id: number;
  island_id: number;
  price: number;
  price_type: 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly';
  land_area?: number;
  building_area?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  facilities?: string[];
}

export interface LeadForm {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface BookingForm {
  check_in_date: string;
  check_out_date: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
}

// Filter Types

export interface PropertyFilters {
  search?: string;
  category_id?: number;
  island_id?: number;
  price_type?: 'sale' | 'rent_daily' | 'rent_monthly' | 'rent_yearly';
  min_price?: number;
  max_price?: number;
  min_land_area?: number;
  max_land_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented';
  sort_by?: 'created_at' | 'price' | 'land_area' | 'views_count' | 'featured';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
