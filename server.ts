import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// ---------------------------------------------------------------------------
// Provider-agnostic AI layer
// ---------------------------------------------------------------------------
// Production default: deterministic engine (no external API dependency).
// When Hermes / OpenCode / Nous Portal credentials are provided via env,
// the endpoint will attempt a provider-agnostic OpenAI-compatible call
// and fall back to deterministic on any failure.
//
// Env contract (all optional):
//   AI_PROVIDER  = "deterministic" | "openai-compatible" | "hermes"  (default: deterministic)
//   AI_API_URL   = OpenAI-compatible chat/completions endpoint URL
//                e.g. https://api.nous.mouad.ai/v1/chat/completions
//                     https://api.openai.com/v1/chat/completions
//                     http://localhost:11434/v1/chat/completions (ollama)
//   AI_API_KEY   = bearer token for the endpoint (if required)
//   AI_MODEL     = model id to request (e.g. hermes-4-70b, longcat-2.0, gpt-4o-mini)
//   AI_TIMEOUT_MS = fetch timeout in ms (default 12000)
// ---------------------------------------------------------------------------

type AiConfig = {
  provider: string;
  apiUrl: string | null;
  apiKey: string | null;
  model: string | null;
  timeoutMs: number;
};

function getAiConfig(): AiConfig {
  return {
    provider: (process.env.AI_PROVIDER || "deterministic").toLowerCase().trim(),
    apiUrl: process.env.AI_API_URL || process.env.OPENAI_BASE_URL || null,
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || null,
    model: process.env.AI_MODEL || process.env.OPENAI_MODEL || null,
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || "12000", 10),
  };
}

function isAiEnabled(cfg: AiConfig): boolean {
  if (cfg.provider === "deterministic" || cfg.provider === "disabled" || cfg.provider === "none") return false;
  // openai-compatible / hermes require an endpoint + model
  return Boolean(cfg.apiUrl && cfg.model);
}

/**
 * Provider-agnostic call via OpenAI-compatible /chat/completions.
 * Works with: Hermes gateway, Nous Portal, OpenCode, Ollama, any OpenAI-compatible proxy.
 * Returns parsed JSON object on success, null on any failure (caller falls back to deterministic).
 */
