import axios from 'axios';
import type {
  ApiResponse,
  AuthResponse,
  DeliveryOrder,
  FoodDonation,
  FoodDonationCreateRequest,
  FoodDonationUpdateRequest,
  Organization,
  OrganizationCreateRequest,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: (data: any) => 
    api.post<ApiResponse<AuthResponse>>('/v1/auth/register', data),
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/v1/auth/login', { email, password }),
};

// Donation Service
export const donationService = {
  createDonation: (donorId: number, data: FoodDonationCreateRequest) =>
    api.post<ApiResponse<FoodDonation>>(`/v1/donations?donorId=${donorId}`, data),
  updateDonation: (id: number, data: FoodDonationUpdateRequest) =>
    api.put<ApiResponse<FoodDonation>>(`/v1/donations/${id}`, data),
  getDonation: (id: number) =>
    api.get<ApiResponse<FoodDonation>>(`/v1/donations/${id}`),
  getAvailableDonations: () =>
    api.get<ApiResponse<FoodDonation[]>>('/v1/donations/available/all'),
  getNearbyDonations: (latitude: number, longitude: number, radius: number = 10) =>
    api.get<ApiResponse<FoodDonation[]>>('/v1/donations/nearby', {
      params: { latitude, longitude, radiusKm: radius },
    }),
  deleteDonation: (id: number) =>
    api.delete(`/v1/donations/${id}`),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<ApiResponse<string>>('/v1/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Organization Service
export const organizationService = {
  createOrganization: (data: OrganizationCreateRequest) =>
    api.post<ApiResponse<Organization>>('/v1/organizations', data),
  updateOrganization: (id: number, data: Partial<OrganizationCreateRequest>) =>
    api.put<ApiResponse<Organization>>(`/v1/organizations/${id}`, data),
  getOrganization: (id: number) =>
    api.get<ApiResponse<Organization>>(`/v1/organizations/${id}`),
  getAllOrganizations: () =>
    api.get<ApiResponse<Organization[]>>('/v1/organizations'),
};

// Delivery Service
export const deliveryService = {
  createDelivery: (data: any) =>
    api.post<ApiResponse<DeliveryOrder>>('/v1/deliveries', data),
  updateDeliveryStatus: (id: number, data: any) =>
    api.put<ApiResponse<DeliveryOrder>>(`/v1/deliveries/${id}/status`, data),
  getDelivery: (id: number) =>
    api.get<ApiResponse<DeliveryOrder>>(`/v1/deliveries/${id}`),
  getDeliveriesByVolunteer: (volunteerId: number) =>
    api.get<ApiResponse<DeliveryOrder[]>>(`/v1/deliveries/volunteer/${volunteerId}`),
  trackDelivery: (id: number) =>
    api.get(`/v1/deliveries/${id}/tracking`),
};

// User Service
export const userService = {
  getAllUsers: () => api.get('/v1/users'),
  updateUser: (id: number, data: any) => api.put(`/v1/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/v1/users/${id}`),
};

export default api;
