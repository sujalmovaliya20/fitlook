"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Share2, Download, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

type Trial = {
  id: string;
  customer_name: string;
  garment_type: string;
  fabric_type: string;
  status: string;
  result_image_url: string;
  fabric_image_url: string;
};

export default function ResultPage() {
  const params = useParams();
  const trialId = params.trialId as string;
  const supabase = createClient();
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function fetchTrial() {
      if (!trialId) return;
      const { data, error } = await supabase
        .from("trials")
        .select("*")
        .eq("id", trialId)
        .single();
      
      if (!error && data) {
        setTrial(data);
        if (data.status === "generated" || data.status === "failed") {
          clearInterval(interval);
        }
      }
      setLoading(false);
    }

    fetchTrial();

    // Poll every 5 seconds if processing
    interval = setInterval(fetchTrial, 5000);

    return () => clearInterval(interval);
  }, [trialId, supabase]);

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!trial) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Trial not found</h2>
        <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    );
  }

  if (trial.status === "pending" || trial.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 max-w-md mx-auto text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border">
            ✨
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Stitching your virtual garment...</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while our AI models drape the {trial.fabric_type || 'fabric'} onto {trial.customer_name}. This usually takes about 30-60 seconds.
          </p>
        </div>
      </div>
    );
  }

  if (trial.status === "failed") {
    return (
      <div className="max-w-md mx-auto mt-12">
        <Card className="border-destructive/50 bg-destructive/5 text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Generation Failed</CardTitle>
            <CardDescription>Something went wrong while generating the AI trial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">The AI model couldn't process this combination correctly.</p>
            <Link href="/dashboard/new-trial" className="block w-full">
              <Button className="w-full"><RefreshCcw className="w-4 h-4 mr-2" /> Try Again</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    const text = encodeURIComponent(`Check my virtual look! ${trial.result_image_url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(trial.result_image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitlook_trial_${trial.customer_name.replace(/\s+/g, '_')}.webp`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to download image. You can right-click and save it.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Virtual Trial Result</h1>
          <p className="text-muted-foreground">{trial.customer_name} • {trial.garment_type}</p>
        </div>
        {trial.fabric_image_url && (
          <div className="w-12 h-12 rounded-md overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={trial.fabric_image_url} alt="Fabric" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="bg-muted/30 rounded-xl border overflow-hidden flex items-center justify-center p-4 min-h-[60vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={trial.result_image_url} 
          alt="Generated Result" 
          className="max-h-[75vh] w-auto max-w-full rounded-md shadow-sm object-contain bg-black/5"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button onClick={handleShare} className="bg-[#25D366] hover:bg-[#128C7E] text-white">
          <Share2 className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </Button>
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </Button>
      </div>
      
      <div className="flex gap-4 pt-4 border-t">
        <Link href="/dashboard/new-trial" className="flex-1">
          <Button variant="secondary" className="w-full">Try Another Fabric</Button>
        </Link>
        <Link href="/dashboard" className="flex-1">
          <Button variant="ghost" className="w-full"><Home className="w-4 h-4 mr-2" /> Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
