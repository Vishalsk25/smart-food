// Types for the application

export enum UserRole {
  RESTAURANT = 'RESTAURANT',
  NGO = 'NGO',
  VOLUNTEER = 'VOLUNTEER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  organizationId?: number;
  latitude: number;
  longitude: number;
  address?: string;
  rewardPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresAt: string;
}

export interface Organization {
  id: number;
  registrationNumber: string;
  name: string;
  type: OrganizationType;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: OrganizationStatus;
  totalDonations: number;
  totalBeneficiaries: number;
  totalFoodWeight: number;
  createdAt: string;
  updatedAt: string;
}

export enum OrganizationType {
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  SUPERMARKET = 'SUPERMARKET',
  EVENT = 'EVENT',
  NGO = 'NGO',
  SHELTER = 'SHELTER',
}

export enum OrganizationStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export interface FoodDonation {
  id: number;
  donorId: number;
  donorName: string;
  foodName: string;
  description?: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  expiryTime: string;
  latitude: number;
  longitude: number;
  pickupInstructions?: string;
  status: DonationStatus;
  imageUrl?: string;
  estimatedBeneficiaries?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodDonationCreateRequest {
  foodName: string;
  description?: string;
  quantity: number;
  unit: string;
  category: FoodCategory;
  expiryTime: string;
  latitude: number;
  longitude: number;
  pickupInstructions?: string;
  estimatedBeneficiaries?: number;
  imageUrl?: string;
}

export interface FoodDonationUpdateRequest {
  foodName?: string;
  description?: string;
  quantity?: number;
  expiryTime?: string;
  pickupInstructions?: string;
  estimatedBeneficiaries?: number;
}

export interface OrganizationCreateRequest {
  registrationNumber: string;
  name: string;
  type: OrganizationType;
  description?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export enum FoodCategory {
  COOKED = 'COOKED',
  RAW = 'RAW',
  PACKAGED = 'PACKAGED',
  BAKERY = 'BAKERY',
  DAIRY = 'DAIRY',
  FRUITS_VEGETABLES = 'FRUITS_VEGETABLES',
}

export enum DonationStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  PICKED = 'PICKED',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface DeliveryOrder {
  id: number;
  donationId: number;
  recipientId: number;
  recipientName: string;
  volunteerId?: number;
  volunteerName?: string;
  status: DeliveryStatus;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
  estimatedDistance?: number;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
  pickedAt?: string;
  deliveredAt?: string;
  proofOfDeliveryUrl?: string;
  notes?: string;
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED = 'PICKED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: number;
}

export interface LiveDonationRecord {
  id?: string;
  backendDonationId?: string | number;
  donorName?: string;
  fullName: string;
  email: string;
  donationType: 'food' | 'funds' | 'both';
  foodPlates?: string;
  quantityChoice?: string;
  category?: string;
  fundsAmount?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  status?: 'Pending' | 'Approved' | 'Accepted' | 'On the Way to Pickup' | 'Picked Up' | 'On the Way to Delivery' | 'Delivered' | 'Cancelled' | string;
  managedBy?: string;
  
  // Delivery & Tracking Fields
  deliveryNgoId?: string;
  deliveryNgoName?: string;
  deliveryNgoContact?: string;
  fromLocation?: string;
  toLocation?: string;
  distanceKm?: string;
  
  // Coordinates for Map
  ngoLat?: number;
  ngoLng?: number;
  donorLat?: number;
  donorLng?: number;
  receiverLat?: number;
  receiverLng?: number;
  
  // Timestamps
  createdAt?: string;
  acceptedAt?: string;
  pickupEta?: string;
  pickedUpAt?: string;
  deliveryEta?: string;
  deliveredAt?: string;
  
  // Verification Logs
  verificationMethod?: VerificationMode;
  pickupVerificationTime?: string;
  deliveryVerificationTime?: string;
  pickupOtpVerified?: boolean;
  deliveryOtpVerified?: boolean;
  pickupQrScanned?: boolean;
  deliveryQrScanned?: boolean;
}

export enum VerificationMode {
  QR_ONLY = 'QR_ONLY',
  OTP_ONLY = 'OTP_ONLY',
  QR_AND_OTP = 'QR_AND_OTP',
}

export interface VerificationSettings {
  method: VerificationMode;
  otpExpiryMinutes: number;
  maxAttempts: number;
  enableGpsLogging: boolean;
  enableScanHistory: boolean;
  enableAuditLogs: boolean;
}
