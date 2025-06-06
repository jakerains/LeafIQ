import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, FileText } from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';

const PrivacyPage = () => {
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

      {/* Content */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Shield className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-5xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your privacy and data security are our top priorities
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="relative rounded-2xl border-[0.75px] border-gray-200/50 p-2">
              <GlowingEffect
                spread={50}
                glow={true}
                disabled={false}
                proximity={100}
                inactiveZone={0.05}
                borderWidth={2}
                movementDuration={2.5}
              />
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-blue-600" />
                  Information We Collect
                </h2>
                <p className="text-gray-600 mb-6">
                  We collect information you provide directly to us, such as when you create an account, 
                  contact us, or use our services. This may include your name, email address, phone number, 
                  and dispensary information.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8 flex items-center">
                  <Lock className="h-6 w-6 mr-3 text-green-600" />
                  How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and security alerts</li>
                  <li>Respond to comments, questions, and customer service requests</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-6 mt-8 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-purple-600" />
                  Data Security
                </h2>
                <p className="text-gray-600 mb-6">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  All data is encrypted in transit and at rest using industry-standard protocols.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-orange-600" />
                  Your Rights
                </h2>
                <p className="text-gray-600 mb-6">
                  You have the right to access, update, or delete your personal information. You may also 
                  opt out of certain communications from us. To exercise these rights, please contact us 
                  at privacy@leafiq.com.
                </p>

                <div className="bg-blue-50 rounded-xl p-6 mt-8">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Contact Us</h3>
                  <p className="text-blue-800">
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="mt-3 text-blue-800">
                    <p>Email: privacy@leafiq.com</p>
                    <p>Address: 123 Cannabis Street, Denver, CO 80202</p>
                  </div>
                </div>
              </div>
              </div>
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

export default PrivacyPage; 