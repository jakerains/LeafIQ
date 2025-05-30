import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl",
      // light styles
      "bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300",
      "bg-gradient-to-br from-white via-gray-50 to-white",
      className,
    )}
  >
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mb-2">
        <Icon className="h-8 w-8 text-primary-600 transition-all duration-300 ease-in-out group-hover:scale-90" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800">
        {name}
      </h3>
      <p className="max-w-lg text-gray-600">{description}</p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="ghost" asChild size="sm" className="pointer-events-auto bg-primary-50 text-primary-700 hover:bg-primary-100">
        <a href={href}>
          {cta}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/40" />
  </div>
);

export { BentoCard, BentoGrid };