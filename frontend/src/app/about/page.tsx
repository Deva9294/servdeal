import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About ServDeal - India's Trusted Home Services Platform",
  description: "Learn about ServDeal's mission to connect verified professionals with customers. Founded by Ravi Pradhan, trusted by 10,000+ customers across India.",
  keywords: "about servdeal, home services platform, verified professionals, ravi pradhan",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-6">About <span className="text-primary">ServDeal</span></h1>
            <p className="text-xl text-gray-600 leading-relaxed">Building trust, one service at a time. Our mission is to connect verified professionals with customers who deserve quality service and transparency.</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">ServDeal was founded with a simple belief: finding reliable home service professionals should be easy, transparent, and trustworthy. Founded by Ravi Pradhan, ServDeal has grown from a vision into a platform trusted by over 10,000 customers across India.</p>
              <p className="text-lg text-gray-700 leading-relaxed">What started as a small initiative to solve a common problem has evolved into a comprehensive marketplace connecting customers with verified, experienced professionals across 20+ service categories.</p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">To revolutionize the home services industry by creating a transparent, secure, and customer-centric platform that empowers both professionals and customers.</p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-2">Trust</h3>
                  <p className="text-gray-600">Every professional is thoroughly verified. Your safety is our priority.</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-2">Quality</h3>
                  <p className="text-gray-600">We maintain the highest standards of service excellence.</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-2">Transparency</h3>
                  <p className="text-gray-600">Clear pricing, honest reviews, and transparent communication always.</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-bold text-primary mb-2">Innovation</h3>
                  <p className="text-gray-600">Using technology to make services more accessible and convenient.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience better service?</h2>
          <p className="text-lg text-gray-100 mb-8">Join thousands of satisfied customers using ServDeal.</p>
          <Link href="/services" className="inline-block px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors">
            Book a Service Now
          </Link>
        </div>
      </section>
    </main>
  );
}
