import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BLOG_POSTS } from '@/data/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Home care tips, safety guides, and provider stories from the ServDeal team.',
};

export default function BlogPage() {
  return (
    <PublicLayout>
      <PageHero
        title="ServDeal"
        highlight="Blog"
        description="Practical advice for Indian homeowners — maintenance, safety, and smarter booking."
      />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 text-6xl">
                    {post.image}
                  </div>
                  <div className="p-6">
                    <Badge status="pending" className="bg-orange-100 text-orange-700">
                      {post.category}
                    </Badge>
                    <h2 className="mt-3 text-lg font-semibold text-brand-navy line-clamp-2">{post.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-slate-500">
                      {post.author} · {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {post.readTime}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
