import type { JurnalAdmin, SiswaAdmin } from "@/data/admin";

export default function RekapSiswa({
  siswa,
  jurnal,
}: {
  siswa: SiswaAdmin[];
  jurnal: JurnalAdmin[];
}) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Rekap per siswa</h2>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Tempat PKL</th>
              <th className="p-3">Pembimbing</th>
              <th className="p-3">Jumlah jurnal</th>
              <th className="p-3">Total jam</th>
              <th className="p-3">Menunggu</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((murid) => {
              const jurnalMurid = jurnal.filter(
                (item) => item.siswa_id === murid.id,
              );
              const totalJam = jurnalMurid.reduce(
                (jumlah, item) => jumlah + item.durasi_jam,
                0,
              );
              const menunggu = jurnalMurid.filter(
                (item) => item.status === "diajukan",
              ).length;

              return (
                <tr className="border-t" key={murid.id}>
                  <td className="p-3">{murid.nama}</td>
                  <td className="p-3">{murid.kelas}</td>
                  <td className="p-3">{murid.tempat_pkl}</td>
                  <td className="p-3">{murid.pembimbing}</td>
                  <td className="p-3">{jurnalMurid.length}</td>
                  <td className="p-3">{totalJam}</td>
                  <td className="p-3">{menunggu}</td>
                </tr>
              );
            })}

            {siswa.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={7}>
                  Belum ada data siswa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
