import type { Metadata } from "next";
import Header from "@/components/Header";
import MiddleSectionV2 from "@/components/MiddleSectionV2";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help us to serve you better 2",
};

export default function PageV2() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSectionV2
        title={
          <>
            Answer a couple of questions <br className="hidden md:block" />and get a <strong>$10 coupon</strong> for your next order
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
