
import { getPricingLeads, getPricingStats } from "@/app/actions/pricing";
import LeadsTable  from "@/components/admin/LeadsTable";
import StatsCards from "@/components/admin/StatsCards";

interface PageProps {
  searchParams: { page?: string };
}

export const dynamic = "force-dynamic";

export default async function PricingLeadsPage({ searchParams }: PageProps) {
  const page  = Number(searchParams.page ?? 1);
  const [{ leads, total, pages }, stats] = await Promise.all([
    getPricingLeads(page, 20),
    getPricingStats(),
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Pricing Leads</h1>
          <p className="text-slate-400 text-sm mt-1">
            {total} total leads captured via the pricing calculator
          </p>
        </div>
        <a
          href="/pricing"
          className="px-4 py-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-black font-medium hover:bg-sky-500/20 transition-colors"
        >
          View Calculator 
        </a>
      </div>

      <StatsCards stats={stats} />
      <LeadsTable leads={leads} page={page} pages={pages} />
    </div>
  );
}