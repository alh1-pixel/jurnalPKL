import { tinjauJurnal } from "@/app/admin/actions";
import type { JurnalAdmin, SiswaAdmin } from "@/data/admin";

const labelStatus: Record<JurnalAdmin["status"], string> = {
  diajukan: "Diajukan",
  disetujui: "Disetujui",
  revisi: "Revisi",
};

export default function KartuTinjauJurnal({
  jurnal,
  siswa,
}: {
  jurnal: JurnalAdmin;
  siswa?: SiswaAdmin;
}) {
  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {siswa?.nama ?? "Siswa tidak ditemukan"}
            {siswa ? ` · ${siswa.kelas}` : ""}
          </p>
          <h3 className="mt-2 font-semibold">{jurnal.kegiatan}</h3>
        </div>

        <span className="rounded bg-slate-100 px-2 py-1 text-xs">
          {labelStatus[jurnal.status]}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        {jurnal.tanggal} · {jurnal.durasi_jam} jam · {jurnal.kompetensi}
      </p>

      {jurnal.catatan && (
        <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900">
          Catatan revisi: {jurnal.catatan}
        </p>
      )}

      {jurnal.status === "diajukan" && (
        <form action={tinjauJurnal} className="mt-4 space-y-3 border-t pt-4">
          <input name="jurnalId" type="hidden" value={jurnal.id} />

          <label
            className="block text-sm font-medium"
            htmlFor={`catatan-${jurnal.id}`}
          >
            Catatan revisi
          </label>

          <textarea
            className="block min-h-24 w-full resize-y rounded border px-3 py-2 text-sm"
            id={`catatan-${jurnal.id}`}
            minLength={5}
            name="catatan"
            placeholder="Jelaskan bagian yang perlu diperbaiki"
            rows={3}
          />

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
              name="keputusan"
              type="submit"
              value="disetujui"
            >
              Setujui
            </button>

            <button
              className="rounded border border-amber-600 px-4 py-2 text-sm text-amber-800 hover:bg-amber-50"
              name="keputusan"
              type="submit"
              value="revisi"
            >
              Minta revisi
            </button>
          </div>
        </form>
      )}
    </article>
  );
}
