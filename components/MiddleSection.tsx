"use client";

import { useMemo, useRef, useState } from "react";

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
  quizVersion?: string;
};

const allProducts: Product[] = [
  {
    id: "green-papaya-unripe",
    name: "Green Papaya Powder (Unripe)",
    subtitle: "Mild • Earthy • Versatile",
    description:
      "A mild, slightly earthy green papaya powder that blends well into smoothies, teas, soups, sauces, and both sweet and savory recipes.",
    image: "/images/green-papaya-powder-unripe.png",
    badges: ["Versatile", "Mild Flavor", "Recipe-Friendly"],
    href: "https://www.znaturalfoods.com/products/green-papaya-powder-unripe",
  },
  {
    id: "papaya-juice-organic",
    name: "Papaya Juice Powder - Organic",
    subtitle: "Sweet • Fruity • Easy to Mix",
    description:
      "A naturally sweet and fruity papaya powder that mixes easily into water, smoothies, shakes, desserts, sauces, and teas.",
    image: "/images/papaya-juice-powder-organic.png",
    badges: ["Organic", "Sweet Flavor", "Drink-Friendly"],
    href: "https://www.znaturalfoods.com/products/papaya-juice-powder-organic",
  },
  {
    id: "green-papaya-organic",
    name: "Green Papaya Powder (Unripe) - Organic",
    subtitle: "Organic • Mild • Flexible",
    description:
      "An organic green papaya powder with a mild, slightly earthy taste that works smoothly in smoothies, soups, teas, sauces, and everyday recipes.",
    image: "/images/green-papaya-powder-organic.png",
    badges: ["Organic", "Mild Flavor", "Flexible Use"],
    href: "https://www.znaturalfoods.com/products/green-papaya-powder-organic",
  },
];

const questions: Question[] = [
  {
    id: "goal",
    title: "What are you hoping to support most right now?",
    answers: [
      {
        id: "digestion",
        title: "A lighter, digestion-friendly routine",
        desc: "I want something that feels gentle and easy to work into the day",
        icon: "🌿",
      },
      {
        id: "glow",
        title: "A brighter, glowier daily routine",
        desc: "I’m drawn to fruity, colorful options that feel fresh",
        icon: "✨",
      },
      {
        id: "everyday",
        title: "Simple everyday nourishment",
        desc: "I like versatile products I can use in more than one way",
        icon: "🥣",
      },
      {
        id: "sweet",
        title: "Something naturally sweet and easy to enjoy",
        desc: "I’m more likely to stick with something that tastes bright and fruity",
        icon: "🍑",
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
        title: "I prefer simple and repeatable",
        desc: "I’d rather keep one easy habit going",
        icon: "✅",
      },
      {
        id: "flexible",
        title: "I like variety",
        desc: "Some days I want drinks, other days recipes",
        icon: "🧭",
      },
    ],
  },
  {
    id: "format",
    title: "How would you be most likely to use papaya powder?",
    answers: [
      {
        id: "drink",
        title: "Mixed into water or juice",
        desc: "Quick and easy is best for me",
        icon: "🥤",
      },
      {
        id: "smoothie",
        title: "Blended into a smoothie",
        desc: "I like a smoother, more enjoyable option",
        icon: "🍹",
      },
      {
        id: "warm",
        title: "Stirred into tea or something warm",
        desc: "I like cozy, easy-to-sip routines",
        icon: "☕",
      },
      {
        id: "food",
        title: "Added into food or recipes",
        desc: "I want flexible everyday ways to use it",
        icon: "🥗",
      },
    ],
  },
  {
    id: "persona",
    title: "Which of these sounds most like you?",
    answers: [
      {
        id: "wholefood",
        title: "I like whole-food style choices",
        desc: "Simple ingredients matter to me",
        icon: "🍃",
      },
      {
        id: "fruity",
        title: "I’m drawn to sweet tropical flavors",
        desc: "I’m more likely to stick with something I really enjoy drinking",
        icon: "🍍",
      },
      {
        id: "routine-first",
        title: "Consistency matters most",
        desc: "The best routine is the one I’ll actually keep",
        icon: "📈",
      },
      {
        id: "explorer",
        title: "I like trying different uses",
        desc: "I enjoy rotating between drinks and recipes",
        icon: "✨",
      },
    ],
  },
];

