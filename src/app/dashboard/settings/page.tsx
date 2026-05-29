"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updatePassword, deleteAccount } from "./actions";

import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { ThreadButton } from "@/components/tailor/ThreadButton";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    async function loadShop() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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

  const handlePasswordUpdate = async (formData: FormData) => {
    const res = await updatePassword(formData);
    if (res.error) alert(res.error);
    else {
      alert("Password updated successfully");
      (document.getElementById("pwd-form") as HTMLFormElement)?.reset();
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== shop?.shop_name) return;
    
    setLoading(true);
    const res = await deleteAccount();
    if (res.error) {
      alert(res.error);
      setLoading(false);
    } else {
      window.location.href = "/";
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
        <h1 className="font-[family-name:var(--font-serif)] italic text-[26px] text-[var(--ink-dark)] mb-1">Security & Preferences</h1>
        <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-mid)]">Manage your account security and data</p>
      </div>

      {/* SECTION 1: CREDENTIALS */}
      <div className="w-full">
        <ChalkLabel className="mb-4 text-center block">SECURITY</ChalkLabel>
        <FabricCard className="p-8">
          <form id="pwd-form" action={handlePasswordUpdate} className="space-y-5">
            <div>
              <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">New Password</label>
              <input 
                name="password" 
                type="password"
                required 
                minLength={6}
                className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
              />
            </div>
            <div>
              <label className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-mid)] uppercase tracking-widest mb-1.5 block">Confirm New Password</label>
              <input 
                name="confirmPassword" 
                type="password"
                required 
                minLength={6}
                className="w-full bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[14px] text-[var(--ink-dark)] focus:outline-none focus:border-[var(--thread-gold)] transition-colors"
              />
            </div>
            <div className="pt-2">
              <ThreadButton variant="ghost" type="submit" className="w-full">
                Update password
              </ThreadButton>
            </div>
          </form>
        </FabricCard>
      </div>

      <MeasureDivider className="w-full my-12 opacity-30" />

      {/* DANGER ZONE */}
      <div className="w-full">
        <div className="bg-[rgba(139,26,26,0.04)] border border-[rgba(139,26,26,0.15)] rounded-[8px] p-8 text-center flex flex-col items-center">
          <ChalkLabel className="!text-[var(--fabric-red)] mb-2 block">CLOSE ATELIER</ChalkLabel>
          <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-mid)] mb-6 max-w-sm">
            Permanently delete your shop and all trial data. This action cannot be undone.
          </p>
          
          <div className="w-full max-w-[320px] space-y-4">
            <input 
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={`Type "${shop?.shop_name || "shop name"}" to confirm`}
              className="w-full bg-transparent border border-[var(--stitch)] rounded-[6px] px-4 py-3 font-[family-name:var(--font-sans)] text-[13px] text-[var(--ink-dark)] text-center focus:outline-none focus:border-[var(--fabric-red)] transition-colors placeholder:text-[var(--ink-faint)]"
            />
            <button 
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== shop?.shop_name}
              className="w-full h-[46px] rounded-[6px] border border-[var(--fabric-red)] text-[var(--fabric-red)] font-[family-name:var(--font-sans)] text-[14px] font-medium transition-colors hover:bg-[rgba(139,26,26,0.08)] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Delete my atelier
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
