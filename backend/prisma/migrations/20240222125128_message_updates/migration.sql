/*
  Warnings:

  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from_userId" INTEGER NOT NULL,
    "to_userId" INTEGER NOT NULL,
    "time" DATETIME NOT NULL,
    "topic" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Message_from_userId_fkey" FOREIGN KEY ("from_userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_to_userId_fkey" FOREIGN KEY ("to_userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("from_userId", "id", "to_userId") SELECT "from_userId", "id", "to_userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
