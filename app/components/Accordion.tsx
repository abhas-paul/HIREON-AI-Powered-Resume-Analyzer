import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}) => {
  const [activeItems, setActiveItems] = useState<string[]>(
    defaultOpen ? [defaultOpen] : []
  );

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
      } else {
        return prev.includes(id) ? [] : [id];
      }
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div
        className={cn(
          "space-y-4 bg-[#050505] rounded-2xl p-4 shadow-[0_0_25px_#00ff9d10]",
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  id,
  children,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#0f0f0f] bg-gradient-to-b from-[#0d0d0d] to-[#060606] hover:shadow-[0_0_15px_#00ff9d30] transition-shadow duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  itemId,
  children,
  className = "",
  icon,
  iconPosition = "right",
}) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  const defaultIcon = (
    <svg
      className={cn(
        "w-5 h-5 transition-transform duration-300 ease-in-out",
        isActive ? "rotate-180 text-[#00ff9d]" : "text-gray-400"
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  return (
    <button
      onClick={() => toggleItem(itemId)}
      className={cn(
        `w-full px-6 py-4 text-left flex items-center justify-between cursor-pointer
         text-white font-medium transition-all duration-300
         hover:text-[#00ff9d] focus:outline-none relative
         before:absolute before:inset-0 before:bg-[#00ff9d10]
         before:opacity-0 hover:before:opacity-100 before:blur-lg before:rounded-xl`,
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {iconPosition === "left" && (icon || defaultIcon)}
        <span className="flex-1 tracking-wide text-[1.05rem]">{children}</span>
      </div>
      {iconPosition === "right" && (icon || defaultIcon)}
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
  itemId,
  children,
  className = "",
}) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);

  return (
    <div
      className={cn(
        `overflow-hidden transition-all duration-500 ease-in-out transform
         ${isActive ? "max-h-[400px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-[0.98]"}
         bg-[#0a0a0a] border-t border-[#00ff9d20]`,
        className
      )}
    >
      <div className="px-6 py-4 text-gray-300 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
};
