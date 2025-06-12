import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface ClaimAnalysisResult {
  technologyDomain: string;
  keyTerms: string[];
  claimElements: number;
  summary: string;
  suggestions: string[];
}

export async function analyzePatentClaim(claimText: string): Promise<ClaimAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a patent analysis expert. Analyze the given patent claim and provide structured insights. Respond with JSON in this exact format:
          {
            "technologyDomain": "string - the main technology field",
            "keyTerms": ["array", "of", "important", "technical", "terms"],
            "claimElements": number - count of distinct claim elements,
            "summary": "string - concise summary of the claim",
            "suggestions": ["array", "of", "new", "claim", "ideas", "based", "on", "gaps"]
          }`
        },
        {
          role: "user",
          content: `Analyze this patent claim and identify opportunities for new claims:\n\n${claimText}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      technologyDomain: result.technologyDomain || "Unknown",
      keyTerms: Array.isArray(result.keyTerms) ? result.keyTerms : [],
      claimElements: typeof result.claimElements === 'number' ? result.claimElements : 0,
      summary: result.summary || "No summary available",
      suggestions: Array.isArray(result.suggestions) ? result.suggestions : []
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze patent claim: " + (error as Error).message);
  }
}

export function calculateSimilarity(text1: string, text2: string): number {
  // Simple similarity calculation based on common words
  // In a real implementation, this would use embeddings from OpenAI or sentence transformers
  const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 3);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}
