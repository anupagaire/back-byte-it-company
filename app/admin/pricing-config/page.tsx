import { PrismaClient }      from "@prisma/client";
import PricingConfigEditor   from "@/components/admin/PricingConfigEditor";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function PricingConfigPage() {
  const services = await prisma.service.findMany({
    where:   { published: true },
    orderBy: { order: "asc" },
    include: { pricingConfig: true },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pricing Configuration</h1>
        <p className="text-slate-400 text-sm mt-1">
          Each service card from your Services page. Set pricing rates per service.
        </p>
      </div>
      <PricingConfigEditor services={JSON.parse(JSON.stringify(services))} />
    </div>
  );
}