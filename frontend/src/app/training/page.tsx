'use client';

import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { GraduationCap, Clock, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  level: string;
  image: string;
  totalDurationMinutes: number;
  price: number;
  enrolledCount: number;
  isCertified: boolean;
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/training');
      setCourses(data.courses || []);
    } catch {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? courses : courses.filter((c) => c.category === filter);
  const categories = ['all', 'skill', 'safety', 'business', 'technical', 'soft_skills'];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-brand-navy to-blue-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <GraduationCap className="h-8 w-8 text-brand-orange" />
          </div>
          <h1 className="text-3xl font-bold">Training & Certification Center</h1>
          <p className="mt-2 text-white/70">Upskill yourself with certified courses and earn verification badges</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12">

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === cat ? 'bg-brand-orange text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat === 'all' ? 'All Courses' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonPulse />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <Card key={course._id} className="overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-white/80" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-brand-orange uppercase">{course.category}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{course.level}</span>
                  </div>
                  <h3 className="mt-2 font-bold text-brand-navy">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">{course.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {Math.ceil(course.totalDurationMinutes / 60)} hrs</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.enrolledCount} enrolled</span>
                    {course.isCertified && <span className="flex items-center gap-1"><Award className="h-3 w-3 text-green-500" /> Certified</span>}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-brand-orange">{course.price === 0 ? 'Free' : `₹${course.price}`}</p>
                    <Link href={`/training/${course.slug}`}>
                      <Button size="sm">View Course</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
