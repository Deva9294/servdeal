import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ServDeal",
  description: "Read ServDeal&apos;s privacy policy to understand how we protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-secondary mb-12">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: May 26, 2026</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">1. Introduction</h2>
            <p>At ServDeal Solution Pvt Ltd, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">2. Information We Collect</h2>
            <p className="mb-4">We collect information in the following ways:</p>
            <div className="space-y-3 ml-4">
              <p><strong>Personal Information:</strong> Name, email address, phone number, address, and payment information.</p>
              <p><strong>Service Information:</strong> Details about services you request, booking history, and preferences.</p>
              <p><strong>Technical Information:</strong> IP address, browser type, device information, and usage patterns.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">3. How We Use Your Information</h2>
            <p>We use your information for processing bookings, delivering services, communicating with you, and improving our platform.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">4. Data Security</h2>
            <p>We implement comprehensive security measures including encryption and secure servers to protect your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-secondary mb-4">5. Contact Us</h2>
            <div className="p-4 bg-gray-light rounded-lg">
              <p><strong>Email:</strong> privacy@servdeal.in</p>
              <p><strong>Phone:</strong> +91 9294899787</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
