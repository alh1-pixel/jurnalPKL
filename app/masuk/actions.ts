"use server";

import { redirect } from "next/navigation";
import { buatSesiMurid } from "@/lib/sesi-murid";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { hapusSesiMurid } from "@/lib/sesi-murid";

export async function masukMurid(formData: FormData) {
  const kode = String(formData.get("kode") ?? "")
    .trim()
    .toUpperCase();

  if (!/^[A-Z0-9-]{6,12}$/.test(kode)) {
    redirect("/masuk?error=kode");
  }

  const { data: siswa, error } = await supabaseAdmin
    .from("siswa")
    .select("id, nama")
    .eq("kode", kode)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memeriksa kode siswa: ${error.message}`);
  }

  if (!siswa) {
    redirect("/masuk?error=kode");
  }

  await buatSesiMurid({
    siswaId: siswa.id,
    nama: siswa.nama,
  });

  redirect("/jurnal");
}

export async function keluarMurid() {
  await hapusSesiMurid();
  redirect("/masuk");
}
