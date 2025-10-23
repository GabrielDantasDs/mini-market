import { User } from "@/reducers/userReducer";

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function parseUserPayload(payload: unknown): User {
  if (!isObject(payload)) throw new Error("Invalid payload: not an object");

  const type = (payload).type;

  if (typeof type !== "string") throw new Error("Invalid user type");

  return { type };
}

export function parseUserFromJWT(token: string): User | null {
  // JWT format: header.payload.signature
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT');

  const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const pad = payloadB64.length % 4;
  const padded = payloadB64 + (pad ? '='.repeat(4 - pad) : '');

  try {
    const json = atob(padded);
    console.log(json)
    const obj = JSON.parse(json);
    return parseUserPayload(obj);
  } catch (err) {
    throw new Error('Failed to decode JWT payload: ' + String(err));
  }
}

export default parseUserFromJWT;
