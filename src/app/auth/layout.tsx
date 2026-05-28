import { Scissors } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form Section */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Scissors className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">
              FitLook
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Decorative Section */}
      <div className="hidden lg:block relative bg-primary flex items-center justify-center p-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="text-3xl font-bold mb-6">Modernize your trial room</h2>
          <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
            Join hundreds of Indian fabric shops leveraging FitLook&apos;s AI technology to show customers exactly how unstitched fabric will look. Increase your sales conversions today.
          </p>
          <div className="bg-background/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-sm italic">
              &quot;FitLook completely changed how we sell sarees and lehengas. Our customers are amazed, and our returns dropped by 40%.&quot;
            </p>
            <p className="mt-4 text-sm font-semibold">— Rajesh K., Silk Emporium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
