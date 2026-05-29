export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/atelier_auth_bg.png')` }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[440px]">
        {children}
      </div>
      
      {/* PAGE FOOTER */}
      <div className="relative z-10 mt-8 text-center flex flex-col items-center gap-1">
        <span className="font-[family-name:var(--font-serif)] italic text-[#E8DCC8] text-[14px]">FitLook</span>
        <span className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[#E8DCC8]/70">Crafted for Indian fabric artisans</span>
      </div>
    </div>
  );
}
