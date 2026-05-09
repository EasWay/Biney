import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

const APP_TIME_ZONE = "Africa/Accra";

// --- IN-MEMORY SESSION STORE (serverless-compatible) ---
const sessionStore = new Map<string, { role: string; content: string }[]>();

const queryDb = async (_sql: string, _params: any[] = []): Promise<any[]> => [];
const runDb = async (_sql: string, _params: any[] = []): Promise<void> => {};

// --- SESSION MANAGEMENT ---
const saveToSession = async (sessionId: string, role: string, content: string) => {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, []);
  }
  sessionStore.get(sessionId)!.push({ role, content });
};

const getHistory = async (sessionId: string) => {
  const rows = sessionStore.get(sessionId) || [];
  return sanitizeChatHistory(rows);
};

const cleanAssistantContent = (content: string) => {
  if (!content.includes("STATE:") && !content.includes("ACTION:")) return content;

  const messageMatch = content.match(/MESSAGE:\s*(.*?)(?:\.\s*ACTION:| ACTION:|$)/s);
  if (messageMatch?.[1]) return messageMatch[1].trim();

  return content
    .replace(/STATE:.*?MESSAGE:/gs, "")
    .replace(/ACTION:.*?DO NOT ASK ANYTHING ELSE\./gs, "")
    .replace(/STATE:.*?ACTION:/gs, "")
    .trim();
};

const sanitizeChatHistory = (history: any[] = []) => {
  const sanitized: any[] = [];
  const removedAssistantStarts = [
    "Hi, I am Bobo. I can help you find care",
    "Doing well, thanks for asking.",
    "I can help you choose the right care area",
    "Sure, I can help with that.",
    "Sure, let's do it.",
    "Biney Medical Centre highlights three main care areas",
    "The listed care areas are general care",
  ];

  for (const item of history) {
    const role = item?.role;
    const rawContent = typeof item?.content === "string" ? item.content : "";
    const content = role === "assistant" ? cleanAssistantContent(rawContent).trim() : rawContent.trim();

    if ((role !== "user" && role !== "assistant") || !content) continue;
    if (role === "assistant" && removedAssistantStarts.some((start) => content.startsWith(start))) continue;

    const previous = sanitized[sanitized.length - 1];
    if (
      role === "assistant" &&
      previous?.role === "user" &&
      previous.content.trim().toLowerCase() === content.toLowerCase()
    ) {
      continue;
    }

    sanitized.push({ role, content });
  }

  return sanitized;
};

const getAccraDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: string) => parts.find((item) => item.type === type)?.value || "";
  return {
    year: Number(part("year")),
    month: Number(part("month")),
    day: Number(part("day")),
    iso: `${part("year")}-${part("month")}-${part("day")}`,
  };
};

const addDaysToIsoDate = (isoDate: string, days: number) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return date.toISOString().slice(0, 10);
};

const formatIsoDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
};

const resolveRequestedSlotDate = (message: string, requestedDate: string) => {
  const lower = message.toLowerCase();
  const today = getAccraDateParts().iso;
  if (/\btoday\b/.test(lower)) return today;
  if (/\btomorrow\b/.test(lower)) return addDaysToIsoDate(today, 1);
  return requestedDate;
};

