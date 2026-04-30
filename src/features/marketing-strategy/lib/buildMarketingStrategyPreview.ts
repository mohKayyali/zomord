import { type BusinessIntakeValues } from "../../business-intake/schemas/businessIntakeSchema";

export type StrategyCardItem = {
  title: string;
  description: string;
  accent?: StrategyAccent;
  icon?: StrategyIcon;
  audienceMarkers?: AudienceMarkers;
};

export type StrategyAccent = "green" | "yellow" | "orange";

export type StrategyIcon = "instagram" | "facebook" | "googleAds";

export type AudienceMarkers = {
  generationLabel: string;
  genders: Array<"male" | "female">;
};

export type BrandPositioningMap = {
  horizontalScore: number;
  verticalScore: number;
  horizontalLabels: {
    start: string;
    end: string;
  };
  verticalLabels: {
    start: string;
    end: string;
  };
  summary: string;
  explanation: string;
};

export type MarketingStrategyPreview = {
  brandPositioning: string;
  brandPositioningMap: BrandPositioningMap;
  toneOfVoice: StrategyCardItem;
  audienceBreakdown: StrategyCardItem[];
  suggestedChannels: StrategyCardItem[];
  campaignIdeas: StrategyCardItem[];
  assistantQuestion: string;
};

function getAccentFromSeed(seed: string): StrategyAccent {
  const hash = Array.from(seed).reduce(
    (total, char, index) => total + char.charCodeAt(0) * (index + 1),
    0,
  );

  const accents: StrategyAccent[] = ["green", "yellow", "orange"];

  return accents[hash % accents.length];
}

function getAudienceMarkers(
  targetAudience: BusinessIntakeValues["targetAudience"],
): AudienceMarkers {
  switch (targetAudience) {
    case "Youth":
      return {
        generationLabel: "Gen Z",
        genders: ["male", "female"],
      };
    case "University Students":
      return {
        generationLabel: "Gen Z",
        genders: ["male", "female"],
      };
    case "Families":
      return {
        generationLabel: "Millennial Parents",
        genders: ["male", "female"],
      };
    case "Businesses":
      return {
        generationLabel: "Millennials / Gen X",
        genders: ["male", "female"],
      };
    case "Professionals":
      return {
        generationLabel: "Millennials / Gen X",
        genders: ["male", "female"],
      };
    case "Tourists":
      return {
        generationLabel: "Gen Z / Millennials",
        genders: ["male", "female"],
      };
    default:
      return {
        generationLabel: "Mixed",
        genders: ["male", "female"],
      };
  }
}

function getToneOfVoice(profile: BusinessIntakeValues): StrategyCardItem {
  const highBudget =
    profile.budgetRange === "$7,000 - $15,000" ||
    profile.budgetRange === "$15,000+";

  if (
    highBudget &&
    (profile.industry === "Fashion & Beauty" ||
      profile.industry === "Real Estate" ||
      profile.industry === "Hospitality & Travel")
  ) {
    return {
      title: "Luxury",
      accent: getAccentFromSeed("Luxury"),
      description:
        "Polished, premium, and aspirational. The messaging should make the offer feel elevated and worth paying more for.",
    };
  }

  if (
    profile.targetAudience === "Youth" ||
    profile.targetAudience === "University Students"
  ) {
    return {
      title: "Youthful",
      accent: getAccentFromSeed("Youthful"),
      description:
        "Fast, social, and culturally current. The voice should feel energetic, easy to share, and visually led.",
    };
  }

  if (
    profile.goal === "Leads" ||
    profile.targetAudience === "Businesses" ||
    profile.targetAudience === "Professionals" ||
    profile.industry === "Professional Services"
  ) {
    return {
      title: "Formal",
      accent: getAccentFromSeed("Formal"),
      description:
        "Clear, credible, and trustworthy. The content should reduce hesitation and make the next step feel low risk.",
    };
  }

  return {
    title: "Warm",
    accent: getAccentFromSeed("Warm"),
    description:
      "Friendly, approachable, and confidence-building. The voice should feel human while still guiding the customer toward action.",
  };
}

function getAudienceMindset(goal: BusinessIntakeValues["goal"]) {
  if (goal === "Sales") {
    return "People who already have buying intent need sharper reasons to choose this business now instead of later.";
  }

  if (goal === "Leads") {
    return "Prospects need enough trust and clarity to leave a message, book a call, or request more information.";
  }

  return "The audience needs repeated brand exposure so the business becomes familiar before asking for a harder conversion.";
}

