"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Layers, 
  Github, 
  MessageSquare, 
  Users, 
  Rocket, 
  TrendingUp 
} from "lucide-react";
import { cn } from "@/lib/utils";

type FormulaTermId = 'fundamentals' | 'projects' | 'communication' | 'networking' | 'persistence' | 'timing' | null;

const MAPPINGS: Record<string, string[]> = {
  fundamentals: ['dsa'],
  projects: ['projects', 'github'],
  communication: ['communication'],
  networking: ['networking'],
  persistence: ['github'],
  timing: ['start-early'],
};

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-10 md:mb-16">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-4"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-muted-foreground text-lg max-w-2xl mx-auto"
    >
      {subtitle}
    </motion.p>
  </div>
);

const FormulaTerm = ({ 
  label, 
  id, 
  colorClass, 
  onHover, 
  activeId 
}: { 
  label: string; 
  id: FormulaTermId; 
  colorClass: string; 
  onHover: (id: FormulaTermId) => void;
  activeId: FormulaTermId;
}) => {
  const isActive = activeId === id;
  
  return (
    <span 
      className={cn(
        "relative inline-block cursor-pointer transition-all duration-300 mx-1 md:mx-1.5 font-bold tracking-tight",
        colorClass,
        isActive ? "opacity-100 scale-105" : "opacity-80 hover:opacity-100"
      )}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      {label}
      <span className={cn(
        "absolute -bottom-1 left-0 w-full border-b-[3px] border-dotted transition-all duration-300",
        isActive ? "border-current opacity-100" : "border-current/30 opacity-40 hover:opacity-100"
      )} />
    </span>
  );
};