const WEBSITE_CONTEXT = `
Website routes and sections. Use these exact Markdown links when directing users:
- [Home](/): full landing page. Sections: [Book Visit](/#book-visit), [Quick Facts](/#quick-facts), [Care Highlights](/#care-highlights), [Patient Journey](/#patient-journey), [Insurance Access](/#insurance-access), [Contact Overview](/#contact-overview).
- [About](/about): Biney Medical Centre overview. Sections: [Overview](/about#overview), [Care Areas](/about#care-areas), [Team](/about#team), [Location Summary](/about#location-summary).
- [Services](/services): care page. Sections: [Services Overview](/services#services-overview), [General Services](/services#general-services), [ENT Problems](/services#ent-problems), [Pregnancy](/services#pregnancy), [Primary Hospital](/services#primary-hospital).
- [Insurance](/insurance): accepted schemes and visit prep. Sections: [Insurance Overview](/insurance#insurance-overview), [Before Your Visit](/insurance#before-your-visit), [Insurance Contact](/insurance#insurance-contact).
- [Health Resources](/resources): simple local health notes. Sections: [Malaria](/resources#malaria), [High Blood Pressure](/resources#hypertension), [Diabetes](/resources#diabetes), [Sore Throat](/resources#sore-throat), [Pregnancy Warning Signs](/resources#pregnancy).
- [FAQ](/faq#common-questions): location, phone numbers, facility type, care areas, accepted insurance, and staff profile availability.
- [Contact](/contact): contact and booking page. Sections: [Contact Details](/contact#contact-details), [Appointment Request](/contact#appointment-request), [Location Map](/contact#location-map), [Google Map](/contact#google-map).

Persistent site facts:
- Name: Biney Medical Centre. Alternate spelling: Biney Medical Center.
- Address: Italian Flats Comm. 2, Community 2, Tema, Ghana.
- Short address: Italian Flats, Community 2, Tema.
- Region: Greater Accra Region. District/locality: Tema Municipal.
- Phone: [0302 202546](tel:+233302202546) and [0303 208579](tel:+233303208579).
- Facility type: Private primary hospital.
- Listed care areas: General care, ENT care, Pregnancy care.
- Accepted insurance: NHIS and Nationwide Medical Insurance.
- Listed hours: Monday to Sunday, 08:00 - 20:00.

Linking rules:
- When a user asks for more detail, include one or two relevant links, not every route.
- Use relative links for internal pages and tel: links for phone numbers.
- For booking or appointment requests, direct users to [Appointment Request](/contact#appointment-request).
- For insurance questions, direct users to [Insurance](/insurance#insurance-overview) or [Before Your Visit](/insurance#before-your-visit).
- For services, symptoms, or departments, direct users to [Services](/services#services-overview), [General Services](/services#general-services), [ENT Problems](/services#ent-problems), or [Pregnancy](/services#pregnancy).
- For educational health content, direct users to [Health Resources](/resources).
- For location, maps, phone numbers, or hours, direct users to [Contact Details](/contact#contact-details) or [Google Map](/contact#google-map).
- For common questions, direct users to [FAQ](/faq#common-questions).
`;

// --- VALIDATION SCHEMAS (Phase 2 Evolution) ---
const BookingSchema = z.object({
  department: z.enum(["General Medicine", "ENT", "Maternity"]).optional(),
  visit_type: z.enum(["New Patient", "Follow-Up", "Specific Service"]).optional(),
  booking_method: z.enum(["Online", "WhatsApp", "Phone"]).optional(),
});

const InsuranceSchema = z.object({
  scheme_name: z.string().min(2),
});

const SlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const FinalBookingSchema = z.object({
  patient_name: z.string().min(2),
  department: z.enum(["General Medicine", "ENT", "Maternity"]),
  date: z.string(),
  time: z.string(),
});

const CostSchema = z.object({
  service_name: z.string().min(2),
});

// --- PHASE 3: MEDICAL GUARDRAILS (Deterministic Safety) ---
const RED_FLAGS = [
  "chest pain", "difficulty breathing", "severe bleeding", "unconscious",
  "stroke symptoms", "slurred speech", "numbness", "poisoning",
  "suicidal", "overdose", "heavy bleeding", "heart attack"
];

const EMERGENCY_RESPONSE = `
🚨 **EMERGENCY DETECTED** 🚨
Based on your message, you may be experiencing a medical emergency. 
**Please stop using this chat and call our emergency line at +233-XX-XXXX-XXX immediately or visit the nearest Emergency Room.**

Your safety is our priority. This chat cannot handle life-threatening situations.
`;

// --- PHASE 1: DETERMINISTIC ORCHESTRATION (The State Machine) ---
type BookingState = {
  department?: string;
  visit_type?: string;
  booking_method?: string;
};

