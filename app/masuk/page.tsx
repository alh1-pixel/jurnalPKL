import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { masukMurid } from "./actions";
import { ambilSesiMurid } from "@/lib/sesi-murid";

type Props = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default function HalamanMasukMurid({ searchParams }: Props) {
  return (
    <Suspense
      fallback={
        <section className="mx-auto max-w-md py-10" aria-live="polite">
          Memuat halaman masuk...
        </section>
      }
    >
      <KontenMasukMurid searchParams={searchParams} />
    </Suspense>
  );
}

async function KontenMasukMurid({ searchParams }: Props) {
  const sesi = await ambilSesiMurid();

  if (sesi) {
    redirect("/jurnal");
  }

  const { error } = await searchParams;
  const kodeSalah = error === "kode";

  return (
    <section className="mx-auto max-w-md py-10">
      <div className="rounded-xl border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-blue-600">Area murid</p>
        <h1 className="mt-2 text-2xl font-bold">Masuk ke jurnal PKL</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gunakan kode siswa yang diberikan oleh sekolah.
        </p>

        <form action={masukMurid} className="mt-6 space-y-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium"
              htmlFor="kode"
            >
              Kode siswa
            </label>
            <input
              autoComplete="off"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              id="kode"
              maxLength={12}
              minLength={6}
              name="kode"
              pattern="[A-Za-z0-9-]{6,12}"
              placeholder="Contoh: PKL-A1N1"
              required
              type="password"
            />
          </div>

          {kodeSalah && (
            <p aria-live="polite" className="text-sm text-red-600">
              Kode siswa tidak cocok. Periksa kembali kode dari sekolah.
            </p>
          )}

          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            type="submit"
          >
            Masuk
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          <Link className="text-blue-600 hover:underline" href="/">
            Kembali ke beranda
          </Link>
        </p>
      </div>
    </section>
  );
}
