import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { BLOG_POSTS, getBlogBySlug } from '@/data/blog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <PublicLayout>
      <article className="pb-20">
        <div className="gradient-hero border-b border-slate-100 py-12">
          <div className="mx-auto max-w-3xl px-4 lg:px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brand-orange hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
            <Badge status="pending" className="mt-6 bg-orange-100 text-orange-700">
              {post.category}
            </Badge>
            <h1 className="mt-4 text-3xl font-bold text-brand-navy md:text-4xl">{post.title}</h1>
            <p className="mt-4 text-slate-600">
              By {post.author} · {new Date(post.date).toLocaleDateString('en-IN', { dateStyle: 'long' })} · {post.readTime} read
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
          <div className="mb-10 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50 text-8xl">
            {post.image}
          </div>
          <div className="prose prose-slate max-w-none">
            {post.content.map((para, i) => (
              <p key={i} className="mb-4 text-slate-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-brand-navy p-8 text-center text-white">
            <h2 className="text-xl font-bold">Need help at home?</h2>
            <p className="mt-2 text-white/70">Book a verified professional on ServDeal in minutes.</p>
            <Link href="/services" className="mt-4 inline-block">
              <Button>Explore Services</Button>
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="text-lg font-bold text-brand-navy">More articles</h3>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="font-medium text-brand-orange hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
