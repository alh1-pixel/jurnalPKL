"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { hapusSesiAdmin, pastikanAdmin } from "@/lib/sesi-admin";

export async function keluarAdmin() {
  await hapusSesiAdmin();
  redirect("/login");
}

export async function tinjauJurnal(formData: FormData) {
  await pastikanAdmin();

  const id = Number(formData.get("jurnalId"));
  const keputusan = formData.get("keputusan");
  const catatanValue = formData.get("catatan");
  const catatan = typeof catatanValue === "string" ? catatanValue.trim() : "";

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("ID jurnal tidak valid.");
  }

  if (keputusan !== "disetujui" && keputusan !== "revisi") {
    throw new Error("Keputusan peninjauan tidak valid.");
  }

  if (keputusan === "revisi" && catatan.length < 5) {
    throw new Error("Catatan revisi minimal 5 karakter.");
  }

  const { data, error } = await supabaseAdmin
    .from("jurnal")
    .update({
      status: keputusan,
      catatan: keputusan === "revisi" ? catatan : null,
    })
    .eq("id", id)
    .eq("status", "diajukan")
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memperbarui jurnal: ${error.message}`);
  }

  if (!data) {
    throw new Error("Jurnal tidak ditemukan atau sudah ditinjau.");
  }

  revalidatePath("/admin");
  revalidatePath("/jurnal");
}
