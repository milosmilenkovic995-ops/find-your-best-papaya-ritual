"use client";

import { useMemo, useState } from "react";

type AnswerOption = {
  id: string;
  title: string;
  desc: string;
  icon: string;
};

type Question = {
  id: string;
  title: string;
  answers: AnswerOption[];
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  badges: string[];
  href: string;
};

type RitualIdea = {
  title: string;
  image: string;
  time: string;
  intro: string;
  ingredients: string[];
  steps: string[];
};

type ProfileResult = {
  key: string;
  name: string;
  shortDescription: string;
};

type MiddleSectionProps = {
  title: string;
  subtitle: string;
};

const mainProduct: Product = {
  id: "amla",
  name: "Amla (Amalaki) Fruit Powder - Organic",
  subtitle: "Tart • Versatile • Easy to Mix",
  description:
    "A bright, versatile fruit powder that works well in water, smoothies, tea-style drinks, and simple recipes.",
  image: "/images/amla-powder.png",
  badges: ["Organic", "Versatile", "Daily Ritual"],
  href: "https://www.znaturalfoods.com/products/amla-amalaki-fruit-powder-organic",
};

const secondaryProduct: Product = {
  id: "booster-c",
  name: "Booster C Blend - Organic",
  subtitle: "Bright • Fruity • Easy Add-On",
  description:
    "A vibrant blend that pairs naturally with daily wellness routines and can be worked into simple drinks and smoothies.",
  image: "/images/booster-c-blend-organic.png",
  badges: [
    "Naturally rich in vitamin C",
    "May support immunity",
    "Supports overall wellness",
  ],
  href: "https://www.znaturalfoods.com/products/booster-c-blend-organic",
};

const questions: Question[] = [
  {
    id: "goal",
    title: "What's your #1 wellness goal right now?",
    answers: [
      {
        id: "immunity",
        title: "Support my everyday wellness",
        desc: "I want something simple I can stay consistent with",
        icon: "🛡️",
      },
      {
        id: "beauty",
        title: "Support my skin, hair, and nails",
        desc: "I like routines that feel beauty-friendly and easy to repeat",
        icon: "✨",
      },
      {
        id: "energy",
        title: "Feel more refreshed in my routine",
        desc: "I want something that fits naturally into active days",
        icon: "⚡",
      },
      {
        id: "digestion",
        title: "Support my digestion routine",
        desc: "I’m looking for something steady and easy to work into the day",
        icon: "🌿",
      },
    ],
  },
  {
    id: "routine",
    title: "How would you describe your daily routine?",
    answers: [
      {
        id: "strict-morning",
        title: "I like starting the day with a simple routine",
        desc: "Morning habits are easier for me to keep",
        icon: "🌅",
      },
      {
        id: "busy-consistent",
        title: "I try to stay consistent, even on busy days",
        desc: "I need something practical and low effort",
        icon: "🕒",
      },
      {
        id: "building-habits",
        title: "I’m building healthier habits little by little",
        desc: "I want something approachable and easy to stick with",
        icon: "🌱",
      },
      {
        id: "evening",
        title: "I prefer something later in the day",
        desc: "Evening rituals feel more natural to me",
        icon: "🌙",
      },
    ],
  },
  {
    id: "format",
    title: "How would you most likely enjoy Amla powder?",
    answers: [
      {
        id: "water",
        title: "Stirred into lukewarm water",
        desc: "Quick, clean, and simple",
        icon: "💧",
      },
      {
        id: "smoothie",
        title: "Blended into a smoothie",
        desc: "I like a more enjoyable, mixed drink",
        icon: "🥤",
      },
      {
        id: "warm-drink",
        title: "Mixed into tea or another warm drink",
        desc: "I prefer something cozy and easy to sip",
        icon: "🍵",
      },
      {
        id: "food",
        title: "Worked into simple recipes",
        desc: "I like flexibility more than strict routines",
        icon: "🥣",
      },
    ],
  },
  {
    id: "persona",
    title: "Which of these sounds most like you?",
    answers: [
      {
        id: "optimizer",
        title: "I like simple wellness habits that are easy to repeat",
        desc: "Consistency matters more to me than complexity",
        icon: "📈",
      },
      {
        id: "natural",
        title: "I prefer clean, plant-based options",
        desc: "I’m drawn to simple ingredient choices",
        icon: "🍃",
      },
      {
        id: "busy",
        title: "I need things to fit a busy schedule",
        desc: "If it’s too complicated, I probably won’t stick with it",
        icon: "🚀",
      },
      {
        id: "explorer",
        title: "I enjoy trying new wellness ideas",
        desc: "I like variety and new ways to use products",
        icon: "🧭",
      },
    ],
  },
];