const InteractiveFormula = ({ 
  onHoverTerm, 
  activeTerm 
}: { 
  onHoverTerm: (id: FormulaTermId) => void;
  activeTerm: FormulaTermId;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center justify-center text-center mb-16 md:mb-24 px-2"
  >
    {/* Formula Container - Clean & Minimal */}
    <div className="relative group max-w-full overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
       {/* Background Glow for Dark Mode */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-24 bg-primary/10 blur-[80px] rounded-full opacity-0 dark:opacity-20 pointer-events-none" />

      <div className="relative z-10 font-mono text-xl md:text-3xl lg:text-4xl leading-relaxed text-foreground/80 md:whitespace-nowrap">
        <span className="text-muted-foreground font-bold mr-3 select-none">SUCCESS =</span>
        
        <span className="inline-flex flex-wrap md:flex-nowrap justify-center items-center gap-y-3 md:gap-y-0">
          <span>(</span>
          <FormulaTerm 
            label="Fundamentals" 
            id="fundamentals" 
            colorClass="text-amber-500 dark:text-yellow-400" 
            onHover={onHoverTerm} 
            activeId={activeTerm}
          />
          <span className="text-muted-foreground/60 select-none">×</span>
          <FormulaTerm 
            label="Projects" 
            id="projects" 
            colorClass="text-emerald-600 dark:text-green-400" 
            onHover={onHoverTerm} 
            activeId={activeTerm}
          />
          <span className="text-muted-foreground/60 select-none">×</span>
          <FormulaTerm 
            label="Communication" 
            id="communication" 
            colorClass="text-pink-600 dark:text-pink-400" 
            onHover={onHoverTerm} 
            activeId={activeTerm}
          />
          <span>)</span>
          
          <span className="w-full md:w-auto md:inline-block flex justify-center items-center mt-2 md:mt-0">
             <span className="mx-2 md:mx-3 text-muted-foreground/60 select-none">+</span>
             <FormulaTerm 
               label="Networking" 
               id="networking" 
               colorClass="text-cyan-600 dark:text-cyan-400" 
               onHover={onHoverTerm} 
               activeId={activeTerm}
             />
             <span className="mx-2 md:mx-3 text-muted-foreground/60 select-none">+</span>
             <FormulaTerm 
               label="Persistence" 
               id="persistence" 
               colorClass="text-orange-600 dark:text-orange-400" 
               onHover={onHoverTerm} 
               activeId={activeTerm}
             />
             <span className="mx-2 md:mx-3 text-muted-foreground/60 select-none">+</span>
             <FormulaTerm 
               label="Timing" 
               id="timing" 
               colorClass="text-red-600 dark:text-red-400" 
               onHover={onHoverTerm} 
               activeId={activeTerm}
             />
          </span>
        </span>
      </div>
      
      <p className="text-muted-foreground text-xs md:text-sm mt-6 font-medium tracking-wide uppercase opacity-60">
        Hover to see the connections
      </p>
    </div>
  </motion.div>
);

const BentoItem = ({ 
  id,
  title, 
  description, 
  icon: Icon, 
  className, 
  delay = 0,
  isHighlighted,
  onHover
}: { 
  id: string;
  title: string; 
  description: string; 
  icon: React.ElementType; 
  className?: string;
  delay?: number;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
}) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    onMouseEnter={() => onHover(id)}
    onMouseLeave={() => onHover(null)}
    className={cn(
      "group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300",
      isHighlighted 
        ? "border-primary/40 shadow-xl shadow-primary/5" 
        : "bg-card border-border hover:border-primary/20 hover:shadow-lg",
      className
    )}
  >
    {/* Highlight Effect - Pulsating Gradient */}
    {isHighlighted && (
       <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"
          />
       </div>
    )}

    {/* Hover Gradient for normal state */}
    {!isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    )}
    
    <div className="relative z-10 h-full flex flex-col">
      <div className={cn(
        "mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl border transition-colors duration-300 shadow-sm",
        isHighlighted 
          ? "bg-primary text-white border-primary" 
          : "bg-background border-border group-hover:bg-primary group-hover:text-white"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className={cn(
        "text-xl font-bold mb-2 transition-colors",
        isHighlighted ? "text-primary" : "text-foreground group-hover:text-primary"
      )}>{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export function SuccessFormula() {
  const [activeTerm, setActiveTerm] = useState<FormulaTermId>(null);
  
  // Reverse lookup to find which term to highlight when hovering a card
  const getTermFromCardId = (cardId: string | null): FormulaTermId => {
    if (!cardId) return null;
    for (const [term, cards] of Object.entries(MAPPINGS)) {
      if (cards.includes(cardId)) return term as FormulaTermId;
    }
    return null;
  };

  const handleCardHover = (cardId: string | null) => {
    if (cardId) {
      const term = getTermFromCardId(cardId);
      if (term) setActiveTerm(term);
    } else {
      setActiveTerm(null);
    }
  };

  const highlightedCardIds = activeTerm ? MAPPINGS[activeTerm] : [];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Elements - Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="container relative mx-auto px-4 z-10">
        <SectionHeader 
          title="Universal Advice Across All Roles" 
          subtitle="No shortcuts. Just a proven roadmap to engineering excellence."
        />

        <InteractiveFormula 
          onHoverTerm={setActiveTerm} 
          activeTerm={activeTerm} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <BentoItem 
            id="dsa"
            title="Master DSA" 
            description="200-300 LeetCode problems are the gold standard for most engineering roles. Don't skip the basics."
            icon={Code2}
            className="md:col-span-2 lg:col-span-1"
            delay={0.1}
            isHighlighted={highlightedCardIds.includes('dsa')}
            onHover={handleCardHover}
          />
          <BentoItem 
            id="projects"
            title="Build Projects" 
            description="4-7 solid portfolio projects with live deployments. Show, don't just tell."
            icon={Layers}
            className="lg:col-span-2"
            delay={0.2}
            isHighlighted={highlightedCardIds.includes('projects')}
            onHover={handleCardHover}
          />
          <BentoItem 
            id="github"
            title="GitHub Profile" 
            description="Keep it active and well-documented. Consistently green squares show persistence."
            icon={Github}
            delay={0.3}
            isHighlighted={highlightedCardIds.includes('github')}
            onHover={handleCardHover}
          />
          <BentoItem 
            id="communication"
            title="Communication" 
            description="Technical writing, presentations, and soft skills are multipliers for your career growth."
            icon={MessageSquare}
            className="md:col-span-2 lg:col-span-1"
            delay={0.4}
            isHighlighted={highlightedCardIds.includes('communication')}
            onHover={handleCardHover}
          />
           <BentoItem 
            id="networking"
            title="Networking" 
            description="Leverage LinkedIn, Twitter/X, alumni networks, and attend meetups."
            icon={Users}
             delay={0.5}
             isHighlighted={highlightedCardIds.includes('networking')}
             onHover={handleCardHover}
          />
          <BentoItem 
            id="start-early"
            title="Start Early" 
            description="Year 1-2 is the time to explore and build foundations. Compounding takes time."
            icon={Rocket}
            className="md:col-span-3 lg:col-span-3 bg-gradient-to-r from-card to-primary/5"
            delay={0.6}
            isHighlighted={highlightedCardIds.includes('start-early')}
            onHover={handleCardHover}
          />
        </div>
        
        <div className="mt-16 text-center">
             <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full"
             >
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Consistency is the only cheat code.</span>
             </motion.div>
        </div>
      </div>
    </section>
  );
}
