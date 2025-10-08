# Car Dealership Telegram Mini App

A fully functional car dealership management system built as a Telegram Mini App. This application provides comprehensive vehicle inventory management, customer lead tracking, test drive scheduling, trade-in evaluations, and financing applications.

## Features

### Vehicle Management
- Multi-step vehicle listing form with validation
- Comprehensive vehicle specifications (VIN, make, model, year, mileage, etc.)
- Accident and service history tracking
- Vehicle image galleries with carousel navigation
- Featured vehicle highlighting
- Real-time inventory tracking with days on lot indicators
- View count analytics

### Customer Engagement
- **Test Drive Scheduling**: Customers can schedule test drives directly through the app
- **Trade-In Evaluation**: Submit trade-in vehicles for evaluation with photos and condition details
- **Financing Applications**: Complete multi-section financing applications with employment verification
- **Social Sharing**: Share vehicle listings via native Web Share API or clipboard

### Admin Features
- Vehicle inventory dashboard with grid layout
- Quick toggle between inventory list and add vehicle form
- Firebase Firestore integration for real-time data synchronization
- Responsive design for mobile and desktop

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Telegram Integration**: @telegram-apps/sdk

## Project Structure

```
src/
├── components/
│   ├── VehicleFormWizard.tsx          # Multi-step vehicle form
│   ├── VehicleFormStep1BasicInfo.tsx   # Step 1: Basic vehicle info
│   ├── VehicleFormStep2Specifications.tsx # Step 2: Vehicle specs
│   ├── VehicleFormStep3ConditionHistory.tsx # Step 3: Condition & history
│   ├── VehicleList.tsx                 # Vehicle inventory grid
│   ├── VehicleCard.tsx                 # Individual vehicle card
│   ├── TestDriveModal.tsx              # Test drive scheduling modal
│   ├── TradeInModal.tsx                # Trade-in evaluation modal
│   ├── FinancingModal.tsx              # Financing application modal
│   ├── FormInput.tsx                   # Reusable form input
│   ├── FormSelect.tsx                  # Reusable form select
│   └── FormTextarea.tsx                # Reusable form textarea
├── lib/
│   └── firebase.ts                     # Firebase configuration
├── types/
│   └── index.ts                        # TypeScript interfaces
├── utils/
│   └── validation.ts                   # Form validation utilities
├── App.tsx                             # Main application component
├── main.tsx                            # React entry point
└── index.css                           # Tailwind CSS configuration
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Telegram Bot Configuration
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
VITE_TELEGRAM_BOT_USERNAME=your_bot_username

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Firebase Setup

### Firestore Collections

The application uses the following Firestore collections:

- `vehicles` - Vehicle inventory data
- `test_drives` - Test drive scheduling requests
- `trade_ins` - Trade-in evaluation submissions
- `financing_applications` - Financing applications
- `service_appointments` - Service department appointments (future)

### Firestore Security Rules

Configure your Firestore security rules to protect data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to vehicles
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Protected customer data
    match /test_drives/{driveId} {
      allow read, write: if request.auth != null;
    }

    match /trade_ins/{tradeInId} {
      allow read, write: if request.auth != null;
    }

    match /financing_applications/{appId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Usage

### Adding a Vehicle

1. Click the "Add Vehicle" button in the header
2. Complete the 3-step wizard:
   - **Step 1: Basic Info** - VIN, year, make, model, condition, body type
   - **Step 2: Specifications** - Mileage, engine, transmission, drivetrain, colors
   - **Step 3: Condition & History** - Owners, title status, accidents, service records
3. Click "Add Vehicle" to save to Firebase

### Managing Inventory

- View all vehicles in the inventory grid
- Click on vehicle cards to see details
- Toggle featured status with the star button
- Share vehicles via the share button
- Schedule test drives, request trade-ins, or apply for financing

### Test Drive Scheduling

1. Click "Test Drive" button on any vehicle card
2. Fill in customer contact information
3. Select preferred date and time
4. Add any additional notes
5. Submit to Firebase

### Trade-In Evaluation

1. Click "Trade-In" button on any vehicle card
2. Enter customer contact details
3. Provide vehicle information (year, make, model, mileage)
4. Select condition and add any known issues
5. Submit for evaluation

### Financing Application

1. Click "Finance" button on any vehicle card
2. Complete the multi-section form:
   - Personal information (name, DOB, contact details)
   - Address information
   - Financing details (credit score, down payment, loan term)
   - Employment information
3. Submit application to Firebase

## Type System

The application uses comprehensive TypeScript interfaces:

- `Vehicle` - Extends Product with automotive-specific fields
- `Dealership` - Extends Shop with dealership operations
- `TestDrive` - Test drive scheduling and tracking
- `TradeIn` - Trade-in evaluation workflow
- `FinancingApplication` - Complete financing application data
- `ServiceAppointment` - Service department appointments

## Validation

Form validation is handled through `src/utils/validation.ts`:

- VIN format validation (17 characters, excluding I, O, Q)
- Required field validation for all steps
- Range validation for numeric fields
- Error message generation

## Build & Deploy

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Enable Web App feature
3. Set the Web App URL to your deployed application
4. Configure bot commands:
   - `/start` - Open the dealership app
   - `/inventory` - View available vehicles
   - `/schedule` - Schedule a test drive
   - `/tradein` - Get trade-in evaluation
   - `/finance` - Apply for financing

## Completed Features (Phase 1 & 2)

### Phase 1: Data Model & Database Schema ✅
- Complete TypeScript type system
- All automotive-specific interfaces
- Firebase Firestore integration
- Type-safe enums and validations

### Phase 2: Vehicle Listing & Management (Partial) ✅
- Multi-step vehicle form wizard with validation
- Reusable form components (Input, Select, Textarea)
- Vehicle card with carousel and badges
- Inventory list with responsive grid
- Test drive scheduling modal
- Trade-in evaluation modal
- Financing application modal
- Firebase Firestore data persistence
- Featured vehicle toggle
- Social sharing functionality

## Upcoming Features

### Phase 2 (Remaining):
- Advanced filtering and sorting
- Bulk actions (mark multiple as featured, batch updates)
- Vehicle detail view with photo gallery
- Price range filters
- Analytics dashboard

### Phase 3: Customer Experience & Lead Management
- Calendar view for test drives
- Admin dashboard for trade-ins
- Application queue management
- Enhanced CRM with lead scoring
- Communication timeline

### Phase 4: Service Department & After-Sales
- Service booking system
- Service history tracking
- Maintenance reminders
- Service packages

### Phase 5: Advanced Search & Recommendations
- Natural language search
- Vehicle comparison tool
- Recommendation engine
- Wishlist functionality

### Phase 6: Analytics & Reporting
- Inventory analytics
- Sales performance metrics
- Customer analytics
- Financial reports

### Phase 7: Integration & Polish
- VIN decoder API integration
- Document management
- PWA features
- Performance optimization
- Security enhancements

## Development Roadmap

Total estimated implementation: ~2,525,000 tokens across 7 phases

**Current Status**: Phase 2 (40% complete)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-08
**Status**: Active Development