function getProfile(goalId?: string): ProfileResult {
  switch (goalId) {
    case "immunity":
      return {
        key: "daily-defender",
        name: "The Daily Defender",
        shortDescription:
          "You’re best matched with a simple Amla ritual that feels easy to repeat and fits naturally into an everyday wellness routine.",
      };
    case "beauty":
      return {
        key: "beauty-within",
        name: "Beauty from Within",
        shortDescription:
          "You’re best matched with an Amla ritual that feels smooth, enjoyable, and easy to work into a beauty-friendly daily routine.",
      };
    case "energy":
      return {
        key: "vital-type",
        name: "The Vital Type",
        shortDescription:
          "You’re best matched with a more refreshing Amla ritual that works well with active days and flexible routines.",
      };
    case "digestion":
      return {
        key: "gentle-reset",
        name: "The Gentle Reset",
        shortDescription:
          "You’re best matched with a steadier Amla ritual that feels simple, supportive, and easy to build into your day.",
      };
    default:
      return {
        key: "daily-defender",
        name: "The Daily Defender",
        shortDescription:
          "You’re best matched with a simple Amla ritual that feels easy to repeat and fits naturally into your routine.",
      };
  }
}

function buildPersonalizedTips(
  routineId?: string,
  formatId?: string,
  personaId?: string
) {
  const tips: string[] = [];

  if (routineId === "strict-morning") {
    tips.push("A simple morning drink looks like the easiest routine for you to stay consistent with.");
  } else if (routineId === "busy-consistent") {
    tips.push("You’ll probably do best with a fast, low-effort option that still feels intentional.");
  } else if (routineId === "building-habits") {
    tips.push("Starting with the easiest version first is likely your best long-term fit.");
  } else if (routineId === "evening") {
    tips.push("A later-in-the-day Amla drink may feel more natural than forcing a strict morning habit.");
  }

  if (formatId === "water") {
    tips.push("A lukewarm water mix looks like your cleanest and most repeatable option.");
  } else if (formatId === "smoothie") {
    tips.push("A smoothie-based ritual looks like the most enjoyable way for you to use Amla regularly.");
  } else if (formatId === "warm-drink") {
    tips.push("A tea-style or warm cup option looks like the smoothest fit for your routine.");
  } else if (formatId === "food") {
    tips.push("You seem like a good fit for a more flexible mix of drinks and simple recipe ideas.");
  }

  if (personaId === "optimizer") {
    tips.push("You seem like someone who does best with simple habits you can actually repeat.");
  } else if (personaId === "natural") {
    tips.push("A clean, plant-based style ritual fits your preferences well.");
  } else if (personaId === "busy") {
    tips.push("The easiest format will probably be the one you stick with best.");
  } else if (personaId === "explorer") {
    tips.push("You’ll likely enjoy rotating between a couple of different Amla formats during the week.");
  }

  return tips.slice(0, 3);
}

