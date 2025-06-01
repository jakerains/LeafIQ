import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Logo from '../../components/ui/Logo';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-8 relative">
        <Link to="/">
          <img 
            src="/leafiq-logo.png" 
            alt="LeafIQ" 
            className="h-16 drop-shadow-lg filter shadow-primary-500/50"
          />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children || <Outlet />}
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;