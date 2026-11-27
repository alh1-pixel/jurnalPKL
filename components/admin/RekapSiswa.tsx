"use client";

import { useState } from "react";

import type { JurnalAdmin, SiswaAdmin, StatusJurnalAdmin } from "@/data/admin";

type FilterStatus = "semua" | StatusJurnalAdmin;

const pilihanFilter: { nilai: FilterStatus; label: string }[] = [
  { nilai: "semua", label: "Semua" },
  { nilai: "diajukan", label: "Diajukan" },
  { nilai: "disetujui", label: "Disetujui" },
  { nilai: "revisi", label: "Revisi" },
];

export default function RekapSiswa({
  siswa,
  jurnal,
}: {
  siswa: SiswaAdmin[];
  jurnal: JurnalAdmin[];
}) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("semua");

  const rekap = siswa.map((murid) => {
    const jurnalMurid = jurnal.filter((item) => item.siswa_id === murid.id);

    return {
      murid,
      jurnalMurid,
      jumlahJurnal: jurnalMurid.length,
      totalJam: jurnalMurid.reduce(
        (jumlah, item) => jumlah + item.durasi_jam,
        0,
      ),
      diajukan: jurnalMurid.filter((item) => item.status === "diajukan").length,
      disetujui: jurnalMurid.filter((item) => item.status === "disetujui")
        .length,
      revisi: jurnalMurid.filter((item) => item.status === "revisi").length,
    };
  });

  const rekapTerfilter =
    filterStatus === "semua"
      ? rekap
      : rekap.filter((baris) =>
          baris.jurnalMurid.some((item) => item.status === filterStatus),
        );

  return (
    <section>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Rekap per siswa</h2>

        <div
          aria-label="Filter rekap berdasarkan status jurnal"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-sm text-slate-600">Status </span>

          {pilihanFilter.map((pilihan) => (
            <button
              aria-pressed={filterStatus === pilihan.nilai}
              className={`rounded border px-3 py-1.5 text-sm ${
                filterStatus === pilihan.nilai
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              key={pilihan.nilai}
              onClick={() => setFilterStatus(pilihan.nilai)}
              type="button"
            >
              {pilihan.label}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[14%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[9%]" />
            <col className="w-[9.67%]" />
            <col className="w-[9.67%]" />
            <col className="w-[9.66%]" />
          </colgroup>

          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Tempat PKL</th>
              <th className="p-3">Pembimbing</th>
              <th className="p-3 text-center">Jumlah jurnal</th>
              <th className="p-3 text-center">Total jam</th>
              <th className="p-3 text-center">Diajukan</th>
              <th className="p-3 text-center">Disetujui</th>
              <th className="p-3 text-center">Revisi</th>
            </tr>
          </thead>

          <tbody>
            {rekapTerfilter.map((baris) => (
              <tr className="border-t" key={baris.murid.id}>
                <td className="break-words p-3">{baris.murid.nama}</td>
                <td className="break-words p-3">{baris.murid.kelas}</td>
                <td className="break-words p-3">{baris.murid.tempat_pkl}</td>
                <td className="break-words p-3">{baris.murid.pembimbing}</td>
                <td className="p-3 text-center">{baris.jumlahJurnal}</td>
                <td className="p-3 text-center">{baris.totalJam}</td>
                <td className="p-3 text-center">{baris.diajukan}</td>
                <td className="p-3 text-center">{baris.disetujui}</td>
                <td className="p-3 text-center">{baris.revisi}</td>
              </tr>
            ))}

            {rekapTerfilter.length === 0 && (
              <tr className="h-12 border-t">
                <td className="p-3 text-center text-slate-500" colSpan={9}>
                  {siswa.length === 0
                    ? "Belum ada data siswa."
                    : `Tidak ada siswa dengan jurnal berstatus ${filterStatus}.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
