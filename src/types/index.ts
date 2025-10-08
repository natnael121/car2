export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  languageCode: string
  telegramId?: number
}

export interface UserData {
  uid: string
  id?: string // Add optional id field for compatibility
  email: string
  displayName?: string
  phone?: string
  bio?: string
  role: 'shop_owner' | 'admin'
  telegramId?: number
  telegram_id?: number // Add for compatibility with different field names
  telegramBotToken?: string
  telegramBotToken?: string
  profileCompleted?: boolean
  settings: {
    notifications: {
      email: boolean
      push: boolean
      telegram: boolean
    }
    telegram: {
      chatId: string
      username: string
      enableNotifications: boolean
    }
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
  }
  businessInfo?: {
    name: string
    logo?: string
    description?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      twitter?: string
      tiktok?: string
      youtube?: string
      whatsapp?: string
    }
    operatingHours?: {
      monday?: string
      tuesday?: string
      wednesday?: string
      thursday?: string
      friday?: string
      saturday?: string
      sunday?: string
    }
    features?: string[]
    specialMessage?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface ShopOwner {
  telegram_id: number
  first_name: string
  last_name: string
  username: string
  created_at: string
  updated_at: Date
  last_shop_id: string
  shops: {
    [shopId: string]: {
      last_interacted: Date
    }
  }
}

export interface Category {
  id: string
  userId: string
  shopId: string
  name: string
  description?: string
  image?: string
  color: string
  icon: string
  order: number
  isActive: boolean
  productCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  userId: string
  shopId?: string
  name: string
  telegramChatId: string
  adminChatId?: string
  role: 'admin' | 'shop' | 'delivery'
  order: number
  icon: string
  isActive: boolean
  notificationTypes?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Shop {
  id: string
  ownerId: string
  name: string
  slug: string
  description: string
  logo?: string
  isActive: boolean
  businessInfo?: {
    name: string
    logo?: string
    description?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      twitter?: string
      tiktok?: string
      youtube?: string
      whatsapp?: string
    }
    operatingHours?: {
      monday?: string
      tuesday?: string
      wednesday?: string
      thursday?: string
      friday?: string
      saturday?: string
      sunday?: string
    }
    features?: string[]
    specialMessage?: string
  }
  settings?: {
    currency: string
    taxRate: number
    businessHours: {
      open: string
      close: string
      days: string[]
    }
    orderSettings: {
      autoConfirm: boolean
      requirePayment: boolean
      allowCancellation: boolean
    }
  }
  stats?: {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    totalCustomers: number
  }
  createdAt: Date
  updatedAt: Date
}

export type DealershipType = 'new' | 'used' | 'both'

export interface Dealership extends Shop {
  dealerLicenseNumber: string
  dealershipType: DealershipType
  brandsCarried: string[]
  serviceDepartment?: {
    hasServiceDepartment: boolean
    serviceBays?: number
    serviceHours?: {
      monday?: string
      tuesday?: string
      wednesday?: string
      thursday?: string
      friday?: string
      saturday?: string
      sunday?: string
    }
    certifiedBrands?: string[]
  }
  financingPartners: string[]
  acceptsTradeIns: boolean
  testDriveAvailable: boolean
  deliveryOptions: {
    pickup: boolean
    localDelivery: boolean
    shipping: boolean
    deliveryRadius?: number
    deliveryFee?: number
  }
}

export interface Product {
  id: string
  shopId: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  subcategory?: string
  images: string[]
  sku?: string
  isActive: boolean
  lowStockAlert: number
  tags?: string[]
  featured?: boolean
  costPrice?: number
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  createdAt: Date
  updatedAt: Date
}

export type TransmissionType = 'automatic' | 'manual' | 'cvt' | 'dual-clutch'
export type DrivetrainType = 'fwd' | 'rwd' | 'awd' | '4wd'
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'plug-in-hybrid' | 'electric' | 'flex-fuel'
export type BodyType = 'sedan' | 'suv' | 'truck' | 'coupe' | 'convertible' | 'wagon' | 'van' | 'hatchback'
export type VehicleCondition = 'new' | 'used' | 'certified-pre-owned'
export type TitleStatus = 'clean' | 'salvage' | 'rebuilt' | 'lemon' | 'flood-damage'

export interface ServiceRecord {
  id: string
  date: Date
  mileage: number
  serviceType: string
  description: string
  cost: number
  servicedBy: string
  invoiceUrl?: string
  nextServiceDue?: Date
  nextServiceMileage?: number
}

export interface AccidentHistory {
  id: string
  date: Date
  description: string
  damageAmount: number
  repaired: boolean
  reportUrl?: string
}

export interface WarrantyInfo {
  type: 'factory' | 'extended' | 'powertrain' | 'corrosion' | 'roadside'
  provider: string
  startDate: Date
  endDate: Date
  mileageLimit?: number
  coverageDetails: string
  transferable: boolean
}

export interface Vehicle extends Omit<Product, 'weight' | 'dimensions' | 'lowStockAlert'> {
  vin: string
  make: string
  model: string
  year: number
  trim?: string
  mileage: number
  mileageUnit: 'miles' | 'kilometers'
  engineSize?: number
  engineType?: string
  cylinders?: number
  transmission: TransmissionType
  drivetrain: DrivetrainType
  exteriorColor: string
  interiorColor: string
  fuelType: FuelType
  bodyType: BodyType
  condition: VehicleCondition
  serviceHistory: ServiceRecord[]
  accidentHistory: AccidentHistory[]
  previousOwners: number
  titleStatus: TitleStatus
  registrationExpiry?: Date
  lastInspectionDate?: Date
  warranty?: WarrantyInfo[]
  features: string[]
  mpgCity?: number
  mpgHighway?: number
  mpgCombined?: number
  seatingCapacity?: number
  doors?: number
  daysOnLot?: number
  viewCount?: number
  inquiryCount?: number
  listingUrl?: string
  carfaxUrl?: string
  autoCheckUrl?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
  productImage?: string
  productSku?: string
}

export interface Order {
  id: string
  shopId: string
  customerId: string
  customerName: string
  customerPhone?: string
  customerEmail?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'confirmation_required' | 'cancelled'
  deliveryMethod: 'pickup' | 'delivery'
  deliveryAddress?: string
  deliveryFee?: number
  estimatedDeliveryTime?: Date
  paymentPreference?: string
  paymentPhotoUrl?: string
  requiresPaymentConfirmation?: boolean
  customerNotes?: string
  source: 'web' | 'telegram'
  tableNumber?: string
  telegramId?: string
  telegramUsername?: string
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  shippedAt?: Date
  deliveredAt?: Date
}

export type CustomerTag = 'VIP' | 'Wholesale' | 'Regular' | 'New'

export interface Customer {
  id: string
  shopId: string
  name: string
  email?: string
  phone?: string
  telegramId?: string
  telegramUsername?: string
  source: 'web' | 'telegram'
  tags: CustomerTag[]
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: Date
  preferredDeliveryMethod?: 'pickup' | 'delivery'
  preferredPaymentMethod?: string
  deliveryAddresses?: string[]
  loyaltyPoints?: number
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum'
  createdAt: Date
  updatedAt: Date
}

export interface ShopCustomer {
  id: string
  customerId: string
  telegramId?: number
  shopId: string
  role: 'admin' | 'customer'
  createdAt: Date
  updatedAt: Date
}

export interface CRMContact {
  id: string
  shopId: string
  telegramId: number
  name: string
  username?: string
  phone?: string
  email?: string
  tags: string[]
  notes: string
  customFields: Record<string, any>
  lastContactedDate?: Date
  lastOrderDate?: Date
  activityStatus: 'active' | 'inactive'
  sourceLink?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  createdAt: Date
  updatedAt: Date
  lastNoteUpdate?: Date
}

export interface CRMTag {
  id: string
  shopId: string
  name: string
  color: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface CRMMessageTemplate {
  id: string
  shopId: string
  name: string
  category?: string
  content: string
  variables: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CRMAutoTagRule {
  id: string
  shopId: string
  pattern: string
  tags: string[]
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CRMStats {
  totalCustomers: number
  activeThisWeek: number
  inactive30Plus: number
  topTags: Array<{ tag: string; count: number }>
}

export type TestDriveStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'no-show'

export interface TestDrive {
  id: string
  dealershipId: string
  vehicleId: string
  vehicleDetails?: {
    make: string
    model: string
    year: number
    vin: string
  }
  customerId?: string
  customerInfo: {
    name: string
    email?: string
    phone: string
    telegramId?: number
    telegramUsername?: string
  }
  driversLicense?: {
    number: string
    state: string
    expirationDate: Date
    verified: boolean
    photoUrl?: string
  }
  preferredDateTime: Date
  alternativeDateTime?: Date
  scheduledDateTime?: Date
  duration: number
  status: TestDriveStatus
  notes?: string
  specialRequirements?: string
  salesRepId?: string
  salesRepName?: string
  checkInTime?: Date
  checkOutTime?: Date
  feedback?: string
  followUpScheduled?: boolean
  followUpDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type TradeInStatus = 'submitted' | 'evaluating' | 'inspected' | 'offer-made' | 'approved' | 'declined' | 'accepted' | 'completed'

export interface TradeInVehicle {
  vin?: string
  make: string
  model: string
  year: number
  trim?: string
  mileage: number
  mileageUnit: 'miles' | 'kilometers'
  exteriorColor?: string
  interiorColor?: string
  transmission?: TransmissionType
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  knownIssues?: string[]
  modifications?: string[]
  accidentHistory?: string
  serviceRecords?: boolean
  hasTitle: boolean
  lienHolder?: string
  outstandingLoan?: number
}

export interface TradeIn {
  id: string
  dealershipId: string
  customerId?: string
  customerInfo: {
    name: string
    email?: string
    phone: string
    telegramId?: number
    telegramUsername?: string
  }
  vehicle: TradeInVehicle
  photos: string[]
  askingPrice?: number
  estimatedValue?: number
  offerAmount?: number
  offerValidUntil?: Date
  status: TradeInStatus
  evaluationNotes?: string
  inspectionDate?: Date
  inspectionNotes?: string
  inspectorName?: string
  interestedInVehicleId?: string
  applyTowardsPurchase?: boolean
  createdAt: Date
  updatedAt: Date
}

export type FinancingStatus = 'submitted' | 'reviewing' | 'documents-requested' | 'pre-approved' | 'approved' | 'declined' | 'cancelled'

export interface FinancingApplication {
  id: string
  dealershipId: string
  vehicleId?: string
  vehicleDetails?: {
    make: string
    model: string
    year: number
    vin?: string
    price: number
  }
  customerId?: string
  applicantInfo: {
    firstName: string
    lastName: string
    email?: string
    phone: string
    telegramId?: number
    dateOfBirth: Date
    ssn?: string
    driversLicense?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  employmentInfo: {
    status: 'employed' | 'self-employed' | 'retired' | 'unemployed'
    employer?: string
    jobTitle?: string
    yearsEmployed?: number
    monthlyIncome: number
    additionalIncome?: number
  }
  coApplicant?: {
    firstName: string
    lastName: string
    email?: string
    phone: string
    dateOfBirth: Date
    ssn?: string
    relationship: string
    employmentInfo: {
      status: 'employed' | 'self-employed' | 'retired' | 'unemployed'
      employer?: string
      monthlyIncome: number
    }
  }
  financingDetails: {
    downPayment: number
    tradeInValue?: number
    tradeInId?: string
    loanAmount: number
    desiredTerm: number
    monthlyBudget?: number
    creditScoreRange?: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown'
  }
  status: FinancingStatus
  creditScore?: number
  approvedLender?: string
  approvedAmount?: number
  approvedRate?: number
  approvedTerm?: number
  monthlyPayment?: number
  documents: {
    name: string
    url: string
    uploadedAt: Date
  }[]
  notes?: string
  salesRepId?: string
  financeManagerId?: string
  createdAt: Date
  updatedAt: Date
}

export type ServiceAppointmentStatus = 'requested' | 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
export type ServiceType = 'oil-change' | 'tire-rotation' | 'brake-service' | 'engine-diagnostic' | 'inspection' | 'maintenance' | 'repair' | 'recall' | 'warranty' | 'custom'

export interface ServiceAppointment {
  id: string
  dealershipId: string
  vehicleVin?: string
  vehicleInfo?: {
    make: string
    model: string
    year: number
    vin: string
    mileage?: number
  }
  customerId?: string
  customerInfo: {
    name: string
    email?: string
    phone: string
    telegramId?: number
  }
  serviceType: ServiceType
  serviceDescription: string
  appointmentDateTime: Date
  estimatedDuration: number
  estimatedCost?: number
  actualCost?: number
  status: ServiceAppointmentStatus
  serviceAdvisorId?: string
  serviceAdvisorName?: string
  technicianId?: string
  technicianName?: string
  serviceBay?: string
  checkInTime?: Date
  startTime?: Date
  completionTime?: Date
  workPerformed?: string[]
  partsReplaced?: {
    partName: string
    partNumber?: string
    quantity: number
    cost: number
  }[]
  laborHours?: number
  photos?: string[]
  customerNotes?: string
  internalNotes?: string
  nextServiceRecommendation?: string
  nextServiceDue?: Date
  nextServiceMileage?: number
  createdAt: Date
  updatedAt: Date
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        BackButton: {
          isVisible: boolean
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
        }
        initDataUnsafe?: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
        }
      }
    }
  }
}