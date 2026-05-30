'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Clock, Award, BookOpen, CheckCircle } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

interface CourseDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  totalDurationMinutes: number;
  price: number;
  enrolledCount: number;
  isCertified: boolean;
  lessons: { title: string; durationMinutes: number }[];
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/training/${slug}`);
        setCourse(data.course);
        setEnrolled(data.isEnrolled || false);
      } catch {
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  const enroll = async () => {
    try {
      await api.post(`/training/${course?._id}/enroll`);
      toast.success('Enrolled successfully!');
      setEnrolled(true);
    } catch {
      toast.error('Failed to enroll');
    }
  };

  if (loading) return <PublicLayout><SkeletonPulse /></PublicLayout>;
  if (!course) return <PublicLayout><div className="text-center py-12 text-slate-500">Course not found</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-brand-orange uppercase">{course.category}</span>
              <h1 className="mt-2 text-3xl font-bold text-brand-navy">{course.title}</h1>
              <p className="mt-2 text-slate-500">{course.description}</p>
            </div>

            <Card className="p-6">
              <h3 className="mb-4 font-bold text-brand-navy">Course Content</h3>
              <div className="space-y-3">
                {course.lessons.map((lesson, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">{i + 1}</span>
                      <p className="text-sm font-medium">{lesson.title}</p>
                    </div>
                    <span className="text-xs text-slate-500">{lesson.durationMinutes} min</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-6">
              <p className="text-3xl font-bold text-brand-orange">{course.price === 0 ? 'Free' : `₹${course.price}`}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {Math.ceil(course.totalDurationMinutes / 60)} hours</div>
                <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {course.lessons.length} lessons</div>
                <div className="flex items-center gap-2"><Award className="h-4 w-4" /> {course.isCertified ? 'Certificate included' : 'No certificate'}</div>
              </div>
              {enrolled ? (
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 py-3 text-green-700 font-medium">
                  <CheckCircle className="h-5 w-5" /> Enrolled
                </div>
              ) : (
                <Button className="mt-6 w-full" onClick={enroll}>{course.price === 0 ? 'Enroll for Free' : 'Buy Now'}</Button>
              )}
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
