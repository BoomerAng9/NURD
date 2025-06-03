import React, { useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  animationType?: "fade" | "slide" | "scale";
  onValueChange?: (value: string) => void;
}

export function AnimatedTabs({
  tabs,
  defaultValue,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  animationType = "fade",
  onValueChange,
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  // Different animation variants based on the animationType
  const getVariants = () => {
    switch (animationType) {
      case "slide":
        return {
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
          exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
          exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } }
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
          exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
        };
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn("w-full", className)}
    >
      <TabsList className={cn("w-full", tabsListClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(tabsTriggerClassName)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {activeTab === tab.value && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                layoutId="tab-indicator"
                transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="relative mt-4 overflow-hidden">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => 
            activeTab === tab.value && (
              <motion.div
                key={tab.value}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={getVariants()}
                className="absolute w-full"
              >
                <TabsContent 
                  value={tab.value} 
                  className={cn("relative mt-0", tabsContentClassName)}
                  forceMount
                >
                  {tab.content}
                </TabsContent>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}