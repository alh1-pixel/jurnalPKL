import type { SiswaAdmin } from "@/data/admin";
import { hapusSiswa } from "@/app/admin/siswa/actions";

export default function DaftarSiswa({ siswa }: { siswa: SiswaAdmin[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">
        Daftar siswa ({siswa.length})
      </h2>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Kelas</th>
              <th className="p-3">Tempat PKL</th>
              <th className="p-3">Pembimbing</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswa.map((murid) => (
              <tr className="border-t" key={murid.id}>
                <td className="p-3">{murid.nama}</td>
                <td className="p-3">{murid.kelas}</td>
                <td className="p-3">{murid.tempat_pkl}</td>
                <td className="p-3">{murid.pembimbing}</td>
                <td className="p-3">
                  <form action={hapusSiswa} className="space-y-2">
                    <input name="siswaId" type="hidden" value={murid.id} />
                    <label className="flex items-start gap-2 text-xs text-slate-600">
                      <input
                        className="mt-0.5"
                        name="konfirmasi"
                        required
                        type="checkbox"
                      />
                      <span>Konfirmasi hapus siswa ini</span>
                    </label>
                    <button
                      className="rounded border border-red-300 px-3 py-1.5 text-red-700 hover:bg-red-50"
                      type="submit"
                    >
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {siswa.length === 0 && (
              <tr>
                <td className="p-6 text-center text-slate-500" colSpan={5}>
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
