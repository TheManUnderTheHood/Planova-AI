import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  Users, 
  Clock, 
  Sparkles,
  ArrowRight,
  Search,
  Brain,
  Rocket,
  Eye,
  Shield,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

// Reusable animation wrapper component
const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E5E7EB] overflow-hidden">
      
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-purple-500/10 shadow-lg shadow-purple-500/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PlanovaAI
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#9CA3AF] hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-[#9CA3AF] hover:text-white transition-colors">
                How It Works
              </a>
              
              <div className="flex items-center gap-4 ml-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 text-[#E5E7EB] hover:text-white transition-colors"
                >
                  Sign In
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
                >
                  Get Started
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#E5E7EB] hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#111827]/95 backdrop-blur-xl border-t border-purple-500/10"
          >
            <div className="px-6 py-6 space-y-4">
              <a 
                href="#features" 
                className="block text-[#9CA3AF] hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="block text-[#9CA3AF] hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              
              <div className="pt-4 space-y-3 border-t border-purple-500/10">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 text-center border border-purple-500/30 rounded-lg text-[#E5E7EB] hover:border-purple-500/50 transition-colors"
                >
                  Sign In
                </button>
                
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-white shadow-lg shadow-purple-500/30"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 overflow-hidden pt-20">{/* Added pt-20 for navbar spacing */}
        {/* Background gradient glow */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left side - Text content */}
          <AnimatedSection>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] border border-purple-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-[#9CA3AF]">AI-Powered Content Strategy</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Plan smarter.
                <br />
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                  Create faster.
                </span>
                <br />
                Win attention.
              </h1>
              
              <p className="text-xl text-[#9CA3AF] max-w-xl">
                PlanovaAI helps creators, startups, and marketing teams discover real-time trends, 
                analyze what content works, and generate actionable strategies — all powered by AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Right side - Dashboard preview */}
          <AnimatedSection delay={0.2}>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="bg-[#111827] border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-500/10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-[#9CA3AF]">Trending Topics</span>
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-purple-500/40 rounded w-3/4" />
                      <div className="h-2 bg-purple-500/30 rounded w-1/2" />
                      <div className="h-2 bg-purple-500/20 rounded w-2/3" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1F2937] p-4 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
                      <div className="text-2xl font-bold">2.4x</div>
                      <div className="text-sm text-[#9CA3AF]">Engagement</div>
                    </div>
                    <div className="bg-[#1F2937] p-4 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-400 mb-2" />
                      <div className="text-2xl font-bold">12hrs</div>
                      <div className="text-sm text-[#9CA3AF]">Saved/Week</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Content strategy shouldn't be this hard
              </h2>
              <p className="text-xl text-[#9CA3AF]">
                Most teams struggle with these critical challenges
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Trend Blindness",
                description: "Missing what's actually trending while your competitors capitalize on viral topics."
              },
              {
                icon: Target,
                title: "Strategy Guesswork",
                description: "Throwing content at the wall hoping something sticks instead of data-driven decisions."
              },
              {
                icon: Clock,
                title: "Time Sink",
                description: "Spending hours on research and planning that could be automated and optimized."
              }
            ].map((problem, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-[#111827] border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
                >
                  <problem.icon className="w-12 h-12 text-[#9CA3AF] mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{problem.title}</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">{problem.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-300">The Solution</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Your AI-powered content command center
                </h2>
                
                <p className="text-xl text-[#9CA3AF] leading-relaxed">
                  PlanovaAI combines real-time trend intelligence, competitor analysis, 
                  and AI strategy generation into one seamless platform. Stop guessing. 
                  Start winning with data-backed content decisions.
                </p>
                
                <div className="space-y-4 pt-4">
                  {[
                    "Real-time trend discovery from multiple sources",
                    "AI-powered content strategy generation",
                    "Automated competitor tracking and analysis",
                    "Actionable insights, not just raw data"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                      <span className="text-[#E5E7EB]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="relative">
                <div className="bg-gradient-to-br from-[#111827] to-[#1F2937] border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                      <div className="flex-1">
                        <div className="h-3 bg-purple-500/40 rounded w-3/4 mb-2" />
                        <div className="h-2 bg-purple-500/20 rounded w-1/2" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-indigo-600/10 rounded-lg border border-indigo-500/20">
                      <Users className="w-8 h-8 text-indigo-400" />
                      <div className="flex-1">
                        <div className="h-3 bg-indigo-500/40 rounded w-2/3 mb-2" />
                        <div className="h-2 bg-indigo-500/20 rounded w-1/3" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-pink-600/10 rounded-lg border border-pink-500/20">
                      <Sparkles className="w-8 h-8 text-pink-400" />
                      <div className="flex-1">
                        <div className="h-3 bg-pink-500/40 rounded w-5/6 mb-2" />
                        <div className="h-2 bg-pink-500/20 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Three steps to better content
              </h2>
              <p className="text-xl text-[#9CA3AF]">
                Simple, powerful, and built for speed
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-500/50 via-purple-500/50 to-purple-500/50" />
            
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover",
                description: "AI scans real-time trends across platforms, finding what's working right now in your niche."
              },
              {
                step: "02",
                icon: Eye,
                title: "Analyze",
                description: "Get deep insights on competitor strategies, content gaps, and audience engagement patterns."
              },
              {
                step: "03",
                icon: Rocket,
                title: "Generate",
                description: "Receive AI-crafted content strategies with actionable steps tailored to your goals."
              }
            ].map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative bg-[#111827] border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
                >
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/30">
                    {step.step}
                  </div>
                  
                  <step.icon className="w-12 h-12 text-purple-400 mb-6 mt-6" />
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">{step.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Everything you need to dominate content
              </h2>
              <p className="text-xl text-[#9CA3AF]">
                Powerful features that work together seamlessly
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Trend Discovery",
                description: "Real-time monitoring across YouTube, Twitter, Reddit, and blogs. Never miss a viral moment.",
                color: "purple"
              },
              {
                icon: Brain,
                title: "AI Strategy Generator",
                description: "Transform trends into actionable content plans with AI-powered recommendations.",
                color: "indigo"
              },
              {
                icon: Users,
                title: "Competitor Tracker",
                description: "Track what's working for competitors and identify opportunities they're missing.",
                color: "pink"
              },
              {
                icon: BarChart3,
                title: "Content Analyzer",
                description: "Deep analytics on engagement, reach, and performance to refine your strategy.",
                color: "violet"
              }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-[#111827] border border-gray-700 rounded-xl p-8 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
                >
                  <div className={`w-14 h-14 bg-${feature.color}-600/20 border border-${feature.color}-500/30 rounded-lg flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">{feature.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-24 px-6 lg:px-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Built for impact, proven by results
              </h2>
            </div>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                stat: "12+ hrs",
                label: "Saved per week",
                description: "Automate research and strategy"
              },
              {
                stat: "2.4x",
                label: "Better engagement",
                description: "Data-driven content decisions"
              },
              {
                stat: "100%",
                label: "Clarity",
                description: "Know exactly what to create"
              }
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="relative bg-gradient-to-br from-[#111827]/80 to-[#1F2937]/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <div className="text-5xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent mb-2">
                    {item.stat}
                  </div>
                  <div className="text-xl font-semibold text-[#E5E7EB] mb-2">{item.label}</div>
                  <p className="text-[#9CA3AF]">{item.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 lg:px-12 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-bold">
                Start planning content
                <br />
                <span className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                  the smart way
                </span>
              </h2>
              
              <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
                Join creators and teams who've stopped guessing and started winning with AI-powered content strategy.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-10 py-5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg font-semibold text-lg text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-10 py-5 bg-[#111827] border border-purple-500/30 rounded-lg font-semibold text-lg hover:border-purple-500/50 transition-colors"
                >
                  Sign In
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-[#9CA3AF]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">PlanovaAI</span>
              </div>
              <p className="text-[#9CA3AF] mb-6 max-w-md">
                AI-powered content strategy engine helping creators and teams discover trends, 
                analyze competitors, and generate winning content strategies.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Use Cases</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#9CA3AF]">
            <p>© 2026 PlanovaAI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
