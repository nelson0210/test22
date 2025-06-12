import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzePatentClaim, calculateSimilarity } from "./lib/openai";
import { extractTextFromPDF, validatePDFFile } from "./lib/pdfParser";
import {
  similaritySearchSchema,
  claimAnalysisRequestSchema,
  type SimilaritySearchResponse,
  type ClaimAnalysisResponse,
} from "@shared/schema";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Patent similarity search endpoint
  app.post("/api/similarity", async (req, res) => {
    try {
      const { text } = similaritySearchSchema.parse(req.body);
      
      // Get all patents for similarity comparison
      const allPatents = await storage.getAllPatents();
      
      // Calculate similarities
      const similarities = allPatents.map(patent => ({
        patent,
        similarityScore: calculateSimilarity(text, patent.claims),
      }));
      
      // Sort by similarity score and take top 10
      const topSimilar = similarities
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 10)
        .map(item => ({
          ...item,
          similarityScore: Math.round(item.similarityScore * 100) / 100, // Round to 2 decimal places
        }));
      
      // Store results
      for (const result of topSimilar) {
        await storage.createSimilarityResult({
          queryText: text,
          similarPatentId: result.patent.id,
          similarityScore: result.similarityScore,
        });
      }
      
      const response: SimilaritySearchResponse = {
        results: topSimilar,
      };
      
      res.json(response);
    } catch (error) {
      console.error("Similarity search error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to perform similarity search"
      });
    }
  });

  // PDF upload endpoint for similarity search
  app.post("/api/similarity/upload", upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file provided" });
      }
      
      if (!validatePDFFile(req.file)) {
        return res.status(400).json({ message: "Invalid PDF file" });
      }
      
      const extractedText = await extractTextFromPDF(req.file.buffer);
      
      // Use the extracted text for similarity search
      const allPatents = await storage.getAllPatents();
      const similarities = allPatents.map(patent => ({
        patent,
        similarityScore: calculateSimilarity(extractedText, patent.claims),
      }));
      
      const topSimilar = similarities
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 10)
        .map(item => ({
          ...item,
          similarityScore: Math.round(item.similarityScore * 100) / 100,
        }));
      
      const response: SimilaritySearchResponse = {
        results: topSimilar,
      };
      
      res.json(response);
    } catch (error) {
      console.error("PDF upload error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process PDF file"
      });
    }
  });

  // Claim analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text } = claimAnalysisRequestSchema.parse(req.body);
      
      // Check if we have cached analysis
      const cachedAnalysis = await storage.getClaimAnalysis(text);
      if (cachedAnalysis) {
        const response: ClaimAnalysisResponse = {
          technologyDomain: cachedAnalysis.technologyDomain || "Unknown",
          keyTerms: cachedAnalysis.keyTerms || [],
          claimElements: cachedAnalysis.claimElements || 0,
          summary: cachedAnalysis.summary || "No summary available",
          suggestions: cachedAnalysis.suggestions || [],
        };
        return res.json(response);
      }
      
      // Perform AI analysis
      const analysisResult = await analyzePatentClaim(text);
      
      // Store the analysis
      await storage.createClaimAnalysis({
        inputText: text,
        technologyDomain: analysisResult.technologyDomain,
        keyTerms: analysisResult.keyTerms,
        claimElements: analysisResult.claimElements,
        summary: analysisResult.summary,
        suggestions: analysisResult.suggestions,
      });
      
      const response: ClaimAnalysisResponse = analysisResult;
      res.json(response);
      
    } catch (error) {
      console.error("Claim analysis error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze patent claim"
      });
    }
  });

  // Get all patents endpoint
  app.get("/api/patents", async (req, res) => {
    try {
      const patents = await storage.getAllPatents();
      res.json(patents);
    } catch (error) {
      console.error("Get patents error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve patents"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
