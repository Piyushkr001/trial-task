// src/config/schema.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  pgEnum,
  customType, 
} from "drizzle-orm/pg-core";

/* -------------------- define a custom bytea -------------------- */
/** 
 * Works with Node runtimes (Buffer). If you prefer Uint8Array,
 * change the generics below to { data: Uint8Array; driverData: Uint8Array }.
 */
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/* -------------------- users -------------------- */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  })
);

/* -------------------- enums -------------------- */
// enums
export const resumeTemplateEnum = pgEnum("resume_template", [
  "classic",
  "modern",
  "compact",
  "minimal",
  "elegant",
  "tech",
  "creative",
  "executive",
  "timeline",
  "twocol",
]);

export const credentialStatusEnum = pgEnum("credential_status", ["linked", "pending", "revoked"]);

/* -------------------- resumes -------------------- */
export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  template: resumeTemplateEnum("template").notNull().default("classic"),
  previewUrl: text("preview_url"),
  storageUrl: text("storage_url"),
  storageKey: text("storage_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- resume_exports -------------------- */
export const resumeExports = pgTable("resume_exports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- resume_activities -------------------- */
export const resumeActivities = pgTable("resume_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  item: varchar("item", { length: 255 }).notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- resume_files (DB binary storage) -------------------- */
export const resumeFiles = pgTable("resume_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  resumeId: uuid("resume_id").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimetype: varchar("mimetype", { length: 128 }).notNull(),
  // ✅ use custom bytea type
  bytes: bytea("bytes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- credentials -------------------- */
export const credentials = pgTable("credentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  status: credentialStatusEnum("status").notNull().default("linked"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- relations -------------------- */
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  credentials: many(credentials),
  exports: many(resumeExports),
  activities: many(resumeActivities),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, { fields: [resumes.userId], references: [users.id] }),
  exports: many(resumeExports),
  activities: many(resumeActivities),
  files: many(resumeFiles),
}));

export const resumeExportsRelations = relations(resumeExports, ({ one }) => ({
  user: one(users, { fields: [resumeExports.userId], references: [users.id] }),
  resume: one(resumes, { fields: [resumeExports.resumeId], references: [resumes.id] }),
}));

export const resumeActivitiesRelations = relations(resumeActivities, ({ one }) => ({
  user: one(users, { fields: [resumeActivities.userId], references: [users.id] }),
  resume: one(resumes, { fields: [resumeActivities.resumeId], references: [resumes.id] }),
}));

export const resumeFilesRelations = relations(resumeFiles, ({ one }) => ({
  resume: one(resumes, { fields: [resumeFiles.resumeId], references: [resumes.id] }),
}));

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, { fields: [credentials.userId], references: [users.id] }),
}));

/* -------------------- types -------------------- */
export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type SelectResume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

export type SelectExport = typeof resumeExports.$inferSelect;
export type InsertExport = typeof resumeExports.$inferInsert;

export type SelectCredential = typeof credentials.$inferSelect;
export type InsertCredential = typeof credentials.$inferInsert;
