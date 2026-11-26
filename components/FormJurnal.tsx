"use client";

import { useActionState } from "react";
import { simpanJurnal, type HasilJurnal } from "@/app/jurnal/baru/actions";

function Galat({ teks }: { teks?: string }) {
  return teks ? <p className="mt-1 text-sm text-red-600">{teks}</p> : null;
}

const kolom =
  "block w-full rounded border px-3 py-2 outline-none focus:border-blue-500";

const awal: HasilJurnal = {
  berhasil: false,
  pesan: "",
  galat: {},
  isian: {
    tanggal: "",
    kegiatan: "",
    kompetensi: "",
    durasi_jam: "1",
    catatan: "",
  },
};

export default function FormJurnal() {
  const [hasil, kirim, sedangKirim] = useActionState(simpanJurnal, awal);
  const i = hasil.isian;

  return (
    <form
      action={kirim}
      className="max-w-lg space-y-4 rounded-xl border bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="tanggal">
          Tanggal
        </label>
        <input
          className={kolom}
          defaultValue={i.tanggal}
          id="tanggal"
          name="tanggal"
          required
          type="date"
        />
        <Galat teks={hasil.galat.tanggal} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="kegiatan">
          Kegiatan
        </label>
        <textarea
          className={kolom}
          defaultValue={i.kegiatan}
          id="kegiatan"
          maxLength={500}
          minLength={30}
          name="kegiatan"
          placeholder="Ceritakan kegiatan PKL hari ini (30–500 karakter)"
          required
          rows={5}
        />
        <Galat teks={hasil.galat.kegiatan} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="kompetensi">
          Kompetensi yang dipelajari
        </label>
        <input
          className={kolom}
          defaultValue={i.kompetensi}
          id="kompetensi"
          maxLength={60}
          minLength={3}
          name="kompetensi"
          placeholder="Contoh: komunikasi profesional"
          required
        />
        <Galat teks={hasil.galat.kompetensi} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="durasi_jam">
          Durasi (jam)
        </label>
        <input
          className={kolom}
          defaultValue={i.durasi_jam}
          id="durasi_jam"
          max={10}
          min={1}
          name="durasi_jam"
          required
          step={1}
          type="number"
        />
        <Galat teks={hasil.galat.durasi_jam} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="catatan">
          Catatan pribadi{" "}
          <span className="font-normal text-slate-500">(opsional)</span>
        </label>
        <textarea
          className={kolom}
          defaultValue={i.catatan}
          id="catatan"
          name="catatan"
          placeholder="Catatan tambahan"
          rows={3}
        />
        <Galat teks={hasil.galat.catatan} />
      </div>

      {hasil.pesan && (
        <p
          aria-live="polite"
          className={
            hasil.berhasil ? "text-sm text-green-700" : "text-sm text-red-600"
          }
        >
          {hasil.pesan}
        </p>
      )}

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={sedangKirim}
        type="submit"
      >
        {sedangKirim ? "Menyimpan..." : "Simpan jurnal"}
      </button>
    </form>
  );
}
