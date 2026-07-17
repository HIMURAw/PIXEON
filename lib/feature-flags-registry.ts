// Plain data, kept out of lib/feature-flags.ts because a "use server" file
// may only export async functions — no consts, no types.
export const FEATURE_FLAGS = [
  {
    key: "ai_chat_assistant",
    label: "AI Destek Asistanı",
    description: "Destek widget'ındaki otomatik yanıtlayan AI sohbet sekmesi.",
  },
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number]["key"];