function getMarketCue(location: BusinessIntakeValues["location"]) {
  if (location === "Jordan") {
    return "Keep the message direct and community-aware, with practical value made visible early in the creative.";
  }

  if (location === "KSA" || location === "UAE" || location === "Qatar") {
    return "The creative should feel polished and high-trust, with stronger emphasis on presentation quality and brand confidence.";
  }

  return "The message should stay easy to understand, mobile-first, and designed to work well in mixed Arabic and English browsing habits.";
}

function getChannelReason(
  channel: "Instagram" | "Facebook" | "Google Ads",
  profile: BusinessIntakeValues,
) {
  if (channel === "Instagram") {
    return profile.targetAudience === "Youth" ||
      profile.targetAudience === "University Students" ||
      profile.industry === "Fashion & Beauty" ||
      profile.industry === "Restaurant & Cafe"
      ? "Strong fit for visual discovery, short-form storytelling, and shareable creative built around lifestyle and taste."
      : "Useful for shaping brand perception with visuals, testimonials, and repeated exposure across feeds and reels.";
  }

  if (channel === "Facebook") {
    return profile.targetAudience === "Families" ||
      profile.targetAudience === "Businesses"
      ? "Helpful for broader reach, retargeting, and practical campaign messaging that explains the offer clearly."
      : "Supports retargeting and wider local reach, especially when the business needs repetition and trust signals.";
  }

  return profile.goal === "Leads" || profile.goal === "Sales"
    ? "Captures active intent from people already searching for a solution, product, or provider in this category."
    : "Adds high-intent visibility around brand and category keywords so awareness grows around relevant searches.";
}

function getCampaignIdeas(profile: BusinessIntakeValues) {
  return [
    {
      title: `${profile.businessName} launch hook`,
      accent: getAccentFromSeed(`${profile.businessName} launch hook`),
      description: `Introduce ${profile.businessName} with a concise promise tailored to ${profile.targetAudience.toLowerCase()} in ${profile.location}. Focus on what makes the offer easier, better, or more desirable.`,
    },
    {
      title: `${profile.goal} offer series`,
      accent: getAccentFromSeed(`${profile.goal} offer series`),
      description:
        profile.goal === "Sales"
          ? "Create a conversion-focused sequence with urgency, featured products or services, and a clear action to buy now."
          : profile.goal === "Leads"
            ? "Build a lead capture sequence around consultations, bookings, demos, or quote requests with low-friction calls to action."
            : "Run a visibility series built on repeatable brand cues, memorable visuals, and simple message recall.",
    },
    {
      title: `Local proof for ${profile.location}`,
      accent: getAccentFromSeed(`Local proof for ${profile.location}`),
      description: `Use testimonials, before-and-after examples, social proof, or trust markers that feel relevant to audiences in ${profile.location}.`,
    },
    {
      title: `${profile.industry} education angle`,
      accent: getAccentFromSeed(`${profile.industry} education angle`),
      description: `Publish short educational content that helps ${profile.targetAudience.toLowerCase()} understand how to choose well in the ${profile.industry.toLowerCase()} space, with the business positioned as the trusted guide.`,
    },
  ];
}

function clampScore(score: number) {
  return Math.max(-100, Math.min(100, score));
}

function describeHorizontalTilt(score: number) {
  if (score >= 35) {
    return "premium";
  }

  if (score >= 12) {
    return "slightly premium";
  }

  if (score <= -35) {
    return "accessible";
  }

  if (score <= -12) {
    return "slightly accessible";
  }

  return "balanced";
}

function describeVerticalTilt(score: number) {
  if (score >= 35) {
    return "formal";
  }

  if (score >= 12) {
    return "slightly formal";
  }

  if (score <= -35) {
    return "youthful";
  }

  if (score <= -12) {
    return "slightly youthful";
  }

  return "balanced";
}

function toSentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildBrandPositioningMap(
  profile: BusinessIntakeValues,
  toneOfVoice: StrategyCardItem,
): BrandPositioningMap {
  let horizontalScore = 0;
  let verticalScore = 0;

  const premiumReasons: string[] = [];
  const formalReasons: string[] = [];

  const addHorizontal = (value: number, reason: string) => {
    horizontalScore += value;

    if (reason) {
      premiumReasons.push(reason);
    }
  };

  const addVertical = (value: number, reason: string) => {
    verticalScore += value;

    if (reason) {
      formalReasons.push(reason);
    }
  };

  switch (profile.industry) {
    case "Fashion & Beauty":
      addHorizontal(22, "fashion and beauty signals support a more premium perception");
      addVertical(-12, "the category usually performs better with a more trend-aware voice");
      break;
    case "Real Estate":
      addHorizontal(24, "real estate positioning tends to reward a more premium promise");
      addVertical(12, "buyers expect a more composed and trust-led message");
      break;
    case "Hospitality & Travel":
      addHorizontal(18, "hospitality offers usually benefit from a polished presentation");
      addVertical(-8, "the category still works best when it feels lively and inviting");
      break;
    case "Professional Services":
      addHorizontal(10, "professional services benefit from a higher-value presentation");
      addVertical(16, "the category needs a more formal and credible posture");
      break;
    case "Technology":
      addHorizontal(8, "technology can support a stronger value and innovation signal");
      addVertical(6, "buyers usually expect clarity and confidence from technology brands");
      break;
    case "Health & Wellness":
      addHorizontal(8, "health and wellness brands often benefit from a quality-first feel");
      addVertical(6, "the message should still feel trusted and reassuring");
      break;
    case "Education":
      addHorizontal(-2, "education often works better when it feels reachable and practical");
      addVertical(8, "the category usually needs more clarity and authority");
      break;
    case "Restaurant & Cafe":
      addHorizontal(4, "food brands can lift perceived value with a stronger experience angle");
      addVertical(-10, "restaurants usually perform better with a warmer and more social tone");
      break;
    case "E-commerce":
      addHorizontal(-6, "e-commerce often wins when the offer feels easy and accessible");
      addVertical(-4, "the tone can stay lighter and more conversion-friendly");
      break;
    case "Automotive":
      addHorizontal(2, "automotive can support a modest premium cue when the service looks dependable");
      addVertical(8, "buyers still expect direct and trust-building communication");
      break;
    default:
      break;
  }

  switch (profile.budgetRange) {
    case "$300 - $1,000":
      addHorizontal(-22, "a smaller budget usually points to a more accessible market entry");
      break;
    case "$1,000 - $3,000":
      addHorizontal(-8, "the current budget suggests a practical, reachable positioning");
      break;
    case "$3,000 - $7,000":
      addHorizontal(8, "this budget supports a more polished perceived value");
      break;
    case "$7,000 - $15,000":
      addHorizontal(20, "a stronger budget allows the brand to present itself more premium");
      break;
    case "$15,000+":
      addHorizontal(30, "the budget supports a clearly premium market posture");
      break;
    default:
      break;
  }

  switch (profile.targetAudience) {
    case "Businesses":
      addHorizontal(8, "business audiences often respond to stronger value signaling");
      addVertical(18, "business buyers typically expect a more formal tone");
      break;
    case "Professionals":
      addHorizontal(8, "professional audiences often reward expertise and perceived quality");
      addVertical(20, "professional buyers usually expect a more composed voice");
      break;
    case "Youth":
      addHorizontal(-8, "youth audiences usually respond better to a more reachable offer");
      addVertical(-22, "youth-focused campaigns work better when the tone feels energetic");
      break;
    case "University Students":
      addHorizontal(-10, "student audiences tend to be more price-aware and accessibility-led");
      addVertical(-25, "student-targeted messaging usually needs a more youthful tone");
      break;
    case "Families":
      addHorizontal(-2, "family positioning works best when value still feels practical");
      addVertical(4, "families often respond to a steadier and more reassuring message");
      break;
    case "Tourists":
      addHorizontal(4, "tourist-facing offers can benefit from a more polished presentation");
      addVertical(-8, "travel audiences usually respond to an inviting and lighter tone");
      break;
    default:
      break;
  }

  switch (profile.goal) {
    case "Leads":
      addHorizontal(2, "lead generation benefits from a little more perceived trust and value");
      addVertical(16, "lead generation often needs a more structured and trust-building voice");
      break;
    case "Sales":
      addVertical(4, "sales messaging still needs a baseline of clarity and confidence");
      break;
    case "Awareness":
      addHorizontal(4, "awareness campaigns can support a stronger brand-led perception");
      addVertical(-12, "awareness work often allows a lighter and more expressive tone");
      break;
    default:
      break;
  }

  switch (toneOfVoice.title) {
    case "Luxury":
      addHorizontal(26, "the current tone of voice is explicitly premium");
      addVertical(14, "luxury positioning usually sounds more composed than casual");
      break;
    case "Formal":
      addHorizontal(6, "formal messaging slightly lifts perceived value");
      addVertical(28, "the strategy already leans formal in tone");
      break;
    case "Youthful":
      addHorizontal(-4, "a youthful voice often makes the brand feel more reachable");
      addVertical(-30, "the strategy already leans youthful in tone");
      break;
    case "Warm":
      addVertical(-6, "a warm tone softens the message and keeps it approachable");
      break;
    default:
      break;
  }

  if (profile.location === "KSA" || profile.location === "UAE" || profile.location === "Qatar") {
    addHorizontal(6, `${profile.location} audiences often reward stronger presentation quality`);
    addVertical(4, `${profile.location} campaigns usually benefit from a more polished tone`);
  } else if (profile.location === "Kuwait") {
    addHorizontal(4, "Kuwait campaigns can support a slightly more premium frame");
  } else if (profile.location === "Egypt") {
    addHorizontal(-2, "the offer may need to stay a bit more accessible in positioning");
  }

  const horizontal = clampScore(horizontalScore);
  const vertical = clampScore(verticalScore);
  const horizontalTilt = describeHorizontalTilt(horizontal);
  const verticalTilt = describeVerticalTilt(vertical);

  const primaryPremiumReason =
    premiumReasons[premiumReasons.length - 1] ??
    "the current inputs shape the value perception";
  const primaryFormalReason =
    formalReasons[formalReasons.length - 1] ??
    "the current inputs shape the communication style";

  return {
    horizontalScore: horizontal,
    verticalScore: vertical,
    horizontalLabels: {
      start: "Accessible",
      end: "Premium",
    },
    verticalLabels: {
      start: "Formal",
      end: "Youthful",
    },
    summary:
      horizontalTilt === "balanced" && verticalTilt === "balanced"
        ? "This position stays close to the center, which suggests a balanced value and tone direction."
        : `This position currently leans ${horizontalTilt} on value perception and ${verticalTilt} in communication style.`,
    explanation: `${toSentenceCase(primaryPremiumReason)}. ${toSentenceCase(primaryFormalReason)}.`,
  };
}

