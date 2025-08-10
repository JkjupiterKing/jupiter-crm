-- Mock data for Jupiter CRM
-- This file contains sample data for testing and development

-- Clear existing data
DELETE FROM InventoryTransaction;
DELETE FROM SaleItem;
DELETE FROM Sale;
DELETE FROM ServiceJob;
DELETE FROM ServiceItem;
DELETE FROM ServiceContract;
DELETE FROM Contract;
DELETE FROM CustomerProduct;
DELETE FROM Product;
DELETE FROM SparePart;
DELETE FROM Customer;
DELETE FROM Engineer;
DELETE FROM Notification;

-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name IN (
  'Customer', 'Product', 'SparePart', 'Sale', 'SaleItem', 'ServiceJob', 
  'ServiceItem', 'ServiceContract', 'Contract', 'CustomerProduct', 'Engineer', 
  'InventoryTransaction', 'Notification'
);

-- Insert Customers
INSERT INTO Customer (id, fullName, email, mobile, altMobile, companyName, address, street, city, state, pincode, isVIP, isActive, notes, createdAt, updatedAt) VALUES
(1, 'John Smith', 'john.smith@email.com', '+91-98765-43210', '+91-98765-43211', 'Smith Enterprises', '123 Main Street', 'Main Street', 'Mumbai', 'Maharashtra', '400001', 1, 1, 'VIP customer, prefers morning appointments', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'Sarah Johnson', 'sarah.j@techcorp.com', '+91-98765-43212', '+91-98765-43213', 'TechCorp Solutions', '456 Business Park', 'Business Park', 'Delhi', 'Delhi', '110001', 0, 1, 'Technical consultant, very particular about quality', '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
(3, 'Michael Brown', 'michael.b@manufacturing.com', '+91-98765-43214', '+91-98765-43215', 'Brown Manufacturing', '789 Industrial Area', 'Industrial Area', 'Bangalore', 'Karnataka', '560001', 1, 1, 'Large manufacturing client, bulk orders', '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(4, 'Emily Davis', 'emily.d@retail.com', '+91-98765-43216', '+91-98765-43217', 'Davis Retail', '321 Shopping Center', 'Shopping Center', 'Chennai', 'Tamil Nadu', '600001', 0, 1, 'Retail chain, regular maintenance contracts', '2024-01-18 13:00:00', '2024-01-18 13:00:00'),
(5, 'David Wilson', 'david.w@hospital.com', '+91-98765-43218', '+91-98765-43219', 'Wilson Hospital', '654 Medical District', 'Medical District', 'Hyderabad', 'Telangana', '500001', 1, 1, 'Hospital equipment maintenance, critical priority', '2024-01-19 14:00:00', '2024-01-19 14:00:00');

-- Insert Products
INSERT INTO Product (id, name, sku, category, currentStock, reorderLevel, unitPrice, costPrice, description, manufacturer, model, warrantyPeriod, isActive, createdAt, updatedAt) VALUES
(1, 'Industrial Air Compressor', 'AC-001', 'Air Compressors', 15, 5, 25000, 18000, 'High-pressure industrial air compressor for manufacturing use', 'Atlas Copco', 'AC-2000', 24, 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'HVAC System', 'HVAC-001', 'HVAC Systems', 8, 3, 45000, 32000, 'Commercial HVAC system with smart controls', 'Carrier', 'HVAC-5000', 36, 1, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
(3, 'Water Pump', 'WP-001', 'Water Pumps', 25, 10, 8000, 5500, 'Submersible water pump for industrial applications', 'Kirloskar', 'WP-1000', 18, 1, '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(4, 'Generator Set', 'GEN-001', 'Generators', 5, 2, 120000, 85000, 'Diesel generator set for backup power', 'Cummins', 'GEN-500', 48, 1, '2024-01-18 13:00:00', '2024-01-18 13:00:00'),
(5, 'Conveyor Belt', 'CB-001', 'Conveyors', 12, 4, 15000, 11000, 'Heavy-duty conveyor belt for material handling', 'Continental', 'CB-200', 12, 1, '2024-01-19 14:00:00', '2024-01-19 14:00:00');

-- Insert Spare Parts
INSERT INTO SparePart (id, name, sku, description, price, isActive, stockQuantity, productId, createdAt, updatedAt) VALUES
(1, 'Air Filter', 'AF-001', 'High-efficiency air filter for compressors', 500, 1, 50, 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'Compressor Oil', 'CO-001', 'Synthetic compressor oil 5W-30', 800, 1, 100, 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(3, 'HVAC Filter', 'HF-001', 'HEPA filter for HVAC systems', 1200, 1, 30, 2, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
(4, 'Pump Impeller', 'PI-001', 'Stainless steel impeller for water pumps', 1500, 1, 25, 3, '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(5, 'Generator Battery', 'GB-001', '12V deep cycle battery for generators', 3000, 1, 15, 4, '2024-01-18 13:00:00', '2024-01-18 13:00:00');

-- Insert Engineers
INSERT INTO Engineer (id, name, email, mobile, specialization, isActive, createdAt, updatedAt) VALUES
(1, 'Rajesh Kumar', 'rajesh.k@jupiter.com', '+91-98765-43220', 'HVAC Systems', 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'Priya Sharma', 'priya.s@jupiter.com', '+91-98765-43221', 'Air Compressors', 1, '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
(3, 'Amit Patel', 'amit.p@jupiter.com', '+91-98765-43222', 'Water Pumps', 1, '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(4, 'Neha Singh', 'neha.s@jupiter.com', '+91-98765-43223', 'Generators', 1, '2024-01-18 13:00:00', '2024-01-18 13:00:00'),
(5, 'Vikram Mehta', 'vikram.m@jupiter.com', '+91-98765-43224', 'Conveyors', 1, '2024-01-19 14:00:00', '2024-01-19 14:00:00');

-- Insert Sales
INSERT INTO Sale (id, customerId, invoiceNumber, saleDate, totalAmount, paymentMode, status, notes, createdAt, updatedAt) VALUES
(1, 1, 'INV-2024-001', '2024-01-20 09:00:00', 25000, 'Bank Transfer', 'PAID', 'Industrial air compressor for manufacturing plant', '2024-01-20 09:00:00', '2024-01-20 09:00:00'),
(2, 2, 'INV-2024-002', '2024-01-21 10:00:00', 45000, 'Credit Card', 'PAID', 'HVAC system for office building', '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(3, 3, 'INV-2024-003', '2024-01-22 11:00:00', 8000, 'Cash', 'PAID', 'Water pump for irrigation system', '2024-01-22 11:00:00', '2024-01-22 11:00:00'),
(4, 4, 'INV-2024-004', '2024-01-23 12:00:00', 15000, 'Bank Transfer', 'PENDING', 'Conveyor belt for warehouse', '2024-01-23 12:00:00', '2024-01-23 12:00:00'),
(5, 5, 'INV-2024-005', '2024-01-24 13:00:00', 120000, 'Bank Transfer', 'PAID', 'Generator set for hospital backup power', '2024-01-24 13:00:00', '2024-01-24 13:00:00');

-- Insert Sale Items
INSERT INTO SaleItem (id, saleId, productId, quantity, unitPrice, lineTotal, itemType, createdAt, updatedAt) VALUES
(1, 1, 1, 1, 25000, 25000, 'PRODUCT', '2024-01-20 09:00:00', '2024-01-20 09:00:00'),
(2, 2, 2, 1, 45000, 45000, 'PRODUCT', '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(3, 3, 3, 1, 8000, 8000, 'PRODUCT', '2024-01-22 11:00:00', '2024-01-22 11:00:00'),
(4, 4, 5, 1, 15000, 15000, 'PRODUCT', '2024-01-23 12:00:00', '2024-01-23 12:00:00'),
(5, 5, 4, 1, 120000, 120000, 'PRODUCT', '2024-01-24 13:00:00', '2024-01-24 13:00:00');

-- Insert Service Jobs
INSERT INTO ServiceJob (id, customerId, engineerId, scheduledDate, serviceDueDate, status, jobType, warrantyStatus, billedAmount, notes, createdAt, updatedAt) VALUES
(1, 1, 2, '2024-02-01 09:00:00', '2024-02-01 09:00:00', 'PLANNED', 'INSTALLATION', 'IN_WARRANTY', NULL, 'Installation of industrial air compressor', '2024-01-25 10:00:00', '2024-01-25 10:00:00'),
(2, 2, 1, '2024-02-02 10:00:00', '2024-02-02 10:00:00', 'PLANNED', 'INSTALLATION', 'IN_WARRANTY', NULL, 'HVAC system installation and commissioning', '2024-01-26 11:00:00', '2024-01-26 11:00:00'),
(3, 3, 3, '2024-02-03 11:00:00', '2024-02-03 11:00:00', 'COMPLETED', 'SERVICE', 'IN_WARRANTY', 2000, 'Annual maintenance of water pump system', '2024-01-27 12:00:00', '2024-01-27 12:00:00'),
(4, 4, 5, '2024-02-04 12:00:00', '2024-02-04 12:00:00', 'PLANNED', 'REPAIR', 'OUT_OF_WARRANTY', NULL, 'Conveyor belt repair and maintenance', '2024-01-28 13:00:00', '2024-01-28 13:00:00'),
(5, 5, 4, '2024-02-05 13:00:00', '2024-02-05 13:00:00', 'PLANNED', 'SERVICE', 'IN_CONTRACT', NULL, 'Monthly generator maintenance service', '2024-01-29 14:00:00', '2024-01-29 14:00:00'),
-- Mock data for dashboard alerts (relative to 2025-08-10)
(6, 1, NULL, '2025-08-01 10:00:00', '2025-08-01 10:00:00', 'PLANNED', 'SERVICE', 'IN_WARRANTY', NULL, 'Mock: Overdue service', '2025-08-01 10:00:00', '2025-08-01 10:00:00'),
(7, 2, 1, '2025-08-20 14:00:00', '2025-08-20 14:00:00', 'PLANNED', 'REPAIR', 'OUT_OF_WARRANTY', NULL, 'Mock: Service due soon', '2025-08-10 11:00:00', '2025-08-10 11:00:00'),
(8, 3, 3, '2025-08-05 11:00:00', '2025-08-05 11:00:00', 'COMPLETED', 'SERVICE', 'IN_CONTRACT', 1500, 'Mock: Service completed this month', '2025-08-05 11:00:00', '2025-08-05 11:00:00'),
(9, 1, NULL, NULL, '2025-09-01 10:00:00', 'UNSCHEDULED', 'SERVICE', 'IN_WARRANTY', NULL, 'Mock: Unscheduled service', '2025-08-10 12:00:00', '2025-08-10 12:00:00');

-- Insert Customer Products
INSERT INTO CustomerProduct (id, customerId, productId, serialNumber, purchaseDate, warrantyExpiry, lastServiceDate, createdAt, updatedAt) VALUES
(1, 1, 1, 'SN-AC-001-2024', '2024-01-20 09:00:00', '2026-01-20 09:00:00', '2024-01-25 10:00:00', '2024-01-20 09:00:00', '2024-01-20 09:00:00'),
(2, 2, 2, 'SN-HVAC-001-2024', '2024-01-21 10:00:00', '2027-01-21 10:00:00', '2024-01-26 11:00:00', '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(3, 3, 3, 'SN-WP-001-2024', '2024-01-22 11:00:00', '2025-07-22 11:00:00', '2024-01-27 12:00:00', '2024-01-22 11:00:00', '2024-01-22 11:00:00'),
(4, 4, 5, 'SN-CB-001-2024', '2024-01-23 12:00:00', '2025-01-23 12:00:00', '2024-01-28 13:00:00', '2024-01-23 12:00:00', '2024-01-23 12:00:00'),
(5, 5, 4, 'SN-GEN-001-2024', '2024-01-24 13:00:00', '2028-01-24 13:00:00', '2024-01-29 14:00:00', '2024-01-24 13:00:00', '2024-01-24 13:00:00');

-- Insert Service Contracts
INSERT INTO ServiceContract (id, customerProductId, contractType, startDate, endDate, frequencyMonths, nextDueDate, isActive, createdAt, updatedAt) VALUES
(1, 1, 'AMC', '2024-01-20 00:00:00', '2024-12-31 23:59:59', 12, '2024-02-20 00:00:00', 1, '2024-01-20 09:00:00', '2024-01-20 09:00:00'),
(2, 2, 'WARRANTY', '2024-01-21 00:00:00', '2027-01-20 23:59:59', 36, '2024-02-21 00:00:00', 1, '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(3, 3, 'AMC', '2024-01-22 00:00:00', '2024-12-31 23:59:59', 12, '2024-02-22 00:00:00', 1, '2024-01-22 11:00:00', '2024-01-22 11:00:00'),
(4, 4, 'AMC', '2024-01-23 00:00:00', '2024-12-31 23:59:59', 12, '2024-02-23 00:00:00', 1, '2024-01-23 12:00:00', '2024-01-23 12:00:00'),
(5, 5, 'AMC', '2024-01-24 00:00:00', '2024-12-31 23:59:59', 12, '2024-02-24 00:00:00', 1, '2024-01-24 13:00:00', '2024-01-24 13:00:00');

-- Insert Contracts
INSERT INTO Contract (id, customerId, contractType, startDate, endDate, terms, isActive, createdAt, updatedAt) VALUES
(1, 1, 'AMC', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'Annual maintenance contract for air compressor system', 1, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 2, 'WARRANTY', '2024-01-21 00:00:00', '2025-01-20 23:59:59', '3-year warranty on HVAC system', 1, '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(3, 3, 'AMC', '2024-01-01 00:00:00', '2024-01-31 23:59:59', 'Annual maintenance contract for water pump system', 1, '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(4, 4, 'AMC', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'Annual maintenance contract for conveyor system', 1, '2024-01-18 13:00:00', '2024-01-18 13:00:00'),
(5, 5, 'AMC', '2024-01-01 00:00:00', '2024-12-31 23:59:59', 'Annual maintenance contract for generator system', 1, '2024-01-19 14:00:00', '2024-01-19 14:00:00');

-- Insert Inventory Transactions
INSERT INTO InventoryTransaction (id, itemType, productId, transactionKind, quantity, unitPrice, totalAmount, notes, transactionDate, createdAt, updatedAt) VALUES
(1, 'PRODUCT', 1, 'PURCHASE', 20, 18000, 360000, 'Initial stock purchase', '2024-01-15 10:00:00', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'PRODUCT', 1, 'SALE', -1, 25000, -25000, 'Sale to John Smith', '2024-01-20 09:00:00', '2024-01-20 09:00:00', '2024-01-20 09:00:00'),
(3, 'PRODUCT', 2, 'PURCHASE', 10, 32000, 320000, 'Initial stock purchase', '2024-01-16 11:00:00', '2024-01-16 11:00:00', '2024-01-16 11:00:00'),
(4, 'PRODUCT', 2, 'SALE', -1, 45000, -45000, 'Sale to Sarah Johnson', '2024-01-21 10:00:00', '2024-01-21 10:00:00', '2024-01-21 10:00:00'),
(5, 'PRODUCT', 3, 'PURCHASE', 30, 5500, 165000, 'Initial stock purchase', '2024-01-17 12:00:00', '2024-01-17 12:00:00', '2024-01-17 12:00:00'),
(6, 'PRODUCT', 3, 'SALE', -1, 8000, -8000, 'Sale to Michael Brown', '2024-01-22 11:00:00', '2024-01-22 11:00:00', '2024-01-22 11:00:00'),
(7, 'PRODUCT', 4, 'PURCHASE', 8, 85000, 680000, 'Initial stock purchase', '2024-01-18 13:00:00', '2024-01-18 13:00:00', '2024-01-18 13:00:00'),
(8, 'PRODUCT', 4, 'SALE', -1, 120000, -120000, 'Sale to David Wilson', '2024-01-24 13:00:00', '2024-01-24 13:00:00', '2024-01-24 13:00:00'),
(9, 'PRODUCT', 5, 'PURCHASE', 15, 11000, 165000, 'Initial stock purchase', '2024-01-19 14:00:00', '2024-01-19 14:00:00', '2024-01-19 14:00:00'),
(10, 'PRODUCT', 5, 'SALE', -1, 15000, -15000, 'Sale to Emily Davis', '2024-01-23 12:00:00', '2024-01-23 12:00:00', '2024-01-23 12:00:00');

-- Insert Service Items
INSERT INTO ServiceItem (id, serviceJobId, productId, quantity, unitPrice, coveredByWarranty) VALUES
(1, 3, 3, 1, 2000, 1),
(2, 4, 5, 1, 1500, 0),
(3, 5, 4, 1, 3000, 1);

-- Insert Notifications
INSERT INTO Notification (id, customerId, message, channel, status, scheduledAt, sentAt, createdAt, updatedAt) VALUES
(1, 1, 'Your service appointment is scheduled for tomorrow at 9:00 AM', 'SMS', 'SENT', '2024-01-31 18:00:00', '2024-01-31 18:00:00', '2024-01-30 10:00:00', '2024-01-31 18:00:00'),
(2, 2, 'Your service appointment is scheduled for tomorrow at 10:00 AM', 'SMS', 'SENT', '2024-02-01 18:00:00', '2024-02-01 18:00:00', '2024-01-31 11:00:00', '2024-02-01 18:00:00'),
(3, 3, 'Your service appointment is scheduled for tomorrow at 11:00 AM', 'SMS', 'SENT', '2024-02-02 18:00:00', '2024-02-02 18:00:00', '2024-02-01 12:00:00', '2024-02-02 18:00:00'),
(4, 4, 'Your service appointment is scheduled for tomorrow at 12:00 PM', 'SMS', 'QUEUED', '2024-02-03 18:00:00', NULL, '2024-02-02 13:00:00', '2024-02-02 13:00:00'),
(5, 5, 'Your service appointment is scheduled for tomorrow at 1:00 PM', 'SMS', 'QUEUED', '2024-02-04 18:00:00', NULL, '2024-02-03 14:00:00', '2024-02-03 14:00:00');
