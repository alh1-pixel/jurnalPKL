"use client";

import { useActionState } from "react";
import { masukAdmin, type HasilMasukAdmin } from "@/app/login/actions";

const awal: HasilMasukAdmin = { pesan: "" };

export default function FormLoginAdmin() {
  const [hasil, kirim, sedangKirim] = useActionState(masukAdmin, awal);

  return (
    <form
      action={kirim}
      className="mx-auto max-w-sm space-y-4 rounded-xl bg-white p-6"
    >
      <div>
        <label className="mb-1 black text-sm font-medium" htmlFor="password">
          Kata sandi admin
        </label>
        <input
          autoComplete="curren-password"
          className="block w-full rounded border px-3 py-2"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {hasil.pesan && (
        <p aria-live="polite" className="text-sm tex-red-600">
          {hasil.pesan}
        </p>
      )}
      <button
        className="w-full rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={sedangKirim}
        type="submit"
      >
        {sedangKirim ? "Memeriksa" : "Masuk"}
      </button>
    </form>
  );
}