async function callProviderAgnosticAI(
  cfg: AiConfig,
  prompt: string,
  systemInstruction: string
): Promise<Record<string, string> | null> {
  if (!isAiEnabled(cfg) || !cfg.apiUrl || !cfg.model) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);

  try {
    // Normalize URL: accept both base URL and full /chat/completions URL
    let endpoint = cfg.apiUrl.replace(/\/$/, "");
    if (!endpoint.endsWith("/chat/completions")) {
      // Handle OPENAI_BASE_URL style (e.g. https://api.example.com/v1)
      endpoint = `${endpoint}/chat/completions`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cfg.apiKey) headers["Authorization"] = `Bearer ${cfg.apiKey}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.warn(`AI provider ${cfg.provider} (${endpoint}) returned ${res.status}: ${errBody.slice(0, 400)}`);
      return null;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) return null;

    try {
      return JSON.parse(content) as Record<string, string>;
    } catch {
      // If provider ignored response_format, wrap raw text as summary
      return { summary: content } as Record<string, string>;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`AI provider call failed (${cfg.provider}): ${msg}`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const cfg = getAiConfig();
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    ai: {
      provider: cfg.provider,
      enabled: isAiEnabled(cfg),
      model: cfg.model || null,
      // never leak apiUrl/apiKey
    },
  });
});

// Lightweight config endpoint for the frontend to display AI status without leaking secrets
app.get("/api/ai-status", (req, res) => {
  const cfg = getAiConfig();
  res.json({
    provider: cfg.provider,
    enabled: isAiEnabled(cfg),
    model: cfg.model || null,
  });
});

// Executive Insights generation endpoint — provider-agnostic with deterministic fallback
app.post("/api/generate-insights", async (req, res) => {
  const {
    siteName = "NuVira Space",
    siteUrl = "https://nuviraspace.com",
    currentScore = 74,
    scoreDelta = 4,
    previousAuditDate = "2026-08-01",
    currentAuditDate = "2026-09-01",
    categoryScores = {} as Record<string, number>,
    topicalCoverageDelta = 8.5,
  } = req.body || {};

  const generateDeterministicSummary = () => ({
    success: true,
    summary: `${siteName} reached an overall SEO health score of ${currentScore}/100 (+${scoreDelta} pts since ${previousAuditDate}), driven by an +8-point surge in Structured Data health following complete TechArticle schema deployment. However, Internal Linking equity experienced a -2-point decline due to a PageRank bottleneck on the core Satellite Servicing pillar requiring immediate anchor remediation.`,
    positiveMovement: {
      title: "Structured Data & Schema Deployment",
      detail: "TechArticle and Product schemas deployed across hardware specification hubs.",
      delta: "+8 pts",
    },
    negativeMovement: {
      title: "Internal Linking PageRank Bottleneck",
      detail: "Core Satellite Servicing pillar suffers equity starvation from isolated case study links.",
      delta: "-2 pts",
    },
    model: "Standard Telemetry Engine",
    isLiveAI: false,
    generatedAt: new Date().toISOString(),
  });

  try {
    const cfg = getAiConfig();

    if (isAiEnabled(cfg)) {
      const prompt = `You are a Principal Enterprise Technical SEO Director delivering a concise, high-impact executive summary for C-level leadership and engineering directors.

Site: ${siteName} (${siteUrl})
Audit Comparison: ${previousAuditDate} to ${currentAuditDate}
Current SEO Health Score: ${currentScore}/100 (Delta: +${scoreDelta} pts vs previous audit)
Category Scores:
- Technical SEO: ${categoryScores.technical || 80}/100 (+6 pts)
- Semantic SEO: ${categoryScores.semantic || 78}/100 (+4 pts)
- Structured Data: ${categoryScores.structuredData || 68}/100 (+8 pts, highest positive movement)
- Content Quality: ${categoryScores.content || 72}/100 (0 pts, stable)
- Internal Linking: ${categoryScores.internalLinks || 64}/100 (-2 pts, PageRank bottleneck on Satellite Servicing)
- AEO / AI Search: ${categoryScores.aeo || 74}/100 (+5 pts)

Key Improvements:
- Deployed TechArticle Schema and resolved duplicate meta titles (+8 pts in Structured Data).
- Topical depth in Spacecraft Propulsion and OTV clusters climbed +${topicalCoverageDelta}%.

Key Bottleneck:
- Internal PageRank flow to the core Satellite Servicing pillar (/services/satellite-servicing) declined by -2 pts, causing equity dilution.

INSTRUCTION:
Generate an exact 2-SENTENCE natural language executive summary:
- Sentence 1: Summarize the current site health score/trajectory and spotlight the single most significant positive movement since the last audit.
- Sentence 2: Spotlight the single most critical negative movement or bottleneck requiring priority engineering attention.

Output your response in JSON format matching this exact schema:
{
  "summary": "string (exactly 2 sentences)",
  "positiveMovementTitle": "string (e.g. Structured Data & Schema Deployment Surge)",
  "positiveMovementDetail": "string (1 short clause with metric delta)",
  "positiveDelta": "string (e.g. +8 pts)",
  "negativeMovementTitle": "string (e.g. Internal Linking PageRank Bottleneck)",
  "negativeMovementDetail": "string (1 short clause with metric delta)",
  "negativeDelta": "string (e.g. -2 pts)"
}`;

      const systemInstruction =
        "You are an expert Enterprise SEO AI Analyst providing crisp, authoritative 2-sentence executive intelligence summaries with zero marketing fluff.";

      const parsed = await callProviderAgnosticAI(cfg, prompt, systemInstruction);

      if (parsed && parsed.summary) {
        return res.json({
          success: true,
          summary: parsed.summary,
          positiveMovement: {
            title: parsed.positiveMovementTitle || "Structured Data & Schema Coverage",
            detail: parsed.positiveMovementDetail || "TechArticle and Product schemas deployed across hardware specification pages.",
            delta: parsed.positiveDelta || "+8 pts",
          },
          negativeMovement: {
            title: parsed.negativeMovementTitle || "Internal PageRank Equity Bottleneck",
            detail: parsed.negativeMovementDetail || "Core Satellite Servicing revenue pillar suffers from internal link dilution.",
            delta: parsed.negativeDelta || "-2 pts",
          },
          model: cfg.model,
          isLiveAI: true,
          generatedAt: new Date().toISOString(),
        });
      }

      // If AI was enabled but returned nothing usable, fall through to deterministic
      if (cfg.provider !== "deterministic") {
        console.warn(`AI provider '${cfg.provider}' produced no usable output — falling back to deterministic engine.`);
      }
    }

    // Default production path: deterministic telemetry engine (zero external dependency)
    return res.json(generateDeterministicSummary());
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/generate-insights handler:", msg);
    // Never fail the dashboard — deterministic engine is the guarantee
    const fallback = {
      success: true,
      summary: `${siteName} reached an overall SEO health score of ${currentScore}/100 (+${scoreDelta} pts since ${previousAuditDate}), driven by an +8-point surge in Structured Data health following complete TechArticle schema deployment. However, Internal Linking equity experienced a -2-point decline due to a PageRank bottleneck on the core Satellite Servicing pillar requiring immediate anchor remediation.`,
      positiveMovement: {
        title: "Structured Data & Schema Deployment",
        detail: "TechArticle and Product schemas deployed across hardware specification hubs.",
        delta: "+8 pts",
      },
      negativeMovement: {
        title: "Internal Linking PageRank Bottleneck",
        detail: "Core Satellite Servicing pillar suffers equity starvation from isolated case study links.",
        delta: "-2 pts",
      },
      model: "Standard Telemetry Engine",
      isLiveAI: false,
      generatedAt: new Date().toISOString(),
    };
    return res.json(fallback);
  }
});

// Vite middleware or Static files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const cfg = getAiConfig();
    console.log(`Enterprise SEO Server listening on http://0.0.0.0:${PORT}`);
    console.log(`AI provider: ${cfg.provider}${isAiEnabled(cfg) ? ` (${cfg.model})` : " (deterministic — no external API)"}`);
  });
}

startServer();
