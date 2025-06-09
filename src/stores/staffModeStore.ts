import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StaffMode =
  | "terpenes" // Interactive Terpene Database
  | "assistant" // Staff AI Assistant
  | "inventory" // Inventory Dashboard
  | "consultation" // Customer Consultation Hub
  | "training" // Training & Knowledge Hub
  | "analytics"; // Performance Analytics

export interface StaffModeConfig {
  id: StaffMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  enabled: boolean;
  requiresAdmin?: boolean;
}

export const STAFF_MODES: StaffModeConfig[] = [
  // Removed "search" mode since we have inventory that does the same thing
  {
    id: "terpenes",
    name: "Terpene Explorer",
    description: "Interactive terpene database and educational tools",
    icon: "Atom",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    enabled: true,
  },
  {
    id: "assistant",
    name: "Bud AI Budtender",
    description: "Employee-focused chatbot for training and support",
    icon: "BudBuddy",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    enabled: true,
  },
  {
    id: "inventory",
    name: "Inventory",
    description: "Real-time stock levels and inventory management",
    icon: "Package",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    enabled: true,
  },
  {
    id: "consultation",
    name: "Customer Hub",
    description: "Customer consultation workflows and preferences",
    icon: "Users",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    enabled: true,
  },
  {
    id: "training",
    name: "Training",
    description: "Cannabis education and knowledge hub",
    icon: "BookOpen",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    enabled: true,
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Performance metrics and insights",
    icon: "BarChart3",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    enabled: true,
    requiresAdmin: true,
  },
];

interface StaffModeState {
  // Current mode state
  activeMode: StaffMode;

  // Mode management
  setActiveMode: (mode: StaffMode) => void;
  getModeConfig: (mode: StaffMode) => StaffModeConfig | undefined;
  getAvailableModes: (isAdmin?: boolean) => StaffModeConfig[];

  // Mode-specific state
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // UI state
  showModeSelector: boolean;
  setShowModeSelector: (show: boolean) => void;

  // Notifications
  notifications: Array<{
    id: string;
    type: "info" | "warning" | "error" | "success";
    message: string;
    timestamp: Date;
  }>;
  addNotification: (
    notification: Omit<StaffModeState["notifications"][0], "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useStaffModeStore = create<StaffModeState>()(
  persist(
    (set, get) => ({
      // Initial state - changed to "inventory" since "search" is removed
      activeMode: "inventory",
      showModeSelector: false,
      searchHistory: [],
      notifications: [],

      // Mode management
      setActiveMode: (mode: StaffMode) => {
        const config = STAFF_MODES.find((m) => m.id === mode);
        if (config?.enabled) {
          set({ activeMode: mode });
        }
      },

      getModeConfig: (mode: StaffMode) => {
        return STAFF_MODES.find((m) => m.id === mode);
      },

      getAvailableModes: (isAdmin = false) => {
        return STAFF_MODES.filter(
          (mode) => mode.enabled && (!mode.requiresAdmin || isAdmin),
        );
      },

      // Search history management
      addSearchHistory: (query: string) => {
        const { searchHistory } = get();
        const newHistory = [
          query,
          ...searchHistory.filter((q) => q !== query),
        ].slice(0, 10);
        set({ searchHistory: newHistory });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      // UI state management
      setShowModeSelector: (show: boolean) => {
        set({ showModeSelector: show });
      },

      // Notification management
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
          ...notification,
          id,
          timestamp: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 5),
        }));
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "staff-mode-storage",
      partialize: (state) => ({
        activeMode: state.activeMode,
        searchHistory: state.searchHistory,
      }),
    },
  ),
);