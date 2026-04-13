import Header from "@/components/Header";
import MiddleSection from "@/components/MiddleSection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSection
        title="Find Your Best Papaya Ritual"
        subtitle="Answer 4 quick questions to get a personalized way to enjoy papaya powder, plus 3 simple papaya recipe ideas matched to your routine."
      />
      <Footer />
    </div>
  );
}