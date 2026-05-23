import Header from "@/components/Header";
import MiddleSectionV2 from "@/components/MiddleSectionV2";
import Footer from "@/components/Footer";

export default function PageV2() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSectionV2
        title="Get $10 off your next order"
        subtitle="Help us serve you better — answer 5 quick questions (about 60 seconds) and we'll send your $10 coupon the moment you finish. Your feedback shapes what we fix next."
      />
      <Footer />
    </div>
  );
}
