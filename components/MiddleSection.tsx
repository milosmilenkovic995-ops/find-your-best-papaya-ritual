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

const mainProducts: Record<string, Product> = {
  endurance: {
    id: "beet-root-juice-powder",
    name: "Beet Root Juice Powder - Organic",
    subtitle: "Bright • Smooth • Easy to Mix",
    description:
      "A vibrant beet option with a smooth, juice-style profile that fits naturally into drinks, smoothies, and pre-workout style routines.",
    image: "/images/beet-root-juice-powder.png",
    badges: ["Organic", "Smooth Mixing", "Drink-Friendly"],
    href: "https://www.znaturalfoods.com/products/beet-root-juice-powder-organic",
  },
  daily: {
    id: "beet-root-powder",
    name: "Beet Root Powder - Organic",
    subtitle: "Earthy-Sweet • Versatile • Whole Root",
    description:
      "A versatile whole beet root powder with an earthy-sweet flavor that works well in smoothies, juices, bowls, and everyday recipes.",
    image: "/images/beet-root-powder.png",
    badges: ["Organic", "Versatile", "Whole Root"],
    href: "https://www.znaturalfoods.com/products/beet-root-powder-organic",
  },
  performance: {
    id: "beet-root-juice-powder",
    name: "Beet Root Juice Powder - Organic",
    subtitle: "Bright • Smooth • Easy to Mix",
    description:
      "A vibrant beet option with a smooth, juice-style profile that fits naturally into drinks, smoothies, and active routines.",
    image: "/images/beet-root-juice-powder.png",
    badges: ["Organic", "Smooth Mixing", "Active Routine"],
    href: "https://www.znaturalfoods.com/products/beet-root-juice-powder-organic",
  },
  natural: {
    id: "beet-root-powder",
    name: "Beet Root Powder - Organic",
    subtitle: "Earthy-Sweet • Versatile • Whole Root",
    description:
      "A simple whole-food style beet powder that adds natural color, flavor, and plant-based nutrition to drinks and recipes.",
    image: "/images/beet-root-powder.png",
    badges: ["Organic", "Whole Root", "Recipe-Friendly"],
    href: "https://www.znaturalfoods.com/products/beet-root-powder-organic",
  },
};

const secondaryProducts: Product[] = [
  {
    id: "beet-root-powder",
    name: "Beet Root Powder - Organic",
    subtitle: "Earthy-Sweet • Versatile • Whole Root",
    description:
      "A versatile whole beet root powder that works well in smoothies, juices, bowls, and recipes.",
    image: "/images/beet-root-powder.png",
    badges: ["Organic", "Whole Root", "Versatile"],
    href: "https://www.znaturalfoods.com/products/beet-root-powder-organic",
  },
  {
    id: "beet-root-juice-powder",
    name: "Beet Root Juice Powder - Organic",
    subtitle: "Bright • Smooth • Easy to Mix",
    description:
      "A smooth beet juice powder option designed for drinks, smoothies, and easy daily use.",
    image: "/images/beet-root-juice-powder.png",
    badges: ["Organic", "Drink-Friendly", "Smooth Mixing"],
    href: "https://www.znaturalfoods.com/products/beet-root-juice-powder-organic",
  },
];