export function buildMarketingStrategyPreview(
  profile: BusinessIntakeValues,
): MarketingStrategyPreview {
  const toneOfVoice = getToneOfVoice(profile);
  const brandPositioningMap = buildBrandPositioningMap(profile, toneOfVoice);
  const notesSentence = profile.additionalNotes.trim()
    ? ` The strategy should also respect this extra business context: ${profile.additionalNotes.trim()}.`
    : "";

  return {
    brandPositioning: `${profile.businessName} should position itself as a ${toneOfVoice.title.toLowerCase()} ${profile.industry.toLowerCase()} brand for ${profile.targetAudience.toLowerCase()} in ${profile.location}. The message should connect the business to a clear practical outcome, then support it with confident visuals and direct calls to action aligned with a ${profile.goal.toLowerCase()} objective.${notesSentence}`,
    brandPositioningMap,
    toneOfVoice,
    audienceBreakdown: [
      {
        title: `Primary segment: ${profile.targetAudience}`,
        accent: getAccentFromSeed(`Primary segment: ${profile.targetAudience}`),
        audienceMarkers: getAudienceMarkers(profile.targetAudience),
        description: `This is the first audience the messaging should prioritize across landing content, ads, and organic creative.`,
      },
      {
        title: "Decision mindset",
        accent: getAccentFromSeed("Decision mindset"),
        description: getAudienceMindset(profile.goal),
      },
      {
        title: `${profile.location} market cue`,
        accent: getAccentFromSeed(`${profile.location} market cue`),
        description: getMarketCue(profile.location),
      },
    ],
    suggestedChannels: [
      {
        title: "Instagram",
        icon: "instagram",
        accent: getAccentFromSeed("Instagram"),
        description: getChannelReason("Instagram", profile),
      },
      {
        title: "Facebook",
        icon: "facebook",
        accent: getAccentFromSeed("Facebook"),
        description: getChannelReason("Facebook", profile),
      },
      {
        title: "Google Ads",
        icon: "googleAds",
        accent: getAccentFromSeed("Google Ads"),
        description: getChannelReason("Google Ads", profile),
      },
    ],
    campaignIdeas: getCampaignIdeas(profile),
    assistantQuestion:
      "What would you like me to refine first: positioning, tone, channels, or campaign ideas?",
  };
}
