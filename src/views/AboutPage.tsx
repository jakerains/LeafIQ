import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Target, 
  Users, 
  Brain, 
  Award, 
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Star,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/">
              <img 
                src="/leafiq-logo.png" 
                alt="LeafIQ" 
                className="h-16 drop-shadow-lg filter shadow-primary-500/50"
              />
            </Link>
            
            <div className="flex gap-4">
              <Link 
                to="/auth/login"
                className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-gray-900 font-medium hover:bg-white hover:shadow-md transition-all duration-300"
              >
                Log In
              </Link>
              <Link 
                to="/auth/signup"
                className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 shadow-md hover:shadow-lg transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Leaf className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Smarter Cannabis Retail
              </span>
              <br />
              <span className="text-gray-900">Powered by AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              LeafIQ is an early-stage startup building intelligent recommendation tools for dispensaries. 
              Our platform connects real-time inventory, cannabinoid data, and customer preferences to make 
              every visit more informed, personalized, and compliant.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <Target className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
              <h2 className="text-3xl font-display font-bold">Mission</h2>
            </div>
            
            <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2">
              <GlowingEffect
                spread={45}
                glow={true}
                disabled={false}
                proximity={85}
                inactiveZone={0.05}
                borderWidth={2}
                movementDuration={2}
              />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <p className="text-xl text-gray-700 leading-relaxed">
                  To remove the guesswork and stigma from cannabis shopping by turning deep plant science into clear, approachable guidance. We aim to make education effortless and accessible, shortening the distance between cannabis users and cannabis understanding—so every dispensary experience feels confident, informed, and stigma-free.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <Brain className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
              <h2 className="text-3xl font-display font-bold">What We Do</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full"
              >
                <Brain className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">AI-Driven Recommendations</h3>
                <p className="text-gray-600">
                  Match shoppers to the right SKUs in seconds, using terpene and cannabinoid profiles combined with live store inventory.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full"
              >
                <Lightbulb className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Actionable Education</h3>
                <p className="text-gray-600">
                  Translate complex cannabis science into plain-language insights for customers and staff.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full"
              >
                <Shield className="h-12 w-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Built-In Compliance</h3>
                <p className="text-gray-600">
                  Help dispensaries stay aligned with ever-changing state regulations and labeling requirements.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Where We Are Now Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <TrendingUp className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
              <h2 className="text-3xl font-display font-bold">Where We Are Now</h2>
            </div>
            
            <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2">
              <GlowingEffect
                spread={45}
                glow={true}
                disabled={false}
                proximity={85}
                inactiveZone={0.05}
                borderWidth={2}
                movementDuration={2}
              />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <p className="text-xl text-gray-700 leading-relaxed">
                  LeafIQ is actively piloting with a small group of forward-thinking dispensaries while we refine our algorithms and integrations. Feedback from these early partners directly shapes how we build and improve the platform.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <Heart className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
              <h2 className="text-3xl font-display font-bold">Values</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Customer Outcomes First",
                  desc: "Every feature we build starts with a simple question: how does this help someone find the right product?",
                  icon: Users,
                  delay: 0.1
                },
                {
                  title: "Rooted in Cannabis Science",
                  desc: "Our system is grounded in real research—not marketing buzzwords.",
                  icon: Leaf,
                  delay: 0.2
                },
                {
                  title: "Compliance by Design",
                  desc: "We bake regulatory safeguards into everything we build.",
                  icon: Shield,
                  delay: 0.3
                },
                {
                  title: "Community-Driven Development",
                  desc: "We build alongside dispensary operators, budtenders, and customers.",
                  icon: Users,
                  delay: 0.4
                },
                {
                  title: "Radically Accessible",
                  desc: "Cannabis education should be easy for anyone to understand—regardless of experience.",
                  icon: MessageSquare,
                  delay: 0.5
                },
                {
                  title: "Commitment to Craft",
                  desc: "Whether it's code, copy, or customer support—we do it right.",
                  icon: Star,
                  delay: 0.6
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: value.delay }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full"
                >
                  <div className="flex items-start">
                    <div className="bg-emerald-100 rounded-lg p-3 mr-4">
                      <value.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center mb-8">
              <User className="h-8 w-8 text-emerald-600 mr-4 flex-shrink-0" />
              <h2 className="text-3xl font-display font-bold">Founder</h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                  <User className="w-16 h-16 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Jake Rains — Founder & CEO</h3>
                  <p className="text-gray-700">
                    Serial tech entrepreneur focused on turning AI research into practical products that improve everyday experiences.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Join the Journey Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ExternalLink className="h-10 w-10 text-emerald-600" />
            </div>
            
            <h2 className="text-3xl font-display font-bold mb-6">
              Join the Journey
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              If you run a dispensary and want to shape the future of data-driven cannabis retail, we'd love to talk.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact"
                className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Request Info
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-4 border-2 border-emerald-500 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-all duration-300"
              >
                Request a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white bg-opacity-90 border-t border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link></li>
                <li><Link to="/security" className="text-gray-600 hover:text-gray-900">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/docs" className="text-gray-600 hover:text-gray-900">Documentation</Link></li>
                <li><Link to="/support" className="text-gray-600 hover:text-gray-900">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
                <li><Link to="/compliance" className="text-gray-600 hover:text-gray-900">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} LeafIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;