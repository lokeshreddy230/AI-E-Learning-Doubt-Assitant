import React from 'react';
import { Sparkles, MessageSquare, FileText, TrendingUp, ArrowRight, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 overflow-hidden min-h-[calc(100vh-73px)] w-full py-12 md:py-0">
        {/* Background glow effects */}
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-lighten"></div>
        <div className="absolute bottom-0 -right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-lighten"></div>
        
        <div className="flex-1 space-y-10 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50/80 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold tracking-wide shadow-sm border border-primary-100 dark:border-primary-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" /> Meet your Next-Gen Learning Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
            Learn Without Limits.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-cyan-500">
              Get Instant AI-Powered<br />Doubt Resolution.
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-light">
            Stuck on a complex concept or a difficult problem? EduAI provides personalized, conversational explanations and step-by-step solutions in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
            <Link to="/chat" className="group w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_40px_rgb(79,70,229,0.4)] hover:-translate-y-1">
              Ask a Doubt <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-800 px-8 py-4 rounded-2xl font-semibold hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 text-center hover:bg-gray-50 dark:hover:bg-gray-800">
              Get Started for Free
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 perspective-1000">
          <div className="aspect-square md:aspect-[4/3] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] overflow-hidden shadow-2xl relative border border-gray-700 transform lg:rotate-y-[-10deg] lg:rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-primary-500/20 flex flex-col items-center justify-center backdrop-blur-xl">
               <div className="relative">
                 <div className="absolute inset-0 bg-primary-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                 <BrainCircuit className="w-32 h-32 text-cyan-300 relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
               </div>
               <div className="mt-8 px-6 py-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
                 <p className="font-mono text-sm tracking-widest text-cyan-300 uppercase font-medium">Neural Engine Active</p>
               </div>
            </div>
            
            {/* Decorative UI elements floating */}
            <div className="absolute top-8 left-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
               <div className="w-20 h-2 bg-white/20 rounded-full mb-2"></div>
               <div className="w-12 h-2 bg-white/20 rounded-full"></div>
            </div>
            <div className="absolute bottom-8 right-8 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg">
               <div className="flex gap-2 mb-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <div className="w-24 h-2 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-32 border-y border-gray-100 dark:border-gray-800/50" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Engineered for Academic Excellence</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-light">Our AI doesn't just give answers; it helps you understand the underlying concepts through tailored, Socratic interactions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group bg-white dark:bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conversational Tutoring</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light text-lg">Engage in natural dialogues. Ask follow-up questions and get explanations that adapt to your knowledge level.</p>
            </div>
            {/* Feature 2 */}
            <div className="group bg-white dark:bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Notes Generation</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light text-lg">Automatically summarize complex topics into concise, study-ready notes with key takeaways and formulas.</p>
            </div>
            {/* Feature 3 */}
            <div className="group bg-white dark:bg-gray-900 p-10 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-primary-900/5 hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deep Analytics</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-light text-lg">Track your learning progress, identify weak areas, and get personalized recommendations to improve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 dark:bg-primary-900 skew-y-3 transform origin-bottom-left -z-10 scale-110"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-0">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[3rem] p-16 md:p-24 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to Supercharge Your Learning?</h2>
            <p className="text-primary-100 mb-12 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed">Join thousands of students who are achieving their academic goals with EduAI's intelligent support.</p>
            <Link to="/register" className="inline-flex items-center gap-3 bg-white text-primary-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-xl">
              Start Your Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
