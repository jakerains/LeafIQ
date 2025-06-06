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
  User
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
                Revolutionizing Cannabis
              </span>
              <br />
              <span className="text-gray-900">Retail Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're building the future of cannabis retail through AI-powered technology that makes 
              dispensaries smarter, customers happier, and the industry more professional.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                To democratize cannabis knowledge and make every dispensary visit an informed, 
                personalized experience. We believe technology should bridge the gap between 
                complex cannabis science and everyday consumers seeking the right products for their needs.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Brain,
                    title: "AI-Powered Education",
                    description: "Making cannabis science accessible to everyone"
                  },
                  {
                    icon: Heart,
                    title: "Patient-Centered",
                    description: "Prioritizing medical cannabis patients' needs"
                  },
                  {
                    icon: Shield,
                    title: "Compliance First",
                    description: "Building trust through regulatory excellence"
                  }
                ].map((value, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl border-[0.75px] border-emerald-200/50 p-2">
                <GlowingEffect
                  spread={50}
                  glow={true}
                  disabled={false}
                  proximity={90}
                  inactiveZone={0.05}
                  borderWidth={3}
                  movementDuration={2.2}
                />
                <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-semibold mb-6">Our Vision</h3>
                <p className="text-emerald-100 mb-8 leading-relaxed">
                  A cannabis industry where every transaction is informed, every recommendation is 
                  personalized, and every customer leaves with exactly what they need to improve their life.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Dispensaries Served", value: "150+" },
                    { label: "Customer Interactions", value: "50K+" },
                    { label: "Product Matches", value: "1M+" },
                    { label: "Accuracy Rate", value: "96%" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold mb-1">{stat.value}</div>
                      <div className="text-emerald-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a simple idea to revolutionizing cannabis retail
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                {
                  year: "2022",
                  title: "The Problem",
                  description: "Visiting a dispensary shouldn't feel overwhelming. We realized that despite cannabis legalization, customers were still struggling to find the right products. Budtenders, while knowledgeable, couldn't possibly remember every detail about hundreds of products.",
                  icon: Lightbulb
                },
                {
                  year: "2023",
                  title: "The Solution",
                  description: "We started building AI technology that could understand cannabis science, customer preferences, and inventory data to make intelligent product recommendations. Our first prototype helped a small dispensary in Colorado increase customer satisfaction by 40%.",
                  icon: Brain
                },
                {
                  year: "2024",
                  title: "Rapid Growth",
                  description: "Word spread quickly in the cannabis community. We expanded to 150+ dispensaries across 12 states, processed over 1 million product recommendations, and helped thousands of customers find their perfect cannabis experience.",
                  icon: TrendingUp
                },
                {
                  year: "2025",
                  title: "The Future",
                  description: "Today, we're the leading AI platform for cannabis retail. But we're just getting started. Our vision includes predictive inventory management, personalized dosing recommendations, and making cannabis accessible to everyone who can benefit from it.",
                  icon: Star
                }
              ].map((milestone, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                      <milestone.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mr-4">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Customer First",
                description: "Every feature we build starts with asking: how does this help customers find the right cannabis products for their needs?"
              },
              {
                icon: Brain,
                title: "Science-Based",
                description: "We base our recommendations on peer-reviewed research, terpene science, and cannabinoid profiles - not marketing hype."
              },
              {
                icon: Shield,
                title: "Compliance Obsessed",
                description: "Cannabis regulations are complex and ever-changing. We ensure our platform always keeps dispensaries compliant."
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "We listen to budtenders, customers, and dispensary owners to build features that solve real problems."
              },
              {
                icon: Heart,
                title: "Accessible",
                description: "Cannabis should be accessible to all who can benefit from it, regardless of their technical knowledge or experience."
              },
              {
                icon: Award,
                title: "Excellence",
                description: "We hold ourselves to the highest standards in everything from code quality to customer support."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative h-full rounded-2xl border-[0.75px] border-gray-200/50 p-2">
                  <GlowingEffect
                    spread={35}
                    glow={true}
                    disabled={false}
                    proximity={70}
                    inactiveZone={0.05}
                    borderWidth={2}
                    movementDuration={1.7}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                      <value.icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cannabis enthusiasts, tech innovators, and retail experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Jake Rains",
                role: "Founder & CEO",
                bio: "Former tech entrepreneur with 10+ years building consumer products. Passionate about using AI to solve real-world problems.",
                location: "Denver, CO",
                experience: "Previous: Tech Startup Founder"
              },
              {
                name: "Dr. Sarah Chen",
                role: "Head of Cannabis Science",
                bio: "PhD in Pharmacology with expertise in cannabinoid research. Published 15+ papers on terpene interactions and effects.",
                location: "San Francisco, CA",
                experience: "Previous: Cannabis Research Lab"
              },
              {
                name: "Marcus Rodriguez",
                role: "VP of Engineering",
                bio: "15 years in enterprise software with expertise in AI/ML systems. Built recommendation engines for Fortune 500 companies.",
                location: "Austin, TX",
                experience: "Previous: Google, Netflix"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-center mb-1">{member.name}</h3>
                <p className="text-emerald-600 text-center font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed">{member.bio}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <MapPin className="h-3 w-3 mr-1" />
                    {member.location}
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {member.experience}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/careers"
              className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Join Our Team
              <Users className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Ready to Transform Your Dispensary?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of dispensaries using LeafIQ to provide better customer experiences 
              and increase sales through intelligent product recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/signup"
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/demo-login"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-medium hover:bg-white hover:text-emerald-600 transition-all duration-300"
              >
                Try Demo
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