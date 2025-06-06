import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description: string;
  expectedDate?: string;
}

const ComingSoonPage = ({ title, description, expectedDate }: ComingSoonPageProps) => {
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
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-cyan-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Clock className="h-12 w-12 text-indigo-600" />
            </div>
            
            <h1 className="text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
            
            {expectedDate && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-md mx-auto mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expected Launch</h3>
                <p className="text-indigo-600 font-medium">{expectedDate}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Want to be notified when this feature becomes available?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact"
                  className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-all duration-300"
                >
                  Get Notified
                </Link>
                
                <Link 
                  to="/"
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
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

// Individual page components
export const BlogPage = () => (
  <ComingSoonPage
    title="Coming Soon"
    description="Our blog featuring cannabis industry insights, platform updates, and educational content is currently in development."
    expectedDate="Q2 2025"
  />
);

export const DocsPage = () => (
  <ComingSoonPage
    title="Documentation"
    description="Comprehensive documentation, API references, and integration guides are being prepared to help you get the most out of LeafIQ."
    expectedDate="Q1 2025"
  />
);

export const CompliancePage = () => (
  <ComingSoonPage
    title="Compliance Center"
    description="Detailed compliance information, regulatory updates, and industry standards documentation coming soon."
    expectedDate="Q2 2025"
  />
);

export default ComingSoonPage; 