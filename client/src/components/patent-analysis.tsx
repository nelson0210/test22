import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Lightbulb, Upload, BarChart3, FileText, Brain, Loader2 } from "lucide-react";
import type { SimilaritySearchResponse, ClaimAnalysisResponse } from "@shared/schema";

export default function PatentAnalysis() {
  const [claimText, setClaimText] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [similarityResults, setSimilarityResults] = useState<SimilaritySearchResponse | null>(null);
  const [analysisResults, setAnalysisResults] = useState<ClaimAnalysisResponse | null>(null);
  const { toast } = useToast();

  const similarityMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/similarity", { text });
      return response.json() as Promise<SimilaritySearchResponse>;
    },
    onSuccess: (data) => {
      setSimilarityResults(data);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.results.length} similar patents`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analysisMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/analyze", { text });
      return response.json() as Promise<ClaimAnalysisResponse>;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      toast({
        title: "Analysis Complete",
        description: "Generated insights and suggestions",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSimilaritySearch = () => {
    if (!claimText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter patent claim text",
        variant: "destructive",
      });
      return;
    }
    similarityMutation.mutate(claimText);
  };

  const handleClaimAnalysis = () => {
    if (!analysisText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter patent text for analysis",
        variant: "destructive",
      });
      return;
    }
    analysisMutation.mutate(analysisText);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Patent Analysis Dashboard</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Upload your patent document or paste claim text to discover insights and similar patents instantly
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-slate-50 shadow-lg">
            <CardContent className="p-8">
              <Tabs defaultValue="similarity" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="similarity" className="flex items-center gap-2">
                    <Search size={16} />
                    Patent Similarity
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-2">
                    <Lightbulb size={16} />
                    Claim Analysis
                  </TabsTrigger>
                </TabsList>

                {/* Patent Similarity Tab */}
                <TabsContent value="similarity">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Panel */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload className="text-primary" size={20} />
                            Input Patent Claim
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* File Upload Zone */}
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
                            <FileText className="mx-auto mb-4 text-slate-400" size={48} />
                            <p className="text-slate-600 font-medium mb-2">Drop PDF file here or click to browse</p>
                            <p className="text-sm text-slate-500">PDF parsing not yet implemented - please use text input below</p>
                          </div>

                          <div className="flex items-center">
                            <div className="flex-1 border-t border-slate-200"></div>
                            <span className="px-4 text-slate-500 text-sm">OR</span>
                            <div className="flex-1 border-t border-slate-200"></div>
                          </div>

                          {/* Text Input */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                              Paste Claim 1 Text
                            </label>
                            <Textarea 
                              className="h-32 resize-none"
                              placeholder="A method for processing data comprising: step 1, step 2, wherein..."
                              value={claimText}
                              onChange={(e) => setClaimText(e.target.value)}
                            />
                          </div>

                          <Button 
                            className="w-full"
                            onClick={handleSimilaritySearch}
                            disabled={similarityMutation.isPending}
                          >
                            {similarityMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="mr-2" size={16} />
                            )}
                            Find Similar Patents
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="text-tech" size={20} />
                            Top 10 Similar Patents
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {similarityResults ? (
                            <div className="space-y-4">
                              {similarityResults.results.map((result, index) => (
                                <motion.div
                                  key={result.patent.id}
                                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-900 mb-1">
                                        {result.patent.title}
                                      </h4>
                                      <p className="text-sm text-slate-600">
                                        {result.patent.patentNumber} • Filed {result.patent.filedDate}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-tech">
                                        {Math.round(result.similarityScore * 100)}%
                                      </div>
                                      <div className="text-xs text-slate-500">similarity</div>
                                    </div>
                                  </div>
                                  <Progress 
                                    value={result.similarityScore * 100} 
                                    className="mb-3 h-2"
                                  />
                                  <p className="text-sm text-slate-700">
                                    {result.patent.abstract}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500">
                              <Search className="mx-auto mb-4" size={48} />
                              <p>Enter patent claim text and click "Find Similar Patents" to see results</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Claim Analysis Tab */}
                <TabsContent value="analysis">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Analysis Input */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="text-primary" size={20} />
                            Patent Document Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea 
                            className="h-48 resize-none"
                            placeholder="Paste your full patent claims or abstract here for comprehensive analysis..."
                            value={analysisText}
                            onChange={(e) => setAnalysisText(e.target.value)}
                          />

                          <Button 
                            className="w-full bg-gradient-to-r from-primary to-tech"
                            onClick={handleClaimAnalysis}
                            disabled={analysisMutation.isPending}
                          >
                            {analysisMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Brain className="mr-2" size={16} />
                            )}
                            Analyze & Generate Ideas
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Analysis Results */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="text-tech" size={20} />
                            AI-Generated Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {analysisResults ? (
                            <div className="space-y-6">
                              {/* Claim Summary */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                              >
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  📋 Claim Structure Analysis
                                </h4>
                                <div className="bg-slate-50 rounded-lg p-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                                    <div>
                                      <span className="font-medium text-slate-600">Technology Domain:</span>
                                      <span className="ml-2 text-slate-900">{analysisResults.technologyDomain}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-slate-600">Claim Elements:</span>
                                      <span className="ml-2 text-slate-900">{analysisResults.claimElements} key elements</span>
                                    </div>
                                  </div>
                                  <div className="mb-3">
                                    <span className="font-medium text-slate-600">Summary:</span>
                                    <p className="mt-1 text-slate-900 text-sm">{analysisResults.summary}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-slate-600">Key Terms:</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {analysisResults.keyTerms.map((term, index) => (
                                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                                          {term}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>

                              {/* New Claim Ideas */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                              >
                                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                  💡 Suggested Claim Ideas
                                </h4>
                                <div className="space-y-3">
                                  {analysisResults.suggestions.map((suggestion, index) => (
                                    <div 
                                      key={index}
                                      className="bg-gradient-to-r from-tech/5 to-primary/5 rounded-lg p-4 border-l-4 border-tech"
                                    >
                                      <h5 className="font-medium text-slate-900 mb-2">
                                        Suggestion {index + 1}
                                      </h5>
                                      <p className="text-sm text-slate-700">
                                        {suggestion}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-500">
                              <Brain className="mx-auto mb-4" size={48} />
                              <p>Enter patent text and click "Analyze & Generate Ideas" to see AI insights</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
