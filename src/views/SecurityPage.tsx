import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Eye, 
  Server, 
  FileCheck, 
  Users, 
  Building, 
  CheckCircle,
  AlertCircle,
  Globe,
  Database,
  Key,
  Fingerprint,
  Zap,
  Award
} from 'lucide-react';
import { GlowingEffect } from '../components/ui/glowing-effect';
import HamburgerMenu from '../components/ui/HamburgerMenu';

const SecurityPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hamburger Menu */}
      <HamburgerMenu />
      
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
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Shield className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Enterprise Security
              </span>
              <br />
              <span className="text-gray-900">& Cannabis Compliance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bank-grade security meets cannabis industry compliance. Your data is protected with 
              military-grade encryption and industry-leading security practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/auth/signup"
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Secure Trial
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-4 border border-gray-300 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
              >
                Security Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Security Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Industry Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Independently verified security and compliance standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Award,
                title: "SOC 2 Type II",
                description: "Annual third-party security audits for trust and compliance",
                status: "Certified"
              },
              {
                icon: Shield,
                title: "ISO 27001",
                description: "International standard for information security management",
                status: "Compliant"
              },
              {
                icon: FileCheck,
                title: "HIPAA Ready",
                description: "Healthcare-grade privacy protections for medical cannabis",
                status: "Ready"
              },
              {
                icon: Building,
                title: "Cannabis Compliance",
                description: "State-specific cannabis regulations and reporting",
                status: "Verified"
              }
            ].map((cert, index) => (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative h-full rounded-2xl border-[0.75px] border-gray-200/50 p-2">
                  <GlowingEffect
                    spread={35}
                    glow={true}
                    disabled={false}
                    proximity={65}
                    inactiveZone={0.05}
                    borderWidth={2}
                    movementDuration={1.6}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center h-full flex flex-col justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{cert.description}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {cert.status}
                </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Security Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multi-layered security protecting your data at every level
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Data Protection */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold">Data Protection</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "AES-256 encryption at rest and in transit",
                  "End-to-end encryption for all communications",
                  "Zero-knowledge architecture for sensitive data",
                  "Automated daily encrypted backups",
                  "GDPR and CCPA compliance ready"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Access Control */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <Fingerprint className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold">Access Control</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Multi-factor authentication (MFA) required",
                  "Role-based access control (RBAC)",
                  "Single sign-on (SSO) integration",
                  "Session management and auto-logout",
                  "IP whitelisting and geofencing"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Network Security */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold">Network Security</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Web Application Firewall (WAF)",
                  "DDoS protection and mitigation",
                  "TLS 1.3 encryption for all connections",
                  "Intrusion detection and prevention",
                  "24/7 security monitoring and alerts"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Audit & Monitoring */}
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-semibold">Audit & Monitoring</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Complete audit trails for all actions",
                  "Real-time security event monitoring",
                  "Automated compliance reporting",
                  "Quarterly penetration testing",
                  "24/7 SOC monitoring and response"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cannabis Compliance */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Cannabis Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for the complex regulatory environment of cannabis retail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileCheck,
                title: "Seed-to-Sale Tracking",
                description: "Full chain of custody tracking for all inventory movements, integrated with state tracking systems like METRC and BioTrackTHC.",
                states: ["California", "Colorado", "Washington", "Oregon", "Nevada"]
              },
              {
                icon: Users,
                title: "Age Verification",
                description: "Robust ID verification systems with real-time validation against DMV databases and fraud detection.",
                features: ["ID scanning", "Database validation", "Fraud detection", "Compliance logs"]
              },
              {
                icon: Database,
                title: "Transaction Reporting",
                description: "Automated compliance reporting for state agencies with real-time data synchronization and audit trails.",
                features: ["Daily reports", "Real-time sync", "Tax calculations", "Audit trails"]
              },
              {
                icon: AlertCircle,
                title: "Inventory Limits",
                description: "Automated enforcement of possession limits, purchase limits, and inventory thresholds per state regulations.",
                features: ["Purchase limits", "Daily limits", "Inventory tracking", "Alert systems"]
              },
              {
                icon: Key,
                title: "Data Residency",
                description: "State-compliant data storage with geo-fencing and data residency requirements for sensitive cannabis data.",
                features: ["In-state storage", "Geo-fencing", "Data sovereignty", "Regional compliance"]
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "Stay current with changing regulations through automated updates and compliance monitoring systems.",
                features: ["Regulation updates", "Auto-compliance", "Change notifications", "Legal monitoring"]
              }
            ].map((item, index) => (
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
                    spread={30}
                    glow={true}
                    disabled={false}
                    proximity={65}
                    inactiveZone={0.05}
                    borderWidth={2}
                    movementDuration={1.8}
                  />
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                
                {item.states && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Supported States:</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.states.map((state, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {item.features && (
                  <ul className="space-y-1">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Trust Center */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                Security Trust Center
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Transparency is key to trust. Access our security documentation, 
                compliance reports, and third-party audit results.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                  <span>SOC 2 Type II compliance reports</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                  <span>Penetration testing results</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                  <span>Security incident response procedures</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="h-5 w-5 text-blue-200 mr-3" />
                  <span>Data processing agreements</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/contact"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center"
                >
                  Request Security Documentation
                  <FileCheck className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-2xl border-[0.75px] border-white/30 p-2">
                <GlowingEffect
                  spread={45}
                  glow={true}
                  disabled={false}
                  proximity={85}
                  inactiveZone={0.05}
                  borderWidth={2}
                  movementDuration={2.2}
                />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Security Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Uptime", value: "99.99%" },
                  { label: "Response Time", value: "< 2 min" },
                  { label: "Encrypted Data", value: "100%" },
                  { label: "Security Audits", value: "Quarterly" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
                </div>
              </div>
            </motion.div>
          </div>
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

export default SecurityPage; 