export type UserRole = "client" | "professional" | "admin";

export type BookingStatus =
  | "pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ProfessionalProfile {
  id: string;
  userId: string;
  status: "pending_setup" | "pending_review" | "approved" | "rejected";
  serviceCategory: string;
  isAvailable?: boolean;

  photoUrl?: string;
  county?: string;
  areas?: string[];
  travelRadiusKm?: number | null;
  eircode?: string;
  latitude?: number;
  longitude?: number;

  yearsExperience?: number;
  hourlyRate?: number;
  skills?: string[];

  photoIdUrl?: string;
  proofAddressUrl?: string;
  certificationUrls?: string[];
  insuranceUrl?: string;
  portfolioUrls?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  professionalId?: string;
  serviceCategory: string;
  problemType: string;

  county: string;
  areas: string[];
  travelRadiusKm?: number | null;
  eircode?: string;
  latitude?: number;
  longitude?: number;

  scheduleType: "now" | "scheduled";
  scheduledAt?: string;

  description?: string;
  imageUrls?: string[];

  status: BookingStatus;
  priceEstimate?: number | null;
  estimatedHours?: number | null;
  rating?: number | null;
  review?: string | null;
  completedAt?: string | null;
  receipt?: {
    priceEstimate?: number | null;
    finalPrice?: number | null;
    completedAt?: string | null;
  } | null;
  paymentIntentId?: string | null;
  cancellationFee?: number | null;

  createdAt: string;
  updatedAt: string;
}

export interface AreaSelection {
  county: string;
  areas: string[];
  travelRadiusKm: number | null;
  eircode?: string;
  latitude?: number | null;
  longitude?: number | null;
}
