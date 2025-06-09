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