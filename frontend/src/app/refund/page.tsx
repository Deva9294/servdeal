import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy - ServDeal",
  description: "Understand ServDeal&apos;s refund policy and money-back guarantee for customer satisfaction.",
};

export default function RefundPolicyPage() {
  return (
    <main className="flex-1 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12">Refund Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: May 26, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section className="p-6 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-lg font-semibold text-secondary">We stand behind our services. If you&apos;re not satisfied, we guarantee your money back.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Money-Back Guarantee</h2>
            <p>If you&apos;re not satisfied with the quality of service provided, we offer a full refund without any questions asked.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Refund Eligibility</h2>
            <p className="mb-4">You are eligible for a refund if the service professional did not show up, service quality was below standards, or work was not completed as promised.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">3. Refund Process</h2>
            <p>Contact our support team within 7 days. Our team will review and respond within 24 hours. Once approved, refund will be processed within 5-7 business days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Contact Us</h2>
            <div className="p-4 bg-gray-light rounded-lg">
              <p><strong>Email:</strong> refunds@servdeal.in</p>
              <p><strong>Phone:</strong> +91 9294899787</p>
              <p><strong>Hours:</strong> 24/7 support available</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
