"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-muted-foreground">Start your 14-day free trial today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input id="shopName" name="shopName" placeholder="Silk Emporium" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" name="ownerName" placeholder="Rajesh K." required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" name="mobile" type="tel" placeholder="+91 98765 43210" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="shop@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
