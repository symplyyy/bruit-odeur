import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "bno-admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SECRET manquant ou trop court (>= 16 chars requis dans .env.local)",
    );
  }
  return s;
}

function adminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD manquant dans .env.local");
  return p;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function verifyPassword(input: string): boolean {
  const expected = Buffer.from(sign(adminPassword()));
  const given = Buffer.from(sign(input));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

function makeToken(): string {
  const issuedAt = Date.now().toString();
  const body = `v1.${issuedAt}`;
  return `${body}.${sign(body)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, issuedAt, sig] = parts;
  if (version !== "v1") return false;
  const body = `${version}.${issuedAt}`;
  const expected = sign(body);
  if (expected.length !== sig.length) return false;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  const issued = Number(issuedAt);
  if (!Number.isFinite(issued)) return false;
  return Date.now() - issued < MAX_AGE_SECONDS * 1000;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(COOKIE_NAME)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/login");
}

export async function adminLogin(password: string): Promise<boolean> {
  if (!verifyPassword(password)) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function adminLogout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
