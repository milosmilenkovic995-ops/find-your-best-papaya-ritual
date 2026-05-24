"use client";
import { useEffect, useState, type ReactNode } from "react";
import confetti from "canvas-confetti";

import { questions, COUPON_CODE, type Question } from "@/lib/questions";

type MiddleSectionProps = { title: ReactNode; subtitle: ReactNode };

const COUPON = COUPON_CODE;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function CouponBox() {
  return (
    <div className="mx-auto mb-6 max-w-md rounded-2xl border-2 border-dashed border-green-700 bg-green-50 px-6 py-5 text-center">
      <div className="mb-1 text-xs font-extrabold tracking-[0.18em] text-green-700">✨ YOUR $10 OFF CODE ✨</div>
      <div className="text-3xl font-extrabold tracking-wider text-slate-900">{COUPON}</div>
    </div>
  );
}

// Subtle confetti burst — fires when the survey reaches the final step.
function fireConfetti() {
  const duration = 6000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 70, ticks: 60, zIndex: 50, gravity: 1, scalar: 0.8 };
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) { clearInterval(interval); return; }
    const particleCount = 25 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() * 0.2 + 0.1 } });
    confetti({ ...defaults, particleCount, origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() * 0.2 + 0.1 } });
  }, 300);
}

const SESSION_STORAGE_KEY = "znf_session_v1";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = (window.crypto && typeof window.crypto.randomUUID === "function")
        ? window.crypto.randomUUID()
        : `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export default function MiddleSection({ title, subtitle }: MiddleSectionProps) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submittedWithEmail, setSubmittedWithEmail] = useState<boolean>(false);

  const [multi, setMulti] = useState<Record<string, string[]>>({});
  const [single, setSingle] = useState<Record<string, string>>({});
  const [textAns, setTextAns] = useState<Record<string, string>>({});
  const [freeTexts, setFreeTexts] = useState<Record<string, string>>({});

  const [email, setEmail] = useState("");
  const [klid, setKlid] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSessionId(getOrCreateSessionId());
    const p = new URLSearchParams(window.location.search);
    const e = p.get("email") || "";
    const k = p.get("klid") || p.get("kl_id") || "";
    if (e) setEmail(e);
    if (k) setKlid(k);
  }, []);

  const totalQ = questions.length;
  const totalSteps = totalQ + 1; // 8 dots total
  const isCouponStep = step === totalSteps; // step 8

  // Subtle 3-second confetti burst when the visitor reaches the final/coupon step.
  useEffect(() => {
    if (!isCouponStep) return;
    fireConfetti();
  }, [isCouponStep]);
  const currentQ = step <= totalQ ? questions[step - 1] : null;

  const scrollTop = () => { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };

  const toggleMulti = (qid: string, aid: string) => {
    setMulti((prev) => {
      const set = new Set(prev[qid] || []);
      if (set.has(aid)) set.delete(aid); else set.add(aid);
      return { ...prev, [qid]: Array.from(set) };
    });
    setError("");
  };
  const pickSingle = (qid: string, aid: string) => {
    setSingle((prev) => ({ ...prev, [qid]: aid }));
    setError("");
  };
  const setFreeText = (qid: string, t: string) => setFreeTexts((prev) => ({ ...prev, [qid]: t }));
  const setText = (qid: string, t: string) => setTextAns((prev) => ({ ...prev, [qid]: t }));

  const validate = (): boolean => {
    if (!currentQ) return true;
    if (currentQ.type === "multi") {
      if (!multi[currentQ.id] || multi[currentQ.id].length === 0) {
        setError("Please select at least one option to continue.");
        return false;
      }
    } else if (currentQ.type === "single") {
      if (!single[currentQ.id]) {
        setError("Please pick one option to continue.");
        return false;
      }
    }
    return true;
  };

  const hasValidEmail = email.trim().length > 0 && EMAIL_REGEX.test(email.trim());

  const buildPayload = (completed: boolean, lastStep: number) => ({
    sessionId,
    completed,
    lastStep,
    email: hasValidEmail ? email.trim() : null,
    klid: klid.trim() || null,
    path: "main_v2",
    pathName: "Customer Feedback Survey",
    submittedVia: hasValidEmail ? "email" : "skip",
    coupon: COUPON,
    discount: "$10 OFF",
    sorting: null,
    answers: questions.map((q) => {
      if (q.type === "multi") {
        const ids = multi[q.id] || [];
        const labels = ids.map((id) => q.answers!.find((a) => a.id === id)?.label || id);
        return {
          questionId: q.id, questionTitle: q.title, questionType: "multi",
          answerIds: ids, answerLabels: labels,
          answerId: ids[0] || "", answerLabel: labels[0] || "",
          freeText: (freeTexts[q.id] || "").trim() || null,
        };
      } else if (q.type === "single") {
        const id = single[q.id] || "";
        const label = q.answers!.find((a) => a.id === id)?.label || "";
        return {
          questionId: q.id, questionTitle: q.title, questionType: "single",
          answerIds: id ? [id] : [], answerLabels: label ? [label] : [],
          answerId: id, answerLabel: label,
          freeText: (freeTexts[q.id] || "").trim() || null,
        };
      } else {
        return {
          questionId: q.id, questionTitle: q.title, questionType: "text",
          answerIds: [], answerLabels: [], answerId: "", answerLabel: "",
          freeText: (textAns[q.id] || "").trim() || null,
        };
      }
    }),
    submittedAt: new Date().toISOString(),
  });

  // Fire-and-forget save. Used both for partial (per-step) and final (completed) writes.
  // Same endpoint, different `completed` flag. Upserts on sessionId so one visitor = one row.
  const sendSave = (completed: boolean, stepNum: number) => {
    if (!sessionId) return;
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(completed, stepNum)),
      keepalive: true, // survives page unload (browser tab close)
    }).catch(() => {});
  };

  const submitFinal = () => {
    setError("");
    setSubmittedWithEmail(hasValidEmail);
    // sendSave uses fetch with keepalive: true so the write completes even
    // after we navigate away from the page below.
    sendSave(true, step);
    try { if (typeof window !== "undefined") window.sessionStorage.removeItem(SESSION_STORAGE_KEY); } catch {}
    // Temporary: redirect to the homepage. The Shopify /discount/CODE URL will
    // be wired up once the coupon is created in the store. Replace below with
    // `https://www.znaturalfoods.com/discount/${COUPON}` when ready.
    if (typeof window !== "undefined") {
      window.location.href = "https://www.znaturalfoods.com/";
      return;
    }
    setDone(true);
    scrollTop();
  };

  const handleContinue = () => {
    if (!validate()) { scrollTop(); return; }
    setError("");
    if (isCouponStep) { submitFinal(); return; }
    // Save what they've answered so far before advancing
    sendSave(false, step);
    setStep(step + 1);
    scrollTop();
  };

  const handleBack = () => {
    setError("");
    if (step > 1) { setStep(step - 1); scrollTop(); }
  };

  /* ---------------- Done state (after submit) ---------------- */
  if (done) {
    if (submittedWithEmail) {
      return (
        <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
          <section className="rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-10 text-center shadow-md">
            <div className="mb-4 text-7xl">💚</div>
            <h2 className="mb-3 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">Thanks — we hear you.</h2>
            <p className="mx-auto mb-7 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              Your $10 coupon is below, ready to use now. We&apos;ll also send a personalized offer to <strong>{email.trim()}</strong> in the next few days based on what you shared.
            </p>
            <CouponBox />
            <p className="mb-6 text-sm text-gray-500">Your $10 off code is yours to use right away — no need to wait for the email.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://www.znaturalfoods.com/" className="rounded-xl bg-green-700 px-6 py-3 font-extrabold text-white hover:bg-green-800">Start shopping →</a>
              <a href="https://www.znaturalfoods.com/specials" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-extrabold text-slate-700 hover:border-gray-400">See current specials</a>
            </div>
          </section>
        </main>
      );
    }
    // No-email confirmation
    return (
      <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
        <section className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-6xl">💚</div>
          <h2 className="mb-3 text-3xl font-extrabold text-slate-900 md:text-4xl">Thanks for telling us.</h2>
          <p className="mx-auto mb-7 max-w-xl text-base leading-7 text-gray-600 md:text-lg">What you shared helps us decide what to fix next. Your $10 coupon is below — use it whenever you&apos;re ready.</p>
          <CouponBox />
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://www.znaturalfoods.com/" className="rounded-xl bg-green-700 px-6 py-3 font-extrabold text-white hover:bg-green-800">Start shopping →</a>
            <a href="https://www.znaturalfoods.com/specials" className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-extrabold text-slate-700 hover:border-gray-400">See current specials</a>
          </div>
        </section>
      </main>
    );
  }

  /* ---------------- Active survey ---------------- */
  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
      {!isCouponStep && (
        <section className="mb-8 text-center">
          <h1 className="text-3xl font-medium leading-tight md:text-4xl">{title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 md:text-lg md:leading-8">{subtitle}</p>
        </section>
      )}

      {error && (<div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>)}

      {currentQ && (
        <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm md:p-9">
          <h2 className="mb-7 text-2xl font-extrabold text-slate-900 md:text-3xl">{currentQ.title}</h2>

          {currentQ.type === "multi" && (
            <div className="grid gap-3 md:grid-cols-2">
              {currentQ.answers!.map((a) => {
                const selected = (multi[currentQ.id] || []).includes(a.id);
                return (
                  <button key={a.id} type="button" onClick={() => toggleMulti(currentQ.id, a.id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${selected ? "border-green-700 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-green-600 hover:shadow-sm"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${selected ? "border-green-700 bg-green-700" : "border-gray-300 bg-white"}`}>
                      {selected && (<svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
                    </span>
                    <span className="text-[15px] font-medium text-slate-900">{a.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === "single" && (
            <div className="grid gap-3 md:grid-cols-2">
              {currentQ.answers!.map((a) => {
                const selected = single[currentQ.id] === a.id;
                return (
                  <button key={a.id} type="button" onClick={() => pickSingle(currentQ.id, a.id)} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${selected ? "border-green-700 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-green-600 hover:shadow-sm"}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-green-700 bg-green-700" : "border-gray-300 bg-white"}`}>
                      {selected && (<span className="h-2 w-2 rounded-full bg-white" />)}
                    </span>
                    <span className="text-[15px] font-medium text-slate-900">{a.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentQ.type === "text" && (
            <textarea value={textAns[currentQ.id] || ""} onChange={(e) => setText(currentQ.id, e.target.value)} rows={6} className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-green-600" placeholder="Type your answer here..." />
          )}

          {(currentQ.type === "multi" || currentQ.type === "single") && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Add a few words (optional) <span className="font-normal text-gray-400">— for &quot;Other&quot; or extra context</span></label>
              <textarea value={freeTexts[currentQ.id] || ""} onChange={(e) => setFreeText(currentQ.id, e.target.value)} rows={2} className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-green-600" placeholder="Add a few words here..." />
            </div>
          )}
        </section>
      )}

      {/* Final step: Thank-you + single CTA that auto-applies the coupon at checkout */}
      {isCouponStep && (
        <section className="overflow-hidden rounded-3xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8 text-center shadow-md md:p-10">
          <div className="mb-3 text-6xl">💚</div>
          <h2 className="mb-3 text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            Thank you for your feedback
          </h2>
          <p className="mx-auto mb-3 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
            Thank you for your valuable time, you helped us a lot. Your coupon is ready &mdash; click below and your coupon will be applied at checkout automatically.
          </p>
          <p className="mx-auto mb-7 max-w-xl text-xs italic leading-5 text-gray-500">
            *The coupon is valid on orders over $50.
          </p>

          <CouponBox />
        </section>
      )}

      {isCouponStep ? (
        <>
          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-xl bg-green-700 px-8 py-4 text-base font-extrabold text-white shadow-sm hover:bg-green-800 md:text-lg"
            >
              Use My $10 Coupon &rarr;
            </button>
          </div>

          {/* Shop-by-category links under the CTA.
              Headless Shopify storefronts don't expose /discount/CODE,
              so for now we link straight to the collection pages.
              Customer manually enters THANKYOU10 (shown in CouponBox above)
              at checkout. Once the headless cart-discount API is wired up,
              swap href to /discount/${COUPON}?redirect=/collections/X. */}
          <div className="mt-10">
            <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
              Or shop by category &mdash; remember to use code <strong className="text-green-700">{COUPON}</strong> at checkout
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href="https://www.znaturalfoods.com/collections/fruit-powders"
                className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center shadow-sm transition hover:border-green-600 hover:shadow-md"
              >
                <div className="mb-1 text-3xl">🍓</div>
                <div className="text-sm font-bold text-slate-900">Fruit Powders</div>
              </a>
              <a
                href="https://www.znaturalfoods.com/collections/protein-powders"
                className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center shadow-sm transition hover:border-green-600 hover:shadow-md"
              >
                <div className="mb-1 text-3xl">💪</div>
                <div className="text-sm font-bold text-slate-900">Protein &amp; Collagens</div>
              </a>
              <a
                href="https://www.znaturalfoods.com/collections/seasonings-spices"
                className="rounded-2xl border border-gray-200 bg-white px-5 py-5 text-center shadow-sm transition hover:border-green-600 hover:shadow-md"
              >
                <div className="mb-1 text-3xl">🌶️</div>
                <div className="text-sm font-bold text-slate-900">Seasoning &amp; Spices</div>
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-7 flex items-center justify-between gap-3">
          <button type="button" onClick={handleBack} disabled={step === 1} className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-gray-400 disabled:opacity-40">&larr; Back</button>
          <button type="button" onClick={handleContinue} className="rounded-xl bg-green-700 px-7 py-3 text-base font-extrabold text-white shadow-sm hover:bg-green-800">Continue &rarr;</button>
        </div>
      )}
    </main>
  );
}
