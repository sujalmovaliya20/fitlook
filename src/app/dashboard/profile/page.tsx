"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "../settings/actions";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { ThreadButton } from "@/components/tailor/ThreadButton";

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  
  const [logoUploading, setLogoUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadShop() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        const { data } = await supabase
          .from("shops")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) setShop(data);
      }
      setLoading(false);
    }
    loadShop();
  }, [supabase]);

  const handleProfileUpdate = async (formData: FormData) => {
    setSaveStatus("saving");
    const res = await updateProfile(formData);
    if (res.error) {
      alert(res.error);
      setSaveStatus("idle");
    } else {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !shop) return;
    
    try {
      setLogoUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${shop.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from("logos").getPublicUrl(fileName);
      
      await supabase.from("shops").update({ logo_url: data.publicUrl }).eq("id", shop.id);
      setShop({ ...shop, logo_url: data.publicUrl });
    } catch (err: any) {
      alert("Error uploading logo: " + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-[2px] border-[var(--stitch)] border-t-[var(--thread-gold)] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-[600px] mx-auto pb-24 mt-4 flex flex-col items-center">
      
      {/* PAGE HEADER */}
      <div className="text-center mb-10">
        <h1 className="font-[family-name:var(--font-serif)] italic text-[26px] text-[var(--ink-dark)] mb-1">Your Atelier Profile</h1>
        <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-mid)]">Your shop's identity and details</p>
      </div>

      <form action={handleProfileUpdate} className="w-full space-y-8 flex flex-col items-center">
        
        {/* SECTION 1: SHOP IDENTITY */}
        <div className="w-full">
          <ChalkLabel className="mb-4 text-center block">THE ESTABLISHMENT</ChalkLabel>
          <FabricCard className="p-8 space-y-8">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="relative w-[64px] h-[64px] rounded-full border-[2px] border-dashed border-[var(--stitch-strong)] flex items-center justify-center overflow-hidden cursor-pointer group hover:border-[var(--thread-gold)] transition-colors bg-[var(--bg-surface)]"
                onClick={() => fileInputRef.current?.click()}
              >
                {shop?.logo_url ? (
                  <Image src={shop.logo_url} alt="Shop Logo" fill className="object-cover" />
                ) : (
                  <span className="font-[family-name:var(--font-serif)] text-[24px] text-[var(--ink-mid)] group-hover:text-[var(--thread-gold)] transition-colors">
                    {shop?.shop_name?.charAt(0) || "S"}
                  </span>
                )}
                {logoUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </div>
              <span className="font-[family-name:var(--font-sans)] font-light text-[12px] text-[var(--ink-light)]">Upload shop logo</span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">Shop Name</label>
                <input 
                  name="shopName" 
                  defaultValue={shop?.shop_name} 
                  required 
                  className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-serif)] text-[18px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
                />
              </div>
              <div>
                <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">City / Location</label>
                <input 
                  name="city" 
                  defaultValue={shop?.city || "Ahmedabad"} 
                  className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
                />
              </div>
            </div>
          </FabricCard>
        </div>

        {/* SECTION 2: PROPRIETOR DETAILS */}
        <div className="w-full">
          <ChalkLabel className="mb-4 text-center block">THE ARTISAN</ChalkLabel>
          <FabricCard className="p-8 space-y-5">
            <div>
              <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">Owner Name</label>
              <input 
                name="ownerName" 
                defaultValue={shop?.owner_name} 
                required 
                className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">Mobile Number</label>
              <input 
                name="mobile" 
                defaultValue={shop?.mobile} 
                required 
                className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">Email Address</label>
              <div className="relative">
                <input 
                  value={userEmail} 
                  readOnly 
                  className="w-full bg-transparent border border-dashed border-[var(--stitch-strong)] rounded-[6px] px-4 py-3 pl-10 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-mid)] cursor-not-allowed opacity-80"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-light)]" />
              </div>
            </div>
          </FabricCard>
        </div>

        {/* SAVE BUTTON */}
        <div className="w-full max-w-[360px] pt-4 text-center">
          <ThreadButton 
            type="submit" 
            className="w-full h-[52px]"
            isLoading={saveStatus === "saving"}
          >
            Save changes to your atelier
          </ThreadButton>
          <div className="h-6 mt-2">
            <span className={cn(
              "font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-faint)] transition-opacity duration-500",
              saveStatus === "saved" ? "opacity-100" : "opacity-0"
            )}>
              Changes saved automatically
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