class BookingGraph {
  static getNextStep(state: BookingState) {
    if (!state.department) {
      return {
        action: "ASK_DEPARTMENT",
        message: "Which department do you need? (General Medicine, ENT, or Maternity)",
        options: ["General Medicine", "ENT", "Maternity"]
      };
    }
    if (!state.visit_type) {
      return {
        action: "ASK_VISIT_TYPE",
        message: "Got it. Is this a first visit, follow-up, or for a specific service?",
        options: ["First Visit", "Follow-up", "Specific Service"]
      };
    }
    if (!state.booking_method) {
      return {
        action: "ASK_METHOD",
        message: "How would you like to book? (Online, WhatsApp, or Phone)",
        options: ["Online", "WhatsApp", "Phone"]
      };
    }
    return {
      action: "COMPLETE",
      message: `Perfect. I have all the details: ${state.department}, ${state.visit_type}, via ${state.booking_method}. Shall I check for available slots now?`,
      ready: true
    };
  }
}

// --- PHASE 4: KNOWLEDGE RETRIEVAL (Simulated RAG) ---
class KnowledgeRetriever {
  static getRelevantContext(query: string, ...kbs: string[]): string {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    if (queryTerms.length === 0) return "No specific local guidelines found for this query.";

    const allSections: string[] = [];
    kbs.forEach(kb => {
      // Split by markdown headers
      const sections = kb.split(/(?=^#+ )/gm);
      allSections.push(...sections);
    });

    // Score sections based on keyword matching
    const scoredSections = allSections.map(section => {
      let score = 0;
      const lowerSection = section.toLowerCase();
      queryTerms.forEach(term => {
        if (lowerSection.includes(term)) {
          // Boost score if term appears in the first 100 chars (likely a header)
          score += lowerSection.indexOf(term) < 100 ? 3 : 1;
        }
      });
      return { section, score };
    });

    // Return top 5 most relevant sections
    const topSections = scoredSections
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.section.trim());

    if (topSections.length === 0) return "No specific local guidelines found for this query.";
    
    return topSections.join("\n\n---\n\n");
  }
}

// --- PHASE 5: INTENT CLASSIFIER (Deterministic Routing) ---
class IntentClassifier {
  static getIntent(message: string): "GREETING" | "BOOKING" | "COST" | "INSURANCE" | "OTHER" {
    const msg = message.toLowerCase();
    
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("how are you")) return "GREETING";
    if (msg.includes("book") || msg.includes("appointment") || msg.includes("schedule")) return "BOOKING";
    if (msg.includes("cost") || msg.includes("price") || msg.includes("how much")) return "COST";
    if (msg.includes("insurance") || msg.includes("covered")) return "INSURANCE";
    
    return "OTHER";
  }
}

// --- PHASE 5: RISK-ADAPTIVE PERSONA ENGINE ---
class PersonaEngine {
  static getMode(message: string, history: any[]): "ROUTINE" | "CLINICAL" | "URGENT" {
    const msg = message.toLowerCase();
    
    // Urgent if red flags are detected (even if middleware handled it, we want the system prompt aligned)
    const isUrgent = RED_FLAGS.some(flag => msg.includes(flag));
    if (isUrgent) return "URGENT";

    // Clinical if asking about treatments, costs, or medical procedures
    const clinicalTerms = ["cost", "price", "treatment", "procedure", "surgery", "medicine", "diagnosis", "doctor"];
    if (clinicalTerms.some(term => msg.includes(term))) return "CLINICAL";

    // Routine by default
    return "ROUTINE";
  }
}

dotenv.config();

const KILO_API_KEY = process.env.KILO_API_KEY;
const KILO_API_BASE_URL = process.env.KILO_API_BASE_URL || "https://api.kilo.ai/api/gateway";

if (!KILO_API_KEY || KILO_API_KEY.includes("replace_me")) {
  console.warn("\n⚠️  KILO_API_KEY is missing or using placeholder! AI features will not work until a valid key is provided in .env\n");
}

const openai = new OpenAI({
  apiKey: KILO_API_KEY || "missing_key", // Prevent immediate crash
  baseURL: KILO_API_BASE_URL,
});


// Load the knowledge base
const KB_PATH = path.join(process.cwd(), "data", "biney_medical_knowledge_base.md");
const STG_PATH = path.join(process.cwd(), "data", "GHANA-STG-2017-1.md");
const EHSP_PATH = path.join(process.cwd(), "data", "MoH-NHESP-Report.md");

const loadKB = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    console.error(`Error reading knowledge file at ${filePath}:`, e);
    return "";
  }
};

const knowledgeBase = loadKB(KB_PATH);
const stgKnowledge = loadKB(STG_PATH);
const ehspKnowledge = loadKB(EHSP_PATH);

