"use client";

import { Brain, BarChart4, Leaf, Users, MessageSquare, Lock } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function LeafIQGlowingCards() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Help customers find exactly what they're looking for—even if they don't know how to ask. LeafIQ analyzes live inventory, terpene profiles, and desired effects.",
      area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
    },
    {
      icon: BarChart4,
      title: "Live Analytics Dashboard",
      description: "See what's moving, what's missing, and what's working—instantly. Track sales, inventory levels, and top vibe searches in one clean view.",
      area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
    },
    {
      icon: Leaf,
      title: "Terpene Intelligence",
      description: "Move beyond \"Indica or Sativa.\" Equip staff with detailed terpene breakdowns, effect pairings, and science-backed talking points that build customer trust.",
      area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
    },
    {
      icon: Users,
      title: "Smart Staff Tools",
      description: "Give your team a co-pilot. Role-based dashboards and guided query logs help budtenders deliver expert service with less training time.",
      area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
    },
    {
      icon: MessageSquare,
      title: "Customer Insight Engine",
      description: "Understand exactly what customers want. Uncover buying patterns, trending effects, and satisfaction scores to fine-tune your product mix.",
      area: "md:[grid-area:3/1/4/8] xl:[grid-area:2/8/3/11]"
    },
    {
      icon: Lock,
      title: "Privacy & Compliance, Built-In",
      description: "Bank-grade encryption, role-based access, and full regulatory compliance keep your data—and your customers—secure.",
      area: "md:[grid-area:3/8/4/13] xl:[grid-area:2/11/3/13]"
    }
  ];

  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[40rem] xl:grid-rows-2">
      {features.map((feature, index) => (
        <GridItem
          key={index}
          area={feature.area}
          icon={<feature.icon className="h-5 w-5" />}
          title={feature.title}
          description={feature.description}
          index={index}
        />
      ))}
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  index: number;
}

const GridItem = ({ area, icon, title, description, index }: GridItemProps) => {
  return (
    <motion.li 
      className={cn("min-h-[16rem] list-none", area)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-200/50 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
          movementDuration={1.5}
          debug={index === 0}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-white/80 backdrop-blur-md p-6 shadow-sm">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-lg border-[0.75px] border-gray-200/60 bg-gradient-to-br from-primary-50 to-primary-100 p-3">
              <div className="text-primary-600">
                {icon}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-xl md:leading-[1.5rem] text-balance text-gray-900">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-sm md:leading-[1.375rem] text-gray-600">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}; 