import type { Metadata } from 'next';
import { LegalPage } from '@/components/content/LegalPage';

export const metadata: Metadata = { title: 'Safety Guidelines' };

export default function SafetyPage() {
  return (
    <LegalPage title="Safety Guidelines">
      <p>
        ServDeal is committed to safe experiences for customers, Partners, and communities across India.
      </p>
      <h2>For Customers</h2>
      <ul>
        <li>Book only through the official ServDeal app or website — avoid cash deals with unverified individuals.</li>
        <li>Verify Partner ID badge and profile photo before allowing entry.</li>
        <li>Keep valuables secured and supervise work in children&apos;s rooms.</li>
        <li>Report harassment, theft, or safety concerns immediately via in-app SOS or call support.</li>
      </ul>
      <h2>For Partners</h2>
      <ul>
        <li>Wear ID badge and use insulated tools for electrical work.</li>
        <li>Decline jobs in unsafe premises and notify ServDeal operations.</li>
        <li>Follow chemical handling guidelines for pest control and cleaning.</li>
        <li>Do not solicit off-platform payments — it voids insurance support.</li>
      </ul>
      <h2>COVID & Health</h2>
      <p>
        Partners are encouraged to use masks when requested and carry sanitizer. Customers may ask for contactless
        handoffs when unwell.
      </p>
      <h2>Emergencies</h2>
      <p>
        For life-threatening situations, call 112 or local emergency services first, then inform ServDeal support for
        follow-up assistance.
      </p>
    </LegalPage>
  );
}
