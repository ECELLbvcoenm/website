export const APPLICATION_FIELDS = ["full_name", "email", "contact_number", "department", "motivation"] as const;
export const DEPARTMENTS = ["Technical", "Marketing", "Finance", "PR"] as const;

export type ApplicationInput = Record<(typeof APPLICATION_FIELDS)[number], string>;

export function parseApplication(value: unknown): ApplicationInput | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const fields = value as Record<string, unknown>;
  if (Object.keys(fields).length !== APPLICATION_FIELDS.length ||
      Object.keys(fields).some((key) => !APPLICATION_FIELDS.includes(key as (typeof APPLICATION_FIELDS)[number]))) return null;
  if (APPLICATION_FIELDS.some((key) => typeof fields[key] !== "string")) return null;

  const full_name = (fields.full_name as string).trim().replace(/\s+/g, " ");
  const email = (fields.email as string).trim().toLowerCase();
  const contact_number = (fields.contact_number as string).trim();
  const department = fields.department as string;
  const motivation = (fields.motivation as string).trim();

  if (full_name.length < 2 || full_name.length > 120 || /[\u0000-\u001f\u007f<>]/.test(full_name)) return null;
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)) return null;
  if (contact_number && (contact_number.length < 7 || contact_number.length > 20 || !/^\+?[0-9 ()-]+$/.test(contact_number))) return null;
  if (!DEPARTMENTS.includes(department as (typeof DEPARTMENTS)[number])) return null;
  if (motivation.length < 20 || motivation.length > 2000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(motivation)) return null;

  return { full_name, email, contact_number, department, motivation };
}