function buildIdeas(
  goalId?: string,
  routineId?: string,
  formatId?: string
): RitualIdea[] {
  const baseFormat = formatId || "water";
  const isEvening = routineId === "evening";

  if (baseFormat === "water") {
    return [
      {
        title: isEvening ? "Evening Amla Water" : "Simple Amla Water",
        image:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
        time: "2 min",
        intro: "The easiest place to start with Amla powder.",
        ingredients: [
          "1 glass lukewarm water",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        ],
        steps: [
          "Add **Amla (Amalaki) Fruit Powder - Organic** to lukewarm water.",
          "Stir well.",
          "Drink right away, even if a few particles remain.",
        ],
      },
      {
        title: "Amla Lemon Water",
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A brighter variation for a more refreshing feel.",
        ingredients: [
          "1 glass lukewarm water",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "Squeeze of lemon",
        ],
        steps: [
          "Add **Amla (Amalaki) Fruit Powder - Organic** to water.",
          "Stir well.",
          "Add lemon and drink fresh.",
        ],
      },
      {
        title: "Mint Amla Water",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A simple variation when you want a lighter everyday ritual.",
        ingredients: [
          "1 glass lukewarm water",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "A few mint leaves",
        ],
        steps: [
          "Add **Amla (Amalaki) Fruit Powder - Organic** to water.",
          "Stir well.",
          "Add mint leaves, let sit briefly, and enjoy.",
        ],
      },
    ];
  }

  if (baseFormat === "smoothie") {
    return [
      {
        title: "Tropical Amla Smoothie",
        image:
          "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A simple blended option for a smoother daily ritual.",
        ingredients: [
          "1 banana",
          "1/2 cup pineapple",
          "1 cup milk of choice",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        ],
        steps: [
          "Add all ingredients to a blender.",
          "Blend until smooth.",
          "Pour and enjoy right away.",
        ],
      },
      {
        title: "Berry Amla Smoothie",
        image:
          "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A fruit-forward option that fits easily into a daily routine.",
        ingredients: [
          "1 cup mixed berries",
          "3/4 cup yogurt or milk of choice",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "Ice if desired",
        ],
        steps: [
          "Add everything to a blender.",
          "Blend until smooth and creamy.",
          "Serve immediately.",
        ],
      },
      {
        title: "Green Amla Blend",
        image:
          "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=80",
        time: "6 min",
        intro: "A flexible smoothie option for more routine-minded drinkers.",
        ingredients: [
          "1 banana",
          "Handful of spinach",
          "1 cup water or milk of choice",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until the texture is smooth.",
          "Pour into a glass and serve.",
        ],
      },
    ];
  }

  if (baseFormat === "warm-drink") {
    return [
      {
        title: isEvening ? "Evening Amla Tea" : "Simple Amla Tea",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A warm, easy-to-sip option for a gentler ritual.",
        ingredients: [
          "1 cup warm water or mild tea",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "Honey optional",
        ],
        steps: [
          "Pour warm water or tea into a mug.",
          "Stir in **Amla (Amalaki) Fruit Powder - Organic**.",
          "Sweeten lightly if desired and sip warm.",
        ],
      },
      {
        title: "Warm Amla Lemon Drink",
        image:
          "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A bright warm drink that still feels light and simple.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "Squeeze of lemon",
        ],
        steps: [
          "Add **Amla (Amalaki) Fruit Powder - Organic** to warm water.",
          "Stir well.",
          "Add a squeeze of lemon and drink fresh.",
        ],
      },
      {
        title: "Spiced Amla Apple Cup",
        image:
          "https://images.unsplash.com/photo-1603048719539-9ecb4f1f8f88?auto=format&fit=crop&w=1200&q=80",
        time: "6 min",
        intro: "A cozier option when you want something warmer and more comforting.",
        ingredients: [
          "1 cup warm apple drink",
          "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
          "Pinch of cinnamon",
        ],
        steps: [
          "Warm the apple drink gently.",
          "Stir in **Amla (Amalaki) Fruit Powder - Organic**.",
          "Add cinnamon and serve warm.",
        ],
      },
    ];
  }

  return [
    {
      title: "Simple Amla Yogurt Bowl",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      time: "3 min",
      intro: "An easy, flexible way to work Amla into food.",
      ingredients: [
        "3/4 cup yogurt",
        "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        "Fruit topping of choice",
      ],
      steps: [
        "Add yogurt to a bowl.",
        "Stir in **Amla (Amalaki) Fruit Powder - Organic**.",
        "Top with fruit and enjoy.",
      ],
    },
    {
      title: "Amla Oat Bowl",
      image:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
      time: "5 min",
      intro: "A simple breakfast-friendly option.",
      ingredients: [
        "Prepared oats",
        "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        "Banana or berries",
      ],
      steps: [
        "Prepare your oats.",
        "Stir in **Amla (Amalaki) Fruit Powder - Organic**.",
        "Top with fruit and serve.",
      ],
    },
    {
      title: "Amla Fruit Mix",
      image:
        "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80",
      time: "4 min",
      intro: "A quick option when you want something flexible and light.",
      ingredients: [
        "Cut fruit of choice",
        "**1 tsp Amla (Amalaki) Fruit Powder - Organic**",
        "Splash of juice if needed",
      ],
      steps: [
        "Add fruit to a bowl.",
        "Sprinkle in **Amla (Amalaki) Fruit Powder - Organic**.",
        "Toss lightly and enjoy fresh.",
      ],
    },
  ];
}

