import Link from "next/link";

export type StatusJurnal = "Diajukan" | "Disetujui" | "Revisi";

type Props = {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi: number;
  status: StatusJurnal;
  id: number;
};

const warnaStatus: Record<StatusJurnal, string> = {
  Diajukan: "bg-amber-100 text-amber-700",
  Disetujui: "bg-green-100 text-green-700",
  Revisi: "bg-red-100 text-red-700",
};

export default function KartuJurnal({
  id,
  tanggal,
  kegiatan,
  kompetensi,
  durasi,
  status,
}: Props) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">{tanggal}</p>
        <span className={`rounded px-2 py-0.5 text-xs ${warnaStatus[status]}`}>
          {status}
        </span>
      </div>
      <h3 className="mt-3 font-semibold">{kegiatan}</h3>
      <p className="mt-1 text-sm text-slate-600">{kompetensi}</p>
      <p className="mt-3 text-sm text-slate-500">{durasi} jam</p>
      {status !== "Disetujui" && (
        <Link
          href={`/jurnal/${id}/ubah`}
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Ubah jurnal
        </Link>
      )}
    </article>
  );
}
