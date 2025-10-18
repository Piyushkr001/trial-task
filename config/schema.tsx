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
} from "drizzle-orm/pg-core";

/* -------------------- users (yours, unchanged) -------------------- */
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    // use text if URLs might exceed 255
    imageUrl: text("image_url"),
    // timezone-aware timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    emailUnique: uniqueIndex("users_email_unique").on(t.email),
  })
);

/* -------------------- enums -------------------- */
export const resumeTemplateEnum = pgEnum("resume_template", [
  "classic",
  "modern",
  "compact",
]);

export const credentialStatusEnum = pgEnum("credential_status", [
  "linked",
  "pending",
  "revoked",
]);

/* -------------------- resumes -------------------- */
export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  template: resumeTemplateEnum("template").notNull().default("classic"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* -------------------- resume_exports -------------------- */
export const resumeExports = pgTable("resume_exports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  // export may or may not be tied to a specific resume (keep nullable)
  resumeId: uuid("resume_id").references(() => resumes.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* -------------------- credentials (for verification) -------------------- */
export const credentials = pgTable("credentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  status: credentialStatusEnum("status").notNull().default("linked"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/* -------------------- relations (optional but handy) -------------------- */
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  credentials: many(credentials),
  exports: many(resumeExports),
}));

export const resumesRelations = relations(resumes, ({ one, many }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
  exports: many(resumeExports),
}));

export const resumeExportsRelations = relations(resumeExports, ({ one }) => ({
  user: one(users, {
    fields: [resumeExports.userId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [resumeExports.resumeId],
    references: [resumes.id],
  }),
}));

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, {
    fields: [credentials.userId],
    references: [users.id],
  }),
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
