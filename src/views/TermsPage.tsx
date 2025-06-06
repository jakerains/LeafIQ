import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

const TermsPage = () => {
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
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Scale className="h-10 w-10 text-purple-600" />
              </div>
              <h1 className="text-5xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Terms of Service
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Legal terms and conditions for using LeafIQ services
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-purple-600" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 mb-6">
                  By accessing and using LeafIQ services, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do 
                  not use this service.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-green-600" />
                  2. Use License
                </h2>
                <p className="text-gray-600 mb-4">
                  Permission is granted to temporarily download one copy of LeafIQ materials for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to decompile or reverse engineer any software contained on LeafIQ's website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-6 mt-8 flex items-center">
                  <AlertTriangle className="h-6 w-6 mr-3 text-orange-600" />
                  3. Disclaimer
                </h2>
                <p className="text-gray-600 mb-6">
                  The materials on LeafIQ's website are provided on an 'as is' basis. LeafIQ makes no 
                  warranties, expressed or implied, and hereby disclaims and negates all other warranties 
                  including without limitation, implied warranties or conditions of merchantability, fitness 
                  for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8">4. Cannabis Compliance</h2>
                <p className="text-gray-600 mb-6">
                  LeafIQ is designed for use in jurisdictions where cannabis is legal. Users are responsible 
                  for ensuring their use of our services complies with all local, state, and federal laws. 
                  We do not facilitate illegal cannabis activities and require all users to operate within 
                  legal frameworks.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8">5. Limitations</h2>
                <p className="text-gray-600 mb-6">
                  In no event shall LeafIQ or its suppliers be liable for any damages (including, without 
                  limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use the materials on LeafIQ's website, even if LeafIQ or 
                  an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8">6. Accuracy of Materials</h2>
                <p className="text-gray-600 mb-6">
                  The materials appearing on LeafIQ's website could include technical, typographical, or 
                  photographic errors. LeafIQ does not warrant that any of the materials on its website 
                  are accurate, complete, or current. LeafIQ may make changes to the materials contained 
                  on its website at any time without notice.
                </p>

                <h2 className="text-2xl font-semibold mb-6 mt-8">7. Governing Law</h2>
                <p className="text-gray-600 mb-6">
                  These terms and conditions are governed by and construed in accordance with the laws of 
                  Colorado and you irrevocably submit to the exclusive jurisdiction of the courts in that 
                  state or location.
                </p>

                <div className="bg-purple-50 rounded-xl p-6 mt-8">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Contact Information</h3>
                  <p className="text-purple-800">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-3 text-purple-800">
                    <p>Email: legal@leafiq.com</p>
                    <p>Address: 123 Cannabis Street, Denver, CO 80202</p>
                    <p>Phone: (555) 123-4567</p>
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

export default TermsPage; 