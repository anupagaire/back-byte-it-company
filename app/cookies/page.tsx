import LegalLayout from '@/components/LegalLayout';

export default function CookiePage() {
  return (
    <LegalLayout title="Cookie Policy" lastUpdated="May 15, 2026">
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">What are Cookies?</h2>
          <p className="leading-relaxed">
            Cookies are small text files stored on your device to help us provide a better user experience. They allow us to remember your preferences and analyze how you interact with our IT services website.
          </p>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Purpose</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-bold">Essential</td>
                <td className="px-6 py-4 text-sm text-gray-600">Necessary for the website to function (e.g., security, sessions).</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-bold">Analytical</td>
                <td className="px-6 py-4 text-sm text-gray-600">Helps us understand how many visitors we have and which pages are popular.</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-bold">Functional</td>
                <td className="px-6 py-4 text-sm text-gray-600">Remembers your settings like Dark Mode or Language.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Managing Your Cookies</h2>
          <p className="leading-relaxed">
            Most web browsers allow you to control cookies through their settings. You can choose to block all cookies, but please note that some parts of our website may not function correctly if you do.
          </p>
        </div>

        <div className="p-6 bg-[#69c8e4]/10 rounded-2xl border border-[#69c8e4]/20">
          <h2 className="text-xl font-bold mb-2 text-[#4ba8c2]">Third-Party Cookies</h2>
          <p className="text-sm">
            We use tools like Google Analytics and LinkedIn Insight Tags to measure our marketing performance. These services set their own cookies according to their respective policies.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}