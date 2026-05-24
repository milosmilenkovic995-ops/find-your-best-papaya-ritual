import type { Metadata } from "next";
import Header from "@/components/Header";
import MiddleSection from "@/components/MiddleSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help us to serve you better",
};

export default async function Page({
  searchParams,
}: {
  // Includes the value injected by middleware when the visitor arrives via /3, /18, /0.
  searchParams: Promise<{ segment?: string; seg?: string; s?: string }>;
}) {
  const sp = await searchParams;
  const initialSegment = String(sp.segment || sp.seg || sp.s || "");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSection
        initialSegment={initialSegment}
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
