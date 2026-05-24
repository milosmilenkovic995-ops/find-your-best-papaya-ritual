import Header from "@/components/Header";
import MiddleSection from "@/components/MiddleSection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSection
        title={
          <>
            Answer a couple of questions <br className="hidden md:block" />and get a <strong>$10</strong> coupon for your next order
          </>
        }
        subtitle={
          <>
            This only takes around 30 seconds. Your feedback helps us make your shopping experience better, and as a thank-you for your valuable time, you&rsquo;ll receive <strong>$10 OFF</strong> your next order.
          </>
        }
      />
      <Footer />
    </div>
  );
}
