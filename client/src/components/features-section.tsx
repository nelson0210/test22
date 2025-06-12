import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, Lightbulb } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: "Smart Patent Discovery",
      description: "Find the most relevant similar patents using advanced semantic similarity algorithms",
      gradient: "from-primary to-tech"
    },
    {
      icon: FileText,
      title: "Instant PDF Processing",
      description: "Upload patent PDFs and extract claims automatically with high accuracy text processing",
      gradient: "from-tech to-primary"
    },
    {
      icon: Lightbulb,
      title: "AI Claim Generation",
      description: "Generate innovative claim ideas and identify gaps in existing patent landscapes",
      gradient: "from-primary to-tech"
    }
  ];

  return (
    <section className="py-20 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful AI-Driven Features</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Advanced patent analysis capabilities powered by state-of-the-art AI technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
