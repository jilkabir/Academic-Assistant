import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  BookOpen,
  Info,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type AnalysisResult } from "@/src/services/geminiService";
import { cn } from "@/lib/utils";

export default function App() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [intensity, setIntensity] = useState<'standard' | 'aggressive'>('standard');

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText, intensity }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze text");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze text. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    setInputText("The objective of this research is to examine the impact of social media on adolescent mental health. Furthermore, it is important to note that the results indicate a significant correlation between high usage and increased anxiety levels. In conclusion, the study suggests that interventions are necessary.");
  };

  const getLikelihoodColor = (likelihood: string) => {
    const l = likelihood.toLowerCase();
    if (l.includes("high")) return "bg-red-50 text-red-700 border-red-100";
    if (l.includes("medium")) return "bg-amber-50 text-amber-700 border-amber-100";
    if (l.includes("low")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    return "bg-zinc-50 text-zinc-700 border-zinc-100";
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#1a1a1a] font-sans selection:bg-zinc-200">
      {/* Navigation */}
      <nav className="border-b border-zinc-200/60 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shadow-lg shadow-zinc-200">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold tracking-tight">Academic Assistant</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400">Human-Centric Research Tools</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-zinc-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">v2.0 Pro</span>
            </div>
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            <Button variant="outline" size="sm" className="rounded-full border-zinc-200 hover:bg-zinc-50 font-semibold px-6">
              Documentation
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-start">
          
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="space-y-6">
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                Linguistic Refinement Engine
              </Badge>
              <h2 className="text-5xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight">
                Elevate your <span className="italic text-zinc-400">scholarly</span> voice.
              </h2>
              <p className="text-xl text-zinc-500 max-w-2xl font-serif italic leading-relaxed">
                "The art of academic writing is not just in the data, but in the human resonance of the narrative."
              </p>
            </section>

            {/* Input Card */}
            <Card className="border-zinc-200/60 shadow-2xl shadow-zinc-200/50 bg-white rounded-[32px] overflow-hidden">
              <CardHeader className="p-8 pb-0 border-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-serif font-semibold flex items-center gap-3">
                      <FileText className="w-6 h-6 text-zinc-400" />
                      Draft Manuscript
                    </CardTitle>
                    <CardDescription className="text-zinc-400 font-medium">Paste your research draft for linguistic analysis</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={loadExample} className="text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest text-[10px]">
                      Try Example
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setInputText("")} className="text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest text-[10px]">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-6 space-y-6">
                <div className="relative">
                  <Textarea 
                    placeholder="The objective of this study is to investigate..."
                    className="min-h-[400px] border-none focus-visible:ring-0 resize-none p-0 text-xl font-serif leading-relaxed placeholder:text-zinc-200"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className="absolute bottom-0 right-0 p-4 pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                      {inputText.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center bg-zinc-50 p-1 rounded-full border border-zinc-100 w-full sm:w-auto">
                    <button
                      onClick={() => setIntensity('standard')}
                      className={cn(
                        "flex-1 sm:flex-none px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                        intensity === 'standard' ? "bg-white text-zinc-900 shadow-sm border border-zinc-100" : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      Standard
                    </button>
                    <button
                      onClick={() => setIntensity('aggressive')}
                      className={cn(
                        "flex-1 sm:flex-none px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                        intensity === 'aggressive' ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "text-zinc-400 hover:text-zinc-600"
                      )}
                    >
                      Aggressive
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing || !inputText.trim()}
                    className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white px-10 h-14 rounded-full transition-all active:scale-95 shadow-xl shadow-zinc-200 font-bold uppercase tracking-widest text-xs"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-3 animate-spin" />
                        Refining Voice...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-3" />
                        Analyze & Humanize
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-700"
              >
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm font-semibold">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Sidebar / Results */}
          <aside className="lg:sticky lg:top-32 space-y-8">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 border border-dashed border-zinc-200 rounded-[32px] text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                    <Info className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-medium">Ready for Analysis</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Your results will appear here once the refinement engine completes its cycle.
                    </p>
                  </div>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-white border border-zinc-100 rounded-[24px] space-y-4">
                      <div className="h-4 w-1/3 bg-zinc-50 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-zinc-50 rounded animate-pulse" />
                        <div className="h-3 w-4/5 bg-zinc-50 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  {/* Analysis Summary */}
                  <Card className="border-zinc-200/60 shadow-xl shadow-zinc-200/30 bg-white rounded-[32px] overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                      <CardTitle className="text-base font-serif font-semibold flex items-center gap-3">
                        <Info className="w-5 h-5 text-zinc-400" />
                        Linguistic Audit
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">AI Likelihood</span>
                        <Badge className={cn("px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-none shadow-sm", getLikelihoodColor(result.aiLikelihood))}>
                          {result.aiLikelihood.split('-')[0].trim()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-amber-500" />
                          Pattern Indicators
                        </h4>
                        <ul className="space-y-3">
                          {result.reasons.map((reason, i) => (
                            <li key={i} className="text-xs text-zinc-500 flex gap-3 leading-relaxed">
                              <ChevronRight className="w-3 h-3 text-zinc-300 flex-shrink-0 mt-0.5" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Improvement Tips */}
                  <Card className="border-zinc-200/60 shadow-xl shadow-zinc-200/30 bg-white rounded-[32px] overflow-hidden">
                    <CardHeader className="p-6 pb-4">
                      <CardTitle className="text-base font-serif font-semibold flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Refinement Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <ul className="space-y-5">
                        {result.improvementTips.map((tip, i) => (
                          <li key={i} className="flex gap-4">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed font-medium">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>
        </div>

        {/* Humanized Version - Full Width Below if Result exists */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20"
            >
              <Card className="border-zinc-200/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] bg-white rounded-[48px] overflow-hidden">
                <CardHeader className="p-10 pb-6 border-none">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Badge className="bg-amber-50 text-amber-600 border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                        Refined Manuscript
                      </Badge>
                      <CardTitle className="text-3xl font-serif font-semibold">Humanized Output</CardTitle>
                      <CardDescription className="text-zinc-400 font-medium">Optimized for natural flow, perplexity, and academic rigor</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => copyToClipboard(result.humanizedVersion)}
                      className={cn(
                        "rounded-full px-8 h-14 transition-all font-bold uppercase tracking-widest text-[10px]", 
                        copied ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "border-zinc-200 hover:bg-zinc-50"
                      )}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Copied to Clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Manuscript
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-zinc-50/30 p-10 lg:p-16">
                    <div className="max-w-4xl mx-auto">
                      <div className="font-serif text-2xl leading-[1.7] text-zinc-800 whitespace-pre-wrap first-letter:text-6xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-zinc-900">
                        {result.humanizedVersion}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-200/60 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-900">
              <BookOpen className="w-5 h-5" />
              <span className="font-serif text-xl font-semibold">Academic Assistant</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-medium">
              Empowering researchers with linguistic tools that preserve the human essence of scientific discovery.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Ethics</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
