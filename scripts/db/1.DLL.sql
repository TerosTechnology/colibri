-- Copyright 2020 Teros Technology
--
-- Ismael Perez Rojo
-- Carlos Alberto Ruiz Naranjo
-- Alfredo Saez
--
-- This file is part of Colibri.
--
-- Colibri is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- Colibri is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

CREATE TABLE `languague` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE `standard` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0,
  `languague_id` INTEGER REFERENCES `languague` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `parser` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE `parser_standard` (
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0,
  `parser_id` INTEGER NOT NULL REFERENCES `parser` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  `standard_id` INTEGER NOT NULL REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (`parser_id`, `standard_id`)
);

CREATE TABLE `linter` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `external` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE `linter_standard` (
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0,
  `linter_id` INTEGER NOT NULL REFERENCES `linter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  `standard_id` INTEGER NOT NULL REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (`linter_id`, `standard_id`)
);

CREATE TABLE `editor` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE `editor_standard` (
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0,
  `editor_id` INTEGER NOT NULL REFERENCES `editor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  `standard_id` INTEGER NOT NULL REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (`editor_id`, `standard_id`)
);

CREATE TABLE `documenter` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `code` VARCHAR(255) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE `documenter_standard` (
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INTEGER NOT NULL DEFAULT 0,
  `documenter_id` INTEGER NOT NULL REFERENCES `documenter` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  `standard_id` INTEGER NOT NULL REFERENCES `standard` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (`documenter_id`, `standard_id`)
);
