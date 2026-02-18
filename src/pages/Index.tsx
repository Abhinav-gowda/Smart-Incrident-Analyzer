import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageUpload from '@/components/ImageUpload';
import ExtractedIngredients from '@/components/ExtractedIngredients';
import AnalysisResults, { Ingredient } from '@/components/AnalysisResults';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, Tag } from 'lucide-react';

// Mock data for demonstration
const mockIngredients: Ingredient[] = [
  {
    name: 'Water',
    riskLevel: 'safe',
    description: 'Essential for life, water is a safe and necessary component in most food products.',
    category: 'Base Ingredient',
  },
  {
    name: 'Organic Cane Sugar',
    riskLevel: 'caution',
    description: 'While natural, excessive sugar consumption can lead to various health issues including obesity and diabetes.',
    category: 'Sweetener',
  },
  {
    name: 'Palm Oil',
    riskLevel: 'caution',
    description: 'High in saturated fats. While not immediately harmfull, regular consumption may contribute to heart disease.',
    category: 'Fat/Oil',
  },
  {
    name: 'Cocoa Powder',
    riskLevel: 'safe',
    description: 'Natural cocoa is rich in antioxidants and flavonoids. Generally considered beneficial in moderation.',
    category: 'Flavoring',
  },
  {
    name: 'Soy Lecithin',
    riskLevel: 'safe',
    description: 'A common emulsifier derived from soybeans. Generally recognized as safe by food authorities.',
    category: 'Emulsifier',
  },
  {
    name: 'Artificial Flavoring',
    riskLevel: 'caution',
    description: 'Synthetic compounds that mimic natural flavors. Some individuals may experience sensitivities.',
    category: 'Flavoring',
  },
  {
    name: 'Red 40',
    riskLevel: 'danger',
    description: 'Synthetic food dye linked to hyperactivity in children and potential carcinogenic effects in some studies.',
    category: 'Colorant',
  },
  {
    name: 'Sodium Benzoate',
    riskLevel: 'danger',
    description: 'Preservative that can form benzene (a carcinogen) when combined with vitamin C. May cause allergic reactions.',
    category: 'Preservative',
  },
];

const Index: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedIngredients, setExtractedIngredients] = useState<string[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Ingredient[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [productName, setProductName] = useState('');

  const simulateOCR = useCallback(() => {
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        resolve([
          'Water',
          'Organic Cane Sugar',
          'Palm Oil',
          'Cocoa Powder',
          'Soy Lecithin',
          'Artificial Flavoring',
          'Red 40',
          'Sodium Benzoate',
        ]);
      }, 1500);
    });
  }, []);

  const simulateAnalysis = useCallback(() => {
    return new Promise<Ingredient[]>((resolve) => {
      setTimeout(() => {
        resolve(mockIngredients);
      }, 2000);
    });
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setShowResults(false);
    setAnalysisResults(null);

    // Simulate OCR extraction
    const extracted = await simulateOCR();
    setExtractedIngredients(extracted);
    setIsProcessing(false);
  };

  const handleTextInput = async (text: string) => {
    setIsProcessing(true);
    setShowResults(false);
    setAnalysisResults(null);

    // Parse ingredients from text
    const ingredients = text
      .split(/[,;\n]/)
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    
    setExtractedIngredients(ingredients);
    setIsProcessing(false);
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    const results = await simulateAnalysis();
    setAnalysisResults(results);
    setShowResults(true);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setExtractedIngredients([]);
    setAnalysisResults(null);
    setShowResults(false);
    setProductName('');
  };

  const calculateOverallScore = (ingredients: Ingredient[]): number => {
    const weights = { safe: 100, caution: 50, danger: 0 };
    const total = ingredients.reduce((sum, ing) => sum + weights[ing.riskLevel], 0);
    return Math.round(total / ingredients.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <section className="container mx-auto px-4 pb-20">
          {!showResults ? (
            <>
              {/* Product Name Input - AI-style soft card container */}
              <div className="w-full max-w-2xl mx-auto mb-10 animate-fade-in">
                <div className="relative bg-card rounded-2xl shadow-soft p-6 border border-border/50">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    {/* Elegant small label */}
                    <label
                      htmlFor="productName"
                      className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-3 block text-center"
                    >
                      Product Identification
                    </label>
                    
                    {/* Input container with icon */}
                    <div className="relative max-w-lg mx-auto">
                      {/* Product/Tag icon */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Tag className="w-5 h-5 text-primary/60" />
                      </div>
                      
                      <input
                        id="productName"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="What product are you analyzing? (e.g., Face Wash, Shampoo)"
                        className="w-full bg-secondary/30 border-0 rounded-xl py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/70 text-center transition-all duration-300 outline-none focus:bg-secondary/50 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)] focus:ring-0"
                      />
                    </div>
                    
                    {/* Helper text */}
                    <p className="text-xs text-muted-foreground/60 text-center mt-3">
                      Optional — helps personalize your analysis results
                    </p>
                  </div>
                </div>
              </div>

              <ImageUpload
                onImageUpload={handleImageUpload}
                onTextInput={handleTextInput}
                isProcessing={isProcessing}
              />
              
              <ExtractedIngredients
                ingredients={extractedIngredients}
                isVisible={extractedIngredients.length > 0 && !isProcessing}
              />
              
              {extractedIngredients.length > 0 && !isProcessing && (
                <div className="flex justify-center mt-6 animate-fade-in">
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="gradient-hero text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-card hover:shadow-elevated hover:scale-[1.02] transition-all duration-300"
                  >
                    Analyze Safety
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Analyze Another Product
                </Button>
              </div>
              
              {analysisResults && (
                <AnalysisResults
                  ingredients={analysisResults}
                  overallScore={calculateOverallScore(analysisResults)}
                  productName={productName || undefined}
                />
              )}
            </>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
