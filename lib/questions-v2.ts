// Survey v2 — separate from v1. Edit ONLY this file to change v2 questions.
// Used by /v2 page, /api/subscribe-v2 route, and /admin/v2 dashboard.

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
    title: "The last time you tried to browse or buy on our website, how easy was it?",
    type: "single",
    answers: [
      { id: "very_easy", label: "Very easy — everything worked smoothly" },
      { id: "mostly_ok", label: "Mostly okay, with a few small issues" },
      { id: "harder", label: "Harder than it should have been" },
      { id: "very_frustrating", label: "Very frustrating" },
      { id: "gave_up", label: "I gave up before finishing" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q2",
    title: "Which parts of the website gave you problems?",
    type: "multi",
    answers: [
      { id: "home_nav", label: "Homepage and navigation — hard to find my way around" },
      { id: "search_category", label: "Search or category pages — couldn't find products easily" },
      { id: "product_pages", label: "Product pages — missing or unclear info" },
      { id: "cart", label: "Shopping cart" },
      { id: "login_account", label: "Login or creating an account" },
      { id: "checkout_payment", label: "Checkout and payment" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q3",
    title: "On product pages, what was missing or unclear?",
    type: "multi",
    answers: [
      { id: "real_photos", label: "Real photos of the actual product (not just packaging)" },
      { id: "short_desc", label: "Shorter, clearer product description" },
      { id: "health_benefits", label: "Health benefits or what the product helps with" },
      { id: "how_to_use", label: "How to use it / dosage / recipes" },
      { id: "comparison", label: "Comparison with similar products" },
      { id: "lab_tests", label: "Lab tests or quality certifications" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q4",
    title: "In the cart or checkout, what made it harder than it should be?",
    type: "multi",
    answers: [
      { id: "shipping_late", label: "Shipping cost shown too late" },
      { id: "forced_account", label: "Forced to create an account to buy" },
      { id: "login_broken", label: "Login didn't work or couldn't access my account" },
      { id: "too_many_fields", label: "Too many form fields or steps" },
      { id: "discount_rewards", label: "Couldn't apply a discount code or rewards points" },
      { id: "page_errors", label: "Page errors — couldn't proceed" },
      { id: "other", label: "Other" },
    ],
  },
  {
    id: "q5",
    title: "If we could fix ONE thing to make your next visit easier, what would it be?",
    type: "multi",
    maxSelect: 3,
    answers: [
      { id: "faster", label: "Make the site faster" },
      { id: "easier_find", label: "Make it easier to find products" },
      { id: "better_product_pages", label: "Better product pages with more info and photos" },
      { id: "simpler_checkout", label: "Simpler cart and checkout" },
      { id: "fix_login", label: "Fix login and account access" },
      { id: "mobile", label: "Better mobile experience" },
      { id: "other", label: "Other" },
    ],
  },
];
