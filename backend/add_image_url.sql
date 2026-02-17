-- Migration: add_category_image_url
-- Add imageUrl column to Category table

ALTER TABLE `Category` ADD COLUMN `imageUrl` TEXT NULL AFTER `iconColor`;
