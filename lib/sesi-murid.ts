import "server-only";

import { cookies } from "next/headers";

const NAMA_COOKIE = "murid_sesi";
const UMUR_SESI = 60 * 60 * 8; // 8 jam
const encoder = new TextEncoder();

type IsiSesiMurid = {
  siswaId: number;
  nama: string;
  exp: number;
};

function encodeBase64Url(value: string) {
  const bytes = encoder.encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(Math.ceil(value.length / 4) * 4, "=");

  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function signatureToBytes(value: string) {
  if (value.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(value)) {
    return null;
  }

  const bytes = new Uint8Array(value.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }

  return bytes;
}

async function ambilKunciSesi(usage: KeyUsage[]) {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    throw new Error("SESSION_SECRET belum diatur di .env.local.");
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage,
  );
}

async function tandatangani(payload: string) {
  const key = await ambilKunciSesi(["sign"]);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function buatSesiMurid(murid: { siswaId: number; nama: string }) {
  if (!Number.isSafeInteger(murid.siswaId) || murid.siswaId <= 0) {
    throw new Error("ID murid tidak valid.");
  }

  const nama = murid.nama.trim();

  if (!nama || nama.length > 40) {
    throw new Error("Nama murid tidak valid.");
  }

  const isiSesi: IsiSesiMurid = {
    siswaId: murid.siswaId,
    nama,
    exp: Math.floor(Date.now() / 1000) + UMUR_SESI,
  };

  const payload = encodeBase64Url(JSON.stringify(isiSesi));
  const signature = await tandatangani(payload);

  (await cookies()).set(NAMA_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UMUR_SESI,
  });
}

export async function ambilSesiMurid(): Promise<{
  siswaId: number;
  nama: string;
} | null> {
  const token = (await cookies()).get(NAMA_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const [payload, signature, ...sisa] = token.split(".");

  if (!payload || !signature || sisa.length > 0) {
    return null;
  }

  const signatureBytes = signatureToBytes(signature);

  if (!signatureBytes) {
    return null;
  }

  const key = await ambilKunciSesi(["verify"]);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    encoder.encode(payload),
  );

  if (!valid) {
    return null;
  }

  let sesi: Partial<IsiSesiMurid>;

  try {
    sesi = JSON.parse(decodeBase64Url(payload)) as Partial<IsiSesiMurid>;
  } catch {
    return null;
  }

  if (
    !Number.isSafeInteger(sesi.siswaId) ||
    typeof sesi.nama !== "string" ||
    !sesi.nama ||
    typeof sesi.exp !== "number" ||
    sesi.exp <= Math.floor(Date.now() / 1000)
  ) {
    return null;
  }

  return {
    siswaId: sesi.siswaId as number,
    nama: sesi.nama,
  };
}

export async function hapusSesiMurid() {
  (await cookies()).delete(NAMA_COOKIE);
}
