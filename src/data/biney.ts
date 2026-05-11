/**
 * biney.ts
 * Re-exports clinic identity data from the single source of truth.
 * All clinic-specific values live in src/config/clinic.config.ts.
 */
export { CLINIC_CONFIG as BINEY, primaryPhone, clinicName } from "../config/clinic.config";

export const serviceHighlights = [
  {
    title: "Everyday medical care",
    description: "We make room for the everyday concerns families bring in: consultations, checks, follow-ups, and practical guidance when something does not feel right.",
  },
  {
    title: "ENT attention",
    description: "Ear, nose, and throat concerns are part of our listed care focus, with a patient-first approach that keeps communication simple and clear.",
  },
  {
    title: "Pregnancy support",
    description: "We support women and families through pregnancy-related visits with the calm, respectful care every patient deserves.",
  },
] as const;

export const staffPlaceholders = [
  "Clinical Team",
  "Nursing Team",
  "Reception Team",
  "Patient Care Team",
] as const;
