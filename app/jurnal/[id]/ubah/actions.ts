"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ambilSesiMurid } from "@/lib/sesi-murid";

type IsianUbah = {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: string;
};

export type HasilUbahJurnal = {
  pesan: string;
  galat: Partial<Record<keyof IsianUbah, string>>;
  isian: IsianUbah;
};

function ambilTeks(formData: FormData, nama: string) {
  const nilai = formData.get(nama);
  return typeof nilai === "string" ? nilai.trim() : "";
}

function tanggalHariIniJakarta() {
  const bagian = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const tahun = bagian.find((item) => item.type === "year")?.value;
  const bulan = bagian.find((item) => item.type === "month")?.value;
  const hari = bagian.find((item) => item.type === "day")?.value;

  if (!tahun || !bulan || !hari) {
    throw new Error("Gagal menentukan tanggal hari ini.");
  }

  return `${tahun}-${bulan}-${hari}`;
}

function tanggalDiizinkan(tanggal: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return false;

  const waktu = new Date(`${tanggal}T00:00:00.000Z`);

  if (
    Number.isNaN(waktu.getTime()) ||
    waktu.toISOString().slice(0, 10) !== tanggal
  ) {
    return false;
  }

  const batas = new Date(`${tanggalHariIniJakarta()}T00:00:00.000Z`);
  batas.setUTCDate(batas.getUTCDate() - 7);

  const palingLama = batas.toISOString().slice(0, 10);
  return tanggal >= palingLama && tanggal <= tanggalHariIniJakarta();
}

export async function ubahJurnal(
  _sebelum: HasilUbahJurnal,
  formData: FormData,
): Promise<HasilUbahJurnal> {
  const sesi = await ambilSesiMurid();

  if (!sesi) redirect("/masuk");

  const id = Number(formData.get("id"));
  const isian: IsianUbah = {
    tanggal: ambilTeks(formData, "tanggal"),
    kegiatan: ambilTeks(formData, "kegiatan"),
    kompetensi: ambilTeks(formData, "kompetensi"),
    durasi_jam: ambilTeks(formData, "durasi_jam"),
  };

  const galat: HasilUbahJurnal["galat"] = {};

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { pesan: "ID jurnal tidak valid.", galat, isian };
  }

  if (!tanggalDiizinkan(isian.tanggal)) {
    galat.tanggal = "Tanggal harus hari ini atau maksimal 7 hari yang lalu.";
  }

  if (isian.kegiatan.length < 30 || isian.kegiatan.length > 500) {
    galat.kegiatan = "Kegiatan harus berisi 30–500 karakter.";
  }

  if (isian.kompetensi.length < 3 || isian.kompetensi.length > 60) {
    galat.kompetensi = "Kompetensi harus berisi 3–60 karakter.";
  }

  if (!/^\d+$/.test(isian.durasi_jam)) {
    galat.durasi_jam = "Durasi harus berupa bilangan bulat.";
  } else {
    const durasi = Number(isian.durasi_jam);

    if (durasi < 1 || durasi > 10) {
      galat.durasi_jam = "Durasi harus antara 1–10 jam.";
    }
  }

  if (Object.keys(galat).length > 0) {
    return { pesan: "Periksa kembali isian yang ditandai.", galat, isian };
  }

  const { data, error } = await supabaseAdmin
    .from("jurnal")
    .update({
      tanggal: isian.tanggal,
      kegiatan: isian.kegiatan,
      kompetensi: isian.kompetensi,
      durasi_jam: Number(isian.durasi_jam),
      status: "diajukan",
      catatan: null,
    })
    .eq("id", id)
    .eq("siswa_id", sesi.siswaId)
    .in("status", ["diajukan", "revisi"])
    .select("id")
    .maybeSingle();

  if (error?.code === "23505") {
    return {
      pesan: "Jurnal untuk tanggal tersebut sudah ada.",
      galat: {
        tanggal: "Satu murid hanya boleh membuat satu jurnal per hari.",
      },
      isian,
    };
  }

  if (error) {
    console.error("Gagal mengubah jurnal:", error);
    return {
      pesan: "Jurnal gagal diubah. Coba lagi.",
      galat: {},
      isian,
    };
  }

  if (!data) {
    return {
      pesan: "Jurnal tidak ditemukan, bukan milikmu, atau sudah disetujui.",
      galat: {},
      isian,
    };
  }

  revalidatePath("/jurnal");
  redirect("/jurnal");
}
