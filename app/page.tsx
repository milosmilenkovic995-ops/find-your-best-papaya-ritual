import Header from "@/components/Header";
import MiddleSection from "@/components/MiddleSection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSection
        title="Find Your Best Amla Ritual"
        subtitle="Answer 4 quick questions to get a personalized way to enjoy Amla powder, plus 3 simple recipe ideas matched to your routine."
      />
      <Footer />
    </div>
  );
}