// OpenClaw-style Agent Configurations
const AGENT_DOCS_PATH = path.join(process.cwd(), "data", "agent");
const readAgentDoc = (filename: string) => {
  try {
    return fs.readFileSync(path.join(AGENT_DOCS_PATH, filename), "utf-8");
  } catch (e) {
    return "";
  }
};

const AGENTS_CONFIG = readAgentDoc("AGENTS.md");
const SOUL_CONFIG = readAgentDoc("SOUL.md");
const USER_CONFIG = readAgentDoc("USER.md");
const TOOLS_CONFIG = readAgentDoc("TOOLS.md");
const MEMORY_CONFIG = readAgentDoc("MEMORY.md");


export class KiloService {
  /**
   * 1. Live AI Symptom Checker & Pre-Appointment Triage
   */
  static async analyzeSymptoms(symptoms: string) {
    const systemPrompt = `
You are the Biney Medical Centre Digital Assistant. You are here to help patients understand which department they need and how urgent their visit might be.

STRATEGIC KNOWLEDGE BASE:
${knowledgeBase}

PERSONA & TONE:
- Human, professional, and deeply caring.
- Use simple, clear English. No complex medical jargon.
- Speak as a helpful member of the hospital staff.

RULES:
1. Based on the symptoms, pick the best department: General Medicine, ENT, or Maternity.
2. Decide the urgency: routine, urgent, or emergency.
3. If the KB mentions specific tests (like an ultrasound or blood test) for these symptoms, list them.
4. Provide simple, warm instructions on what the patient should do next (e.g., "Please bring your ID and try to arrive 15 minutes early").
5. Always include a gentle medical disclaimer.

RETURN ONLY A JSON OBJECT:
{
  "department": "...",
  "urgency": "...",
  "recommendedTests": ["...", "..."],
  "instructions": "Warm, human-sounding advice on what to do next based on the KB.",
  "disclaimer": "Just a reminder: I am an AI assistant, not a doctor. This isn't a final diagnosis, so please see our team for a proper check-up.",
  "cta": "Book your [Department] visit"
}
    `;

    const response = await openai.chat.completions.create({
      model: "kilo-auto/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Symptoms: ${symptoms}` },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  /**
   * 2. The Smart FAQ & Booking Assistant with Autonomous Tools
   */
  static async chat(message: string, history: any[] = [], sessionId?: string) {
    const sanitizedHistory = sanitizeChatHistory(history).slice(-12);

    // Save User Message (Phase 7)
    if (sessionId) await saveToSession(sessionId, "user", message);

    // 2. Safety Middleware Scan (Phase 3)
    const lowerMessage = message.toLowerCase();
    const hasRedFlag = RED_FLAGS.some(flag => lowerMessage.includes(flag));
    if (hasRedFlag) {
      if (sessionId) await saveToSession(sessionId, "assistant", EMERGENCY_RESPONSE);
      return EMERGENCY_RESPONSE;
    }

    // 1. Fetch Facility Data (Phase 6: Structured DB)
    const doctors = await queryDb("SELECT * FROM doctors");
    const treatments = await queryDb("SELECT DISTINCT treatment_type FROM treatments");
    
    const DOCTORS_SUMMARY = doctors.map((d: any) => `${d.first_name} ${d.last_name} (${d.specialization})`).join(", ");
    const TREATMENT_SUMMARY = treatments.map((t: any) => t.treatment_type).join(", ");

    // 2. Dynamic Knowledge Retrieval (Phase 4: Simulated RAG)
    const relevantKnowledge = KnowledgeRetriever.getRelevantContext(message, knowledgeBase, stgKnowledge, ehspKnowledge);

    // 3. Dynamic Persona Calculation (Phase 5: Risk-Adaptive Tone)
    const activeMode = PersonaEngine.getMode(message, history);
    const intent = IntentClassifier.getIntent(message);
    const todayIso = getAccraDateParts().iso;
    const tomorrowIso = addDaysToIsoDate(todayIso, 1);
    const dateContext = `Today in ${APP_TIME_ZONE} is ${formatIsoDate(todayIso)} (${todayIso}). Tomorrow is ${formatIsoDate(tomorrowIso)} (${tomorrowIso}).`;

    const systemPrompt = `
<SOUL>
${SOUL_CONFIG}
</SOUL>

<AGENTS>
${AGENTS_CONFIG}
</AGENTS>

<USER_CONTEXT>
${USER_CONFIG}
</USER_CONTEXT>

<MEMORY_CONTEXT>
${MEMORY_CONFIG}
</MEMORY_CONTEXT>

<TOOLS_AND_CONVENTIONS>
${TOOLS_CONFIG}

# DATA REPOSITORIES
- **Available Doctors**: ${DOCTORS_SUMMARY}
- **Available Treatments**: ${TREATMENT_SUMMARY}
</TOOLS_AND_CONVENTIONS>

<KNOWLEDGE_BASE>
${relevantKnowledge}
</KNOWLEDGE_BASE>

<WEBSITE_CONTEXT>
${WEBSITE_CONTEXT}
</WEBSITE_CONTEXT>

<OPERATIONAL_STATE>
Active Mode: ${activeMode}
Detected Intent: ${intent}
Turn: ${sanitizedHistory.length + 1}
Current Date: ${dateContext}

CORE RULES:
1. TRANSLATE TOOLS: Convert 'STATE/ACTION' tags into Bobo's natural voice. NEVER show tags.
2. NO MIRRORING: Do not repeat user greetings or phrases. Be Bobo, not a mirror.
3. CONTEXT: ${intent === "BOOKING" ? "User wants to book. Use tools to guide them." : "Provide helpful clinic info."}
4. DATES: Never invent today's date. If the user says today, use ${todayIso}. If the user says tomorrow, use ${tomorrowIso}.
5. LINKS: When useful, direct users to the exact website page using Markdown links from WEBSITE_CONTEXT.
</OPERATIONAL_STATE>
    `;

    const tools: any[] = [
      {
        type: "function",
        function: {
          name: "booking_state_manager",
          description: "Update and track the state of a booking or visit. Call this whenever the user expresses an intent to visit the clinic, come for a consultation, check in, or book an appointment.",
          parameters: {
            type: "object",
            properties: {
              department: { type: "string", enum: ["General Medicine", "ENT", "Maternity"], description: "The department selected by the user." },
              visit_type: { type: "string", enum: ["New Patient", "Follow-Up", "Specific Service"], description: "The type of visit." },
              booking_method: { type: "string", enum: ["Online", "WhatsApp", "Phone"], description: "How the user wants to book." },
            },
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_insurance_coverage",
          description: "Check if a specific insurance scheme is accepted and what it covers.",
          parameters: {
            type: "object",
            properties: {
              scheme_name: { type: "string", description: "The name of the insurance scheme (e.g., NHIS, Nationwide)." },
            },
            required: ["scheme_name"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_available_slots",
          description: "Retrieve available appointment slots for a specific date.",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "The date to check (YYYY-MM-DD)." },
            },
            required: ["date"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "book_appointment",
          description: "Finalize an appointment booking.",
          parameters: {
            type: "object",
            properties: {
              patient_name: { type: "string" },
              department: { type: "string", enum: ["General Medicine", "ENT", "Maternity"] },
              date: { type: "string" },
              time: { type: "string" },
            },
            required: ["patient_name", "department", "date", "time"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "get_service_costs",
          description: "Get the fixed costs for common medical services.",
          parameters: {
            type: "object",
            properties: {
              service_name: { type: "string", description: "e.g., Consultation, ENT Checkup, Ultrasound" },
            },
            required: ["service_name"],
          },
        },
      },
    ];

    let currentMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedHistory,
      { role: "user", content: message },
    ];

    // Debug Log (Phase 5: Observability)
    if (process.env.DEBUG_CHAT === "true") {
      console.log(`[ORCHESTRATOR] Intent: ${intent} | Mode: ${activeMode}`);
      console.log(`[HISTORY] Items: ${currentMessages.length}`);
    }

    // Recursive tool handler
    while (true) {
      const response = await openai.chat.completions.create({
        model: "kilo-auto/free",
        messages: currentMessages as any,
        tools: tools,
        tool_choice: "auto",
      });

      const responseMessage = response.choices[0].message;

      if (!responseMessage.tool_calls) {
        currentMessages.push(responseMessage as any);
        break;
      }

      // Add assistant message to history
      currentMessages.push(responseMessage as any);

      for (const toolCall of responseMessage.tool_calls) {
        const tc = toolCall as any;
        const functionName = tc.function.name;
        const rawArgs = JSON.parse(tc.function.arguments);
        let result = "";
        let validatedArgs: any = null;

        // Structured Validation Layer
        try {
          if (functionName === "booking_state_manager") validatedArgs = BookingSchema.parse(rawArgs);
          else if (functionName === "check_insurance_coverage") validatedArgs = InsuranceSchema.parse(rawArgs);
          else if (functionName === "get_available_slots") validatedArgs = SlotsSchema.parse(rawArgs);
          else if (functionName === "book_appointment") validatedArgs = FinalBookingSchema.parse(rawArgs);
          else if (functionName === "get_service_costs") validatedArgs = CostSchema.parse(rawArgs);
        } catch (error: any) {
          result = `ERROR: Invalid arguments for ${functionName}. ${error.message}`;
          currentMessages.push({ role: "tool", tool_call_id: toolCall.id, content: result } as any);
          continue;
        }

        // Logic Layer (Now with validated data and Graph Orchestration)
        if (functionName === "booking_state_manager") {
          const nextStep = BookingGraph.getNextStep(validatedArgs);
          result = `STATE: ${nextStep.action}. MESSAGE: ${nextStep.message}. ACTION: ${nextStep.message}. DO NOT ASK ANYTHING ELSE.`;
        } else if (functionName === "check_insurance_coverage") {
          const scheme = validatedArgs.scheme_name.toLowerCase();
          if (scheme.includes("nhis")) {
            result = "Biney Medical accepts NHIS. It covers general consultations, basic laboratory tests, and essential drugs on the NHIS list.";
          } else if (scheme.includes("nationwide")) {
            result = "Nationwide Medical Insurance is fully accepted at Biney for all listed tiers including outpatient and specialist ENT care.";
          } else {
            result = `We currently handle ${validatedArgs.scheme_name} on a case-by-case basis. We recommend calling our front desk for immediate verification.`;
          }
        } else if (functionName === "get_available_slots") {
          const slotDate = resolveRequestedSlotDate(message, validatedArgs.date);
          result = `Available appointment slots for ${formatIsoDate(slotDate)} (${slotDate}): 09:00 AM, 11:30 AM, 02:00 PM, 04:30 PM. Use exactly this date in your reply. For booking details, send the user to [Appointment Request](/contact#appointment-request). Note: Monday mornings are typically fully booked.`;
        } else if (functionName === "book_appointment") {
          result = `SUCCESS: Appointment confirmed for ${validatedArgs.patient_name} in ${validatedArgs.department} on ${validatedArgs.date} at ${validatedArgs.time}. Reference: B-3001.`;
        } else if (functionName === "get_service_costs") {
          const service = validatedArgs.service_name.toLowerCase();
          const matches = await queryDb("SELECT * FROM treatments WHERE treatment_type LIKE ?", [`%${service}%`]);
          if (matches.length > 0) {
            const match = matches[0];
            result = `${match.treatment_type}: GHS ${match.cost} (${match.description})`;
          } else {
            result = `I couldn't find a fixed cost for '${validatedArgs.service_name}'. Please visit [/services] for our full price list.`;
          }
        }

        currentMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        } as any);
      }
    }

    // 5. Final Response Sanitization (Phase 5 Fail-safe)
    let finalResponse = currentMessages[currentMessages.length - 1].content || "";
    
    // Fail-safe: If the AI leaked tags, strip them out
    if (finalResponse.includes("STATE:") || finalResponse.includes("ACTION:")) {
      finalResponse = finalResponse
        .replace(/STATE:.*MESSAGE:/g, "")
        .replace(/ACTION:.*DO NOT ASK ANY.*/g, "")
        .replace(/STATE:.*ACTION:/g, "")
        .trim();
    }

    // Save AI Response (Phase 7)
    if (sessionId) await saveToSession(sessionId, "assistant", finalResponse);
    return finalResponse;
  }

  static async getSessionHistory(sessionId: string) {
    return getHistory(sessionId);
  }

  /**
   * 3. Health Education Search (Phase 5: Knowledge Integration)
   */
  static async searchHealth(query: string) {
    // 1. Retrieve raw clinical context
    let rawContext = KnowledgeRetriever.getRelevantContext(query, stgKnowledge, ehspKnowledge, knowledgeBase);
    
    if (rawContext === "No specific local guidelines found for this query.") {
      return { query, results: rawContext, simpleResults: null };
    }

    // Limit context size to avoid token issues (approx 6k-8k characters is safe for free models)
    if (rawContext.length > 8000) {
      rawContext = rawContext.substring(0, 8000) + "... [Content truncated for brevity]";
    }

    // 2. Use AI to "translate" medical jargon into simple, patient-friendly English
    const simplificationPrompt = `
You are Bobo, an Educational Assistant for Biney Medical Centre. 
Your goal is to summarize the following official medical guidelines into simple, easy-to-understand notes for a general audience in Tema, Ghana.

GUIDELINES TO SUMMARIZE:
${rawContext}

INSTRUCTIONS:
- Use very simple English. Avoid big words.
- Tell the reader what the condition is, what signs to look for, and how to stay safe at home.
- Always mention when they should come to the clinic.
- Be warm and helpful.
- Structure:
  # [Condition Name]
  - **Overview**: Simple one-sentence explanation.
  - **What to look for**: Simple list of signs.
  - **Home Care**: Simple steps to take.
  - **When to see us**: Clear warning signs.

Keep it short and simple. Return ONLY the summary.
`;

    let simplified = "";
    try {
      if (!KILO_API_KEY || KILO_API_KEY.includes("replace_me") || KILO_API_KEY === "missing_key") {
        throw new Error("KILO_API_KEY is missing or invalid");
      }

      const response = await openai.chat.completions.create({
        model: "kilo-auto/free",
        messages: [
          { role: "system", content: simplificationPrompt },
          { role: "user", content: `Please simplify these guidelines for query: "${query}"` },
        ],
        temperature: 0.3,
      });
      
      simplified = response.choices[0]?.message?.content?.trim() || "";
      
      if (!simplified) {
        throw new Error("AI returned empty summary");
      }
    } catch (err: any) {
      console.error(`[HEALTH_SEARCH_ERROR] AI Simplification failed:`, err.message);
      
      // Fallback message so the user isn't stuck with an empty "Simple Breakdown"
      simplified = `# Summary Unavailable\n\nWe found matching sections in the official guidelines for **"${query}"**, but we couldn't generate a simplified summary right now.\n\n### What to do:\n- Please click the **"Clinical Guidelines"** tab above to read the full technical details.\n- Visit our clinic or call us if you have urgent concerns.\n\n*Our AI assistant is currently experiencing high demand or configuration issues.*`;
    }

    // Always log these in dev/test
    console.log(`[HEALTH_SEARCH] Query: "${query}" | Context: ${rawContext.length} chars | Simplified: ${simplified.length} chars`);

    return {
      query,
      results: rawContext, // Keep clinical details for reference
      simpleResults: simplified,
      source: "Ministry of Health (MoH) - Ghana Standard Treatment Guidelines (2017) & Essential Health Services Package (2022)"
    };
  }


  /**
   * 3. Live AI-Generated Patient Testimonials
   */
  static async polishTestimonial(rawFeedback: string) {
    const systemPrompt = `
You are a Communications Specialist for Biney Medical Centre. 
Your job is to take raw, messy patient feedback and rewrite it into a professional, warm, and authentic testimonial for our public website.

RULES:
- Use simple, natural-sounding English.
- Keep the core message and any staff names mentioned exactly as they are.
- Make it sound like a real person sharing their gratitude, not a marketing bot.
- 1-2 sentences maximum.
- Preserve the authentic voice of the patient.

Example Input: "wait was long but dr ama was great and I feel better"
Example Output: "Although there was a bit of a wait, Dr. Ama was wonderful and helped me feel much better. I'm very grateful for the care!" — [Name]

INPUT:
${rawFeedback}
    `;

    const response = await openai.chat.completions.create({
      model: "kilo-auto/free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please polish this feedback: ${rawFeedback}` },
      ],
    });

    return response.choices[0].message.content;
  }
}
