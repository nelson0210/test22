import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Rocket, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-tech">
        {/* Circuit board pattern background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" className="w-full h-full">
            <defs>
              <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="2" fill="currentColor"/>
                <path d="M25,0 L25,15 M25,35 L25,50 M0,25 L15,25 M35,25 L50,25" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" className="text-white"/>
          </svg>
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* AI Brain visualization */}
          <motion.div 
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-tech to-primary rounded-full flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Brain className="text-white text-2xl" size={32} />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Re<span className="text-tech-light">Phin</span>D
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-300 mb-8 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Let AI RePhind Your Patent Insight
          </motion.p>
          
          <motion.p 
            className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Revolutionary AI-powered patent analysis platform that discovers similar patents, 
            generates comprehensive summaries, and suggests innovative claim ideas to accelerate your IP research.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-tech text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-tech/90 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Rocket className="mr-2" size={20} />
            Start Analysis
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 bg-transparent"
          >
            <Play className="mr-2" size={20} />
            Watch Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
