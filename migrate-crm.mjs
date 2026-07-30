import mysql from "mysql2/promise";
import { readFileSync } from "fs";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL not set");

console.log("Connecting to database...");
const conn = await mysql.createConnection(url);

const statements = [
  `CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`openId\` varchar(64) NOT NULL,
    \`name\` text,
    \`email\` varchar(320),
    \`loginMethod\` varchar(64),
    \`role\` enum('user','admin') NOT NULL DEFAULT 'user',
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    \`lastSignedIn\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`users_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`users_openId_unique\` UNIQUE(\`openId\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`constituents\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`firstName\` varchar(100) NOT NULL,
    \`lastName\` varchar(100) NOT NULL,
    \`primaryEmail\` varchar(320),
    \`primaryPhone\` varchar(30),
    \`addressStreet1\` varchar(200),
    \`addressStreet2\` varchar(200),
    \`addressCity\` varchar(100),
    \`addressState\` varchar(100),
    \`addressZip\` varchar(20),
    \`addressCountry\` varchar(100),
    \`householdId\` varchar(64),
    \`employerName\` varchar(200),
    \`jobTitle\` varchar(200),
    \`contactTypes\` json,
    \`contactNotes\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    \`optInEmail\` boolean NOT NULL DEFAULT true,
    \`optInSms\` boolean NOT NULL DEFAULT false,
    \`optInPhysicalMail\` boolean NOT NULL DEFAULT true,
    \`source\` varchar(50) DEFAULT 'manual',
    \`wixSubmissionId\` varchar(128),
    CONSTRAINT \`constituents_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`volunteerProfiles\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`constituentId\` int NOT NULL,
    \`skills\` json,
    \`availability\` json,
    \`emergencyContactName\` varchar(200),
    \`emergencyContactPhone\` varchar(30),
    \`backgroundCheckStatus\` enum('Not Started','Pending','Passed','Failed','Expired') DEFAULT 'Not Started',
    \`backgroundCheckExpiration\` date,
    \`preferredLocations\` json,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`volunteerProfiles_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`volunteerShifts\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`constituentId\` int NOT NULL,
    \`shiftDate\` date NOT NULL,
    \`hoursWorked\` decimal(5,2) NOT NULL,
    \`location\` varchar(200),
    \`description\` text,
    \`status\` enum('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`volunteerShifts_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`boardProfiles\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`constituentId\` int NOT NULL,
    \`boardRole\` enum('President','Vice President','Treasurer','Secretary','Member-at-Large','Chair','Vice Chair'),
    \`committees\` json,
    \`termStartDate\` date,
    \`termEndDate\` date,
    \`termNumber\` int DEFAULT 1,
    \`personalGivingTarget\` decimal(12,2),
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`boardProfiles_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`membershipProfiles\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`constituentId\` int NOT NULL,
    \`memberTier\` enum('Student','Individual','Family','Corporate','VIP'),
    \`joinDate\` date,
    \`lastRenewalDate\` date,
    \`membershipExpirationDate\` date,
    \`uniqueMemberId\` varchar(20),
    \`annualDuesAmount\` decimal(10,2),
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`membershipProfiles_id\` PRIMARY KEY(\`id\`),
    CONSTRAINT \`membershipProfiles_uniqueMemberId_unique\` UNIQUE(\`uniqueMemberId\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`webhookLogs\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`source\` varchar(50) NOT NULL DEFAULT 'wix',
    \`submissionId\` varchar(128),
    \`rawPayload\` json,
    \`status\` enum('success','duplicate','error') NOT NULL,
    \`constituentId\` int,
    \`errorMessage\` text,
    \`receivedAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`webhookLogs_id\` PRIMARY KEY(\`id\`)
  )`,
];

for (const sql of statements) {
  const tableName = sql.match(/CREATE TABLE IF NOT EXISTS `(\w+)`/)?.[1];
  try {
    await conn.execute(sql);
    console.log(`✓ ${tableName}`);
  } catch (err) {
    console.error(`✗ ${tableName}:`, err.message);
  }
}

await conn.end();
console.log("\nMigration complete.");
