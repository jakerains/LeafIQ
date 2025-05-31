import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../types';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';