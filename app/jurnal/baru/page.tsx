import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FormJurnal from "@/components/FormJurnal";
import { ambilSesiMurid } from "@/lib/sesi-murid";

export default function HalamanJurnalBaru() {
  return (
    <Suspense
      fallback={
        <section aria-live="polite" className="mx-auto max-w-lg py-10">
          Memuat formulir...
        </section>
      }
    >
      <KontenJurnalBaru />
    </Suspense>
  );
}

async function KontenJurnalBaru() {
  const sesi = await ambilSesiMurid();

  if (!sesi) {
    redirect("/masuk");
  }
  return (
    <section className="mx-auto max-w-lg py-8">
      <Link
        className="mb-5 inline-block text-sm text-blue-600 hover:underline"
        href="/jurnal"
      >
        Kembali ke jurnal
      </Link>
      <h1 className="mb-2 text-2xl font-bold">Tulis jurnal harian</h1>
      <p className="mb-6 text-sm text-slate-600">
        Catat kegiatan PKL yang kamu lakukan hari ini
      </p>
      <FormJurnal />
    </section>
  );
}
