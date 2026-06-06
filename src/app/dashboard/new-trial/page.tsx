"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { FabricCard } from "@/components/tailor/FabricCard";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { Scissors } from "lucide-react";

const GARMENTS = [
  { id: "mens-kurta", name: "Men's Kurta", hindi: "Kurta" },
  { id: "mens-sherwani", name: "Sherwani", hindi: "Sherwani" },
  { id: "mens-suit", name: "Tailored Suit", hindi: "Suit" },
  { id: "mens-full-sleeve-shirt", name: "Full Sleeve Shirt", hindi: "Shirt" },
  { id: "mens-half-sleeve-shirt", name: "Half Sleeve Shirt", hindi: "Shirt" },
  { id: "womens-saree", name: "Saree", hindi: "Saree" },
  { id: "womens-lehenga", name: "Lehenga Choli", hindi: "Lehenga" },
  { id: "womens-salwar", name: "Salwar Kameez", hindi: "Salwar" },
];

export default function NewTrialPage() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Step 1
  const [fabricFile, setFabricFile] = useState<File | null>(null);
  const [fabricPreview, setFabricPreview] = useState<string | null>(null);

  // Step 2
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [customerPreview, setCustomerPreview] = useState<string | null>(null);

  // Step 3
  const [garmentType, setGarmentType] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [fabricType, setFabricType] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  const loadingTexts = [
    "Reading the fabric texture…",
    "Measuring the pattern…",
    "Fitting to the customer…",
    "Adding the final touches…"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleFabricSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFabricFile(e.target.files[0]);
      setFabricPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomerFile(e.target.files[0]);
      setCustomerPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return !!fabricFile;
    if (currentStep === 2) return !!customerFile;
    if (currentStep === 3) return !!garmentType;
    return true;
  };

  const uploadToSupabase = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleGenerate = async () => {
    if (!fabricFile || !customerFile || !garmentType) return;
    
    try {
      setIsGenerating(true);

      const fabricUrl = await uploadToSupabase(fabricFile, "fabric-images");
      const customerUrl = await uploadToSupabase(customerFile, "customer-images");

      const { data: { user } } = await supabase.auth.getUser();
      const { data: trialData, error: trialError } = await supabase.from('trials').insert({
        shop_id: user?.id,
        customer_name: customerName || "Walk-in Customer",
        fabric_type: fabricType || "Custom Fabric",
        garment_type: garmentType,
        fabric_image_url: fabricUrl,
        customer_image_url: customerUrl,
        status: "processing"
      }).select().single();

      if (trialError || !trialData) throw new Error("Failed to create trial in database");

      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: trialData.id,
          fabricImageUrl: fabricUrl,
          customerImageUrl: customerUrl,
          garmentType,
        }),
      }).catch(console.error);

      // Simulate a bit of loading for the cinematic effect before redirecting
      setTimeout(() => {
        router.push(`/dashboard/result/${trialData.id}`);
      }, 16000); // give enough time to see the rotating texts
      
    } catch (error: any) {
      console.error(error);
      setIsGenerating(false);
      toast(error.message === "BILLING_LIMIT" ? "Plan limit exceeded." : "Failed to generate trial.", "error");
    }
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg-parchment)] flex flex-col items-center justify-center p-6">
        <style>{`
          @keyframes stitch-motion {
            0% { transform: translateY(0); }
            50% { transform: translateY(8px); }
            100% { transform: translateY(0); }
          }
          .animate-stitch { animation: stitch-motion 0.8s infinite ease-in-out; }
          .progress-bar { transition: width 4s ease-in-out; }
        `}</style>
        
        {/* Animated Needle */}
        <div className="relative w-[2px] h-[60px] bg-[var(--ink-light)] mb-12 animate-stitch mx-auto rounded-full flex justify-center">
          {/* Eye of the needle */}
          <div className="absolute top-[4px] w-[1px] h-[6px] bg-[var(--bg-parchment)] rounded-full"></div>
          {/* Thread */}
          <svg className="absolute -top-[100px] left-0 w-[40px] h-[100px] overflow-visible" viewBox="0 0 40 100" fill="none">
            <path d="M0,4 Q-20,40 10,70 T0,105" stroke="var(--thread-gold)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <h2 className="font-[family-name:var(--font-serif)] italic font-normal text-[clamp(18px,4.5vw,24px)] text-[var(--ink-dark)] mb-3">
          Stitching your look…
        </h2>
        
        <div className="h-6 mb-12 overflow-hidden relative w-full max-w-full max-w-[300px]">
          {loadingTexts.map((text, i) => (
            <p 
              key={i} 
              className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] absolute inset-0 text-center transition-all duration-500"
              style={{
                opacity: i === loadingTextIndex ? 1 : 0,
                transform: `translateY(${i === loadingTextIndex ? '0' : i < loadingTextIndex ? '-10px' : '10px'})`
              }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[240px] h-[4px] bg-[var(--stitch)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--thread-gold)] progress-bar" 
            style={{ width: `${(loadingTextIndex + 1) * 25}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full max-w-[540px] mx-auto pb-12 md:pb-24 mt-4">
      {/* STEPPER */}
      <div className="w-full flex items-center relative mb-12 px-6">
        <div className="absolute left-6 right-6 h-[1px] bg-[var(--stitch)] top-[4px] z-0" />
        <div 
          className="absolute left-6 h-[1px] bg-[var(--thread-gold)] top-[4px] z-0 transition-all duration-300" 
          style={{ width: `calc(${((currentStep - 1) / 3) * 100}% - 48px)` }} 
        />
        
        <div className="w-full flex justify-between relative z-10">
          {["Fabric", "Customer", "Style", "Confirm"].map((label, index) => {
            const stepNum = index + 1;
            const isActive = currentStep === stepNum;
            const isComplete = currentStep > stepNum;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={cn("w-[10px] h-[10px] rotate-45 border flex items-center justify-center transition-colors duration-300", 
                  isActive ? "bg-[var(--thread-gold)] border-[var(--thread-gold)] shadow-[0_0_8px_var(--thread-muted)]" : 
                  isComplete ? "bg-[var(--ink-dark)] border-[var(--ink-dark)]" : 
                  "bg-[var(--bg-parchment)] border-[var(--stitch-strong)]"
                )}>
                   {isComplete && <span className="text-[var(--bg-parchment)] text-[clamp(10px,2vw,12px)] -rotate-45 block leading-none font-bold">✓</span>}
                </div>
                <ChalkLabel className={cn(isActive ? "text-[var(--ink-dark)] font-normal" : "opacity-60")}>
                  {label}
                </ChalkLabel>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[400px]">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-1">Show us the fabric</h2>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">Photograph the cloth your customer has chosen.</p>
            </div>

            <label className={cn(
              "flex flex-col items-center justify-center min-h-[240px] bg-[var(--bg-surface)] border-2 border-dashed border-[var(--stitch-strong)] rounded-[8px] cursor-pointer transition-all duration-200 overflow-hidden relative",
              "hover:border-[var(--thread-gold)] hover:bg-[var(--thread-muted)]"
            )}>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFabricSelect} />
              
              {fabricPreview ? (
                <>
                  <img src={fabricPreview} className="absolute inset-0 w-full h-full object-contain p-2 max-w-full h-auto" alt="Fabric" />
                  <div className="absolute top-3 right-3 bg-[var(--ink-dark)] text-[var(--bg-parchment)] px-3 py-1 rounded-full font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] shadow-sm flex items-center gap-1.5 z-10">
                    <span className="text-[clamp(10px,2vw,12px)]">✓</span> Fabric captured
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-[40px] h-[40px]">
                    <div className="absolute inset-0 bg-[var(--fabric-teal)] border border-[var(--stitch)] transform -rotate-6 shadow-sm rounded-[2px]"></div>
                    <div className="absolute inset-0 bg-[var(--thread-saffron)] border border-[var(--stitch)] transform rotate-6 opacity-90 shadow-sm rounded-[2px]"></div>
                  </div>
                  <p className="font-[family-name:var(--font-serif)] text-[clamp(14px,3vw,16px)] text-[var(--ink-mid)] mt-3">Tap to photograph fabric</p>
                  <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">JPG or PNG · Clear, flat lay preferred</p>
                </div>
              )}
            </label>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-1">Photograph the customer</h2>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">We need a full-body photo to map the fabric accurately.</p>
            </div>

            <label className={cn(
              "flex flex-col items-center justify-center min-h-[240px] bg-[var(--bg-surface)] border-2 border-dashed border-[var(--stitch-strong)] rounded-[8px] cursor-pointer transition-all duration-200 overflow-hidden relative",
              "hover:border-[var(--thread-gold)] hover:bg-[var(--thread-muted)]"
            )}>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCustomerSelect} />
              
              {customerPreview ? (
                <>
                  <img src={customerPreview} className="absolute inset-0 w-full h-full object-contain p-2 max-w-full h-auto" alt="Customer" />
                  <div className="absolute top-3 right-3 bg-[var(--ink-dark)] text-[var(--bg-parchment)] px-3 py-1 rounded-full font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] shadow-sm flex items-center gap-1.5 z-10">
                    <span className="text-[clamp(10px,2vw,12px)]">✓</span> Customer captured
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[40px] h-[40px] flex items-center justify-center opacity-60">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
                    </svg>
                  </div>
                  <p className="font-[family-name:var(--font-serif)] text-[clamp(14px,3vw,16px)] text-[var(--ink-mid)] mt-1">Tap to photograph customer</p>
                  <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">Front-facing, full height</p>
                </div>
              )}
            </label>

            <FabricCard className="border-l-[3px] border-l-[var(--fabric-teal)] pl-5 py-4">
              <ChalkLabel className="mb-1 text-[var(--fabric-teal)]">Tailor's Tip</ChalkLabel>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] leading-relaxed">
                Stand the customer straight, arms slightly apart. Full height in frame. Plain wall behind them.
              </p>
            </FabricCard>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-1">Choose the cut</h2>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">Select the style of garment to be tailored.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GARMENTS.map((garment) => {
                const isSelected = garmentType === garment.id;
                return (
                  <div 
                    key={garment.id}
                    onClick={() => setGarmentType(garment.id)}
                    className={cn(
                      "relative bg-[var(--bg-card)] rounded-[8px] p-4 cursor-pointer transition-all duration-200 border",
                      "hover:shadow-sm",
                      isSelected 
                        ? "border-[var(--thread-gold)] border-l-[3px] border-l-[var(--thread-saffron)] bg-[var(--thread-muted)] shadow-sm" 
                        : "border-[var(--stitch)] border-l-[3px] border-l-[var(--fabric-cream)]"
                    )}
                  >
                    <ChalkLabel className="mb-2 !text-[clamp(10px,2vw,12px)]">Garment</ChalkLabel>
                    <p className="font-[family-name:var(--font-serif)] text-[clamp(14px,3vw,16px)] text-[var(--ink-dark)] leading-tight mb-1">{garment.name}</p>
                    <p className="font-[family-name:var(--font-sans)] italic font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-light)]">{garment.hindi}</p>
                    
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-[var(--thread-gold)]">
                        <Scissors className="w-[14px] h-[14px]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <MeasureDivider />

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <ChalkLabel>Customer Name</ChalkLabel>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <ChalkLabel>Fabric Type (Optional)</ChalkLabel>
                <input 
                  type="text" 
                  value={fabricType}
                  onChange={(e) => setFabricType(e.target.value)}
                  placeholder="Cotton, Silk, Linen…"
                  className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <ChalkLabel>Style Notes (Optional)</ChalkLabel>
                <textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Slim fit, mandarin collar, 3 buttons…"
                  rows={3}
                  className="w-full p-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-1">Ready to stitch</h2>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">Review the details on the order chit.</p>
            </div>

            <FabricCard className="border-l-[4px] border-l-[var(--ink-dark)] p-0 overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <ChalkLabel>Garment</ChalkLabel>
                  <p className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)]">{GARMENTS.find(g => g.id === garmentType)?.name || "Not selected"}</p>
                </div>
                
                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <ChalkLabel>Customer</ChalkLabel>
                  <p className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)]">{customerName || "Walk-in Customer"}</p>
                </div>

                <div className="grid grid-cols-[120px_1fr] gap-4">
                  <ChalkLabel>Fabric Type</ChalkLabel>
                  <p className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)]">{fabricType || "Not specified"}</p>
                </div>

                {instructions && (
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <ChalkLabel>Style Notes</ChalkLabel>
                    <p className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] italic opacity-80">{instructions}</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-2">
                <MeasureDivider />
                <p className="font-[family-name:var(--font-mono)] text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)] text-center pb-4 pt-2">Order #{Date.now().toString().slice(-6)}</p>
              </div>
            </FabricCard>

            <div className="pt-2 flex flex-col gap-3">
              <ThreadButton onClick={handleGenerate} className="w-full h-[52px] text-[clamp(14px,3vw,16px)]">
                Begin the stitch &rarr;
              </ThreadButton>
              <p className="text-center font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">
                AI will generate a preview in 20–40 seconds
              </p>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      {currentStep < 4 && (
        <div className="mt-12 flex items-center justify-between">
          <button 
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] disabled:opacity-0 hover:text-[var(--ink-dark)] transition-colors"
          >
            &larr; Back
          </button>
          
          <ThreadButton 
            onClick={() => {
              if (isStepValid()) setCurrentStep(prev => prev + 1);
            }}
            disabled={!isStepValid()}
          >
            Next Step
          </ThreadButton>
        </div>
      )}
    </div>
  );
}
