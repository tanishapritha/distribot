import { pgTable, text, timestamp, uuid, integer, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk User ID
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  productUrl: text("product_url").notNull(),
  description: text("description").notNull(),
  audience: text("audience").notNull(),
  pricing: text("pricing").notNull(),
  githubUrl: text("github_url"),
  repoPath: text("repo_path"),
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull(),
  platform: text("platform").notNull(), // 'reddit' | 'hn' | 'x'
  community: text("community"),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  content: text("content"),
  score: integer("score").default(0),
  status: text("status").default("new"), // 'new' | 'replied' | 'skipped'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const replies = pgTable("replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id").notNull(),
  text: text("text").notNull(),
  status: text("status").default("draft"), // 'draft' | 'posted'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  productUrl: text("product_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
