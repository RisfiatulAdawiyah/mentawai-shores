import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Property,
  Category,
  Island,
  Favorite,
  Lead,
  Booking,
  LoginCredentials,
  RegisterData,
  PropertyFilters,
  PropertyFormData,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mentawai.universitas-digital.web.id/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      withCredentials: false,
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<null>>) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await this.client.post('/auth/login', credentials);
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const { data } = await this.client.post('/auth/register', userData);
    if (data.success && data.data?.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async logout(): Promise<ApiResponse<null>> {
    const { data } = await this.client.post('/auth/logout');
    this.clearToken();
    return data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const { data } = await this.client.get('/auth/user');
    return data;
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const { data } = await this.client.put('/auth/profile', userData);
    return data;
  }

  async changePassword(passwords: { 
    current_password: string; 
    password: string; 
    password_confirmation: string 
  }): Promise<ApiResponse<null>> {
    const { data } = await this.client.put('/auth/password', passwords);
    return data;
  }

  // Property endpoints
  async getProperties(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const { data } = await this.client.get('/properties', { params: filters });
    return data;
  }

  async getProperty(slug: string): Promise<ApiResponse<Property>> {
    const { data } = await this.client.get(`/properties/${slug}`);
    return data;
  }

  async createProperty(propertyData: PropertyFormData): Promise<ApiResponse<Property>> {
    const { data } = await this.client.post('/properties', propertyData);
    return data;
  }

  async updateProperty(id: number, propertyData: Partial<PropertyFormData>): Promise<ApiResponse<Property>> {
    const { data } = await this.client.put(`/properties/${id}`, propertyData);
    return data;
  }

  async deleteProperty(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete(`/properties/${id}`);
    return data;
  }

  async getFeaturedProperties(): Promise<ApiResponse<Property[]>> {
    const { data } = await this.client.get('/properties/featured');
    return data;
  }

  async getLatestProperties(params?: { per_page?: number }): Promise<PaginatedResponse<Property>> {
    const { data } = await this.client.get('/properties/latest', { params });
    return data;
  }

  async getMyProperties(): Promise<ApiResponse<Property[]>> {
    const { data } = await this.client.get('/my-properties');
    return data;
  }

  // Property Images
  async uploadPropertyImages(propertyId: number, images: File[]): Promise<ApiResponse<PropertyImage[]>> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images[]', image);
    });
    const { data } = await this.client.post(`/properties/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async deletePropertyImage(propertyId: number, imageId: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete(`/properties/${propertyId}/images/${imageId}`);
    return data;
  }

  async setPrimaryImage(propertyId: number, imageId: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.put(`/properties/${propertyId}/images/${imageId}/primary`);
    return data;
  }

  async reorderImages(propertyId: number, imageIds: number[]): Promise<ApiResponse<null>> {
    const { data } = await this.client.put(`/properties/${propertyId}/images/reorder`, { 
      image_ids: imageIds 
    });
    return data;
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const { data } = await this.client.get('/categories');
    return data;
  }

  async getCategory(slug: string): Promise<ApiResponse<Category>> {
    const { data } = await this.client.get(`/categories/${slug}`);
    return data;
  }

  async getCategoryProperties(slug: string, filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const { data } = await this.client.get(`/categories/${slug}/properties`, { params: filters });
    return data;
  }

  // Islands
  async getIslands(): Promise<ApiResponse<Island[]>> {
    const { data } = await this.client.get('/islands');
    return data;
  }

  async getIsland(slug: string): Promise<ApiResponse<Island>> {
    const { data } = await this.client.get(`/islands/${slug}`);
    return data;
  }

  async getIslandProperties(slug: string, filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    const { data } = await this.client.get(`/islands/${slug}/properties`, { params: filters });
    return data;
  }

  // Favorites
  async getFavorites(): Promise<ApiResponse<Favorite[]>> {
    const { data } = await this.client.get('/favorites');
    return data;
  }

  async addFavorite(propertyId: number): Promise<ApiResponse<Favorite>> {
    const { data } = await this.client.post(`/favorites/${propertyId}`);
    return data;
  }

  async removeFavorite(propertyId: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete(`/favorites/${propertyId}`);
    return data;
  }

  async toggleFavorite(propertyId: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
    const { data } = await this.client.post(`/favorites/${propertyId}/toggle`);
    return data;
  }

  async checkFavorite(propertyId: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
    const { data } = await this.client.get(`/favorites/${propertyId}/check`);
    return data;
  }

  // Leads
  async getLeads(): Promise<ApiResponse<Lead[]>> {
    const { data } = await this.client.get('/leads');
    return data;
  }

  async getLead(id: number): Promise<ApiResponse<Lead>> {
    const { data } = await this.client.get(`/leads/${id}`);
    return data;
  }

  async createLead(propertyId: number, leadData: { 
    name: string;
    email: string;
    phone: string;
    message?: string;
  }): Promise<ApiResponse<Lead>> {
    const { data } = await this.client.post(`/properties/${propertyId}/leads`, leadData);
    return data;
  }

  async updateLeadStatus(id: number, status: string): Promise<ApiResponse<Lead>> {
    const { data } = await this.client.put(`/leads/${id}/status`, { status });
    return data;
  }

  async deleteLead(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.delete(`/leads/${id}`);
    return data;
  }

  async getLeadStats(): Promise<ApiResponse<LeadStats>> {
    const { data } = await this.client.get('/leads/stats');
    return data;
  }

  // Bookings
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    const { data } = await this.client.get('/bookings');
    return data;
  }

  async getBooking(id: number): Promise<ApiResponse<Booking>> {
    const { data } = await this.client.get(`/bookings/${id}`);
    return data;
  }

  async createBooking(propertyId: number, bookingData: {
    check_in_date: string;
    check_out_date: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    special_requests?: string;
  }): Promise<ApiResponse<Booking>> {
    const { data } = await this.client.post(`/properties/${propertyId}/bookings`, bookingData);
    return data;
  }

  async cancelBooking(id: number): Promise<ApiResponse<null>> {
    const { data } = await this.client.put(`/bookings/${id}/cancel`);
    return data;
  }

  async confirmBooking(id: number): Promise<ApiResponse<Booking>> {
    const { data } = await this.client.put(`/bookings/${id}/confirm`);
    return data;
  }

  async completeBooking(id: number): Promise<ApiResponse<Booking>> {
    const { data } = await this.client.put(`/bookings/${id}/complete`);
    return data;
  }

  async getBookingStats(): Promise<ApiResponse<BookingStats>> {
    const { data } = await this.client.get('/bookings/stats');
    return data;
  }

  async checkAvailability(propertyId: number, params: {
    check_in_date: string;
    check_out_date: string;
  }): Promise<ApiResponse<{ available: boolean }>> {
    const { data } = await this.client.get(`/properties/${propertyId}/availability`, { params });
    return data;
  }

  // Property Bookings (Owner/Agent)
  async getPropertyBookings(): Promise<ApiResponse<Booking[]>> {
    const { data } = await this.client.get('/property-bookings');
    return data;
  }
}

export const api = new ApiClient();
export default api;
