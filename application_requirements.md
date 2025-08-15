# Application Requirements Document

This document outlines the requirements for a comprehensive web-based administration application. The application is designed to be built using a modern web stack and should be suitable for generation by AI development tools.

## 1. High-Level Objective

The primary goal is to create a robust, admin-only web application for managing products, customers, sales, and services. The application must provide a clear and efficient user interface for all management tasks, as well as insightful dashboards and reports. A key feature is the ability to run in two modes: a "normal" mode connected to a live database, and a "mock" mode for development and testing, which uses a separate, pre-populated database.

## 2. Technology Stack

The application should be built using the following technologies:

- **Frontend:** React / Next.js
- **Backend:** Node.js (as provided by Next.js)
- **Database:** SQLite
- **ORM:** Prisma

## 3. Non-Functional Requirements

### 3.1. Data Modes

The application must support two operational modes, selectable at startup:

- **Normal Mode:**
    - Connects to the main database at `file:./prisma/database.db`.
    - This is the default mode for production use.

- **Mock Mode:**
    - Activated by running the `npm run dev:mock` script.
    - Connects to a separate mock database at `file:./prisma/mock.db`.
    - On startup, the mock database should be automatically populated with data from a single SQL file (`prisma/mock-data.sql`).
    - The mock data must be comprehensive enough to test all application features, including dashboards and reports.

### 3.2. Code Quality

- The codebase should be clean, well-structured, and maintainable.
- UI, API, and database schema should be perfectly aligned to avoid data mismatches.
- Unused files, code, and dependencies should be removed.

## 4. Functional Requirements

### 4.1. Product Management

- **Add/Edit/Delete Products:**
    - Manage product details, including name, category, SKU, description, price, cost, manufacturer, model, and warranty period.
- **Inventory Tracking:**
    - Track current stock levels and reorder levels for each product.
- **Spare Parts Management:**
    - Add, edit, and delete spare parts associated with products.
    - Track stock quantities for spare parts.

### 4.2. Customer Management

- **Add/Edit/Delete Customers:**
    - Manage customer details, including name, contact information (mobile, email), address, and company name.
- **Customer Search and Filtering:**
    - Search for customers by name, phone number, address details (area, PIN code, district), and the products they own.
    - Filter customers by warranty status (In Warranty, In Contract, Out of Warranty).

### 4.3. Sales Management

- **Create Sales Orders:**
    - Record sales of products and spare parts to customers.
    - Generate bills/invoices for each sale.
- **Track Sales:**
    - View a list of all sales, with details of products sold and total amounts.
    - Track payment status (Paid, Pending, Cancelled).

### 4.4. Service Management

- **Schedule and Manage Service Jobs:**
    - Schedule service jobs for customers, including installations, repairs, and regular maintenance.
    - Assign engineers to service jobs.
- **Track Service History:**
    - Maintain a complete service history for each customer and product.
- **Manage Service Contracts:**
    - Create and manage Annual Maintenance Contracts (AMCs) for customers.
- **Track Warranty Status:**
    - Automatically track the warranty status of customer products.

### 4.5. Dashboards

- **Service Due Dashboard:**
    - Display a list of services due in the next 30 days.
    - Show a list of overdue services.
    - Provide a feature to send service notifications (future integration).
- **Service Visits Dashboard:**
    - Display a list of service visits planned for the current day.
    - Show service visits planned for the next 7 days.

### 4.6. Reporting

The application must provide the following reports:

- **Inventory Report:**
    - A summary of current stock levels for all products and spare parts.
- **Sales Report:**
    - A detailed report of all sales within a specified period.
- **Service Report:**
    - A report on all service jobs performed, including details of parts used.
- **Customer Report:**
    - A comprehensive list of all customers and their purchased products.
- **Scheduled Service Report:**
    - A report of all upcoming scheduled services.

## 5. Data Model (Schema)

The following Prisma schema defines the data structure for the application.

