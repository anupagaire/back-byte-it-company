import LegalLayout from '@/components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 24, 2026">
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
          <p className="leading-relaxed">
            At <strong>Back ByteTech</strong>, we collect information that you provide directly to us when you inquire about our IT services, including cloud solutions and web development.
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Name and contact details</li>
            <li>Project requirements and business information</li>
            <li>Technical data (IP addresses, browser types)</li>
          </ul>
        </div>

        <div className="p-6 bg-[#69c8e4]/10 rounded-2xl border border-[#69c8e4]/20">
          <h2 className="text-xl font-bold mb-2 text-[#4ba8c2]">How we use your data</h2>
          <p className="text-sm">
            We use your data strictly to improve our service delivery and communicate project milestones. We never sell your data to third-party marketers.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">2. Data Security</h2>
          <p className="leading-relaxed">
            As an IT company, security is our priority. We implement industry-standard encryption to protect your sensitive business logic and personal information.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}