function getProfile(goalId?: string, personaId?: string): ProfileResult {
  if (goalId === "digestion") {
    return {
      key: "green-digestive",
      name: "The Gentle Green Routine",
      shortDescription:
        "You’re best matched with a green papaya routine that feels mild, flexible, and easy to work into a digestion-friendly day.",
    };
  }

  if (goalId === "sweet" || goalId === "glow" || personaId === "fruity") {
    return {
      key: "ripe-bright",
      name: "The Bright Tropical Routine",
      shortDescription:
        "You’re best matched with a sweeter papaya option that feels bright, fruity, and easy to enjoy in drinks and smoothies.",
    };
  }

  if (goalId === "everyday" && personaId === "wholefood") {
    return {
      key: "green-organic",
      name: "The Everyday Green Ritual",
      shortDescription:
        "You’re best matched with a more versatile green papaya routine that feels simple, pantry-friendly, and easy to repeat.",
    };
  }

  return {
    key: "green-organic",
    name: "The Everyday Green Ritual",
    shortDescription:
      "You’re best matched with a flexible papaya routine that feels simple, useful, and easy to fit into daily life.",
  };
}

function getMainProduct(profileKey: string): Product {
  if (profileKey === "green-digestive") return allProducts[0];
  if (profileKey === "ripe-bright") return allProducts[1];
  return allProducts[2];
}

function getAlsoWorthTrying(mainProductId: string): Product[] {
  return allProducts.filter((product) => product.id !== mainProductId);
}

function buildPersonalizedTips(
  routineId?: string,
  formatId?: string,
  personaId?: string
) {
  const tips: string[] = [];

  if (routineId === "morning") {
    tips.push(
      "A simple papaya routine in the morning looks like your best fit because it will be easier for you to keep consistent."
    );
  } else if (routineId === "busy") {
    tips.push(
      "You’ll probably do best with a low-effort option that feels quick but still intentional."
    );
  } else if (routineId === "steady") {
    tips.push(
      "A simple repeatable papaya habit looks like your strongest long-term fit."
    );
  } else if (routineId === "flexible") {
    tips.push(
      "You’ll probably enjoy a papaya option that can move between drinks, smoothies, and recipes."
    );
  }

  if (formatId === "drink") {
    tips.push(
      "A water-or-juice based papaya ritual looks like the easiest option for your routine."
    );
  } else if (formatId === "smoothie") {
    tips.push(
      "A smoothie-based papaya routine looks like the most enjoyable fit for you."
    );
  } else if (formatId === "warm") {
    tips.push(
      "A warm papaya drink looks like a smoother, more comfortable fit for your style."
    );
  } else if (formatId === "food") {
    tips.push(
      "A more recipe-based approach looks like the best fit for how you like to use products."
    );
  }

  if (personaId === "wholefood") {
    tips.push(
      "A simpler whole-food style papaya option fits your preferences especially well."
    );
  } else if (personaId === "fruity") {
    tips.push(
      "A sweeter, brighter papaya option looks like the one you’re most likely to genuinely enjoy and keep using."
    );
  } else if (personaId === "routine-first") {
    tips.push(
      "Consistency matters most for you, so the easiest repeatable version is likely your best match."
    );
  } else if (personaId === "explorer") {
    tips.push(
      "You’ll probably enjoy rotating between a few different papaya ideas during the week."
    );
  }

  return tips.slice(0, 3);
}

