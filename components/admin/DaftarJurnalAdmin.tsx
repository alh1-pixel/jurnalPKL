import KartuTinjauJurnal from "@/components/admin/KartuTinjauJurnal";
import type { JurnalAdmin, SiswaAdmin } from "@/data/admin";

export default function DaftarJurnalAdmin({
  jurnal,
  siswa,
}: {
  jurnal: JurnalAdmin[];
  siswa: SiswaAdmin[];
}) {
  const siswaById = new Map(siswa.map((item) => [item.id, item]));

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Semua jurnal</h2>

      {jurnal.length === 0 ? (
        <div className="rounded-xl border bg-white p-8 text-center text-slate-500">
          Belum ada jurnal yang dikirim.
        </div>
      ) : (
        <div className="space-y-4">
          {jurnal.map((item) => (
            <KartuTinjauJurnal
              key={item.id}
              jurnal={item}
              siswa={siswaById.get(item.siswa_id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
