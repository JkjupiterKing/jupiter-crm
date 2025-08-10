/*
  Warnings:

  - Added the required column `updatedAt` to the `ServiceContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDueDate` to the `ServiceJob` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceContract" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerProductId" INTEGER NOT NULL,
    "contractType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "frequencyMonths" INTEGER,
    "nextDueDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceContract_customerProductId_fkey" FOREIGN KEY ("customerProductId") REFERENCES "CustomerProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ServiceContract" ("contractType", "customerProductId", "endDate", "frequencyMonths", "id", "isActive", "nextDueDate", "startDate") SELECT "contractType", "customerProductId", "endDate", "frequencyMonths", "id", "isActive", "nextDueDate", "startDate" FROM "ServiceContract";
DROP TABLE "ServiceContract";
ALTER TABLE "new_ServiceContract" RENAME TO "ServiceContract";
CREATE INDEX "ServiceContract_customerProductId_idx" ON "ServiceContract"("customerProductId");
CREATE INDEX "ServiceContract_endDate_idx" ON "ServiceContract"("endDate");
CREATE INDEX "ServiceContract_nextDueDate_idx" ON "ServiceContract"("nextDueDate");
CREATE TABLE "new_ServiceJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "customerProductId" INTEGER,
    "saleId" INTEGER,
    "scheduledDate" DATETIME,
    "serviceDueDate" DATETIME NOT NULL,
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
INSERT INTO "new_ServiceJob" ("billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "saleId", "scheduledDate", "status", "updatedAt", "warrantyStatus") SELECT "billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "saleId", "scheduledDate", "status", "updatedAt", "warrantyStatus" FROM "ServiceJob";
DROP TABLE "ServiceJob";
ALTER TABLE "new_ServiceJob" RENAME TO "ServiceJob";
CREATE INDEX "ServiceJob_customerId_idx" ON "ServiceJob"("customerId");
CREATE INDEX "ServiceJob_customerProductId_idx" ON "ServiceJob"("customerProductId");
CREATE INDEX "ServiceJob_engineerId_idx" ON "ServiceJob"("engineerId");
CREATE INDEX "ServiceJob_scheduledDate_idx" ON "ServiceJob"("scheduledDate");
CREATE INDEX "ServiceJob_serviceDueDate_idx" ON "ServiceJob"("serviceDueDate");
CREATE INDEX "ServiceJob_status_idx" ON "ServiceJob"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
