"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ambilSesiMurid } from "@/lib/sesi-murid";

export type HasilJurnal = {
  berhasil: boolean;
  pesan: string;
  galat: {
    tanggal?: string;
    kegiatan?: string;
    kompetensi?: string;
    durasi_jam?: string;
    catatan?: string;
  };
  isian: {
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi_jam: string;
    catatan: string;
  };
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return false;
  }

  const waktuTanggal = new Date(`${tanggal}T00:00:00.000Z`);

  if (
    Number.isNaN(waktuTanggal.getTime()) ||
    waktuTanggal.toISOString().slice(0, 10) !== tanggal
  ) {
    return false;
  }

  const hariIni = tanggalHariIniJakarta();
  const batasLama = new Date(`${hariIni}T00:00:00.000Z`);
  batasLama.setUTCDate(batasLama.getUTCDate() - 7);

  const tanggalPalingLama = batasLama.toISOString().slice(0, 10);

  return tanggal >= tanggalPalingLama && tanggal <= hariIni;
}

export async function simpanJurnal(
  _sebelum: HasilJurnal,
  formData: FormData,
): Promise<HasilJurnal> {
  const sesi = await ambilSesiMurid();

  if (!sesi) {
    redirect("/masuk");
  }
  const isian = {
    tanggal: ambilTeks(formData, "tanggal"),
    kegiatan: ambilTeks(formData, "kegiatan"),
    kompetensi: ambilTeks(formData, "kompetensi"),
    durasi_jam: ambilTeks(formData, "durasi_jam"),
    catatan: ambilTeks(formData, "catatan"),
  };

  const galat: HasilJurnal["galat"] = {};

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
    return {
      berhasil: false,
      pesan: "Periksa kembali isian yang ditandai.",
      galat,
      isian,
    };
  }

  const { error } = await supabaseAdmin.from("jurnal").insert({
    siswa_id: sesi.siswaId,
    tanggal: isian.tanggal,
    kegiatan: isian.kegiatan,
    kompetensi: isian.kompetensi,
    durasi_jam: Number(isian.durasi_jam),
    status: "diajukan",
    catatan: isian.catatan || null,
  });

  if (error?.code === "23505") {
    return {
      berhasil: false,
      pesan: "Jurnal untuk tanggal tersebut sudah ada.",
      galat: {
        tanggal: "Satu murid hanya boleh membuat satu jurnal per hari.",
      },
      isian,
    };
  }

  if (error) {
    console.error("Gagal menyimpan jurnal:", error);
    return {
      berhasil: false,
      pesan:
        "Jurnal gagal disimpan. Periksa konfigurasi database lalu coba lagi.",
      galat: {},
      isian,
    };
  }

  revalidatePath("/jurnal");
  redirect("/jurnal");
}
