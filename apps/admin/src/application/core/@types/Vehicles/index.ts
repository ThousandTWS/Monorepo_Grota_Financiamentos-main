export type VehicleStatus =
  | "available"
  | "in_financing"
  | "sold"
  | "reserved"
  | "maintenance";

export type VehicleCondition = "new" | "used" | "semi_new";

export type FuelType =
  | "gasoline"
  | "ethanol"
  | "flex"
  | "diesel"
  | "electric"
  | "hybrid";

export type TransmissionType = "manual" | "automatic" | "automated";

export interface Vehicle {
  id: string;
  dealerId: string;
  dealerName: string;
  brand: string;
  model: string;
  year: number;
  modelYear: number;
  color: string;
  licensePlate: string;
  chassisNumber: string;
  renavam: string;
  mileage: number;
  condition: VehicleCondition;
  fuelType: FuelType;
  transmission: TransmissionType;
  doors: number;
  price: number;
  costPrice?: number;
  description?: string;
  features: string[];
  images: string[];
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
  soldAt?: string;
  reservedUntil?: string;
  financingProposalId?: string;
}

export interface VehicleFilters {
  status?: VehicleStatus[];
  condition?: VehicleCondition[];
  brand?: string[];
  fuelType?: FuelType[];
  transmission?: TransmissionType[];
  priceRange?: {
    min: number;
    max: number;
  };
  yearRange?: {
    min: number;
    max: number;
  };
  search?: string;
  dealerId?: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  inFinancing: number;
  sold: number;
  reserved: number;
  maintenance: number;
  totalValue: number;
  averagePrice: number;
}