const questions: Question[] = [
  {
    id: "goal",
    title: "What are you hoping to support most right now?",
    answers: [
      {
        id: "endurance",
        title: "Daily energy and stamina",
        desc: "I want something that fits naturally into active days",
        icon: "⚡",
      },
      {
        id: "daily",
        title: "Everyday nourishment",
        desc: "I like adding nutrient-dense foods into my routine",
        icon: "🥬",
      },
      {
        id: "performance",
        title: "Workout or movement support",
        desc: "I want something that feels good before training or activity",
        icon: "🏃",
      },
      {
        id: "natural",
        title: "A more natural food-based option",
        desc: "I prefer simple ingredients and whole-food style choices",
        icon: "🌿",
      },
    ],
  },
  {
    id: "routine",
    title: "Which routine sounds most like you?",
    answers: [
      {
        id: "morning",
        title: "I like getting started early",
        desc: "Morning routines are easiest for me to keep",
        icon: "🌅",
      },
      {
        id: "busy",
        title: "I need something fast",
        desc: "If it takes too long, I probably won’t stick with it",
        icon: "🕒",
      },
      {
        id: "steady",
        title: "I like keeping things simple and consistent",
        desc: "I’d rather repeat one easy habit than overcomplicate it",
        icon: "✅",
      },
      {
        id: "flexible",
        title: "I like having options",
        desc: "Some days I drink it, other days I mix it into food",
        icon: "🧭",
      },
    ],
  },
  {
    id: "format",
    title: "How would you be most likely to use beet powder?",
    answers: [
      {
        id: "drink",
        title: "Mixed into water or juice",
        desc: "Quick and straightforward",
        icon: "🥤",
      },
      {
        id: "smoothie",
        title: "Blended into a smoothie",
        desc: "I like a smoother, more enjoyable option",
        icon: "🍓",
      },
      {
        id: "warm",
        title: "Stirred into something warm",
        desc: "I like cozy, easy-to-sip routines",
        icon: "☕",
      },
      {
        id: "food",
        title: "Added into food or recipes",
        desc: "I prefer flexible, everyday ways to use it",
        icon: "🥣",
      },
    ],
  },
  {
    id: "persona",
    title: "Which of these sounds most like you?",
    answers: [
      {
        id: "active",
        title: "I’m usually on the go",
        desc: "I want things to fit into a busy day",
        icon: "🚀",
      },
      {
        id: "wholefood",
        title: "I like whole-food style choices",
        desc: "Simple, recognizable ingredients matter to me",
        icon: "🍃",
      },
      {
        id: "routine-first",
        title: "I care most about consistency",
        desc: "The best routine is the one I’ll actually keep",
        icon: "📈",
      },
      {
        id: "explorer",
        title: "I enjoy trying new ways to use things",
        desc: "I like variety more than strict rules",
        icon: "✨",
      },
    ],
  },
];

function getProfile(goalId?: string): ProfileResult {
  switch (goalId) {
    case "endurance":
      return {
        key: "endurance",
        name: "The Daily Mover",
        shortDescription:
          "You’re best matched with a beet routine that feels energizing, practical, and easy to work into active days.",
      };
    case "daily":
      return {
        key: "daily",
        name: "The Everyday Nourisher",
        shortDescription:
          "You’re best matched with a more balanced beet routine that feels simple, versatile, and easy to repeat day after day.",
      };
    case "performance":
      return {
        key: "performance",
        name: "The Performance Type",
        shortDescription:
          "You’re best matched with a beet routine that feels bright, purposeful, and easy to use before movement or exercise.",
      };
    case "natural":
      return {
        key: "natural",
        name: "The Whole-Food Minimalist",
        shortDescription:
          "You’re best matched with a simple beet option that feels natural, flexible, and easy to use in everyday food and drink routines.",
      };
    default:
      return {
        key: "daily",
        name: "The Everyday Nourisher",
        shortDescription:
          "You’re best matched with a balanced beet routine that feels simple, versatile, and easy to repeat.",
      };
  }
}

function buildPersonalizedTips(
  routineId?: string,
  formatId?: string,
  personaId?: string
) {
  const tips: string[] = [];

  if (routineId === "morning") {
    tips.push(
      "A morning beet routine looks like your best fit because it will be easier for you to keep consistent."
    );
  } else if (routineId === "busy") {
    tips.push(
      "You’ll probably do best with a quick, low-effort option that still feels intentional."
    );
  } else if (routineId === "steady") {
    tips.push(
      "A simple beet habit you can repeat easily looks like your strongest long-term fit."
    );
  } else if (routineId === "flexible") {
    tips.push(
      "You’ll probably enjoy a beet option that can move between drinks, smoothies, and simple recipes."
    );
  }

  if (formatId === "drink") {
    tips.push(
      "A water-or-juice based beet ritual looks like the easiest option for your routine."
    );
  } else if (formatId === "smoothie") {
    tips.push(
      "A smoothie-based beet routine looks like the most enjoyable fit for you."
    );
  } else if (formatId === "warm") {
    tips.push(
      "A warm beet drink looks like a smoother, more comfortable fit for your style."
    );
  } else if (formatId === "food") {
    tips.push(
      "A more flexible recipe-based approach looks like the best fit for how you like to use products."
    );
  }

  if (personaId === "active") {
    tips.push(
      "You seem like someone who benefits most from routines that feel fast, clean, and easy to fit into movement-focused days."
    );
  } else if (personaId === "wholefood") {
    tips.push(
      "A simpler whole-food style beet option fits your preferences best."
    );
  } else if (personaId === "routine-first") {
    tips.push(
      "Consistency matters most for you, so the easiest repeatable version is likely your best match."
    );
  } else if (personaId === "explorer") {
    tips.push(
      "You’ll probably enjoy rotating between a few different beet ideas during the week."
    );
  }

  return tips.slice(0, 3);
}

