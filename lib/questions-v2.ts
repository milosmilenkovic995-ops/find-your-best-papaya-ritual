// Survey v2 — separate from v1. Edit ONLY this file to change v2 questions.
// Used by /v2 page, /api/subscribe-v2 route, and /admin/v2 dashboard.
//
// Round 2 (2026-08-04): rewritten to focus on WHY customers don't buy —
// covering both UX friction and technical friction, split by page/stage
// so cross-tabs in the dashboard pinpoint "problem X on page Y."

export type MCAnswer = { id: string; label: string };
export type QuestionType = "multi" | "single" | "text";
export type Question = {
  id: string;
  title: string;
  type: QuestionType;
  answers?: MCAnswer[];
  maxSelect?: number; // multi-only: cap on number of selections
};

export const COUPON_CODE_V2 = "THANKYOU10";
export const COUPON_LABEL_V2 = "$10 OFF";
export const PATH_ID_V2 = "v2";
export const PATH_NAME_V2 = "Customer Feedback Survey v2";

export const questionsV2: Question[] = [
  {
    id: "q1",
    title: "On our website, which pages have given you the most trouble or frustration?",
    type: "multi",
    answers: [
      { id: "homepage", label: "Homepage / main navigation" },
      { id: "category", label: "Product category pages (product listings)" },
      { id: "product_page", label: "Individual product pages" },
      { id: "search", label: "Search results" },
      { id: "cart_checkout", label: "Cart, checkout, or payment page" },
      { id: "no_trouble", label: "I haven't had trouble on any page" },
    ],
  },
  {
    id: "q2",
    title: "On our website, what kind of problems have you had?",
    type: "multi",
    answers: [
      { id: "cant_find", label: "I couldn't find the product I was looking for" },
      { id: "cant_compare", label: "I couldn't compare products or decide which was right" },
      { id: "missing_info", label: "Info I needed was missing (reviews, shipping time, stock, health benefits)" },
      { id: "coupon_broken", label: "My coupon or rewards code didn't work" },
      { id: "too_many_steps", label: "Too many steps, forms, or clicks to get where I wanted" },
      { id: "no_problems", label: "I haven't had these problems" },
    ],
  },
  {
    id: "q3",
    title: "Have you had technical problems on our site? What kind?",
    type: "multi",
    answers: [
      { id: "slow", label: "Pages loaded too slowly or the site froze" },
      { id: "broken_content", label: "Images or buttons were missing or broken" },
      { id: "errors", label: "I got an error message or a “404 not found” page" },
      { id: "search_empty", label: "Search returned no results (even for a product I know you sell)" },
      { id: "mobile_bad", label: "Site worked badly on my phone (small buttons, broken layout)" },
      { id: "no_tech_problems", label: "I haven't had technical problems" },
    ],
  },
];
