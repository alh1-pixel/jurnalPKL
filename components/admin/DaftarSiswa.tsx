"use client";

import { useActionState, useState } from "react";

import type { SiswaAdmin } from "@/data/admin";
import { hapusSiswa, ubahSiswa } from "@/app/admin/siswa/actions";

const hasilAwal = {
  pesan: "",
  berhasil: false,
};

export default function DaftarSiswa({ siswa }: { siswa: SiswaAdmin[] }) {
  const [hasil, action, sedangMenghapus] = useActionState(
    hapusSiswa,
    hasilAwal,
  );
  const [siswaYangDiedit, setSiswaYangDiedit] = useState<SiswaAdmin | null>(
    null,
  );

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">
        Daftar siswa ({siswa.length})
      </h2>

      {hasil.pesan && (
        <p
          aria-live="polite"
          className={`mb-4 rounded-lg border p-3 text-sm ${
            hasil.berhasil
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role={hasil.berhasil ? "status" : "alert"}
        >
          {hasil.pesan}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[16%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[26%]" />
          </colgroup>
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
                  <button
                    className="mb-3 block text-sm text-blue-600 hover:underline"
                    onClick={() => setSiswaYangDiedit(murid)}
                    type="button"
                  >
                    Ubah data
                  </button>

                  <form action={action} className="space-y-2">
                    <input name="siswaId" type="hidden" value={murid.id} />

                    <label className="flex items-start gap-2 text-xs text-slate-600">
                      <input
                        className="mt-0.5"
                        disabled={sedangMenghapus}
                        name="konfirmasi"
                        required
                        type="checkbox"
                      />
                      <span>Konfirmasi hapus siswa ini</span>
                    </label>

                    <button
                      className="rounded border border-red-300 px-3 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50"
                      disabled={sedangMenghapus}
                      type="submit"
                    >
                      {sedangMenghapus ? "Memeriksa..." : "Hapus"}
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

      {siswaYangDiedit && (
        <DialogEditSiswa
          key={siswaYangDiedit.id}
          murid={siswaYangDiedit}
          onTutup={() => setSiswaYangDiedit(null)}
        />
      )}
    </section>
  );
}

function DialogEditSiswa({
  murid,
  onTutup,
}: {
  murid: SiswaAdmin;
  onTutup: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onTutup();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onTutup();
      }}
    >
      <div
        aria-labelledby={`judul-edit-${murid.id}`}
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl"
        role="dialog"
      >
        <form action={ubahSiswa} className="space-y-4 p-6">
          <input name="siswaId" type="hidden" value={murid.id} />

          <h2 className="text-xl font-semibold" id={`judul-edit-${murid.id}`}>
            Ubah data siswa
          </h2>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor={`nama-edit-${murid.id}`}
            >
              Nama
            </label>
            <input
              autoFocus
              className="w-full rounded border px-3 py-2"
              defaultValue={murid.nama}
              id={`nama-edit-${murid.id}`}
              maxLength={100}
              name="nama"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor={`kelas-edit-${murid.id}`}
            >
              Kelas
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              defaultValue={murid.kelas}
              id={`kelas-edit-${murid.id}`}
              maxLength={50}
              name="kelas"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor={`tempat-pkl-edit-${murid.id}`}
            >
              Tempat PKL
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              defaultValue={murid.tempat_pkl}
              id={`tempat-pkl-edit-${murid.id}`}
              maxLength={150}
              name="tempat_pkl"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor={`pembimbing-edit-${murid.id}`}
            >
              Pembimbing
            </label>
            <input
              className="w-full rounded border px-3 py-2"
              defaultValue={murid.pembimbing}
              id={`pembimbing-edit-${murid.id}`}
              maxLength={100}
              name="pembimbing"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor={`kode-edit-${murid.id}`}
            >
              Kode login baru (opsional)
            </label>
            <input
              className="w-full rounded border px-3 py-2 uppercase"
              id={`kode-edit-${murid.id}`}
              maxLength={12}
              name="kode"
              pattern="[A-Za-z0-9-]{6,12}"
              placeholder="Kosongkan untuk mempertahankan kode lama"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded border px-4 py-2 text-sm hover:bg-slate-50"
              onClick={onTutup}
              type="button"
            >
              Batal
            </button>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              type="submit"
            >
              Simpan perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
