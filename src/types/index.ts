export interface Shop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'plug-in-hybrid' | 'electric' | 'flex-fuel';
export type TransmissionType = 'automatic' | 'manual' | 'CVT' | 'dual-clutch';
export type DrivetrainType = 'FWD' | 'RWD' | 'AWD' | '4WD';
export type BodyType = 'sedan' | 'SUV' | 'truck' | 'coupe' | 'convertible' | 'wagon' | 'van' | 'hatchback';
export type VehicleCondition = 'new' | 'used' | 'certified-pre-owned';
export type TitleStatus = 'clean' | 'salvage' | 'rebuilt' | 'lemon' | 'flood-damage';
export type MileageUnit = 'miles' | 'km';

export interface ServiceRecord {
  id: string;
  date: string;
  mileage: number;
  serviceType: string;
  description: string;
  cost: number;
  serviceProvider: string;
  invoiceUrl?: string;
}

export interface AccidentHistory {
  id: string;
  date: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  repairCost?: number;
  reportUrl?: string;
}

export interface WarrantyInfo {
  type: 'manufacturer' | 'extended' | 'powertrain' | 'bumper-to-bumper';
  provider: string;
  expiryDate: string;
  expiryMileage: number;
  transferable: boolean;
  details: string;
}

export interface Vehicle extends Product {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  mileageUnit: MileageUnit;
  engineSize?: string;
  engineType?: string;
  cylinders?: number;
  transmission: TransmissionType;
  drivetrain: DrivetrainType;
  exteriorColor: string;
  interiorColor: string;
  fuelType: FuelType;
  bodyType: BodyType;
  condition: VehicleCondition;
  serviceHistory: ServiceRecord[];
  accidentHistory: AccidentHistory[];
  numberOfOwners: number;
  titleStatus: TitleStatus;
  registrationExpiry?: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  warranty?: WarrantyInfo[];
  features: string[];
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number;
  seatingCapacity?: number;
  doors?: number;
  daysOnLot: number;
  viewCount: number;
  inquiryCount: number;
  carfaxUrl?: string;
  autoCheckUrl?: string;
  listingUrl?: string;
  sold?: boolean;
}

export interface Dealership extends Shop {
  dealerLicenseNumber: string;
  dealershipType: 'new' | 'used' | 'both';
  brandsCarried: string[];
  hasServiceDepartment: boolean;
  serviceBays?: number;
  serviceHours?: {
    open: string;
    close: string;
    daysOpen: string[];
  };
  certifiedBrands?: string[];
  financingPartners: string[];
  acceptsTradeIns: boolean;
  testDriveAvailable: boolean;
  deliveryOptions: {
    pickup: boolean;
    localDelivery: boolean;
    shipping: boolean;
    deliveryRadius?: number;
    deliveryFee?: number;
  };
}

export type TestDriveStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no-show';