function renderIngredient(text: string) {
  const isBold = text.startsWith("**") && text.endsWith("**");
  const clean = isBold ? text.replace(/\*\*/g, "") : text;
  return isBold ? <strong>{clean}</strong> : clean;
}

function Progress({ step }: { step: number }) {
  const items = [1, 2, 3, 4, 5];

  return (
    <div className="mt-6 flex items-center justify-center">
      {items.map((item, i) => {
        const active = item <= step;
        const isEmail = item === 5;

        return (
          <div key={item} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                active
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {isEmail ? "✉" : item}
            </div>
            {i < items.length - 1 && (
              <div
                className={`h-[2px] w-12 ${
                  item < step ? "bg-green-700" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border-2 border-green-700 bg-white p-6 text-center shadow-md">
      <div className="mb-4 inline-block rounded-full bg-green-700 px-3 py-2 text-[11px] font-extrabold text-white">
        BEST MATCH
      </div>

      <img
        src={product.image}
        alt={product.name}
        className="mx-auto mb-5 h-80 w-full max-w-md object-contain"
      />

      <h3 className="mb-2 text-3xl font-extrabold text-slate-900">
        {product.name}
      </h3>

      <div className="mb-3 text-gray-500">{product.subtitle}</div>
      <p className="mb-4 leading-7 text-gray-600">{product.description}</p>

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {product.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700"
          >
            {badge}
          </span>
        ))}
      </div>

      <a
        href={product.href}
        className="inline-block rounded-xl bg-green-700 px-5 py-3 font-extrabold text-white"
      >
        Shop Now →
      </a>
    </div>
  );
}

function SecondaryProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
      <img
        src={product.image}
        alt={product.name}
        className="mx-auto mb-5 h-56 w-full max-w-xs object-contain"
      />

      <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
        {product.name}
      </h3>

      <div className="mb-3 text-gray-500">{product.subtitle}</div>
      <p className="mb-4 leading-7 text-gray-600">{product.description}</p>

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {product.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700"
          >
            {badge}
          </span>
        ))}
      </div>

      <a
        href={product.href}
        className="inline-block rounded-xl bg-green-700 px-5 py-3 font-extrabold text-white"
      >
        Shop Now →
      </a>
    </div>
  );
}

function IdeaCard({ idea }: { idea: RitualIdea }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <img
        src={idea.image}
        alt={idea.title}
        className="h-72 w-full object-cover"
      />

      <div className="p-6">
        <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
          {idea.title}
        </h3>

        <div className="mb-3 text-sm font-medium text-gray-500">
          {idea.time} • {idea.intro}
        </div>

        <div className="mb-2 text-xs font-extrabold tracking-[0.16em] text-green-700">
          INGREDIENTS
        </div>

        <ul className="mb-5 list-disc space-y-1 pl-5 text-gray-700">
          {idea.ingredients.map((item) => (
            <li key={item}>{renderIngredient(item)}</li>
          ))}
        </ul>

        <div className="mb-2 text-xs font-extrabold tracking-[0.16em] text-green-700">
          HOW TO MAKE IT
        </div>

        <ol className="list-decimal space-y-1 pl-5 text-gray-700">
          {idea.steps.map((item) => (
            <li key={item}>{renderIngredient(item)}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function MiddleSection({
  title,
  subtitle,
}: MiddleSectionProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[step - 1];

  const profile = useMemo(() => getProfile(answers.goal?.id), [answers]);

  const personalizedTips = useMemo(
    () =>
      buildPersonalizedTips(
        answers.routine?.id,
        answers.format?.id,
        answers.persona?.id
      ),
    [answers]
  );

  const ritualIdeas = useMemo(
    () =>
      buildIdeas(answers.goal?.id, answers.routine?.id, answers.format?.id),
    [answers]
  );

  const handleAnswer = (answer: AnswerOption) => {
    if (!currentQuestion) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));

    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const trimmedFirstName = firstName.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirstName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error("Subscribe failed:", data);
        alert("Email was not sent to Klaviyo. Check console / API response.");
        return;
      }

      setStep(6);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong while sending to Klaviyo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 pb-10 pt-12">
      {step <= 5 && (
        <section className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500 md:text-[28px] md:leading-[1.5]">
            {subtitle}
          </p>
          <Progress step={step} />
        </section>
      )}

      {step <= 4 && currentQuestion && (
        <section className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-4 text-xs font-extrabold tracking-[0.18em] text-green-700">
            QUESTION {step} OF 4
          </div>

          <h2 className="mb-7 text-3xl font-extrabold text-slate-900 md:text-4xl">
            {currentQuestion.title}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(answer)}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-green-600 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  {answer.icon}
                </div>

                <div>
                  <div className="mb-1 text-[17px] font-bold text-slate-900">
                    {answer.title}
                  </div>
                  <div className="text-sm text-gray-500">{answer.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-4 text-5xl">🎁</div>

          <h2 className="mb-3 text-4xl font-extrabold text-slate-900">
            Your recipes are ready!
          </h2>

          <div className="mb-5 text-3xl font-light leading-tight text-slate-900 md:text-4xl">
            Surprise <strong>GIFT</strong> — you got{" "}
            <span className="font-extrabold">$10 OFF</span>
          </div>

          <p className="mx-auto mb-7 max-w-2xl text-center text-lg leading-8 text-gray-500">
            Subscribe to get your coupon code and 3 Amla recipe ideas
            <br className="hidden md:block" />
            matched to your routine.
          </p>

          <div className="mx-auto max-w-md space-y-3">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`w-full rounded-xl border px-4 py-4 outline-none ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
            />

            {emailError && (
              <div className="text-left text-sm text-red-500">
                Please enter a valid email address.
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-xl bg-green-700 px-4 py-4 text-lg font-extrabold text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Get My $10 OFF Code"}
            </button>

            <div className="text-xs text-gray-500">
              ✉️ By entering your email, you agree to receive marketing emails
              from Z Natural Foods. We never spam. You can unsubscribe at any time.
            </div>
            <div className="text-xs text-gray-400">
              
            </div>
          </div>
        </section>
      )}

      {step === 6 && (
        <section>
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold md:text-5xl">
              {profile.name}
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-gray-500">
              {profile.shortDescription}
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-4xl">
            <ProductCard product={mainProduct} />
          </div>

          <div className="mx-auto mb-10 max-w-4xl rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-3 text-xs font-extrabold tracking-[0.16em] text-green-700">
              PERSONALIZED NOTES
            </div>
            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              {personalizedTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center text-2xl font-extrabold">
              3 simple Amla ideas for your routine
            </div>

            <div className="space-y-6">
              {ritualIdeas.map((idea) => (
                <IdeaCard key={idea.title} idea={idea} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="mb-5 text-center text-xs font-extrabold tracking-[0.16em] text-gray-500">
              ALSO WORTH TRYING
            </div>

            <SecondaryProductCard product={secondaryProduct} />
          </div>
        </section>
      )}
    </main>
  );
}