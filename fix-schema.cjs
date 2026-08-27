const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Change provider
schema = schema.replace(/provider = "postgresql"/, 'provider = "sqlite"');
schema = schema.replace(/url\s+=\s+env\("DATABASE_URL"\)/, 'url      = "file:./dev.db"');

// 2. Remove all enums
schema = schema.replace(/enum \w+ \{[\s\S]*?\}/g, '');

// 3. Change enum fields to String
schema = schema.replace(/role\s+Role\s+@default\(USER\)/, 'role          String         @default("USER")');
schema = schema.replace(/interval\s+Interval\s+@default\(MONTHLY\)/, 'interval      String         @default("MONTHLY")');
schema = schema.replace(/status\s+SubscriptionStatus\s+@default\(ACTIVE\)/, 'status                 String @default("ACTIVE")');
schema = schema.replace(/status\s+PaymentStatus\s+@default\(PENDING\)/, 'status                 String @default("PENDING")');
schema = schema.replace(/status\s+TicketStatus\s+@default\(OPEN\)/, 'status    String    @default("OPEN")');
schema = schema.replace(/priority\s+TicketPriority\s+@default\(NORMAL\)/, 'priority  String  @default("NORMAL")');
schema = schema.replace(/type\s+AnnouncementType\s+@default\(INFO\)/, 'type      String @default("INFO")');

// 4. Fix String[] arrays
schema = schema.replace(/features\s+String\[\]/, 'features      String @default("[]")'); // Store as stringified JSON

// 5. Fix Json type
schema = schema.replace(/content\s+Json/, 'content       String');
schema = schema.replace(/snapshot\s+Json/, 'snapshot    String');
schema = schema.replace(/value\s+Json/, 'value     String');

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('Schema fixed!');
