/**
 * db.ts
 * ─────────────────────────────────────────────────────────────────
 * Lightweight, pure-JS data layer.
 * Reads CSV files bundled with the Vercel function (see vercel.json
 * includeFiles: "data/**"). No native bindings — works everywhere.
 *
 * Exposes the same queryDb / runDb interface the rest of the codebase
 * expects, so it's a drop-in replacement for the old SQLite stubs.
 * ─────────────────────────────────────────────────────────────────
 */

import fs   from "fs";
import path from "path";

// ── CSV Parser ────────────────────────────────────────────────────
function parseCsv(filePath: string): Record<string, string>[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines   = content.split("\n").filter(l => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.split(",");
      return headers.reduce((row: Record<string, string>, header, i) => {
        row[header] = (values[i] ?? "").trim();
        return row;
      }, {});
    });
  } catch {
    return [];
  }
}

// ── Lazy-loaded tables (loaded once, cached in module scope) ──────
let _doctors:      Record<string, string>[] | null = null;
let _treatments:   Record<string, string>[] | null = null;
let _appointments: Record<string, string>[] | null = null;
let _patients:     Record<string, string>[] | null = null;

const DATA_DIR = path.join(process.cwd(), "data");

function getDoctors()      { return (_doctors      ??= parseCsv(path.join(DATA_DIR, "doctors.csv"))); }
function getTreatments()   { return (_treatments   ??= parseCsv(path.join(DATA_DIR, "treatments.csv"))); }
function getAppointments() { return (_appointments ??= parseCsv(path.join(DATA_DIR, "appointments.csv"))); }
function getPatients()     { return (_patients     ??= parseCsv(path.join(DATA_DIR, "patients.csv"))); }

// ── In-process session store ──────────────────────────────────────
// On Vercel serverless, function instances can be reused within a
// warm period. The client always sends full history with each request
// so sessions are rebuilt from the client payload — the server store
// is an optimistic cache for the /api/history endpoint only.
export const sessionStore = new Map<string, { role: string; content: string }[]>();

export async function saveToSession(sessionId: string, role: string, content: string) {
  if (!sessionStore.has(sessionId)) sessionStore.set(sessionId, []);
  sessionStore.get(sessionId)!.push({ role, content });
}

export async function getSessionHistory(sessionId: string) {
  return sessionStore.get(sessionId) ?? [];
}

// ── queryDb — SQL-like interface over CSV tables ──────────────────
// Supports the queries actually used in kiloService.ts:
//   SELECT * FROM doctors
//   SELECT DISTINCT treatment_type FROM treatments
//   SELECT * FROM treatments WHERE treatment_type LIKE ?
export async function queryDb(sql: string, params: unknown[] = []): Promise<Record<string, string>[]> {
  const q = sql.trim().toLowerCase();

  // ── doctors ──────────────────────────────────────────────────
  if (q.includes("from doctors")) {
    return getDoctors();
  }

  // ── SELECT DISTINCT treatment_type FROM treatments ────────────
  if (q.includes("distinct treatment_type")) {
    const seen = new Set<string>();
    return getTreatments()
      .filter(r => {
        if (seen.has(r.treatment_type)) return false;
        seen.add(r.treatment_type);
        return true;
      })
      .map(r => ({ treatment_type: r.treatment_type }));
  }

  // ── SELECT * FROM treatments WHERE treatment_type LIKE ? ──────
  if (q.includes("from treatments") && q.includes("like")) {
    const pattern = String(params[0] ?? "")
      .replace(/%/g, "")
      .toLowerCase();
    return getTreatments().filter(r =>
      r.treatment_type?.toLowerCase().includes(pattern)
    );
  }

  // ── appointments ──────────────────────────────────────────────
  if (q.includes("from appointments")) {
    return getAppointments();
  }

  // ── patients ──────────────────────────────────────────────────
  if (q.includes("from patients")) {
    return getPatients();
  }

  return [];
}

// runDb kept for API compatibility — CSV layer is read-only.
export async function runDb(_sql: string, _params: unknown[] = []): Promise<void> {}
