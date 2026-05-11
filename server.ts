/**
 * server.ts — Local development entry point
 * ──────────────────────────────────────────
 * Imports the shared Express app from api/index.ts and starts a
 * local HTTP server. Vercel uses api/index.ts directly — this file
 * is only used when running `npm run server` locally.
 */

import dotenv  from "dotenv";
import path    from "path";
import express from "express";

dotenv.config();

import app from "./api/index.js";

const PORT = process.env.PORT || 3001;

// Serve the built frontend in local production-preview mode
app.use(express.static(path.join(process.cwd(), "dist")));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🏥  Biney Medical Backend → http://localhost:${PORT}\n`);
});
