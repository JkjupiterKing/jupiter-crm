/*
  Warnings:

  - You are about to drop the column `area` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `doorNumber` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `layout` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Engineer` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `InventoryTransaction` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `warrantyMonths` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `SaleItem` table. All the data in the column will be lost.
  - Made the column `totalAmount` on table `Sale` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "mobile" TEXT NOT NULL,
    "altMobile" TEXT,
    "companyName" TEXT,
    "address" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "isVIP" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("address", "altMobile", "city", "companyName", "createdAt", "email", "fullName", "id", "isActive", "isVIP", "mobile", "notes", "pincode", "state", "street", "updatedAt") SELECT "address", "altMobile", "city", "companyName", "createdAt", "email", "fullName", "id", "isActive", "isVIP", "mobile", "notes", "pincode", "state", "street", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE INDEX "Customer_fullName_idx" ON "Customer"("fullName");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_mobile_idx" ON "Customer"("mobile");
CREATE INDEX "Customer_companyName_idx" ON "Customer"("companyName");
CREATE INDEX "Customer_city_idx" ON "Customer"("city");
CREATE INDEX "Customer_state_idx" ON "Customer"("state");
CREATE INDEX "Customer_pincode_idx" ON "Customer"("pincode");
CREATE TABLE "new_Engineer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "specialization" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Engineer" ("createdAt", "email", "id", "isActive", "mobile", "name", "phone", "specialization", "updatedAt") SELECT "createdAt", "email", "id", "isActive", "mobile", "name", "phone", "specialization", "updatedAt" FROM "Engineer";
DROP TABLE "Engineer";
ALTER TABLE "new_Engineer" RENAME TO "Engineer";
CREATE INDEX "Engineer_name_idx" ON "Engineer"("name");
CREATE INDEX "Engineer_email_idx" ON "Engineer"("email");
CREATE INDEX "Engineer_specialization_idx" ON "Engineer"("specialization");
CREATE TABLE "new_InventoryTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemType" TEXT NOT NULL,
    "productId" INTEGER,
    "sparePartId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "transactionKind" TEXT NOT NULL,
    "notes" TEXT,
    "unitPrice" INTEGER,
    "totalAmount" INTEGER,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventoryTransaction_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_InventoryTransaction" ("createdAt", "id", "itemType", "notes", "productId", "quantity", "sparePartId", "totalAmount", "transactionDate", "transactionKind", "unitPrice", "updatedAt") SELECT "createdAt", "id", "itemType", "notes", "productId", "quantity", "sparePartId", "totalAmount", "transactionDate", "transactionKind", "unitPrice", "updatedAt" FROM "InventoryTransaction";
DROP TABLE "InventoryTransaction";
ALTER TABLE "new_InventoryTransaction" RENAME TO "InventoryTransaction";
CREATE INDEX "InventoryTransaction_productId_idx" ON "InventoryTransaction"("productId");
CREATE INDEX "InventoryTransaction_sparePartId_idx" ON "InventoryTransaction"("sparePartId");
CREATE INDEX "InventoryTransaction_createdAt_idx" ON "InventoryTransaction"("createdAt");
CREATE INDEX "InventoryTransaction_transactionDate_idx" ON "InventoryTransaction"("transactionDate");
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "sku" TEXT NOT NULL,
    "description" TEXT,
    "currentStock" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 5,
    "unitPrice" INTEGER,
    "costPrice" INTEGER,
    "manufacturer" TEXT,
    "model" TEXT,
    "warrantyPeriod" INTEGER NOT NULL DEFAULT 12,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "costPrice", "createdAt", "currentStock", "description", "id", "isActive", "manufacturer", "model", "name", "reorderLevel", "sku", "unitPrice", "updatedAt", "warrantyPeriod") SELECT "category", "costPrice", "createdAt", "currentStock", "description", "id", "isActive", "manufacturer", "model", "name", "reorderLevel", "sku", "unitPrice", "updatedAt", "warrantyPeriod" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "Product_sku_idx" ON "Product"("sku");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_manufacturer_idx" ON "Product"("manufacturer");
CREATE TABLE "new_Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "saleDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalAmount" INTEGER NOT NULL,
    "paymentMode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sale" ("createdAt", "customerId", "id", "invoiceNumber", "notes", "paymentMode", "saleDate", "status", "totalAmount", "updatedAt") SELECT "createdAt", "customerId", "id", "invoiceNumber", "notes", "paymentMode", "saleDate", "status", "totalAmount", "updatedAt" FROM "Sale";
DROP TABLE "Sale";
ALTER TABLE "new_Sale" RENAME TO "Sale";
CREATE UNIQUE INDEX "Sale_invoiceNumber_key" ON "Sale"("invoiceNumber");
CREATE INDEX "Sale_customerId_idx" ON "Sale"("customerId");
CREATE INDEX "Sale_saleDate_idx" ON "Sale"("saleDate");
CREATE INDEX "Sale_status_idx" ON "Sale"("status");
CREATE TABLE "new_SaleItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "saleId" INTEGER NOT NULL,
    "itemType" TEXT NOT NULL,
    "productId" INTEGER,
    "sparePartId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "lineTotal" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SaleItem_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SaleItem" ("createdAt", "id", "itemType", "lineTotal", "productId", "quantity", "saleId", "sparePartId", "unitPrice", "updatedAt") SELECT "createdAt", "id", "itemType", "lineTotal", "productId", "quantity", "saleId", "sparePartId", "unitPrice", "updatedAt" FROM "SaleItem";
DROP TABLE "SaleItem";
ALTER TABLE "new_SaleItem" RENAME TO "SaleItem";
CREATE INDEX "SaleItem_saleId_idx" ON "SaleItem"("saleId");
CREATE INDEX "SaleItem_productId_idx" ON "SaleItem"("productId");
CREATE INDEX "SaleItem_sparePartId_idx" ON "SaleItem"("sparePartId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
