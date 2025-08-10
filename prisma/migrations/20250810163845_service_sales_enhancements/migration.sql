-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "service_frequency" TEXT NOT NULL DEFAULT 'NONE',
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
CREATE TABLE "new_ServiceJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "customerProductId" INTEGER,
    "saleId" INTEGER,
    "scheduledDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "jobType" TEXT NOT NULL DEFAULT 'SERVICE',
    "warrantyStatus" TEXT NOT NULL,
    "engineerId" INTEGER,
    "problemDescription" TEXT,
    "resolutionNotes" TEXT,
    "billedAmount" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceJob_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceJob_customerProductId_fkey" FOREIGN KEY ("customerProductId") REFERENCES "CustomerProduct" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ServiceJob_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ServiceJob_engineerId_fkey" FOREIGN KEY ("engineerId") REFERENCES "Engineer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ServiceJob" ("billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "scheduledDate", "status", "updatedAt", "warrantyStatus") SELECT "billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "scheduledDate", "status", "updatedAt", "warrantyStatus" FROM "ServiceJob";
DROP TABLE "ServiceJob";
ALTER TABLE "new_ServiceJob" RENAME TO "ServiceJob";
CREATE INDEX "ServiceJob_customerId_idx" ON "ServiceJob"("customerId");
CREATE INDEX "ServiceJob_customerProductId_idx" ON "ServiceJob"("customerProductId");
CREATE INDEX "ServiceJob_engineerId_idx" ON "ServiceJob"("engineerId");
CREATE INDEX "ServiceJob_scheduledDate_idx" ON "ServiceJob"("scheduledDate");
CREATE INDEX "ServiceJob_status_idx" ON "ServiceJob"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
