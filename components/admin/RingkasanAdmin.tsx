type Props = {
  jumlahSiswa: number;
  jumlahDiajukan: number;
  jumlahDisetujui: number;
  jumlahRevisi: number;
  totalJam: number;
};

export default function RingkasanAdmin({
  jumlahSiswa,
  jumlahDiajukan,
  jumlahDisetujui,
  jumlahRevisi,
  totalJam,
}: Props) {
  const ringkasan = [
    { label: "Jumlah siswa", nilai: jumlahSiswa },
    { label: "Menunggu ditinjau", nilai: jumlahDiajukan },
    { label: "Disetujui", nilai: jumlahDisetujui },
    { label: "Revisi", nilai: jumlahRevisi },
    { label: "Total jam PKL", nilai: `${totalJam} jam` },
  ];

  return (
    <section
      aria-label="Ringkasan PKL"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {ringkasan.map((item) => (
        <article
          className="rounded-xl border bg-white p-4 shadow-sm"
          key={item.label}
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-bold">{item.nilai}</p>
        </article>
      ))}
    </section>
  );
}
