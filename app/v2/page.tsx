import Header from "@/components/Header";
import MiddleSectionV2 from "@/components/MiddleSectionV2";
import Footer from "@/components/Footer";

export default function PageV2() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSectionV2
        title="$10 off — our way of saying thanks"
        subtitle="5 questions, about 60 seconds. Tell us what's working and what's not — we'll use what you say to fix what matters most to you. Your coupon shows up the moment you finish."
      />
      <Footer />
    </div>
  );
}
