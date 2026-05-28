"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const shopName = formData.get("shopName") as string;
  const ownerName = formData.get("ownerName") as string;
  const mobile = formData.get("mobile") as string;

  const { error } = await supabase
    .from("shops")
    .update({ shop_name: shopName, owner_name: ownerName, mobile })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard", "layout");
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Note: Due to RLS and foreign key constraints, usually deleting auth.users cascades, 
  // but clients can't delete auth.users without the service key.
  // We'll delete the shops row which will log them out and effectively 'disable' their dashboard,
  // but true deletion requires admin API.
  
  const { error } = await supabase.from("shops").delete().eq("id", user.id);
  
  if (error) return { error: error.message };

  await supabase.auth.signOut();
  return { success: true };
}
