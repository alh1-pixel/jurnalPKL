import FormLoginAdmin from "@/components/FormLoginAdmin";

export default function HalamanLoginAdmin() {
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
