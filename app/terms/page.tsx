// app/terms/page.tsx
import LegalLayout from '@/components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 15, 2026">
      <section className="space-y-8">
        <p className="text-lg text-gray-700 italic">
          By engaging with Back ByteTech for IT services, you agree to the following terms and conditions.
        </p>

        <div>
          <h2 className="text-2xl font-bold mb-4">1. Scope of Services</h2>
          <p className="leading-relaxed">
            Back ByteTech provides custom software development, cloud infrastructure, and cybersecurity services. Each project is governed by a specific Statement of Work (SOW). Any changes to the project scope must be agreed upon in writing and may incur additional costs.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">2. Payment Terms</h2>
          <p className="leading-relaxed">
            Invoices are issued according to the project milestones defined in the SOW. Payments are due within 15 days of the invoice date. Late payments may result in a temporary suspension of development services.
          </p>
        </div>

        <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
          <h2 className="text-xl font-bold mb-2 text-yellow-800">Intellectual Property</h2>
          <p className="text-sm text-yellow-700">
            Upon full and final payment, the client owns the specific custom code built for them. However, Back ByteTech retains ownership of pre-existing libraries, tools, and general knowledge used during development.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">3. Limitation of Liability</h2>
          <p className="leading-relaxed">
            While we strive for 100% security and uptime, Back ByteTech is not liable for any indirect, incidental, or consequential damages resulting from server downtime, third-party API failures, or cyber-attacks.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}