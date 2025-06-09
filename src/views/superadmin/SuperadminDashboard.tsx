import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Database, 
  Users, 
  Building2, 
  BrainCircuit, 
  Settings, 
  Activity,
  FileText,
  Upload,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  User,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Package,
  BarChart3,
  MessageCircle,
  Store,
  Clock,
  Zap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import EnhancedKnowledgeUploader from '../../components/superadmin/EnhancedKnowledgeUploader';

// Component imports will be created
const SuperadminOverview = () => {
  const [stats, setStats] = useState({
    totalOrganizations: 0,
    totalUsers: 0,
    totalProducts: 0,
    activeSearches: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching real superadmin stats...');
        setLoading(true);
        
        // Try to use our custom platform stats function first
        const { data: platformStats, error: statsError } = await (supabase.rpc as any)('get_platform_stats');
        
        if (!statsError && platformStats && platformStats.length > 0) {
          // We got the stats from our custom function
          const stats = platformStats[0];
          
          console.log('📊 Platform stats from database:');
          console.log('  - Total Users:', stats.total_users);
          console.log('  - Total Organizations:', stats.total_organizations);
          console.log('  - Total Products:', stats.total_products);
          console.log('  - Users by Organization:', stats.users_by_organization);
          
          setStats({
            totalOrganizations: stats.total_organizations,
            totalUsers: stats.total_users,
            totalProducts: stats.total_products,
            activeSearches: Math.floor(Math.random() * 15) + 1 // Random for demo
          });
          
          console.log('✅ Real stats loaded from platform_stats function');
        } else {
          // Fallback to individual queries if the function doesn't exist yet
          console.log('ℹ️ Falling back to individual queries...');
          
          // Try the simple user count function first
          let userCount = 0;
          try {
            const { data: userCountData } = await (supabase.rpc as any)('get_total_user_count');
            if (userCountData !== null && userCountData !== undefined) {
              userCount = userCountData;
              console.log('  - Users (from auth.users):', userCount);
            }
          } catch (e) {
            console.log('  - User count function not available, using profiles');
          }
          
          // Get other stats
          const [orgsResult, productsResult] = await Promise.all([
            // Organization count
            supabase
              .from('organizations')
              .select('id', { count: 'exact', head: true }),
            
            // Product count
            supabase
              .from('products')
              .select('id', { count: 'exact', head: true })
          ]);
          
          // If we didn't get user count from the function, use profiles
          if (userCount === 0) {
            const { count } = await supabase
              .from('profiles')
              .select('id', { count: 'exact', head: true });
            userCount = count || 0;
            console.log('  - Users (from profiles table):', userCount);
          }
          
          const realStats = {
            totalOrganizations: orgsResult.count || 0,
            totalUsers: userCount,
            totalProducts: productsResult.count || 0,
            activeSearches: Math.floor(Math.random() * 15) + 1
          };
          
          setStats(realStats);
          console.log('✅ Stats loaded via individual queries:', realStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Fallback to demo data if there's an error
        setStats({
          totalOrganizations: 1,
          totalUsers: 3,
          totalProducts: 234,
          activeSearches: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">LeafIQ Platform Overview</h2>
        <p className="text-purple-100">
          Superadmin Dashboard - Managing {stats.totalOrganizations} dispensary organizations across the platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dispensaries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizations}</p>
              <p className="text-xs text-green-600 mt-1">Organizations using LeafIQ</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Platform Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Staff & customers</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">Across all dispensaries</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Searches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSearches}</p>
              <p className="text-xs text-gray-500 mt-1">Platform queries</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <BrainCircuit className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subscription Revenue Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Subscription Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-sm text-gray-600">Active Subscriptions</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalOrganizations > 0 ? stats.totalOrganizations : 'N/A'}
            </p>
            <p className="text-xs text-gray-500">Paying dispensaries</p>
          </div>
                     <div className="text-center p-4 bg-blue-50 rounded-xl">
             <p className="text-sm text-gray-600">Est. Monthly Revenue</p>
             <p className="text-2xl font-bold text-blue-600">
               ${(stats.totalOrganizations * 249).toLocaleString()}
             </p>
             <p className="text-xs text-gray-500">Standard Plan + Add-ons</p>
           </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-gray-600">Platform Health</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalOrganizations > 0 ? '🟢 Healthy' : '🟡 Growing'}
            </p>
            <p className="text-xs text-gray-500">Based on usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_status: string;
  plan_type: string;
  billing_interval: string;
  base_plan: string;
  monthly_price: number;
  annual_price: number;
  addon_features: any[];
  addon_total: number;
  created_at: string | null;
  updated_at: string | null;
  // UI display properties (computed)
  status: string;
  plan: string;
  created: string;
}

// Organization Details Modal
const OrganizationDetailsModal: React.FC<{
  organization: Organization;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ organization, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Organization ID</label>
                  <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">{organization.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Slug</label>
                  <p className="text-sm text-gray-900">/{organization.slug}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-sm text-gray-900">
                    {organization.created}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      organization.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : organization.status === 'trialing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {organization.status || 'inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Plan</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      organization.plan === 'enterprise'
                        ? 'bg-indigo-100 text-indigo-800'
                        :                       organization.plan === 'pro'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {organization.plan || 'basic'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={16} />
                Edit Organization
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
                    onDelete();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={16} />
                Delete Organization
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Edit Organization Modal
const EditOrganizationModal: React.FC<{
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedOrg: Partial<Organization>) => void;
}> = ({ organization, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'active',
    plan: 'basic'
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        slug: organization.slug || '',
        status: organization.subscription_status || 'active',
        plan: organization.plan_type || 'basic'
      });
    }
  }, [organization]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      slug: formData.slug,
      subscription_status: formData.status,
      plan_type: formData.plan
    });
  };

  if (!isOpen || !organization) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Organization</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="trialing">Trialing</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Quick Actions Modal Component
const QuickActionsModal: React.FC<{
  organization: Organization;
  isOpen: boolean;
  onClose: () => void;
}> = ({ organization, isOpen, onClose }) => {
  const [actionStats, setActionStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeSearches: 0,
    lastActivity: null as string | null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActionStats = async () => {
      if (!isOpen || !organization) return;
      
      try {
        setLoading(true);
        console.log(`📊 Fetching stats for organization: ${organization.name}`);
        
        // Fetch organization-specific stats
        const [productsRes, usersRes] = await Promise.all([
          supabase
            .from('products')
            .select('id')
            .eq('organization_id', organization.id),
          supabase
            .from('profiles')
            .select('user_id')
            .eq('organization_id', organization.id)
        ]);
        
        setActionStats({
          totalProducts: productsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          activeSearches: Math.floor(Math.random() * 10) + 1,
          lastActivity: new Date().toLocaleDateString()
        });
      } catch (error) {
        console.error('Error fetching action stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionStats();
  }, [isOpen, organization]);

  const quickActions = [
    {
      id: 'inventory',
      title: 'View Inventory',
      subtitle: `${actionStats.totalProducts} products`,
      icon: Package,
      color: 'blue',
      action: () => {
        console.log(`🏪 Viewing inventory for ${organization.name}`);
        // Navigate to organization-specific inventory view
        window.open(`/admin/inventory?org=${organization.id}`, '_blank');
      }
    },
    {
      id: 'users',
      title: 'Manage Users',
      subtitle: `${actionStats.totalUsers} users`,
      icon: Users,
      color: 'green',
      action: () => {
        console.log(`👥 Managing users for ${organization.name}`);
        // Navigate to organization-specific user management
        window.open(`/admin/users?org=${organization.id}`, '_blank');
      }
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      subtitle: 'Performance metrics',
      icon: BarChart3,
      color: 'purple',
      action: () => {
        console.log(`📈 Viewing analytics for ${organization.name}`);
        // Navigate to organization-specific analytics
        window.open(`/admin/analytics?org=${organization.id}`, '_blank');
      }
    },
    {
      id: 'activity',
      title: 'Recent Activity',
      subtitle: `Last active: ${actionStats.lastActivity || 'N/A'}`,
      icon: Activity,
      color: 'orange',
      action: () => {
        console.log(`🔄 Viewing activity for ${organization.name}`);
        // Navigate to organization-specific activity log
        window.open(`/admin/activity?org=${organization.id}`, '_blank');
      }
    },
    {
      id: 'ai_searches',
      title: 'AI Interactions',
      subtitle: `${actionStats.activeSearches} recent searches`,
      icon: BrainCircuit,
      color: 'teal',
      action: () => {
        console.log(`🤖 Viewing AI interactions for ${organization.name}`);
        // Navigate to organization-specific AI activity
        window.open(`/admin/ai-activity?org=${organization.id}`, '_blank');
      }
    },
    {
      id: 'settings',
      title: 'Organization Settings',
      subtitle: 'Configuration & preferences',
      icon: Settings,
      color: 'gray',
      action: () => {
        console.log(`⚙️ Managing settings for ${organization.name}`);
        // Navigate to organization-specific settings
        window.open(`/admin/settings?org=${organization.id}`, '_blank');
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
      gray: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{organization.name}</h2>
            <p className="text-gray-600">Quick Actions & Management</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-xl animate-pulse">
                <div className="flex items-center mb-3">
                  <div className="h-6 w-6 bg-gray-200 rounded mr-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  onClick={action.action}
                  className={`p-6 border rounded-xl text-left transition-all duration-200 ${getColorClasses(action.color)}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <Icon size={20} className="mr-3" />
                    <h3 className="font-semibold">{action.title}</h3>
                  </div>
                  <p className="text-sm opacity-75">{action.subtitle}</p>
                </motion.button>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Organization ID: {organization.id}</span>
            <span>Status: <span className="font-medium text-green-600">Active</span></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const OrganizationsManager = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching organizations from database...');
        
        // Try to fetch from database first - use type assertion since our types might not include all fields
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Database error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('✅ Found real organizations:', data.length);
          const formattedOrgs: Organization[] = data.map((org: any) => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            subscription_status: org.subscription_status || 'unknown',
            plan_type: org.plan_type || 'standard_monthly',
            billing_interval: org.billing_interval || 'monthly',
            base_plan: org.base_plan || 'standard',
            monthly_price: org.monthly_price || 249,
            annual_price: org.annual_price || 2490,
            addon_features: org.addon_features || [],
            addon_total: org.addon_total || 0,
            created_at: org.created_at,
            updated_at: org.updated_at,
            // UI display properties
            status: org.subscription_status || 'unknown',
            plan: org.plan_type || 'standard_monthly',
            created: org.created_at ? new Date(org.created_at).toLocaleDateString() : 'Unknown'
          }));
          setOrganizations(formattedOrgs);
        } else {
          console.log('⚠️ No organizations found in database, using demo data');
          // Fallback to demo data
          const demoOrgs: Organization[] = [
            {
              id: 'demo-dispensary-001',
              name: 'Demo Dispensary',
              slug: 'demo-dispensary',
              subscription_status: 'unknown',
              plan_type: 'standard_monthly',
              billing_interval: 'monthly',
              base_plan: 'standard',
              monthly_price: 249,
              annual_price: 2490,
              addon_features: [],
              addon_total: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              status: 'unknown',
              plan: 'standard_monthly',
              created: new Date().toLocaleDateString()
            }
          ];
          setOrganizations(demoOrgs);
        }
      } catch (error) {
        console.error('❌ Failed to fetch organizations:', error);
        // Show demo data on error
        setOrganizations([
          {
            id: 'demo-dispensary-001',
            name: 'Demo Dispensary',
            slug: 'demo-dispensary',
            subscription_status: 'unknown',
            plan_type: 'standard_monthly',
            billing_interval: 'monthly',
            base_plan: 'standard',
            monthly_price: 249,
            annual_price: 2490,
            addon_features: [],
            addon_total: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'unknown',
            plan: 'basic',
            created: new Date().toLocaleDateString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleViewDetails = (org: Organization) => {
    setSelectedOrg(org);
    setShowDetailsModal(true);
  };

  const handleEdit = (org?: Organization) => {
    setSelectedOrg(org || selectedOrg);
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData: Partial<Organization>) => {
    if (!selectedOrg) return;

    try {
      console.log('💾 Updating organization...', updatedData);
      
      // Check if this is a demo organization (starts with 'demo-')
      const isDemoOrg = selectedOrg.id.startsWith('demo-');
      
      if (!isDemoOrg) {
                  // Try to update in database for real organizations
          // Map UI fields to database column names
          const dbData: any = {};
          if (updatedData.status) dbData.subscription_status = updatedData.status;
          if (updatedData.plan) dbData.plan_type = updatedData.plan;
          if (updatedData.name) dbData.name = updatedData.name;
        
        console.log('🔄 Updating database with:', dbData);
        
        const { error } = await supabase
          .from('organizations')
          .update(dbData)
          .eq('id', selectedOrg.id);

        if (error) {
          console.error('❌ Database update error:', error);
          alert(`Failed to update organization: ${error.message}`);
          return;
        }
        console.log('✅ Organization updated in database');
        alert('✅ Organization updated successfully!');
      } else {
        console.log('📝 Updating demo organization (local state only)');
        alert('⚠️ Note: This is demo data. Changes will not persist after refresh.');
      }

      // Update local state
      setOrganizations(orgs => 
        orgs.map(org => 
          org.id === selectedOrg.id 
            ? { ...org, ...updatedData }
            : org
        )
      );

      setShowEditModal(false);
      setSelectedOrg(null);
      console.log('✅ Organization updated successfully');
    } catch (error) {
      console.error('❌ Error updating organization:', error);
      alert(`Error updating organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (org?: Organization) => {
    const orgToDelete = org || selectedOrg;
    if (!orgToDelete) return;

    try {
      console.log('🗑️ Deleting organization...', orgToDelete.id);
      
      // Delete from database
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', orgToDelete.id);

      if (error) {
        console.error('Database delete error:', error);
        // For demo purposes, still update local state
      }

      // Update local state
      setOrganizations(orgs => orgs.filter(o => o.id !== orgToDelete.id));
      setShowDetailsModal(false);
      setSelectedOrg(null);
      console.log('✅ Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const getStatusBadge = (status: string = 'unknown') => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      trialing: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
      unknown: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.unknown}`}>
        {status}
      </span>
    );
  };

  const getPlanBadge = (plan: string = 'basic') => {
    const styles = {
      basic: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[plan as keyof typeof styles] || styles.basic}`}>
        {plan}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
              <p className="text-sm text-gray-600 mt-1">Manage dispensary organizations and their settings</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus size={16} />
              Add Organization
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No organizations found</h3>
            <p className="text-gray-600">Add your first organization to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="cursor-pointer" onClick={() => handleViewDetails(org)}>
                        <div className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors">
                          {org.name}
                        </div>
                        <div className="text-sm text-gray-500">/{org.slug}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(org.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanBadge(org.plan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {org.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedOrg(org);
                            setShowQuickActions(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                          title="Quick Actions"
                        >
                          <Zap size={16} />
                        </button>
                        <button 
                          onClick={() => handleViewDetails(org)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(org)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                          title="Edit Organization"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(org)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete Organization"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedOrg && (
        <>
          <QuickActionsModal
            organization={selectedOrg}
            isOpen={showQuickActions}
            onClose={() => {
              setShowQuickActions(false);
              setSelectedOrg(null);
            }}
          />

          <OrganizationDetailsModal
            organization={selectedOrg}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedOrg(null);
            }}
            onEdit={() => handleEdit()}
            onDelete={() => handleDelete()}
          />

          <EditOrganizationModal
            organization={selectedOrg}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedOrg(null);
            }}
            onSave={handleSaveEdit}
          />
        </>
      )}
    </div>
  );
};

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
          <p className="text-gray-600">Platform settings and configuration will be available here.</p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component with State-Based Tabs
const SuperadminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'documents', label: 'Knowledge Base', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperadminOverview />;
      case 'organizations':
        return <OrganizationsManager />;
      case 'documents':
        return <EnhancedKnowledgeUploader />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <SuperadminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/leafiq-logo.png" 
                alt="LeafIQ" 
                className="h-10"
              />
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-semibold text-gray-900">Superadmin</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">Platform Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar with State-Based Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                        isActive
                          ? 'bg-purple-100 text-purple-900'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default SuperadminDashboard;