import HeroSection from "@/components/hero-section";
import PatentAnalysis from "@/components/patent-analysis";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-tech rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900">RePhinD</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-primary transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors font-medium">
                How It Works
              </a>
              <button 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <HeroSection />
      <div id="analysis">
        <PatentAnalysis />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <Footer />
    </div>
  );
}
