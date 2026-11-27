import Link from "next/link";
import { Suspense } from "react";

import DaftarSiswa from "@/components/admin/DaftarSiswa";
import FormTambahSiswa from "@/components/admin/FormTambahSiswa";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { pastikanAdmin } from "@/lib/sesi-admin";

type Props = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const pesanHasil: Record<string, string> = {
  ditambahkan: "Data siswa berhasil ditambahkan.",
  diubah: "Data siswa berhasil diperbarui.",
  dihapus: "Data siswa berhasil dihapus.",
  "kode-dipakai": "Kode login sudah digunakan. Pilih kode lain.",
  "data-tidak-valid": "Periksa kembali data yang dimasukkan.",
  "punya-jurnal":
    "Siswa tidak dapat dihapus karena sudah memiliki jurnal. Data jurnal tetap dipertahankan.",
  "tidak-ditemukan": "Data siswa tidak ditemukan.",
};

export default function HalamanSiswaAdmin(props: Props) {
  return (
    <Suspense fallback={<p className="py-10">Memuat daftar siswa...</p>}>
      <KontenSiswa searchParams={props.searchParams} />
    </Suspense>
  );
}

async function KontenSiswa({ searchParams }: Props) {
  await pastikanAdmin();

  const params = await searchParams;
  const hasil = typeof params.hasil === "string" ? params.hasil : "";
  const pesan = pesanHasil[hasil];

  const { data: siswa, error } = await supabaseAdmin
    .from("siswa")
    .select("id, nama, kelas, tempat_pkl, pembimbing")
    .order("nama");

  if (error) {
    throw new Error(`Gagal memuat daftar siswa: ${error.message}`);
  }

  return (
    <div className="space-y-8">
      <header>
        <Link className="text-sm text-blue-600 hover:underline" href="/admin">
          Kembali ke panel admin
        </Link>
        <p className="mt-4 text-sm font-medium text-blue-600">Panel admin</p>
        <h1 className="mt-1 text-3xl font-bold">Kelola siswa</h1>
        <p className="mt-2 text-slate-600">
          Tambahkan data siswa atau hapus siswa yang belum memiliki jurnal.
        </p>
      </header>

      {pesan && (
        <p
          aria-live="polite"
          className="rounded-lg border bg-white p-4 text-sm text-slate-700"
        >
          {pesan}
        </p>
      )}

      <FormTambahSiswa />
      <DaftarSiswa siswa={siswa ?? []} />
    </div>
  );
}
