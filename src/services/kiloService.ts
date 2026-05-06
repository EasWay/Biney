import OpenAI from "openai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const KILO_API_KEY = process.env.KILO_API_KEY;
const KILO_API_BASE_URL = process.env.KILO_API_BASE_URL || "https://api.kilo.ai/v1";

if (!KILO_API_KEY || KILO_API_KEY.includes("replace_me")) {
  console.warn("\n⚠️  KILO_API_KEY is missing or using placeholder! AI features will not work until a valid key is provided in .env\n");
}

const openai = new OpenAI({
  apiKey: KILO_API_KEY || "missing_key", // Prevent immediate crash
  baseURL: KILO_API_BASE_URL,
});


// Load the knowledge base once
const KB_PATH = path.join(process.cwd(), "data", "biney_medical_knowledge_base.md");
let knowledgeBase = "";
try {
  knowledgeBase = fs.readFileSync(KB_PATH, "utf-8");
} catch (error) {
  console.error("Error reading knowledge base:", error);
}

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
      model: "kilo-auto",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Symptoms: ${symptoms}` },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  }

  /**
   * 2. The Smart FAQ & Booking Assistant
   */
  static async chat(message: string, history: any[] = []) {
    const systemPrompt = `
You are the Biney Medical Centre Assistant. You work for the hospital and are here to help patients with any questions they have about our services, hours, or booking.

STRATEGIC KNOWLEDGE BASE:
${knowledgeBase}

PERSONA & TONE:
- Extremely human, friendly, and professional.
- Use simple English. Avoid being overly "robotic" or technical.
- You are a helpful digital receptionist in Tema. Use local greetings if appropriate, but keep the main response in English.

GUIDELINES:
- Answer questions accurately using only the Knowledge Base.
- If a patient asks about insurance (like NHIS) or payments (like MTN MoMo), be very clear and helpful.
- If you don't know the answer, politely offer to have a human staff member call them.
- Always guide the patient toward booking an appointment if it seems they need care.
- Keep responses concise but warm.
    `;

    const response = await openai.chat.completions.create({
      model: "kilo-auto",
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
    });

    return response.choices[0].message.content;
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
      model: "kilo-auto",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please polish this feedback: ${rawFeedback}` },
      ],
    });

    return response.choices[0].message.content;
  }
}

