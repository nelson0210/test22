import {
  patents,
  similarityResults,
  claimAnalysis,
  type Patent,
  type InsertPatent,
  type SimilarityResult,
  type InsertSimilarityResult,
  type ClaimAnalysis,
  type InsertClaimAnalysis,
} from "@shared/schema";

export interface IStorage {
  // Patent operations
  getPatent(id: number): Promise<Patent | undefined>;
  getPatentByNumber(patentNumber: string): Promise<Patent | undefined>;
  getAllPatents(): Promise<Patent[]>;
  createPatent(patent: InsertPatent): Promise<Patent>;
  
  // Similarity operations
  createSimilarityResult(result: InsertSimilarityResult): Promise<SimilarityResult>;
  getSimilarityResults(queryText: string): Promise<SimilarityResult[]>;
  
  // Claim analysis operations
  createClaimAnalysis(analysis: InsertClaimAnalysis): Promise<ClaimAnalysis>;
  getClaimAnalysis(inputText: string): Promise<ClaimAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private patents: Map<number, Patent>;
  private similarityResults: Map<number, SimilarityResult>;
  private claimAnalyses: Map<number, ClaimAnalysis>;
  private currentPatentId: number;
  private currentSimilarityId: number;
  private currentAnalysisId: number;

  constructor() {
    this.patents = new Map();
    this.similarityResults = new Map();
    this.claimAnalyses = new Map();
    this.currentPatentId = 1;
    this.currentSimilarityId = 1;
    this.currentAnalysisId = 1;
    
    // Initialize with some sample patents for similarity search
    this.initializeSamplePatents();
  }

  private async initializeSamplePatents() {
    const samplePatents: InsertPatent[] = [
      {
        title: "Method for Data Processing Using Machine Learning",
        patentNumber: "US11234567",
        abstract: "A computer-implemented method for processing large datasets using neural networks and machine learning algorithms to improve data classification accuracy.",
        claims: "1. A computer-implemented method for processing data comprising: receiving input data from multiple sources; applying a neural network model to classify the data; and outputting classification results with confidence scores.",
        filedDate: "2022-03-15",
        inventors: "John Smith, Jane Doe",
        assignee: "Tech Corp Inc."
      },
      {
        title: "Automated Data Classification System",
        patentNumber: "US11123456",
        abstract: "System and method for automatically classifying incoming data streams using pattern recognition and artificial intelligence techniques.",
        claims: "1. A system for data classification comprising: a data input module; a pattern recognition engine; and a classification output interface configured to provide real-time results.",
        filedDate: "2021-11-20",
        inventors: "Alice Johnson, Bob Wilson",
        assignee: "Data Systems LLC"
      },
      {
        title: "Real-time Data Processing Framework",
        patentNumber: "US10987654",
        abstract: "A framework for processing streaming data in real-time applications with low latency and high throughput requirements.",
        claims: "1. A framework for real-time data processing comprising: stream ingestion components; parallel processing units; and output distribution mechanisms.",
        filedDate: "2020-08-10",
        inventors: "Charlie Brown, David Lee",
        assignee: "Stream Tech Inc."
      },
      {
        title: "Intelligent Document Analysis Platform",
        patentNumber: "US11345678",
        abstract: "Platform for analyzing documents using natural language processing and computer vision techniques to extract structured information.",
        claims: "1. A document analysis platform comprising: optical character recognition modules; natural language processing engines; and structured data extraction components.",
        filedDate: "2022-07-01",
        inventors: "Emma Davis, Frank Miller",
        assignee: "DocTech Solutions"
      },
      {
        title: "Machine Learning Model Optimization System",
        patentNumber: "US11456789",
        abstract: "System for automatically optimizing machine learning model parameters and architecture for improved performance.",
        claims: "1. A system for model optimization comprising: parameter tuning algorithms; performance evaluation metrics; and automated architecture selection methods.",
        filedDate: "2023-01-12",
        inventors: "Grace Wilson, Henry Taylor",
        assignee: "AI Optimization Corp"
      }
    ];

    for (const patent of samplePatents) {
      await this.createPatent(patent);
    }
  }

  async getPatent(id: number): Promise<Patent | undefined> {
    return this.patents.get(id);
  }

  async getPatentByNumber(patentNumber: string): Promise<Patent | undefined> {
    return Array.from(this.patents.values()).find(
      (patent) => patent.patentNumber === patentNumber
    );
  }

  async getAllPatents(): Promise<Patent[]> {
    return Array.from(this.patents.values());
  }

  async createPatent(insertPatent: InsertPatent): Promise<Patent> {
    const id = this.currentPatentId++;
    const patent: Patent = { ...insertPatent, id };
    this.patents.set(id, patent);
    return patent;
  }

  async createSimilarityResult(insertResult: InsertSimilarityResult): Promise<SimilarityResult> {
    const id = this.currentSimilarityId++;
    const result: SimilarityResult = { ...insertResult, id };
    this.similarityResults.set(id, result);
    return result;
  }

  async getSimilarityResults(queryText: string): Promise<SimilarityResult[]> {
    return Array.from(this.similarityResults.values()).filter(
      (result) => result.queryText === queryText
    );
  }

  async createClaimAnalysis(insertAnalysis: InsertClaimAnalysis): Promise<ClaimAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: ClaimAnalysis = { ...insertAnalysis, id };
    this.claimAnalyses.set(id, analysis);
    return analysis;
  }

  async getClaimAnalysis(inputText: string): Promise<ClaimAnalysis | undefined> {
    return Array.from(this.claimAnalyses.values()).find(
      (analysis) => analysis.inputText === inputText
    );
  }
}

export const storage = new MemStorage();
