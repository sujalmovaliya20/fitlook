import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Smartphone, Sparkles, ArrowRight, Scissors } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">FitLook</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="hidden sm:flex">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Let your customers try before they buy — <span className="text-accent">without stitching a single thread.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Transform your Indian ethnic wear shop. FitLook&apos;s AI virtual trial room shows your customers exactly how that unstitched fabric will look on them in seconds. Increase sales, reduce returns, and modernize your retail experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto group">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features / How it Works */}
        <section id="features" className="py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three Simple Steps to Higher Conversions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No complex setups. Designed specifically for the fast-paced environment of Indian fabric and saree retailers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 px-6 pb-8 space-y-6 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">1. Snap fabric photo</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Capture a quick picture of any unstitched fabric, saree, or lehenga material right on your store counter.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 px-6 pb-8 space-y-6 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Smartphone className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">2. Click customer photo</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Take a photo of your customer in the store or have them upload a selfie. Our AI ensures complete privacy.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background border-none shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Sparkles className="h-5 w-5 text-accent opacity-50" />
                </div>
                <CardContent className="pt-8 px-6 pb-8 space-y-6 text-center flex flex-col items-center">
                  <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">3. AI generates the look</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Watch their eyes light up as FitLook instantly shows them wearing the perfectly stitched outfit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/10"></div>
          <div className="container relative mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to bring your fabric retail into the future?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join hundreds of boutique owners across India who are closing sales faster and providing a magical shopping experience.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base bg-background text-foreground hover:bg-background/90">
                Start your 14-day free trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-primary">FitLook</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitLook Retail Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
