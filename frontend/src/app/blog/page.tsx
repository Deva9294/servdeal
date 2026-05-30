'use client';

import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function BlogPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data.data;
    },
  });

  return (
    <PublicLayout>
      <PageHero
        title="ServDeal"
        highlight="Blog"
        description="Practical advice for Indian homeowners — maintenance, safety, and smarter booking."
      />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {isLoading && <p className="text-sm text-slate-500">Loading articles...</p>}
          {!isLoading && !posts?.length && <p className="text-sm text-slate-500">No articles yet.</p>}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(posts || []).map((post: { slug: string; image?: string; category: string; title: string; excerpt: string; author?: string; createdAt?: string; readTime?: string }) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 text-6xl">
                    {post.image || '📝'}
                  </div>
                  <div className="p-6">
                    <Badge status="pending" className="bg-orange-100 text-orange-700">
                      {post.category || 'General'}
                    </Badge>
                    <h2 className="mt-3 text-lg font-semibold text-brand-navy line-clamp-2">{post.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-slate-500">
                      {post.author || 'ServDeal'} · {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} · {post.readTime || '3 min'}
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
