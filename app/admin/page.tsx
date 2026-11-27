import Link from "next/link";
import { Suspense } from "react";

import DaftarJurnalAdmin from "@/components/admin/DaftarJurnalAdmin";
import RekapSiswa from "@/components/admin/RekapSiswa";
import RingkasanAdmin from "@/components/admin/RingkasanAdmin";
import { ambilDataDashboardAdmin } from "@/data/admin";
import { pastikanAdmin } from "@/lib/sesi-admin";
import { keluarAdmin } from "./actions";

export default function HalamanAdmin() {
  return (
    <Suspense fallback={<p className="py-10">Memuat panel admin...</p>}>
      <KontenAdmin />
    </Suspense>
  );
}

async function KontenAdmin() {
  await pastikanAdmin();

  const { siswa, jurnal } = await ambilDataDashboardAdmin();

  const jumlahDiajukan = jurnal.filter(
    (item) => item.status === "diajukan",
  ).length;
  const jumlahDisetujui = jurnal.filter(
    (item) => item.status === "disetujui",
  ).length;
  const jumlahRevisi = jurnal.filter((item) => item.status === "revisi").length;
  const totalJam = jurnal.reduce((jumlah, item) => jumlah + item.durasi_jam, 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">Panel admin</p>
          <h1 className="mt-1 text-3xl font-bold">Ringkasan PKL</h1>
          <p className="mt-2 text-slate-600">
            Pantau jurnal dan tinjau pengajuan murid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="rounded border bg-white px-4 py-2 text-sm hover:bg-slate-50"
            href="/admin/siswa"
          >
            Kelola siswa
          </Link>
          <form action={keluarAdmin}>
            <button
              className="rounded border bg-white px-4 py-2 text-sm hover:bg-slate-50"
              type="submit"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      <RingkasanAdmin
        jumlahSiswa={siswa.length}
        jumlahDiajukan={jumlahDiajukan}
        jumlahDisetujui={jumlahDisetujui}
        jumlahRevisi={jumlahRevisi}
        totalJam={totalJam}
      />

      <RekapSiswa siswa={siswa} jurnal={jurnal} />

      <DaftarJurnalAdmin siswa={siswa} jurnal={jurnal} />
    </div>
  );
}
