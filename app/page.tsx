import Link from "next/link";

export default async function Beranda() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold">Jurnal Praktik Kerja Lapangan</h1>
        <p className="mt-3 text-slate-600">
          Mari mulai membuat catatan kegiatan pklmu.
        </p>
        <Link
          href="/masuk"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          Lihat semua jurnal
        </Link>
      </section>
    </div>
  );
}
