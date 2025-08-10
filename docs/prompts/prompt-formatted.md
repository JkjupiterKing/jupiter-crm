# Cursor AI Enhancement Prompt

You are enhancing an **existing** React + Next.js + SQLite + Prisma ORM application.  
The application code already exists in the workspace — update and refactor it based on the following requirements.

---

## 1. Fix Existing Issues
- Review and update any **critical Prisma schema/ORM mismatches** between the schema, migrations, and the actual database.
- Fix any **functional mismatches** between the UI components and API endpoints.

---

## 2. Add Mock Data Mode (`--mock`)

When the application starts, it should support **two modes**:

### Normal Mode
- Default mode (no flags) should use the main database:  
  `file:./prisma/database.db`

### Mock Mode (`--mock`)
When launched with `--mock`, the application should:
1. Use `file:./prisma/mock.db` as the database.
2. Load mock data from a **single SQL file** (e.g., `prisma/mock-data.sql`) into the mock database.
3. Include **diverse mock data** so that all functionalities can be validated in mock mode:
   - Products
   - Customers
   - Inventory
   - Sales
   - Services
   - Warranties and Contracts
4. Ensure APIs in mock mode read/write **only** from the mock DB.
5. Automatically load the mock SQL file into `mock.db` **when the application starts in mock mode**.

---

## 3. Application Context

This is an **admin-only** web application with the following features:

### Products
- Add/Remove/Maintain Product Details
- Add/Remove/Maintain Spare Parts Details
- Inventory count tracking

### Customers
- Add/Remove/Maintain Customer Details
- Search by:
  - Name
  - Door number
  - Mobile number
  - Area/Layout
  - PIN Code
  - District
  - Product
  - Warranty Status (Out of Warranty / In Contract / In Warranty)

### Sales/Service
- Products sold & corresponding bills
- Service bills and details
- Spare part replacements
- Warranty/Contract status tracking

### Admin Dashboards
#### Service Due Dashboard
- Services due in next 30 days
- Service overdue list
- Ability to click and send service notifications to customers (SMS/WhatsApp — backend integration will be done later)

#### Service Visits Dashboard
- Visits planned for today
- Visits planned for next 7 days

### Reports
- Inventory Report
- Sales Report
- Service Report
- Customer Report
- Scheduled Service Report

---

## 4. Implementation Notes
- Maintain clean separation between **normal mode** and **mock mode** databases to prevent accidental data mixing.
- Ensure mock data covers all report and dashboard features.
- Keep the mock DB generation process **fast** and **repeatable** for development and testing.