function getMainProduct(profileKey?: string): Product {
  if (profileKey === "endurance") return mainProducts.endurance;
  if (profileKey === "performance") return mainProducts.performance;
  if (profileKey === "natural") return mainProducts.natural;
  return mainProducts.daily;
}

function getAlsoWorthTrying(mainProductId: string): Product[] {
  return secondaryProducts.filter((product) => product.id !== mainProductId);
}

function buildIdeas(
  goalId?: string,
  routineId?: string,
  formatId?: string
): RitualIdea[] {
  const isMorning = routineId === "morning";
  const isBusy = routineId === "busy";

  if (formatId === "drink") {
    if (goalId === "performance" || goalId === "endurance") {
      return [
        {
          title: isMorning ? "Morning Beet Juice Mix" : "Simple Beet Juice Mix",
          image:
            "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=1200&q=80",
          time: "2 min",
          intro: "A fast beet drink option for active days.",
          ingredients: [
            "8–10 oz water or juice",
            "**1 tsp Beet Root Juice Powder - Organic**",
          ],
          steps: [
            "Add **Beet Root Juice Powder - Organic** to water or juice.",
            "Stir or shake well.",
            "Drink fresh.",
          ],
        },
        {
          title: "Beet Citrus Drink",
          image:
            "https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?auto=format&fit=crop&w=1200&q=80",
          time: "3 min",
          intro: "A brighter beet option with a more refreshing feel.",
          ingredients: [
            "8–10 oz water",
            "**1 tsp Beet Root Juice Powder - Organic**",
            "Squeeze of orange or lemon",
          ],
          steps: [
            "Add **Beet Root Juice Powder - Organic** to water.",
            "Stir well.",
            "Add citrus and drink fresh.",
          ],
        },
        {
          title: "Quick Beet Water",
          image:
            "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
          time: "2 min",
          intro: "The easiest place to start when you want something simple.",
          ingredients: [
            "8–10 oz water",
            "**1 tsp Beet Root Powder - Organic**",
          ],
          steps: [
            "Add **Beet Root Powder - Organic** to water.",
            "Stir well.",
            "Drink right away.",
          ],
        },
      ];
    }

    return [
      {
        title: isMorning ? "Morning Beet Water" : "Simple Beet Water",
        image:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
        time: "2 min",
        intro: "A straightforward beet ritual for everyday use.",
        ingredients: [
          "8–10 oz water",
          "**1 tsp Beet Root Powder - Organic**",
        ],
        steps: [
          "Add **Beet Root Powder - Organic** to water.",
          "Stir well.",
          "Drink fresh.",
        ],
      },
      {
        title: "Beet Lemon Water",
        image:
          "https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A brighter beet drink when you want a lighter taste.",
        ingredients: [
          "8–10 oz water",
          "**1 tsp Beet Root Powder - Organic**",
          "Squeeze of lemon",
        ],
        steps: [
          "Add **Beet Root Powder - Organic** to water.",
          "Stir well.",
          "Add lemon and enjoy.",
        ],
      },
      {
        title: "Beet Juice Mix",
        image:
          "https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?auto=format&fit=crop&w=1200&q=80",
        time: "2 min",
        intro: "A smooth drink option when you want something easy.",
        ingredients: [
          "8–10 oz water or juice",
          "**1 tsp Beet Root Juice Powder - Organic**",
        ],
        steps: [
          "Add **Beet Root Juice Powder - Organic** to water or juice.",
          "Stir or shake well.",
          "Drink fresh.",
        ],
      },
    ];
  }

  if (formatId === "smoothie") {
    return [
      {
        title: "Berry Beet Smoothie",
        image:
          "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=80",
        time: isBusy ? "4 min" : "5 min",
        intro: "A smooth, colorful option that makes beet powder easy to enjoy.",
        ingredients: [
          "1 cup mixed berries",
          "3/4 cup yogurt or milk of choice",
          "**1 tsp Beet Root Juice Powder - Organic**",
        ],
        steps: [
          "Add everything to a blender.",
          "Blend until smooth.",
          "Serve immediately.",
        ],
      },
      {
        title: "Tropical Beet Smoothie",
        image:
          "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A fruit-forward smoothie option for a brighter routine.",
        ingredients: [
          "1 banana",
          "1/2 cup pineapple",
          "1 cup milk of choice",
          "**1 tsp Beet Root Juice Powder - Organic**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until smooth.",
          "Pour and enjoy right away.",
        ],
      },
      {
        title: "Banana Beet Blend",
        image:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A simple smoothie choice when you want something easy and repeatable.",
        ingredients: [
          "1 banana",
          "1 cup milk of choice",
          "**1 tsp Beet Root Powder - Organic**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until smooth.",
          "Serve fresh.",
        ],
      },
    ];
  }

  if (formatId === "warm") {
    return [
      {
        title: "Warm Beet Latte",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A cozy beet option when you prefer something warm and easy to sip.",
        ingredients: [
          "1 cup warm milk of choice",
          "**1 tsp Beet Root Juice Powder - Organic**",
          "Cinnamon optional",
        ],
        steps: [
          "Warm the milk gently.",
          "Whisk in **Beet Root Juice Powder - Organic**.",
          "Add cinnamon if desired and serve warm.",
        ],
      },
      {
        title: "Warm Beet Cocoa",
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A richer warm beet drink for a more comforting routine.",
        ingredients: [
          "1 cup warm milk of choice",
          "**1 tsp Beet Root Powder - Organic**",
          "1 tsp cocoa powder",
        ],
        steps: [
          "Warm the milk gently.",
          "Whisk in **Beet Root Powder - Organic** and cocoa.",
          "Serve warm.",
        ],
      },
      {
        title: "Simple Warm Beet Drink",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A simple warm option when you want something softer and easier.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Beet Root Juice Powder - Organic**",
        ],
        steps: [
          "Add **Beet Root Juice Powder - Organic** to warm water.",
          "Stir well.",
          "Sip warm.",
        ],
      },
    ];
  }

  return [
    {
      title: "Beet Yogurt Bowl",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      time: "3 min",
      intro: "An easy way to add beet powder into a simple food routine.",
      ingredients: [
        "3/4 cup yogurt",
        "**1 tsp Beet Root Powder - Organic**",
        "Fruit topping of choice",
      ],
      steps: [
        "Add yogurt to a bowl.",
        "Stir in **Beet Root Powder - Organic**.",
        "Top with fruit and enjoy.",
      ],
    },
    {
      title: "Beet Oat Bowl",
      image:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
      time: "5 min",
      intro: "A breakfast-friendly option for a more everyday beet habit.",
      ingredients: [
        "Prepared oats",
        "**1 tsp Beet Root Powder - Organic**",
        "Banana or berries",
      ],
      steps: [
        "Prepare your oats.",
        "Stir in **Beet Root Powder - Organic**.",
        "Top with fruit and serve.",
      ],
    },
    {
      title: "Beet Energy Bites",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      time: "10 min",
      intro: "A flexible recipe option when you want something a little different.",
      ingredients: [
        "1 cup oats",
        "2 tbsp nut butter",
        "**1 tsp Beet Root Powder - Organic**",
      ],
      steps: [
        "Mix ingredients in a bowl.",
        "Roll into small bites.",
        "Chill briefly and enjoy.",
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

  const mainProduct = useMemo(() => getMainProduct(profile.key), [profile.key]);

  const alsoWorthTrying = useMemo(
    () => getAlsoWorthTrying(mainProduct.id),
    [mainProduct.id]
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
            Your beet recipe ideas are ready!
          </h2>

          <div className="mb-5 text-3xl font-light leading-tight text-slate-900 md:text-4xl">
            Surprise <strong>GIFT</strong> — you got{" "}
            <span className="font-extrabold">$10 OFF</span>
          </div>

          <p className="mx-auto mb-7 max-w-2xl text-center text-lg leading-8 text-gray-500">
            Subscribe to get your coupon code and 3 beet recipe ideas
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
              from Z Natural Foods. We never spam. You can unsubscribe at any
              time.
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
              3 simple beet ideas for your routine
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

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {alsoWorthTrying.map((product) => (
                  <SecondaryProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}