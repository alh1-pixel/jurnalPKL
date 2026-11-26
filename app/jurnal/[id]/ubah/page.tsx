import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import FormUbahJurnal from "@/components/FormUbahJurnal";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ambilSesiMurid } from "@/lib/sesi-murid";

export default async function HalamanUbahJurnal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="py-10">Memuat jurnal...</p>}>
      <KontenUbahJurnal params={params} />
    </Suspense>
  );
}

async function KontenUbahJurnal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sesi = await ambilSesiMurid();
  if (!sesi) redirect("/masuk");

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isSafeInteger(id) || id <= 0) notFound();

  const { data: jurnal, error } = await supabaseAdmin
    .from("jurnal")
    .select("id, tanggal, kegiatan, kompetensi, durasi_jam, status")
    .eq("id", id)
    .eq("siswa_id", sesi.siswaId)
    .in("status", ["diajukan", "revisi"])
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal memuat jurnal: ${error.message}`);
  }

  if (!jurnal) notFound();

  return (
    <section className="mx-auto max-w-lg py-8">
      <Link
        className="mb-5 inline-block text-sm text-blue-600 hover:underline"
        href="/jurnal"
      >
        Kembali ke jurnal
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Ubah jurnal</h1>
      <p className="mb-6 text-sm text-slate-600">
        Jurnal hanya dapat diubah sebelum disetujui.
      </p>
      <FormUbahJurnal jurnal={jurnal} />
    </section>
  );
}
