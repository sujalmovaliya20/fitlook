"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const shopName = formData.get("shopName") as string;
  const ownerName = formData.get("ownerName") as string;
  const mobile = formData.get("mobile") as string;

  // 1. Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. Insert into shops table
  if (authData.user) {
    const { error: dbError } = await supabase.from("shops").insert({
      id: authData.user.id,
      shop_name: shopName,
      owner_name: ownerName,
      mobile: mobile,
      email: email,
    });

    if (dbError) {
      // In a real app we'd probably want to handle this gracefully or delete the auth user
      console.error("Error inserting shop:", dbError);
      return { error: "Failed to create shop profile." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
