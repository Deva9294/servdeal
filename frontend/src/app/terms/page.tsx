import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - ServDeal",
  description: "Read ServDeal&apos;s Terms & Conditions to understand the rules governing the use of our platform.",
};

export default function TermsPage() {
  return (
    <main className="flex-1 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last Updated: May 26, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using ServDeal&apos;s website and services, you accept and agree to be bound by the terms of this agreement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Use of Service</h2>
            <p>You agree to use this service only for lawful purposes. You must be at least 18 years old to use this service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">3. Cancellation Policy</h2>
            <p>Cancellation 24 hours before: Full refund. Cancellation 12-24 hours before: 50% refund. Less than 12 hours: No refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Limitation of Liability</h2>
            <p>ServDeal is provided as is without warranties. Our maximum liability is limited to the amount paid for the service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Contact Us</h2>
            <div className="p-4 bg-gray-light rounded-lg">
              <p><strong>Email:</strong> legal@servdeal.in</p>
              <p><strong>Phone:</strong> +91 9294899787</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
