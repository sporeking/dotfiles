/**
 * Hypa — Pi Coding Agent Extension
 *
 * Integrates Hypa's command output compression into pi.
 * Intercepts bash tool calls and wraps them with `hypa -c "..."` to
 * compress noisy output before it reaches the context window.
 *
 * Hypa uses deterministic reducers + DSL filters (no LLM) to strip
 * known noise patterns from build tools, package managers, linters, etc.
 *
 * For commands that should NOT be compressed (interactive, streaming),
 * the model can prepend HYPARAW=1 to the command.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

// ── Configuration ─────────────────────────────────────────
const HYPA_BIN = "/home/sporeking/.local/bin/hypa";

// Commands that always bypass hypa (interactive, streaming, or git editors)
const PASSTHROUGH_PREFIXES = [
  "vim", "vi", "nano", "emacs", "less", "more", "tail -f", "top", "htop",
  "npm init", "npm login", "git commit", "git rebase -i",
];

// ── Helpers ───────────────────────────────────────────────

function shouldPassthrough(command: string): boolean {
  const trimmed = command.trim();
  // Explicit bypass: HYPARAW=1 prefix
  if (/^HYPARAW=1\s/.test(trimmed)) return true;

  // Matches a passthrough prefix
  return PASSTHROUGH_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

function hasHypa(): boolean {
  return existsSync(HYPA_BIN);
}

/**
 * Check if we should try to compress this output.
 * Single-word commands or very short commands usually don't benefit.
 */
function isCompressible(command: string): boolean {
  const trimmed = command.trim();
  // Skip one-word commands (cd, ls, pwd, etc.) — usually instant + tiny output
  if (!trimmed.includes(" ")) return false;
  return true;
}

// ── Extension Entrypoint ──────────────────────────────────

export default function (pi: ExtensionAPI) {
  if (!hasHypa()) {
    // Hypa not installed — extension is a no-op
    console.warn("[hypa] binary not found at", HYPA_BIN, "— extension disabled");
    return;
  }

  // Register custom tool: hypa
  pi.registerTool({
    name: "hypa",
    label: "Hypa",
    description:
      "Run a shell command with Hypa output compression. " +
      "Compresses noisy command output (build logs, test output, git history, " +
      "package manager output) before it enters the context window. " +
      "Uses deterministic reducers (not LLM) — safe, predictable, local-first. " +
      "For commands that need raw streaming output, add HYPARAW=1 prefix.",
    parameters: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "Shell command to execute with compression",
        },
        raw: {
          type: "boolean",
          description:
            "If true, run without compression (passthrough mode). " +
            "Use for interactive commands or when raw output is needed.",
          default: false,
        },
      },
      required: ["command"],
    },
    async execute(
      _toolCallId: string,
      params: { command: string; raw?: boolean },
      _signal: AbortSignal,
      _onUpdate: any,
      _ctx: any,
    ) {
      const { command, raw } = params;

      if (raw || shouldPassthrough(command)) {
        // Passthrough — run raw
        try {
          const result = execSync(command, {
            encoding: "utf-8",
            maxBuffer: 10 * 1024 * 1024,
            timeout: 120_000,
          });
          return {
            content: [{ type: "text", text: result }],
            details: {
              compressed: false,
              originalTokens: 0,
              compressedTokens: 0,
            },
          };
        } catch (e: any) {
          return {
            content: [
              {
                type: "text",
                text: e.stdout || e.message || String(e),
              },
            ],
            isError: true,
            details: {
              compressed: false,
              exitCode: e.status ?? -1,
            },
          };
        }
      }

      // Buffered + compressed mode
      try {
        const result = execSync(`${HYPA_BIN} -c ${JSON.stringify(command)}`, {
          encoding: "utf-8",
          maxBuffer: 10 * 1024 * 1024,
          timeout: 300_000,
        });
        const output = result;

        // Try to extract the hypa footer: [hypa: X→Y tok, -Z%, reducer=???]
        const footerMatch = output.match(
          /\[hypa:\s*(\d+)\s*[→>]\s*(\d+)\s*tok,\s*(-?\d+)%/,
        );
        const originalTokens = footerMatch
          ? parseInt(footerMatch[1], 10)
          : undefined;
        const compressedTokens = footerMatch
          ? parseInt(footerMatch[2], 10)
          : undefined;
        const savingsPercent = footerMatch
          ? parseInt(footerMatch[3], 10)
          : undefined;

        return {
          content: [{ type: "text", text: output }],
          details: {
            compressed: true,
            originalTokens,
            compressedTokens,
            savingsPercent,
          },
        };
      } catch (e: any) {
        // If hypa fails, fall back to raw execution
        try {
          const fallback = execSync(command, {
            encoding: "utf-8",
            maxBuffer: 10 * 1024 * 1024,
            timeout: 120_000,
          });
          return {
            content: [
              {
                type: "text",
                text: `[hypa-fallback] hypa compression failed, showing raw output:\n${fallback}`,
              },
            ],
            details: {
              compressed: false,
              hypaError: e.message || String(e),
            },
          };
        } catch (e2: any) {
          return {
            content: [
              {
                type: "text",
                text: e2.stdout || e2.message || String(e2),
              },
            ],
            isError: true,
            details: {
              compressed: false,
              exitCode: e2.status ?? -1,
            },
          };
        }
      }
    },
  });

  // Intercept bash tool calls — auto-wrap with hypa when beneficial
  pi.on("tool_call", (event: any, _ctx: any) => {
    try {
      if (event.toolName !== "bash") return;
      const command = event.input?.command;
      if (!command || typeof command !== "string") return;

      // Skip passthrough commands
      if (shouldPassthrough(command)) return;

      // Skip non-compressible commands
      if (!isCompressible(command)) return;

      // Automatically wrap with hypa
      event.input.command = `HYPARAW=1 ${HYPA_BIN} -c ${JSON.stringify(command)}`;

      // Signal that we're not blocking, just transforming
      return undefined;
    } catch {
      // Best effort — don't break tool calls
    }
  });

  // Add hypa footer savings info to tool results when applicable
  pi.on("tool_result", (event: any, _ctx: any) => {
    try {
      if (event.toolName !== "bash") return;
      const content = event.content;
      if (!content || !Array.isArray(content)) return;

      const text = content
        .map((c: any) => c?.text ?? "")
        .join("\n");
      const footerMatch = text.match(
        /\[hypa:\s*(\d+)\s*[→>]\s*(\d+)\s*tok,\s*(-?\d+)%/,
      );
      if (footerMatch) {
        // Attach savings metadata to details
        event.details = {
          ...event.details,
          hypaCompressed: true,
          hypaOriginalTokens: parseInt(footerMatch[1], 10),
          hypaCompressedTokens: parseInt(footerMatch[2], 10),
          hypaSavingsPercent: parseInt(footerMatch[3], 10),
        };
      }
    } catch {
      // Best effort
    }
  });
}
