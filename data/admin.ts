import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type StatusJurnalAdmin = "diajukan" | "disetujui" | "revisi";

export type SiswaAdmin = {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
};

export type JurnalAdmin = {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
  status: StatusJurnalAdmin;
  catatan: string | null;
};

export async function ambilDataDashboardAdmin() {
  const [hasilSiswa, hasilJurnal] = await Promise.all([
    supabaseAdmin
      .from("siswa")
      .select("id, nama, kelas, tempat_pkl, pembimbing")
      .order("nama"),
    supabaseAdmin
      .from("jurnal")
      .select(
        "id, siswa_id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan",
      )
      .order("tanggal", { ascending: false }),
  ]);

  if (hasilSiswa.error) {
    throw new Error(`Gagal memuat data siswa: ${hasilSiswa.error.message}`);
  }

  if (hasilJurnal.error) {
    throw new Error(`Gagal memuat data jurnal: ${hasilJurnal.error.message}`);
  }

  return {
    siswa: (hasilSiswa.data ?? []) as SiswaAdmin[],
    jurnal: (hasilJurnal.data ?? []) as JurnalAdmin[],
  };
}
