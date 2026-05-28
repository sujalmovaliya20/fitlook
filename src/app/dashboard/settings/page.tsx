"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, updatePassword, deleteAccount } from "./actions";
import { Camera, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  
  const [logoUploading, setLogoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleProfileUpdate = async (formData: FormData) => {
    const res = await updateProfile(formData);
    if (res.error) alert(res.error);
    else alert("Profile updated successfully");
  };

  const handlePasswordUpdate = async (formData: FormData) => {
    const res = await updatePassword(formData);
    if (res.error) alert(res.error);
    else alert("Password updated successfully");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure? This action is irreversible!")) {
      const res = await deleteAccount();
      if (res.error) alert(res.error);
      else window.location.href = "/auth/login";
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
      
      // Update shops table
      await supabase.from("shops").update({ logo_url: data.publicUrl }).eq("id", shop.id);
      setShop({ ...shop, logo_url: data.publicUrl });
      alert("Logo updated!");
    } catch (err: any) {
      alert("Error uploading logo: " + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your shop profile and security preferences.</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Info */}
        <Card>
          <CardHeader>
            <CardTitle>Shop Profile</CardTitle>
            <CardDescription>Update your shop details and logo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border bg-muted flex items-center justify-center overflow-hidden group">
                {shop?.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={shop.logo_url} alt="Shop Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-muted-foreground">
                    {shop?.shop_name?.charAt(0) || "S"}
                  </span>
                )}
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                />
              </div>
              <div>
                <h3 className="font-medium">Shop Logo</h3>
                <p className="text-sm text-muted-foreground mb-2">Click the image to upload a new logo.</p>
              </div>
            </div>

            <form action={handleProfileUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="shopName">Shop Name</Label>
                <Input id="shopName" name="shopName" defaultValue={shop?.shop_name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input id="ownerName" name="ownerName" defaultValue={shop?.owner_name} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" name="mobile" defaultValue={shop?.mobile} required />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Permanently delete your shop and all associated data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
