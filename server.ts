import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { KiloService } from "./src/services/kiloService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/**
 * Endpoint 1: Live AI Symptom Checker & Triage
 */
app.post("/api/triage", async (req, res) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required" });
    }
    const result = await KiloService.analyzeSymptoms(symptoms);
    res.json(result);
  } catch (error: any) {
    console.error("Triage Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

/**
 * Endpoint 2: Smart FAQ & Booking Assistant
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await KiloService.chat(message, history || []);
    res.json({ response });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

/**
 * Endpoint 3: Live AI-Generated Patient Testimonials
 */
app.post("/api/testimonial-polish", async (req, res) => {
  try {
    const { feedback } = req.body;
    if (!feedback) {
      return res.status(400).json({ error: "Feedback is required" });
    }
    const polished = await KiloService.polishTestimonial(feedback);
    res.json({ polished });
  } catch (error: any) {
    console.error("Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Biney Medical Backend running on http://localhost:${PORT}`);
});
