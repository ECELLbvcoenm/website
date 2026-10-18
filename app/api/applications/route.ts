import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { handleApplicationRequest, type SubmissionResult } from "@/lib/application-handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleApplicationRequest(request, async (application, ip): Promise<SubmissionResult> => {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const pepper = process.env.APPLICATION_HASH_SECRET;
    if (!url || !serviceKey || !pepper || pepper.length < 32) return "unavailable";

    const hash = (value: string) => createHmac("sha256", pepper).update(value).digest("hex");
    const client = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await client.rpc("submit_application", {
      p_full_name: application.full_name,
      p_email: application.email,
      p_contact_number: application.contact_number,
      p_department: application.department,
      p_motivation: application.motivation,
      p_ip_hash: hash(`ip:${ip}`),
      p_email_hash: hash(`email:${application.email}`),
    });
    return error ? "unavailable" : data as SubmissionResult;
  });
}
