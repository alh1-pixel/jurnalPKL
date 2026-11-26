"use server";

import { redirect } from "next/navigation";
import { buatSesiAdmin } from "@/lib/sesi-admin";

export type HasilMasukAdmin = {
  pesan: string;
};

export async function masukAdmin(
  _sebelum: HasilMasukAdmin,
  formData: FormData,
): Promise<HasilMasukAdmin> {
  const nilai = formData.get("password");
  const password = typeof nilai === "string" ? nilai : "";
  const passwordAdmin = process.env.ADMIN_PASSWORD;

  if (!passwordAdmin) {
    throw new Error("ADMIN_PASSWORD belum diatur");
  }

  if (!password || password !== passwordAdmin) {
    return { pesan: "kata sandi admin salah" };
  }

  await buatSesiAdmin();
  redirect("/admin");
}
