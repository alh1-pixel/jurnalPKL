"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { pastikanAdmin } from "@/lib/sesi-admin";

function ambilTeks(formData: FormData, nama: string) {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai.trim() : "";
}

export async function tambahSiswa(formData: FormData) {
  await pastikanAdmin();

  const nama = ambilTeks(formData, "nama");
  const kelas = ambilTeks(formData, "kelas");
  const tempatPkl = ambilTeks(formData, "tempat_pkl");
  const pembimbing = ambilTeks(formData, "pembimbing");
  const kode = ambilTeks(formData, "kode").toUpperCase();

  if (
    !nama ||
    !kelas ||
    !tempatPkl ||
    !pembimbing ||
    !/^[A-Z0-9-]{6,12}$/.test(kode)
  ) {
    redirect("/admin/siswa?hasil=data-tidak-valid");
  }

  const { error } = await supabaseAdmin.from("siswa").insert({
    nama,
    kelas,
    tempat_pkl: tempatPkl,
    pembimbing,
    kode,
  });

  if (error?.code === "23505") {
    redirect("/admin/siswa?hasil=kode-dipakai");
  }

  if (error) {
    throw new Error(`Gagal menambahkan siswa: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/siswa");
  redirect("/admin/siswa?hasil=ditambahkan");
}

export async function hapusSiswa(formData: FormData) {
  await pastikanAdmin();

  const siswaId = Number(ambilTeks(formData, "siswaId"));
  const konfirmasi = formData.get("konfirmasi") === "on";

  if (!Number.isSafeInteger(siswaId) || siswaId <= 0 || !konfirmasi) {
    redirect("/admin/siswa?hasil=data-tidak-valid");
  }

  const { count, error: errorJurnal } = await supabaseAdmin
    .from("jurnal")
    .select("id", { count: "exact", head: true })
    .eq("siswa_id", siswaId);

  if (errorJurnal) {
    throw new Error(`Gagal memeriksa jurnal siswa: ${errorJurnal.message}`);
  }

  if ((count ?? 0) > 0) {
    redirect("/admin/siswa?hasil=punya-jurnal");
  }

  const { data, error } = await supabaseAdmin
    .from("siswa")
    .delete()
    .eq("id", siswaId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal menghapus siswa: ${error.message}`);
  }

  if (!data) {
    redirect("/admin/siswa?hasil=tidak-ditemukan");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/siswa");
  redirect("/admin/siswa?hasil=dihapus");
}
