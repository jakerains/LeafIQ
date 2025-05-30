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
    background: <img src="https://images.pexels.com/photos/1619298/pexels-photo-1619298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    Icon: Package,
    name: "Smart Inventory Management",
    description: "Real-time tracking and automated reordering suggestions to keep your best sellers in stock.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.pexels.com/photos/6980712/pexels-photo-6980712.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
    className: "md:col-span-1",
  },
  {
    Icon: Target,
    name: "Customer Insights",
    description: "Deep analytics on customer preferences and buying patterns to optimize your product mix.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Users,
    name: "Staff Management",
    description: "Role-based access control and performance tracking for your team members.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
    className: "md:col-span-1",
  },
  {
    Icon: Zap,
    name: "Real-time Analytics",
    description: "Live dashboards showing sales, inventory levels, and customer satisfaction metrics.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.pexels.com/photos/7947452/pexels-photo-7947452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
    className: "md:col-span-1",
  },
  {
    Icon: Lock,
    name: "Enterprise Security",
    description: "Bank-grade encryption and compliance with all relevant data protection regulations.",
    href: "/",
    cta: "Learn more",
    background: <img src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" className="absolute inset-0 w-full h-full object-cover opacity-10" alt="" />,
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