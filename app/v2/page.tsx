import type { Metadata } from "next";
import Header from "@/components/Header";
import MiddleSectionV2 from "@/components/MiddleSectionV2";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Help us to serve you better",
};

export default async function PageV2({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; seg?: string; s?: string }>;
}) {
  const sp = await searchParams;
  const initialSegment = String(sp.segment || sp.seg || sp.s || "");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <MiddleSectionV2
        initialSegment={initialSegment}
        title={
          <>
            Answer <strong>3 quick questions</strong> <br className="hidden md:block" />and get a <strong>$10 coupon</strong> for your next order
          </>
        }
        subtitle={
          <>
            Just 3 questions, around 30 seconds. Your feedback helps us fix what&rsquo;s not working on our website, and as a thank-you for your valuable time, you&rsquo;ll receive <strong>$10 OFF</strong> your next order.
          </>
        }
      />
      <Footer />
    </div>
  );
}
