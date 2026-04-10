/** Aligns with PBC Content Generator Specification (Google Sheet columns). */

export const SHEET_HEADERS = [
  "timestamp",
  "business_name",
  "industry",
  "email",
  "phone",
  "website",
  "topic",
  "topic_desc",
  "audience",
  "goal",
  "tone",
  "platforms",
  "keywords",
  "competitors",
  "avatar_who",
  "avatar_pain",
  "avatar_tried",
  "pillar_title",
  "cluster_1",
  "cluster_2",
  "cluster_3",
  "cluster_4",
  "cluster_5",
] as const;

export type SheetHeader = (typeof SHEET_HEADERS)[number];

export type GeneratorForm = {
  business_name: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  topic: string;
  topic_desc: string;
  audience: string;
  goal: string;
  tone: string;
  platforms: string;
  keywords: string;
  competitors: string;
  avatar_who: string;
  avatar_pain: string;
  avatar_tried: string;
};

export type StrategyResult = {
  pillar_title: string;
  cluster_1: string;
  cluster_2: string;
  cluster_3: string;
  cluster_4: string;
  cluster_5: string;
};

export const INDUSTRIES = [
  "professional",
  "trades",
  "hospitality",
  "retail",
  "health",
  "creative",
  "tech",
  "agriculture",
  "education",
  "other",
] as const;

export const GOALS = [
  "awareness",
  "leads",
  "authority",
  "engagement",
  "sales",
] as const;

export const TONES = [
  "professional",
  "friendly",
  "bold",
  "empathetic",
  "educational",
  "inspirational",
] as const;

export const PLATFORM_OPTIONS = [
  { key: "website", label: "Website" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "email", label: "Email" },
  { key: "google-business", label: "Google Business" },
] as const;
