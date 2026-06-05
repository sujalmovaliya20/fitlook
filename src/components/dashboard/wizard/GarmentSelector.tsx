"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { useState } from "react";
import { cn } from "@/lib/utils";

const GARMENTS = [
  { id: "Full Sleeve Shirt", emoji: "👔", category: "Men's Top" },
  { id: "Half Sleeve Shirt", emoji: "👕", category: "Men's Top" },
  { id: "Kurta", emoji: "👘", category: "Traditional" },
  { id: "Pant (Formal)", emoji: "👖", category: "Bottom" },
  { id: "Pant (Casual)", emoji: "🩳", category: "Bottom" },
  { id: "Salwar Suit", emoji: "👗", category: "Women's" },
  { id: "Saree Blouse", emoji: "👚", category: "Women's" },
];

interface GarmentSelectorProps {
  selectedGarment: string;
  onSelectGarment: (garment: string) => void;
  customerName: string;
  onChangeCustomerName: (name: string) => void;
  fabricType: string;
  onChangeFabricType: (type: string) => void;
  instructions: string;
  onChangeInstructions: (inst: string) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function GarmentSelector({
  selectedGarment,
  onSelectGarment,
  customerName,
  onChangeCustomerName,
  fabricType,
  onChangeFabricType,
  instructions,
  onChangeInstructions
}: GarmentSelectorProps) {
  const [showNotes, setShowNotes] = useState(!!instructions);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(18px,4.5vw,24px)] text-[var(--text-primary)] mb-6">Choose the garment style</h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {GARMENTS.map((garment) => {
            const isSelected = selectedGarment === garment.id;
            
            return (
              <motion.div key={garment.id} variants={itemVariants}>
                <GlowCard 
                  glowColor={isSelected ? "gold" : "none"}
                  className={cn(
                    "relative p-5 cursor-pointer h-full transition-all duration-300",
                    isSelected 
                      ? "border-[var(--accent-gold)] bg-[rgba(201,168,76,0.05)] shadow-[var(--glow-gold)]"
                      : "border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.15)]"
                  )}
                >
                  {/* Click handler wrapper since GlowCard doesn't expose onClick directly */}
                  <div className="absolute inset-0 z-10" onClick={() => onSelectGarment(garment.id)} />
                  
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--accent-gold)] flex items-center justify-center text-black">
                      <Check className="w-3 h-3 stroke-[3px]" />
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <span className="text-[clamp(22px,6vw,36px)] leading-none">{garment.emoji}</span>
                    <div>
                      <h4 className={cn("font-medium text-[clamp(12px,2.5vw,14px)]", isSelected ? "text-[var(--accent-gold)]" : "text-[var(--text-primary)]")}>
                        {garment.id}
                      </h4>
                      <p className="text-[clamp(10px,2vw,12px)] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{garment.category}</p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[rgba(255,255,255,0.05)] rounded-[var(--radius-lg)] p-4 md:p-6 lg:p-8 space-y-6">
        <h3 className="font-[family-name:var(--font-display)] text-[clamp(16px,4vw,20px)] text-[var(--text-primary)] mb-4">Trial Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FloatingInput 
            id="customerName" 
            label="Customer Name" 
            value={customerName} 
            onChange={(e) => onChangeCustomerName(e.target.value)} 
          />
          <FloatingInput 
            id="fabricType" 
            label="Fabric Type (e.g. Cotton Silk)" 
            value={fabricType} 
            onChange={(e) => onChangeFabricType(e.target.value)} 
          />
        </div>

        <div>
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 text-[clamp(12px,2.5vw,14px)] text-[var(--accent-gold)] hover:text-[#E5B96A] transition-colors font-medium mt-2"
          >
            {showNotes ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showNotes ? "Remove style notes" : "Add style notes (Optional)"}
          </button>

          <AnimatePresence>
            {showNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => onChangeInstructions(e.target.value)}
                    placeholder="e.g. V-neck, 3/4 sleeves, ankle length..."
                    className="w-full min-h-[100px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[10px] p-4 text-[clamp(14px,3vw,16px)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] focus:shadow-[var(--glow-gold)] transition-all resize-y"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
