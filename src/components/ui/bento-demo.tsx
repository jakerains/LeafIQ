import {
  Brain,
  Package,
  Target,
  Users,
  Zap,
  Lock
} from "lucide-react";

import { BentoCard, BentoGrid } from "./bento-grid";

const features = [
  {
    Icon: Brain,
    name: "AI-Powered Recommendations",
    description: "Match customers with perfect products using our advanced AI engine that understands terpene profiles and desired effects.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    Icon: Package,
    name: "Smart Inventory Management",
    description: "Real-time tracking and automated reordering suggestions to keep your best sellers in stock.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-1",
  },
  {
    Icon: Target,
    name: "Customer Insights",
    description: "Deep analytics on customer preferences and buying patterns to optimize your product mix.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Users,
    name: "Staff Management",
    description: "Role-based access control and performance tracking for your team members.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-1",
  },
  {
    Icon: Zap,
    name: "Real-time Analytics",
    description: "Live dashboards showing sales, inventory levels, and customer satisfaction metrics.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-1",
  },
  {
    Icon: Lock,
    name: "Enterprise Security",
    description: "Bank-grade encryption and compliance with all relevant data protection regulations.",
    href: "/",
    cta: "Learn more",
    background: null,
    className: "md:col-span-1",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="md:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };