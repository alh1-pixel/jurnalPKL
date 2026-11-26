import { Suspense } from "react";
import { redirect } from "next/navigation";

import FormLoginAdmin from "@/components/FormLoginAdmin";
import { ambilSesiAdmin } from "@/lib/sesi-admin";

export default function HalamanLoginAdmin() {
  return (
    <Suspense fallback={<p className="py-10">Memeriksa sesi admin...</p>}>
      <KontenLoginAdmin />
    </Suspense>
  );
}

async function KontenLoginAdmin() {
  const sesi = await ambilSesiAdmin();

  if (sesi) {
    redirect("/admin");
  }

  return (
    <section className="py-10">
      <div className="mx-auto mb-5 max-w-sm">
        <p className="text-sm font-medium text-blue-600">Area admin</p>
        <h1 className="mt-1 text-2xl font-bold">Login administrator</h1>
        <p className="mt-2 text-sm text-slate-600">
          Masukkan kata sandi admin untuk melanjutkan
        </p>
      </div>
      <FormLoginAdmin />
    </section>
  );
}
