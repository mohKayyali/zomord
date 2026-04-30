import { z } from "zod";

export const businessIntakeSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name should be at least 2 characters."),
  industry: z.string().min(1, "Select an industry."),
  targetAudience: z.string().min(1, "Choose the primary audience."),
  location: z.string().min(1, "Select the primary market."),
  budgetRange: z.string().min(1, "Pick a budget range."),
  goal: z.enum(["Sales", "Awareness", "Leads"], {
    errorMap: () => ({ message: "Choose one marketing goal." }),
  }),
  languagePreference: z.enum(["Arabic", "English", "Both"], {
    errorMap: () => ({ message: "Choose a language preference." }),
  }),
  additionalNotes: z.string(),
});

export type BusinessIntakeValues = z.infer<typeof businessIntakeSchema>;

export type BusinessIntakeFieldErrors = Partial<
  Record<keyof BusinessIntakeValues, string>
>;

export const businessIntakeInitialValues: BusinessIntakeValues = {
  businessName: "",
  industry: "",
  targetAudience: "",
  location: "Jordan",
  budgetRange: "",
  goal: "Sales",
  languagePreference: "Both",
  additionalNotes: "",
};
