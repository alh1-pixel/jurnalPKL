"use client";

import { useActionState } from "react";
import {
  ubahJurnal,
  type HasilUbahJurnal,
} from "@/app/jurnal/[id]/ubah/actions";

type Props = {
  jurnal: {
    id: number;
    tanggal: string;
    kegiatan: string;
    kompetensi: string;
    durasi_jam: number;
  };
};

function Galat({ teks }: { teks?: string }) {
  return teks ? <p className="mt-1 text-sm text-red-600">{teks}</p> : null;
}

const kolom = "block w-full rounded border px-3 py-2";

export default function FormUbahJurnal({ jurnal }: Props) {
  const awal: HasilUbahJurnal = {
    pesan: "",
    galat: {},
    isian: {
      tanggal: jurnal.tanggal,
      kegiatan: jurnal.kegiatan,
      kompetensi: jurnal.kompetensi,
      durasi_jam: String(jurnal.durasi_jam),
    },
  };

  const [hasil, kirim, sedangKirim] = useActionState(ubahJurnal, awal);
  const i = hasil.isian;

  return (
    <form
      action={kirim}
      className="max-w-lg space-y-4 rounded-xl border bg-white p-6"
    >
      <input name="id" type="hidden" value={jurnal.id} />

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
          required
          rows={5}
        />
        <Galat teks={hasil.galat.kegiatan} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="kompetensi">
          Kompetensi
        </label>
        <input
          className={kolom}
          defaultValue={i.kompetensi}
          id="kompetensi"
          maxLength={60}
          minLength={3}
          name="kompetensi"
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
          type="number"
        />
        <Galat teks={hasil.galat.durasi_jam} />
      </div>

      {hasil.pesan && (
        <p aria-live="polite" className="text-sm text-red-600">
          {hasil.pesan}
        </p>
      )}

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        disabled={sedangKirim}
        type="submit"
      >
        {sedangKirim ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}
