import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function ambilJurnalMurid(siswaId: number) {
  const { data, error } = await supabaseAdmin
    .from("jurnal")
    .select("id, tanggal, kegiatan, kompetensi, durasi_jam, status, catatan")
    .eq("siswa_id", siswaId)
    .order("tanggal", { ascending: false });

  if (error) {
    throw new Error(`Gagal mengambil jurnal: ${error.message}`);
  }

  return data;
}
