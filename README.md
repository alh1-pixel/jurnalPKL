# Jurnal PKL

Website untuk membantu siswa mencatat kegiatan Praktik Kerja Lapangan (PKL), melihat status jurnal, dan membantu admin melakukan peninjauan.

## Informasi proyek

- **Nama aplikasi:** JurnalKu
- **Repository:** [masukkan tautan repository GitHub]
- **Website:** [masukkan tautan deployment, atau tulis Belum dideploy]
- **Pembuat:** [nama dan kelas]

## Teknologi

- Next.js
- TypeScript
- Tailwind CSS
- Supabase

## Fitur dan halaman

| Rute                | Fungsi                                              |
| ------------------- | --------------------------------------------------- |
| `/`                 | Beranda dan tautan ke halaman masuk                 |
| `/masuk`            | Masuk sebagai siswa menggunakan kode siswa          |
| `/jurnal`           | Melihat jurnal, ringkasan durasi/status, dan keluar |
| `/jurnal/baru`      | Membuat jurnal baru                                 |
| `/jurnal/[id]/ubah` | Mengubah jurnal yang belum disetujui                |
| `/login`            | Masuk sebagai admin                                 |
| `/admin`            | Ringkasan data dan peninjauan jurnal                |
| `/admin/siswa`      | Menambah, mengubah, dan menghapus data siswa        |

## Persiapan

### Persyaratan

- Node.js dan npm
- Proyek Supabase yang sudah dikonfigurasi

### Instalasi dependensi

```bash
npm install
```

### Environment variables

Buat file `.env.local` di folder utama proyek:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SESSION_SECRET=
ADMIN_PASSWORD=
```

Isi nilainya secara lokal sesuai konfigurasi. Jangan mencantumkan nilai rahasia di README atau commit `.env.local` ke repository.

### Menjalankan aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000`.

### Pemeriksaan kode

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Catat hasil yang benar-benar diperoleh. Jangan menuliskan pemeriksaan berhasil jika belum dijalankan.

## Struktur database

Aplikasi menggunakan tabel berikut:

### `siswa`

Kolom yang digunakan aplikasi: `id`, `nama`, `kelas`, `tempat_pkl`, `pembimbing`, dan `kode`.

### `jurnal`

Kolom yang digunakan aplikasi: `id`, `siswa_id`, `tanggal`, `kegiatan`, `kompetensi`, `durasi_jam`, `status`, `catatan`, dan `dibuat`.

`jurnal.siswa_id` mengacu pada `siswa.id`. Sesuaikan dokumentasi ini dengan skema aktual di Supabase.

Pastikan database memiliki constraint yang diperlukan, termasuk kode siswa unik dan satu jurnal per siswa untuk tanggal yang sama.

## Aturan bisnis dan validasi

- Tanggal jurnal adalah hari ini atau maksimal 7 hari sebelumnya.
- Kegiatan berisi 30–500 karakter.
- Kompetensi berisi 3–60 karakter.
- Durasi berupa bilangan bulat 1–10 jam.
- Satu siswa hanya boleh memiliki satu jurnal pada tanggal yang sama.
- Status jurnal adalah `diajukan`, `disetujui`, atau `revisi`.
- Catatan revisi admin minimal 5 karakter.
- Siswa hanya dapat mengubah jurnal yang belum disetujui.
- Siswa hanya boleh mengakses jurnal miliknya sendiri.

Validasi dilakukan di server. Validasi pada elemen formulir di browser hanya membantu pengguna; bukan pengganti validasi server.

## Akses dan keamanan

- Halaman dan Server Actions admin memeriksa sesi admin.
- Identitas siswa diambil dari sesi, bukan dipercaya dari input pengguna.
- Kunci Supabase dan password admin disimpan sebagai environment variables.
- `SUPABASE_SECRET_KEY` hanya digunakan di server dan memiliki hak akses tinggi. Jangan mengekspos atau membagikan nilainya.
- Karena secret key Supabase dapat melewati RLS, operasi data harus tetap dibatasi melalui pemeriksaan sesi dan kepemilikan di server.

## Data contoh dan pengujian

- Jumlah data siswa contoh: [isi jumlah; tugas meminta minimal 5 jika itu ketentuan pada lembar tugas]
- Jumlah jurnal contoh: [isi jumlah; tugas meminta minimal 12 jika itu ketentuan pada lembar tugas]
- Gunakan data fiktif, bukan data pribadi nyata.

Skenario yang diuji:

- [ ] Login siswa dengan kode benar dan salah
- [ ] Siswa hanya melihat jurnal miliknya
- [ ] Pembuatan jurnal dengan data valid
- [ ] Penolakan tanggal, durasi, atau panjang teks yang tidak valid
- [ ] Penolakan jurnal ganda pada tanggal yang sama
- [ ] Admin menyetujui jurnal dan meminta revisi
- [ ] Catatan revisi terlihat oleh siswa
- [ ] Admin menambah, mengubah, dan menghapus siswa
- [ ] Siswa yang memiliki jurnal tidak dapat dihapus
- [ ] Logout dan akses langsung ke halaman yang dilindungi

Hasil pemeriksaan:

- `npm run lint`: [belum dijalankan / hasil]
- `npx tsc --noEmit`: [belum dijalankan / hasil]
- `npm run build`: [belum dijalankan / hasil]

## Kendala dan pekerjaan tersisa

- Kendala yang ditemukan: [tulis kendala nyata dan cara mengatasinya]
- Pekerjaan tersisa: [tulis yang belum selesai, atau Tidak ada jika memang selesai]

## Rencana dan progres

| Tahap                       | Status   |
| --------------------------- | -------- |
| Halaman dan alur siswa      | [status] |
| Panel dan pengelolaan admin | [status] |
| Pengujian                   | [status] |
| Deployment                  | [status] |