```prisma
// Enums for various status and type fields

enum InventoryItemType { PRODUCT SPARE_PART }
enum InventoryTransactionKind { ADJUSTMENT PURCHASE SALE SERVICE_USE RETURN }
enum SaleItemType { PRODUCT SPARE_PART }
enum ServiceStatus { PLANNED COMPLETED CANCELLED NO_SHOW UNSCHEDULED }
enum JobType { INSTALLATION REPAIR SERVICE }
enum WarrantyStatus { IN_WARRANTY IN_CONTRACT OUT_OF_WARRANTY }
enum NotificationChannel { SMS WHATSAPP }
enum NotificationStatus { QUEUED SENT FAILED }
enum ContractType { WARRANTY AMC }
enum SaleStatus { PAID PENDING CANCELLED }
enum ServiceFrequency { NONE QUARTERLY HALF_YEARLY YEARLY }

// Models (Tables)

model Product {
  id               Int                  @id @default(autoincrement())
  name             String
  category         String?
  sku              String               @unique
  description      String?
  currentStock     Int                  @default(0)
  reorderLevel     Int                  @default(5)
  unitPrice        Int?
  costPrice        Int?
  manufacturer     String?
  model            String?
  warrantyPeriod   Int                  @default(12)
  service_frequency ServiceFrequency    @default(NONE)
  isActive         Boolean              @default(true)
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  spareParts       SparePart[]
  customerProducts CustomerProduct[]
  saleItems        SaleItem[]
  serviceItems     ServiceItem[]
  inventoryTxns    InventoryTransaction[]
}

model SparePart {
  id            Int                   @id @default(autoincrement())
  name          String
  sku           String                @unique
  description   String?
  price         Int?
  isActive      Boolean               @default(true)
  stockQuantity Int                   @default(0)
  createdAt     DateTime              @default(now())
  updatedAt     DateTime              @updatedAt
  product       Product?              @relation(fields: [productId], references: [id])
  productId     Int?
  saleItems     SaleItem[]
  serviceItems  ServiceItem[]
  inventoryTxns InventoryTransaction[]
}

model Customer {
  id            Int            @id @default(autoincrement())
  fullName      String
  email         String?
  mobile        String
  altMobile     String?
  companyName   String?
  address       String?
  street        String?
  city          String?
  state         String?
  pincode       String?
  isVIP         Boolean        @default(false)
  isActive      Boolean        @default(true)
  notes         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  products      CustomerProduct[]
  sales         Sale[]
  serviceJobs   ServiceJob[]
  notifications Notification[]
  contracts     Contract[]
}

model Engineer {
  id             Int          @id @default(autoincrement())
  name           String
  email          String?
  phone          String?
  mobile         String?
  specialization String?
  isActive       Boolean      @default(true)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  serviceJobs    ServiceJob[]
}

model CustomerProduct {
  id                Int             @id @default(autoincrement())
  customer          Customer        @relation(fields: [customerId], references: [id])
  customerId        Int
  product           Product         @relation(fields: [productId], references: [id])
  productId         Int
  serialNumber      String?
  purchaseDate      DateTime
  warrantyExpiry    DateTime?
  lastServiceDate   DateTime?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  contracts         ServiceContract[]
  serviceJobs       ServiceJob[]
}

model Sale {
  id            Int       @id @default(autoincrement())
  customer      Customer  @relation(fields: [customerId], references: [id])
  customerId    Int
  invoiceNumber String    @unique
  saleDate      DateTime  @default(now())
  totalAmount   Int
  paymentMode   String?
  status        SaleStatus @default(PAID)
  notes         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  items         SaleItem[]
  serviceJobs   ServiceJob[]
}

model SaleItem {
  id           Int           @id @default(autoincrement())
  sale         Sale          @relation(fields: [saleId], references: [id])
  saleId       Int
  itemType     SaleItemType
  product      Product?      @relation(fields: [productId], references: [id])
  productId    Int?
  sparePart    SparePart?    @relation(fields: [sparePartId], references: [id])
  sparePartId  Int?
  quantity     Int
  unitPrice    Int
  lineTotal    Int
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

model ServiceJob {
  id                 Int               @id @default(autoincrement())
  customer           Customer          @relation(fields: [customerId], references: [id])
  customerId         Int
  customerProduct    CustomerProduct?  @relation(fields: [customerProductId], references: [id])
  customerProductId  Int?
  saleId             Int?
  sale               Sale?             @relation(fields: [saleId], references: [id])
  scheduledDate      DateTime?
  serviceDueDate     DateTime
  status             ServiceStatus     @default(PLANNED)
  jobType            JobType           @default(SERVICE)
  warrantyStatus     WarrantyStatus
  engineer           Engineer?         @relation(fields: [engineerId], references: [id])
  engineerId         Int?
  problemDescription String?
  resolutionNotes    String?
  billedAmount       Int?
  notes              String?
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
  items              ServiceItem[]
  notifications      Notification[]
}

model ServiceItem {
  id                 Int         @id @default(autoincrement())
  serviceJob         ServiceJob  @relation(fields: [serviceJobId], references: [id])
  serviceJobId       Int
  product            Product?    @relation(fields: [productId], references: [id])
  productId          Int?
  sparePart          SparePart?  @relation(fields: [sparePartId], references: [id])
  sparePartId        Int?
  quantity           Int
  unitPrice          Int
  coveredByWarranty  Boolean     @default(false)
}

model ServiceContract {
  id                Int             @id @default(autoincrement())
  customerProduct   CustomerProduct @relation(fields: [customerProductId], references: [id])
  customerProductId Int
  contractType      ContractType
  startDate         DateTime
  endDate           DateTime
  frequencyMonths   Int?
  nextDueDate       DateTime?
  isActive          Boolean         @default(true)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

model Contract {
  id                Int             @id @default(autoincrement())
  customer          Customer        @relation(fields: [customerId], references: [id])
  customerId        Int
  contractType      ContractType
  startDate         DateTime
  endDate           DateTime
  terms             String?
  isActive          Boolean         @default(true)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

model InventoryTransaction {
  id                Int                      @id @default(autoincrement())
  itemType          InventoryItemType
  product           Product?                 @relation(fields: [productId], references: [id])
  productId         Int?
  sparePart         SparePart?               @relation(fields: [sparePartId], references: [id])
  sparePartId       Int?
  quantity          Int
  transactionKind   InventoryTransactionKind
  notes             String?
  unitPrice         Int?
  totalAmount       Int?
  transactionDate   DateTime                 @default(now())
  createdAt         DateTime                 @default(now())
  updatedAt         DateTime                 @default(now())
}

model Notification {
  id           Int                  @id @default(autoincrement())
  customer     Customer             @relation(fields: [customerId], references: [id])
  customerId   Int
  serviceJob   ServiceJob?          @relation(fields: [serviceJobId], references: [id])
  serviceJobId Int?
  channel      NotificationChannel
  message      String
  status       NotificationStatus   @default(QUEUED)
  sentAt       DateTime?
  scheduledAt  DateTime?
  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @default(now())
}
```
