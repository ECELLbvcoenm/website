import { parseApplication, type ApplicationInput } from "./application.ts";

export type SubmissionResult = "accepted" | "duplicate" | "rate_limited" | "invalid" | "unavailable";
export type SubmitApplication = (application: ApplicationInput, ip: string) => Promise<SubmissionResult>;

function reply(status: number, message: string) {
  return Response.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function limitedJson(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) throw new Error("body too large");
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)));
}

export async function handleApplicationRequest(request: Request, submit: SubmitApplication): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reply(403, "Submission unavailable.");
  if (request.headers.get("sec-fetch-site") === "cross-site") return reply(403, "Submission unavailable.");
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return reply(415, "Send a JSON application.");
  }
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 8192) return reply(413, "Application is too large.");

  let raw: unknown;
  try {
    raw = await limitedJson(request);
  } catch {
    return reply(400, "Invalid application.");
  }
  const application = parseApplication(raw);
  if (!application) return reply(400, "Please check the application fields and try again.");

  // Vercel overwrites this header at its edge. Missing headers share one bucket.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() || "unknown";
  try {
    const result = await submit(application, ip);
    if (result === "accepted" || result === "duplicate") return reply(201, "Application received. We will be in touch.");
    if (result === "rate_limited") return reply(429, "Too many submissions. Please try again later.");
    if (result === "invalid") return reply(400, "Please check the application fields and try again.");
  } catch {
    // Keep database and provider details out of visitor responses and logs.
  }
  return reply(503, "Applications are temporarily unavailable. Please try again later.");
}
