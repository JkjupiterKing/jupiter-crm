-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ServiceJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "customerProductId" INTEGER,
    "saleId" INTEGER,
    "visitScheduledDate" DATETIME,
    "serviceDueDate" DATETIME NOT NULL,
    "serviceDueStatus" TEXT,
    "serviceVisitStatus" TEXT NOT NULL DEFAULT 'UNSCHEDULED',
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
INSERT INTO "new_ServiceJob" ("billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "saleId", "serviceDueDate", "serviceDueStatus", "serviceVisitStatus", "updatedAt", "visitScheduledDate", "warrantyStatus") SELECT "billedAmount", "createdAt", "customerId", "customerProductId", "engineerId", "id", "jobType", "notes", "problemDescription", "resolutionNotes", "saleId", "serviceDueDate", "serviceDueStatus", "serviceVisitStatus", "updatedAt", "visitScheduledDate", "warrantyStatus" FROM "ServiceJob";
DROP TABLE "ServiceJob";
ALTER TABLE "new_ServiceJob" RENAME TO "ServiceJob";
CREATE INDEX "ServiceJob_customerId_idx" ON "ServiceJob"("customerId");
CREATE INDEX "ServiceJob_customerProductId_idx" ON "ServiceJob"("customerProductId");
CREATE INDEX "ServiceJob_engineerId_idx" ON "ServiceJob"("engineerId");
CREATE INDEX "ServiceJob_visitScheduledDate_idx" ON "ServiceJob"("visitScheduledDate");
CREATE INDEX "ServiceJob_serviceDueDate_idx" ON "ServiceJob"("serviceDueDate");
CREATE INDEX "ServiceJob_serviceDueStatus_idx" ON "ServiceJob"("serviceDueStatus");
CREATE INDEX "ServiceJob_serviceVisitStatus_idx" ON "ServiceJob"("serviceVisitStatus");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
