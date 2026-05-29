import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/Button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <p className="text-8xl font-bold text-brand-orange">404</p>
        <h1 className="mt-4 text-3xl font-bold text-brand-navy">Page Not Found</h1>
        <p className="mt-3 max-w-md text-slate-600">
          The page you are looking for might have moved or does not exist. Let us get you back to booking trusted home
          services.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button size="lg">
              <Home className="h-5 w-5" />
              Go Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="secondary" size="lg">
              <Search className="h-5 w-5" />
              Browse Services
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
