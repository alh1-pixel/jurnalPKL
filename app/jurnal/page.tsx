import Link from "next/link";
import { redirect } from "next/navigation";

import KartuJurnal, { type StatusJurnal } from "@/components/KartuJurnal";
import { ambilJurnalMurid } from "@/data/ambil";
import { ambilSesiMurid } from "@/lib/sesi-murid";

function labelStatus(status: string): StatusJurnal {
  switch (status) {
    case "diajukan":
      return "Diajukan";
    case "disetujui":
      return "Disetujui";
    case "revisi":
      return "Revisi";
    default:
      throw new Error(`Status jurnal tidak dikenal: ${status}`);
  }
}

function formatTanggal(tanggal: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${tanggal}T00:00:00Z`));
}

export default async function HalamanJurnalMurid() {
  const sesi = await ambilSesiMurid();

  if (!sesi) {
    redirect("/masuk");
  }

  const jurnal = await ambilJurnalMurid(sesi.siswaId);

  const totalJam = jurnal.reduce((total, item) => total + item.durasi_jam, 0);

  const jumlahStatus = {
    diajukan: jurnal.filter((item) => item.status === "diajukan").length,
    disetujui: jurnal.filter((item) => item.status === "disetujui").length,
    revisi: jurnal.filter((item) => item.status === "revisi").length,
  };

  return (
    <div>
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">Area murid</p>
          <h1 className="mt-1 text-3xl font-bold">Jurnal saya</h1>
          <p className="mt-2 text-slate-600">
            Halo, {sesi.nama}. Berikut catatan kegiatan PKL kamu.
          </p>
        </div>

        <Link
          href="/jurnal/baru"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Tulis jurnal
        </Link>
      </section>

      <section
        aria-label="Ringkasan jurnal"
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Ringkasan label="Total jam" nilai={`${totalJam} jam`} />
        <Ringkasan label="Diajukan" nilai={jumlahStatus.diajukan} />
        <Ringkasan label="Disetujui" nilai={jumlahStatus.disetujui} />
        <Ringkasan label="Perlu revisi" nilai={jumlahStatus.revisi} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Riwayat jurnal</h2>

        {jurnal.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <h3 className="font-semibold">Belum ada jurnal</h3>
            <p className="mt-2 text-sm text-slate-500">
              Jurnal yang kamu buat akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jurnal.map((item) => (
              <KartuJurnal
                key={item.id}
                tanggal={formatTanggal(item.tanggal)}
                kegiatan={item.kegiatan}
                kompetensi={item.kompetensi}
                durasi={item.durasi_jam}
                status={labelStatus(item.status)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Ringkasan({
  label,
  nilai,
}: {
  label: string;
  nilai: string | number;
}) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{nilai}</p>
    </article>
  );
}
