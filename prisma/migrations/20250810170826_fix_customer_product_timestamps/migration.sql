/*
  Warnings:

  - Added the required column `updatedAt` to the `CustomerProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "serialNumber" TEXT,
    "purchaseDate" DATETIME NOT NULL,
    "warrantyExpiry" DATETIME,
    "lastServiceDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CustomerProduct_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CustomerProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CustomerProduct" ("customerId", "id", "lastServiceDate", "productId", "purchaseDate", "serialNumber", "warrantyExpiry") SELECT "customerId", "id", "lastServiceDate", "productId", "purchaseDate", "serialNumber", "warrantyExpiry" FROM "CustomerProduct";
DROP TABLE "CustomerProduct";
ALTER TABLE "new_CustomerProduct" RENAME TO "CustomerProduct";
CREATE INDEX "CustomerProduct_customerId_idx" ON "CustomerProduct"("customerId");
CREATE INDEX "CustomerProduct_productId_idx" ON "CustomerProduct"("productId");
CREATE INDEX "CustomerProduct_warrantyExpiry_idx" ON "CustomerProduct"("warrantyExpiry");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