export interface TestDrive {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  telegramUserId?: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  preferredDate: string;
  preferredTime: string;
  alternativeDates?: { date: string; time: string }[];
  status: TestDriveStatus;
  driversLicenseVerified: boolean;
  driversLicensePhotoUrl?: string;
  duration: number;
  notes?: string;
  specialRequirements?: string;
  salesRepId?: string;
  salesRepName?: string;
  checkInTime?: string;
  checkOutTime?: string;
  feedback?: string;
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TradeInStatus = 'submitted' | 'evaluating' | 'inspected' | 'offer-made' | 'approved' | 'declined' | 'accepted' | 'completed';

export interface TradeInVehicle {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  exteriorColor: string;
  interiorColor: string;
  hasAccidents: boolean;
  accidentDetails?: string;
  knownIssues?: string;
  modifications?: string[];
}

export interface TradeIn {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  telegramUserId?: string;
  vehicle: TradeInVehicle;
  photos: string[];
  estimatedValue?: number;
  offerAmount?: number;
  offerValidUntil?: string;
  status: TradeInStatus;
  evaluationNotes?: string;
  inspectionNotes?: string;
  applyTowardsPurchase?: {
    vehicleId: string;
    vehicleName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type CreditScoreRange = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
export type FinancingStatus = 'submitted' | 'reviewing' | 'documents-requested' | 'pre-approved' | 'approved' | 'declined' | 'completed';

export interface EmploymentInfo {
  employer: string;
  jobTitle: string;
  employmentType: 'full-time' | 'part-time' | 'self-employed' | 'retired' | 'other';
  yearsEmployed: number;
  monthlyIncome: number;
  phoneNumber: string;
}

export interface FinancingDocument {
  id: string;
  type: 'drivers-license' | 'proof-of-income' | 'proof-of-residence' | 'insurance' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface FinancingApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dateOfBirth: string;
  ssn?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  creditScoreRange: CreditScoreRange;
  vehicleId?: string;
  vehiclePrice?: number;
  downPayment: number;
  loanTermPreference: number;
  monthlyBudget?: number;
  preApprovalStatus: boolean;
  lenderName?: string;
  lenderContactInfo?: string;
  applicantEmployment: EmploymentInfo;
  coApplicant?: {
    name: string;
    relationship: string;
    employment: EmploymentInfo;
  };
  documents: FinancingDocument[];
  status: FinancingStatus;
  approvalAmount?: number;
  approvalRate?: number;
  approvalTerm?: number;
  monthlyPayment?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = 'oil-change' | 'tire-rotation' | 'brake-service' | 'engine-diagnostic' | 'inspection' | 'maintenance' | 'repair' | 'recall' | 'warranty' | 'custom';
export type ServiceAppointmentStatus = 'requested' | 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export interface ServiceAppointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleVin: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMileage: number;
  serviceType: ServiceType[];
  customServiceDescription?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: ServiceAppointmentStatus;
  serviceAdvisorId?: string;
  serviceAdvisorName?: string;
  technicianId?: string;
  technicianName?: string;
  estimatedCompletionTime?: string;
  actualCompletionTime?: string;
  estimatedCost?: number;
  actualCost?: number;
  workPerformed?: string[];
  partsReplaced?: { part: string; partNumber: string; cost: number }[];
  diagnosticNotes?: string;
  customerNotes?: string;
  nextServiceRecommendations?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number | '';
  vin: string;
  trim: string;
  condition: VehicleCondition | '';
  bodyType: BodyType | '';
  exteriorColor: string;
  interiorColor: string;
  mileage: number | '';
  mileageUnit: MileageUnit;
  engineSize: string;
  engineType: string;
  cylinders: number | '';
  transmission: TransmissionType | '';
  drivetrain: DrivetrainType | '';
  fuelType: FuelType | '';
  mpgCity: number | '';
  mpgHighway: number | '';
  mpgCombined: number | '';
  seatingCapacity: number | '';
  doors: number | '';
  numberOfOwners: number | '';
  titleStatus: TitleStatus | '';
  hasAccidents: boolean;
  accidentHistory: AccidentHistory[];
  serviceHistory: ServiceRecord[];
  features: string[];
  price: number | '';
  description: string;
  imageUrls: string[];
}

export type CustomerSource = 'walk-in' | 'test-drive' | 'trade-in' | 'financing' | 'purchase' | 'service' | 'referral' | 'online';
export type CustomerStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'vip';

export interface CustomerVehiclePurchase {
  vehicleId: string;
  vehicleName: string;
  vin: string;
  purchaseDate: string;
  salePrice: number;
  downPayment?: number;
  financedAmount?: number;
  tradeinValue?: number;
  notes?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  source: CustomerSource[];
  status: CustomerStatus;
  telegramUserId?: string;
  totalPurchases: number;
  totalSpent: number;
  vehiclesPurchased: CustomerVehiclePurchase[];
  testDrives: string[];
  tradeIns: string[];
  financingApplications: string[];
  serviceAppointments: string[];
  notes?: string;
  preferredContact?: 'email' | 'phone' | 'telegram';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
}
