import Header from "@/components/Header";
import MiddleSection from "@/components/MiddleSection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSection
        title="Get $10 off your next order"
        subtitle="Help us serve you better — answer 5 quick questions (about 60 seconds) and we'll send your $10 coupon the moment you finish. Your feedback shapes what we fix next."
      />
      <Footer />
    </div>
  );
}