function buildIdeas(
  goalId?: string,
  routineId?: string,
  formatId?: string,
  personaId?: string
): RitualIdea[] {
  const fruity =
    goalId === "sweet" || goalId === "glow" || personaId === "fruity";
  const isMorning = routineId === "morning";

  if (formatId === "drink") {
    if (fruity) {
      return [
        {
          title: isMorning ? "Morning Papaya Juice Mix" : "Simple Papaya Juice Mix",
          image:
            "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
          time: "2 min",
          intro: "A bright and easy papaya drink for everyday use.",
          ingredients: [
            "8–10 oz cold water",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to cold water.",
            "Stir or shake well.",
            "Drink fresh.",
          ],
        },
        {
          title: "Papaya Citrus Cooler",
          image:
            "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80",
          time: "3 min",
          intro: "A brighter tropical option with a more refreshing feel.",
          ingredients: [
            "8–10 oz water",
            "**1 tsp Papaya Juice Powder - Organic**",
            "Squeeze of lime or orange",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to water.",
            "Stir well.",
            "Add citrus and enjoy cold.",
          ],
        },
        {
          title: "Papaya Iced Drink",
          image:
            "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=1200&q=80",
          time: "2 min",
          intro: "An easy chilled drink when you want something simple and fruity.",
          ingredients: [
            "8–10 oz water over ice",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to water.",
            "Stir well over ice.",
            "Serve immediately.",
          ],
        },
      ];
    }

    return [
      {
        title: isMorning ? "Morning Green Papaya Tea" : "Simple Green Papaya Drink",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A milder green papaya option for a more gentle routine.",
        ingredients: [
          "8–10 oz warm water",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe) - Organic** to warm water.",
          "Stir well.",
          "Sip warm.",
        ],
      },
      {
        title: "Green Papaya Lemon Drink",
        image:
          "https://images.unsplash.com/photo-1519096845289-95806ee03a1a?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A simple option when you want something lighter and brighter.",
        ingredients: [
          "8–10 oz water",
          "**1 tsp Green Papaya Powder (Unripe)**",
          "Squeeze of lemon",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe)** to water.",
          "Stir well.",
          "Add lemon and enjoy.",
        ],
      },
      {
        title: "Green Papaya Warm Cup",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "A softer, more comfortable option for a simple daily routine.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe) - Organic** to warm water.",
          "Stir well.",
          "Drink warm.",
        ],
      },
    ];
  }

  if (formatId === "smoothie") {
    if (fruity) {
      return [
        {
          title: "Papaya Mango Smoothie",
          image:
            "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=1200&q=80",
          time: "5 min",
          intro: "A bright tropical smoothie that makes papaya easy to enjoy.",
          ingredients: [
            "1/2 cup mango",
            "1 banana",
            "1 cup milk of choice",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add everything to a blender.",
            "Blend until smooth.",
            "Serve immediately.",
          ],
        },
        {
          title: "Papaya Berry Smoothie",
          image:
            "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=80",
          time: "5 min",
          intro: "A fruit-forward smoothie with a brighter color and sweeter feel.",
          ingredients: [
            "1 cup berries",
            "3/4 cup yogurt or milk of choice",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add ingredients to a blender.",
            "Blend until smooth.",
            "Serve fresh.",
          ],
        },
        {
          title: "Papaya Banana Blend",
          image:
            "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?auto=format&fit=crop&w=1200&q=80",
          time: "4 min",
          intro: "A simple smoothie option when you want something easy and repeatable.",
          ingredients: [
            "1 banana",
            "1 cup milk of choice",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add ingredients to a blender.",
            "Blend until smooth.",
            "Serve right away.",
          ],
        },
      ];
    }

    return [
      {
        title: "Green Papaya Smoothie",
        image:
          "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A smoother green papaya option for a more balanced daily routine.",
        ingredients: [
          "1 banana",
          "1 cup milk of choice",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until smooth.",
          "Serve fresh.",
        ],
      },
      {
        title: "Green Papaya Coconut Smoothie",
        image:
          "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A milder smoothie option with a softer tropical feel.",
        ingredients: [
          "1 cup coconut milk",
          "1/2 banana",
          "**1 tsp Green Papaya Powder (Unripe)**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until smooth.",
          "Serve immediately.",
        ],
      },
      {
        title: "Papaya Green Blend",
        image:
          "https://images.unsplash.com/photo-1514995669114-6081e934b693?auto=format&fit=crop&w=1200&q=80",
        time: "6 min",
        intro: "A simple smoothie when you want something easy but still fresh.",
        ingredients: [
          "1 banana",
          "Handful of spinach",
          "1 cup water or milk of choice",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add ingredients to a blender.",
          "Blend until smooth.",
          "Pour into a glass and serve.",
        ],
      },
    ];
  }

  if (formatId === "warm") {
    if (fruity) {
      return [
        {
          title: "Warm Papaya Tea",
          image:
            "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
          time: "4 min",
          intro: "A gentler warm option when you want something easy to sip.",
          ingredients: [
            "1 cup warm water",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to warm water.",
            "Stir well.",
            "Sip warm.",
          ],
        },
        {
          title: "Papaya Honey Cup",
          image:
            "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
          time: "4 min",
          intro: "A warmer fruit-forward option with a softer feel.",
          ingredients: [
            "1 cup warm water",
            "**1 tsp Papaya Juice Powder - Organic**",
            "Honey optional",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to warm water.",
            "Stir well.",
            "Add honey if desired.",
          ],
        },
        {
          title: "Simple Warm Papaya Drink",
          image:
            "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
          time: "3 min",
          intro: "An easy warm version when you want something light and simple.",
          ingredients: [
            "1 cup warm water",
            "**1 tsp Papaya Juice Powder - Organic**",
          ],
          steps: [
            "Add **Papaya Juice Powder - Organic** to warm water.",
            "Stir well.",
            "Drink warm.",
          ],
        },
      ];
    }

    return [
      {
        title: "Green Papaya Tea",
        image:
          "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A simple warm cup that fits a gentler daily routine.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe) - Organic** to warm water.",
          "Stir well.",
          "Sip warm.",
        ],
      },
      {
        title: "Green Papaya Ginger Cup",
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
        time: "4 min",
        intro: "A warmer option when you want something gentle and simple.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Green Papaya Powder (Unripe)**",
          "Pinch of ginger",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe)** to warm water.",
          "Stir well.",
          "Add ginger and sip warm.",
        ],
      },
      {
        title: "Simple Warm Green Papaya Drink",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "An easy warm choice for a soft, repeatable routine.",
        ingredients: [
          "1 cup warm water",
          "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        ],
        steps: [
          "Add **Green Papaya Powder (Unripe) - Organic** to warm water.",
          "Stir well.",
          "Drink warm.",
        ],
      },
    ];
  }

  if (fruity) {
    return [
      {
        title: "Papaya Yogurt Bowl",
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
        time: "3 min",
        intro: "An easy way to add papaya flavor into a simple snack or breakfast.",
        ingredients: [
          "3/4 cup yogurt",
          "**1 tsp Papaya Juice Powder - Organic**",
          "Fruit topping of choice",
        ],
        steps: [
          "Add yogurt to a bowl.",
          "Stir in **Papaya Juice Powder - Organic**.",
          "Top with fruit and enjoy.",
        ],
      },
      {
        title: "Papaya Oat Bowl",
        image:
          "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A simple breakfast-friendly option with a sweeter tropical feel.",
        ingredients: [
          "Prepared oats",
          "**1 tsp Papaya Juice Powder - Organic**",
          "Banana or mango",
        ],
        steps: [
          "Prepare your oats.",
          "Stir in **Papaya Juice Powder - Organic**.",
          "Top with fruit and serve.",
        ],
      },
      {
        title: "Papaya Chia Cup",
        image:
          "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
        time: "5 min",
        intro: "A lighter tropical option when you want something simple and different.",
        ingredients: [
          "Prepared chia pudding",
          "**1 tsp Papaya Juice Powder - Organic**",
          "Fruit topping of choice",
        ],
        steps: [
          "Add chia pudding to a bowl or cup.",
          "Stir in **Papaya Juice Powder - Organic**.",
          "Top and serve.",
        ],
      },
    ];
  }

  return [
    {
      title: "Green Papaya Yogurt Bowl",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      time: "3 min",
      intro: "An easy way to add green papaya into a simple food routine.",
      ingredients: [
        "3/4 cup yogurt",
        "**1 tsp Green Papaya Powder (Unripe) - Organic**",
        "Fruit topping of choice",
      ],
      steps: [
        "Add yogurt to a bowl.",
        "Stir in **Green Papaya Powder (Unripe) - Organic**.",
        "Top with fruit and enjoy.",
      ],
    },
    {
      title: "Green Papaya Oat Bowl",
      image:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
      time: "5 min",
      intro: "A breakfast-friendly option for a more everyday green papaya habit.",
      ingredients: [
        "Prepared oats",
        "**1 tsp Green Papaya Powder (Unripe)**",
        "Banana or berries",
      ],
      steps: [
        "Prepare your oats.",
        "Stir in **Green Papaya Powder (Unripe)**.",
        "Top with fruit and serve.",
      ],
    },
    {
      title: "Green Papaya Soup Stir-In",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      time: "5 min",
      intro: "A simple savory idea when you prefer more flexible recipe uses.",
      ingredients: [
        "1 bowl warm soup",
        "**1 tsp Green Papaya Powder (Unripe) - Organic**",
      ],
      steps: [
        "Warm your soup.",
        "Stir in **Green Papaya Powder (Unripe) - Organic**.",
        "Mix well and serve.",
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
  quizVersion = "v1",
}: MiddleSectionProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sessionIdRef = useRef(
    typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  );

  const savePart = (updates: {
    answers?: Record<string, AnswerOption>;
    email?: string;
    first_name?: string;
    completed?: boolean;
  }) => {
    fetch("/api/quiz/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionIdRef.current, quiz_version: quizVersion, ...updates }),
    }).catch(() => {});
  };

  const currentQuestion = questions[step - 1];

  const profile = useMemo(
    () => getProfile(answers.goal?.id, answers.persona?.id),
    [answers]
  );

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
      buildIdeas(
        answers.goal?.id,
        answers.routine?.id,
        answers.format?.id,
        answers.persona?.id
      ),
    [answers]
  );

  const mainProduct = useMemo(() => getMainProduct(profile.key), [profile.key]);

  const alsoWorthTrying = useMemo(
    () => getAlsoWorthTrying(mainProduct.id),
    [mainProduct.id]
  );

  const handleAnswer = (answer: AnswerOption) => {
    if (!currentQuestion) return;

    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);
    setStep((prev) => prev + 1);
    savePart({ answers: updatedAnswers });
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

      savePart({ answers, email: trimmedEmail, first_name: trimmedFirstName || undefined, completed: true });
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
            Your papaya ideas are ready!
          </h2>

          <div className="mb-5 text-3xl font-light leading-tight text-slate-900 md:text-4xl">
            Surprise <strong>GIFT</strong> — you got{" "}
            <span className="font-extrabold">$10 OFF</span>
          </div>

          <p className="mx-auto mb-7 max-w-2xl text-center text-lg leading-8 text-gray-500">
            Subscribe to get your coupon code and 3 papaya recipe ideas
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
              3 simple papaya ideas for your routine
            </div>

            <div className="space-y-6">
              {ritualIdeas.map((idea) => (
                <IdeaCard key={idea.title} idea={idea} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-5xl">
            <div className="mb-5 text-center text-xs font-extrabold tracking-[0.16em] text-gray-500">
              ALSO WORTH TRYING
            </div>

            <div className="mx-auto mt-12 max-w-5xl">
  <div className="mb-5 text-center text-xs font-extrabold tracking-[0.16em] text-gray-500">
    
  </div>

  <div className="grid gap-6 md:grid-cols-2">
    {alsoWorthTrying.map((product) => (
      <div key={product.id} className="w-full">
        <SecondaryProductCard product={product} />
      </div>
    ))}
  </div>
</div>
          </div>
        </section>
      )}
    </main>
  );
}