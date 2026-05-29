import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Chatbot } from '@/components/ai/Chatbot';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Chatbot />
    </>
  );
}
