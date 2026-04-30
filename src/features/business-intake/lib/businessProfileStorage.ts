import {
  businessIntakeSchema,
  type BusinessIntakeValues,
} from "../schemas/businessIntakeSchema";

const BUSINESS_PROFILE_STORAGE_KEY = "zomorod.business-profile";

export function saveBusinessProfile(profile: BusinessIntakeValues) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    BUSINESS_PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );
}

export function loadBusinessProfile(): BusinessIntakeValues | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawProfile = window.localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);

  if (!rawProfile) {
    return null;
  }

  try {
    const parsedProfile = JSON.parse(rawProfile);
    const result = businessIntakeSchema.safeParse(parsedProfile);

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
