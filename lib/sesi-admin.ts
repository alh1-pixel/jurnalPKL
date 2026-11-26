import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NAMA_COOKIE = "admin_sesi";
const UMUR_SESI = 60 * 60 * 8;
const encoder = new TextEncoder();

async function ambilKucni(usage: KeyUsage[]) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET belum diatur");
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HVAC", hash: "SHA-256" },
    false,
    usage,
  );
}

async function tandaTangani(nilai: string) {
  const kunci = await ambilKucni(["sign"]);
  const hasil = await crypto.subtle.sign("HMAC", kunci, encoder.encode(nilai));

  return Array.from(new Uint8Array(hasil))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function ubahHexKeBytes(nilai: string) {
  if (nilai.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(nilai)) {
    return null;
  }
  const bytes = new Uint8Array(nilai.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(nilai.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

export async function buatSesiAdmin() {
  const kedaluwarsa = String(Math.floor(Date.now() / 1000) + UMUR_SESI);
  const tandaTangan = await tandaTangani(kedaluwarsa);

  (await cookies()).set(NAMA_COOKIE, `${kedaluwarsa}.${tandaTangan}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });
}

export async function ambilSesiAdmin() {
  const token = (await cookies()).get(NAMA_COOKIE)?.value;
  if (!token) return null;

  const [kedaluwarsa, tandaTangan, ...sisa] = token.split(".");
  if (!kedaluwarsa || !tandaTangan || sisa.length > 0) return null;

  const waktuKedaluwarsa = Number(kedaluwarsa);
  if (
    !Number.isSafeInteger(waktuKedaluwarsa) ||
    waktuKedaluwarsa <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  const tandaBytes = ubahHexKeBytes(tandaTangan);
  if (!tandaBytes) return null;

  const kunci = await ambilKucni(["verify"]);
  const valid = await crypto.subtle.verify(
    "HVAC",
    kunci,
    tandaBytes,
    encoder.encode(kedaluwarsa),
  );

  return valid ? { role: "admin" as const } : null;
}

export async function pastikanAdmin() {
  if (!(await ambilSesiAdmin())) {
    redirect("/login");
  }
}

export async function hapusSesiAdmin() {
  (await cookies()).delete(NAMA_COOKIE);
}
