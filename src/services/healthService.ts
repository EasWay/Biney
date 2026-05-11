import { BINEY } from "../data/biney";

export interface HealthTip {
  title: string;
  description: string;
  benefit: string;
}

export interface HealthNews {
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  imageKeyword: string;
}

const FACILITY_FACTS: HealthTip[] = [
  {
    title: "Care close to home",
    description: `We serve patients from ${BINEY.shortAddress}, with our centre positioned inside the Tema community we care for.`,
    benefit: "Tema",
  },
  {
    title: "Insurance-aware care",
    description: `We welcome patients using ${BINEY.acceptedInsurance.join(" and ")} and help them understand what applies to their visit.`,
    benefit: "Insurance",
  },
  {
    title: "Focused services",
    description: `Our care focus includes ${BINEY.departments.join(", ")} for individuals and families in Tema.`,
    benefit: "Patient care",
  },
];

const FACILITY_NOTES: HealthNews[] = [
  {
    title: "Find us in Tema",
    summary: BINEY.address,
    content: `We are located around Italian Flats in Community 2, Tema. Patients can call ahead before visiting so our team can guide them clearly.`,
    date: "Tema",
    category: "Contact",
    imageKeyword: "location",
  },
  {
    title: "Call before your visit",
    summary: BINEY.phones.map((phone) => phone.label).join(" / "),
    content: `For appointments, directions, or insurance questions, patients can reach us on ${BINEY.phones.map((phone) => phone.label).join(" or ")}.`,
    date: "Contact",
    category: "Contact",
    imageKeyword: "phone",
  },
  {
    title: "A calmer patient experience",
    summary: "This concept is designed around clarity, trust, and easy next steps.",
    content: "The full production site can add real team profiles, patient stories, facility photos, and department details once Biney Medical Centre provides approved materials.",
    date: "Website concept",
    category: "Experience",
    imageKeyword: "staff",
  },
];

export const fetchHealthTips = async (): Promise<HealthTip[]> => {
  return FACILITY_FACTS;
};

export const fetchHealthNews = async (): Promise<HealthNews[]> => {
  return FACILITY_NOTES;
};
export const searchHealth = async (query: string): Promise<{ results: string; simpleResults: string | null; source: string }> => {
  const apiUrl = window.location.hostname === "localhost" ? "http://localhost:3001/api/health-search" : "/api/health-search";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error("Search failed");
  return response.json();
};
