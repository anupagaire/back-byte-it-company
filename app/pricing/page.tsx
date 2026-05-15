import PricingCalculator from "@/components/pricing/PricingCalculator";
import type { Metadata }  from "next";

export const metadata: Metadata = {
  title: "Project Pricing Calculator | Instant Estimate",
  description:
    "Get an instant, personalised price estimate for your web app, mobile app, cloud infrastructure, or digital marketing campaign.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#080c14] py-16 px-4">
      <PricingCalculator />
    </main>
  );
}