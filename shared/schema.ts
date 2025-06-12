import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const patents = pgTable("patents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  patentNumber: text("patent_number").notNull().unique(),
  abstract: text("abstract"),
  claims: text("claims").notNull(),
  filedDate: text("filed_date"),
  inventors: text("inventors"),
  assignee: text("assignee"),
});

export const similarityResults = pgTable("similarity_results", {
  id: serial("id").primaryKey(),
  queryText: text("query_text").notNull(),
  similarPatentId: integer("similar_patent_id").references(() => patents.id),
  similarityScore: real("similarity_score").notNull(),
});

export const claimAnalysis = pgTable("claim_analysis", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  technologyDomain: text("technology_domain"),
  keyTerms: text("key_terms").array(),
  claimElements: integer("claim_elements"),
  summary: text("summary"),
  suggestions: text("suggestions").array(),
});

export const insertPatentSchema = createInsertSchema(patents).omit({
  id: true,
});

export const insertSimilarityResultSchema = createInsertSchema(similarityResults).omit({
  id: true,
});

export const insertClaimAnalysisSchema = createInsertSchema(claimAnalysis).omit({
  id: true,
});

// API request/response schemas
export const similaritySearchSchema = z.object({
  text: z.string().min(1, "Patent text is required"),
});

export const claimAnalysisRequestSchema = z.object({
  text: z.string().min(1, "Patent text is required"),
});

export type Patent = typeof patents.$inferSelect;
export type InsertPatent = z.infer<typeof insertPatentSchema>;
export type SimilarityResult = typeof similarityResults.$inferSelect;
export type InsertSimilarityResult = z.infer<typeof insertSimilarityResultSchema>;
export type ClaimAnalysis = typeof claimAnalysis.$inferSelect;
export type InsertClaimAnalysis = z.infer<typeof insertClaimAnalysisSchema>;
export type SimilaritySearchRequest = z.infer<typeof similaritySearchSchema>;
export type ClaimAnalysisRequest = z.infer<typeof claimAnalysisRequestSchema>;

// Response types
export type SimilaritySearchResponse = {
  results: Array<{
    patent: Patent;
    similarityScore: number;
  }>;
};

export type ClaimAnalysisResponse = {
  technologyDomain: string;
  keyTerms: string[];
  claimElements: number;
  summary: string;
  suggestions: string[];
};
