/*
  Warnings:

  - You are about to drop the column `size` on the `ministryresource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `MinistryResource` DROP COLUMN `size`,
    ADD COLUMN `extension` VARCHAR(191) NULL,
    ADD COLUMN `sizeBytes` BIGINT NULL,
    ADD COLUMN `storagePath` TEXT NULL,
    MODIFY `type` ENUM('PDF', 'PPTX', 'AUDIO', 'VIDEO', 'WORD') NOT NULL;
