import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { KiloService } from "../src/services/kiloService.js";

dotenv.config();

const app = express();

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
    const { message, history, sessionId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await KiloService.chat(message, history || [], sessionId);
    res.json({ response });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

/**
 * Endpoint 4: Fetch Session History
 */
app.get("/api/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await KiloService.getSessionHistory(sessionId);
    res.set("Cache-Control", "no-store");
    res.json(history);
  } catch (error: any) {
    console.error("History Error:", error);
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

/**
 * Endpoint 5: Health Education Search
 */
app.post("/api/health-search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const result = await KiloService.searchHealth(query);
    res.json(result);
  } catch (error: any) {
    console.error("Health Search Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Export for Vercel
export default app;

