import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import { KiloService } from "./src/services/kiloService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Concise request logging when explicitly debugging.
if (process.env.DEBUG_HTTP === "true") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

// Lightweight API action logger
app.use((req, res, next) => {
  if (process.env.DEBUG_HTTP === "true" && req.path.startsWith("/api")) {
    console.log(`[API] ${req.method} ${req.path}`);
  }
  next();
});


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
    const errorMsg = error.message || "Internal Server Error";
    console.error("Triage Error:", errorMsg.substring(0, 200) + (errorMsg.length > 200 ? "..." : ""));
    res.status(500).json({ error: errorMsg });
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
    const errorMsg = error.message || "Internal Server Error";
    console.error("Chat Error:", errorMsg.substring(0, 200) + (errorMsg.length > 200 ? "..." : ""));
    res.status(500).json({ error: errorMsg });
  }
});

/**
 * Endpoint 4: Fetch Session History (Phase 7)
 */
app.get("/api/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await KiloService.getSessionHistory(sessionId);
    res.set("Cache-Control", "no-store");
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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
    const errorMsg = error.message || "Internal Server Error";
    console.error("Testimonial Error:", errorMsg.substring(0, 200) + (errorMsg.length > 200 ? "..." : ""));
    res.status(500).json({ error: errorMsg });
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
    const errorMsg = error.message || "Internal Server Error";
    console.error("Health Search Error:", errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// Serve static files from the frontend dist folder
app.use(express.static(path.join(process.cwd(), "dist")));

// Handle client-side routing: serve index.html for all non-API routes
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Biney Medical Backend running on http://localhost:${PORT}`);
});
