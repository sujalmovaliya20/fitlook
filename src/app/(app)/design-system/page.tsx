import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { FabricCard } from "@/components/tailor/FabricCard";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { MeasurementBadge } from "@/components/tailor/MeasurementBadge";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";

export default function DesignSystemPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div>
        <h1 className="text-4xl font-[family-name:var(--font-serif)] italic text-[var(--ink-dark)] mb-2">Tailor's Atelier</h1>
        <p className="text-[var(--ink-light)] font-[family-name:var(--font-sans)]">Design System Components Overview</p>
      </div>

      <MeasureDivider />

      <section className="space-y-6">
        <h2 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--ink-dark)]">Typography & Badges</h2>
        <div className="grid grid-cols-2 gap-8">
          <FabricCard className="flex flex-col gap-4 justify-center items-center">
            <ChalkLabel withDash>Sleeve Length</ChalkLabel>
            <MeasurementBadge value="24.5" unit="in" size="lg" />
          </FabricCard>
          <FabricCard className="flex flex-col gap-4 justify-center items-center">
            <ChalkLabel withDash>Total Orders</ChalkLabel>
            <MeasurementBadge value="1,240" size="md" />
          </FabricCard>
        </div>
      </section>

      <MeasureDivider />

      <section className="space-y-6">
        <h2 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--ink-dark)]">Interactive Elements</h2>
        <div className="flex gap-4">
          <ThreadButton>Start Measurement</ThreadButton>
          <ThreadButton variant="ghost">View Details</ThreadButton>
          <ThreadButton isLoading>Generating Pattern</ThreadButton>
        </div>
      </section>

      <MeasureDivider />

      <section className="space-y-6">
        <h2 className="text-2xl font-[family-name:var(--font-serif)] text-[var(--ink-dark)]">Fabric Colors</h2>
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--fabric-red)] border border-[var(--stitch-strong)] shadow-sm"></div>
          <div className="w-16 h-16 rounded-full bg-[var(--fabric-teal)] border border-[var(--stitch-strong)] shadow-sm"></div>
          <div className="w-16 h-16 rounded-full bg-[var(--fabric-cream)] border border-[var(--stitch-strong)] shadow-sm"></div>
          <div className="w-16 h-16 rounded-full bg-[var(--thread-gold)] border border-[var(--stitch-strong)] shadow-sm"></div>
        </div>
      </section>
    </div>
  );
}
