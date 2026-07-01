'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

const pages = ['home', 'about', 'terms', 'privacy', 'faq'];

interface CMSContent {
  _id: string;
  slug: string;
  title: string;
  metaTitle: string;
  content: string;
  imageUrl?: string;
}

export default function AdminCMSPage() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', metaTitle: '', content: '', imageUrl: '' });

  const loadContent = async (slug: string) => {
    setLoading(true);
    setSelectedPage(slug);
    try {
      const { data } = await api.get(`/cms/${slug}`);
      setForm({
        title: data.data?.title || '',
        metaTitle: data.data?.metaTitle || '',
        content: data.data?.content || '',
        imageUrl: data.data?.imageUrl || '',
      });
    } catch {
      setForm({ title: '', metaTitle: '', content: '', imageUrl: '' });
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      await api.put(`/cms/${selectedPage}`, form);
      toast.success('Content saved successfully');
      loadContent(selectedPage);
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const pageLabels: Record<string, string> = {
    home: 'Home Banner',
    about: 'About Us',
    terms: 'Terms',
    privacy: 'Privacy',
    faq: 'FAQ Section',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">CMS Editor</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Pages</h3>
          <ul className="mt-4 space-y-2">
            {pages.map((p) => (
              <li key={p}>
                <button 
                  onClick={() => loadContent(p)}
                  className={`w-full rounded-lg border p-3 text-left text-sm hover:border-brand-orange ${selectedPage === p ? 'border-brand-orange bg-orange-50' : ''}`}
                >
                  {pageLabels[p]}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-4 p-5">
          <h3 className="font-semibold">Edit Content</h3>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-32" />
              <Skeleton className="h-10" />
            </div>
          ) : (
            <>
              <Input 
                placeholder="Page title" 
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input 
                placeholder="Meta title" 
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              />
              <textarea 
                className="w-full rounded-xl border p-3 text-sm" 
                rows={6} 
                placeholder="HTML content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <Input 
                placeholder="Banner image URL" 
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <Button onClick={saveContent} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
