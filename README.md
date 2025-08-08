# Pratham Enterprises CRM

A comprehensive Customer Relationship Management system designed specifically for Pratham Enterprises. This application helps manage customers, products, sales, services, and inventory in one centralized platform.

## Features

### 1. Customer Management
- Add, edit, and maintain customer details
- Search customers by name, mobile, door number, area, layout, PIN code, district
- Filter customers by warranty status (In warranty, In contract, Out of warranty)
- Complete customer profile with contact and address information

### 2. Product & Inventory Management
- Add and maintain product details with SKU, pricing, and warranty information
- Manage spare parts inventory
- Track stock quantities with low stock alerts
- Product categorization and status management

### 3. Sales Management
- Create sales invoices with multiple items
- Track payment modes and status
- Generate sales reports
- Invoice management and history

### 4. Service Management
- Schedule service appointments
- Track service status (Planned, Completed, Cancelled, No Show)
- Manage warranty and contract services
- Engineer assignment and visit tracking
- Service due notifications

### 5. Dashboard & Analytics
- Real-time statistics and overview
- Service due alerts (next 30 days)
- Overdue service notifications
- Low stock alerts
- Recent activities tracking

### 6. Admin Features
- Service due dashboard
- Engineer visit planning
- SMS/WhatsApp notification system (framework ready)
- Comprehensive reporting system

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (with Prisma ORM)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pratham-enterprises
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Customers**: Customer information and contact details
- **Products**: Product catalog with pricing and warranty
- **SpareParts**: Spare parts inventory
- **Sales**: Sales transactions and invoices
- **ServiceJobs**: Service appointments and work orders
- **Engineers**: Service engineer information
- **InventoryTransactions**: Stock movement tracking
- **Notifications**: SMS/WhatsApp notification logs

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── customers/       # Customer management APIs
│   │   ├── products/        # Product management APIs
│   │   ├── sales/          # Sales management APIs
│   │   ├── services/       # Service management APIs
│   │   └── dashboard/      # Dashboard statistics API
│   ├── customers/          # Customer pages
│   ├── products/           # Product pages
│   ├── sales/             # Sales pages
│   ├── services/          # Service pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   └── globals.css        # Global styles
├── lib/
│   └── db.ts              # Database connection
└── generated/
    └── prisma/            # Generated Prisma client
```

## Usage

### Dashboard
The main dashboard provides an overview of:
- Total customers, products, sales, and pending services
- Quick action buttons for common tasks
- Alerts for overdue services and low stock
- Recent activities

### Customer Management
1. Navigate to `/customers`
2. Use search and filters to find customers
3. Click "Add Customer" to register new customers
4. View, edit, or delete customer records

### Product Management
1. Navigate to `/products`
2. View all products with stock levels
3. Add new products or spare parts
4. Manage inventory levels

### Sales Management
1. Navigate to `/sales`
2. Create new sales invoices
3. Track payment status
4. Generate sales reports

### Service Management
1. Navigate to `/services`
2. Schedule new service appointments
3. Track service status
4. Manage engineer assignments

## Deployment

### Local Development
The application is designed to run locally on your laptop. Simply run:
```bash
npm run dev
```

### Cloud Deployment
For future cloud deployment, the application can be easily modified to:
- Use PostgreSQL or MySQL instead of SQLite
- Add authentication and authorization
- Integrate with cloud services (AWS, Vercel, etc.)
- Add real SMS/WhatsApp integration

## Customization

### Adding New Features
1. Create new API routes in `src/app/api/`
2. Add corresponding pages in `src/app/`
3. Update the database schema if needed
4. Add navigation links in the dashboard

### Styling
The application uses Tailwind CSS for styling. Custom styles can be added in:
- `src/app/globals.css` for global styles
- Component-specific classes for individual components

### Database Changes
To modify the database schema:
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` to apply changes
3. Update API routes and components as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a basic CRM system designed for local use. For production deployment, additional security measures, authentication, and cloud-specific configurations should be implemented.
