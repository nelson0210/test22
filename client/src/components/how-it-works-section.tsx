import { motion } from "framer-motion";
import { Upload, Brain, TrendingUp } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Upload or Input",
      description: "Upload your patent PDF or paste claim text directly into our intelligent interface"
    },
    {
      number: 2,
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI processes your patent using advanced NLP and semantic similarity algorithms"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Get Insights",
      description: "Receive comprehensive analysis, similar patents, and innovative claim suggestions"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How RePhinD Works</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Simple, powerful workflow designed for patent professionals and inventors
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-primary to-tech rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-white text-xl font-bold">{step.number}</span>
              </motion.div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
              
              {/* Icon representation */}
              <motion.div 
                className="mt-6 flex justify-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                viewport={{ once: true }}
              >
                <step.icon className="text-slate-400" size={32} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
