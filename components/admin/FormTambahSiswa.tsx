import { tambahSiswa } from "@/app/admin/siswa/actions";

export default function FormTambahSiswa() {
  return (
    <section className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold">Tambah siswa</h2>

      <form action={tambahSiswa} className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="nama">
            Nama
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            id="nama"
            maxLength={100}
            name="nama"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="kelas">
            Kelas
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            id="kelas"
            maxLength={50}
            name="kelas"
            required
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="tempat_pkl"
          >
            Tempat PKL
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            id="tempat_pkl"
            maxLength={150}
            name="tempat_pkl"
            required
          />
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="pembimbing"
          >
            Pembimbing
          </label>
          <input
            className="w-full rounded border px-3 py-2"
            id="pembimbing"
            maxLength={100}
            name="pembimbing"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium" htmlFor="kode">
            Kode login siswa
          </label>
          <input
            autoCapitalize="characters"
            className="w-full rounded border px-3 py-2 uppercase"
            id="kode"
            maxLength={12}
            minLength={6}
            name="kode"
            pattern="[A-Za-z0-9-]{6,12}"
            required
          />
          <p className="mt-1 text-sm text-slate-500">
            6–12 karakter: huruf, angka, atau tanda hubung. Berikan kode ini
            kepada siswa.
          </p>
        </div>

        <div className="sm:col-span-2">
          <button
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            type="submit"
          >
            Tambah siswa
          </button>
        </div>
      </form>
    </section>
  );
}
