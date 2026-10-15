# Dokumen Teknis Modul 02 — FITCORE Meal Plan

Nama : Ahmad Haikal Harahap (105224002)
Link Repository : 
## 1. Struktur Semantik

Halaman **FITCORE Meal Plan** menggunakan struktur HTML semantik untuk membagi halaman menjadi beberapa bagian utama.

Struktur landmark yang digunakan:

```text
<body>
└── <header>
    ├── Brand FITCORE
    └── <nav aria-label="Navigasi utama">
└── <main>
    ├── <section> Hero / informasi Meal Plan
    ├── <section> Nutrition Summary
    ├── <div> Main Grid
    │   ├── Daftar Today's Meals
    │   │   └── <article> setiap Meal Card
    │   └── Progress dan Schedule
    ├── <section> Motivational Banner
    └── <footer>
```

Penggunaan elemen semantik membantu membedakan bagian navigasi, konten utama, artikel meal, dan footer. Pada bagian meal, setiap menu dibuat menggunakan `<article>` karena setiap kartu dapat dianggap sebagai satu bagian konten yang berdiri sendiri.

Selain itu, navigasi diberi `aria-label="Navigasi utama"` agar lebih mudah dikenali oleh teknologi pembaca layar. Emoji pada kartu makanan diberi `aria-hidden="true"` karena hanya berfungsi sebagai elemen visual.

**Bukti Accessibility Tree:**

![Accessibility Tree](./aksebilitas%20tree.png)

---

## 2. Tata Letak Responsif

Website dibuat menggunakan **Tailwind CSS** dengan pendekatan mobile-first. Tampilan diuji pada ukuran layar **360 px, 768 px, dan 1280 px**.

### a. Tampilan 360 px

Pada ukuran 360 px, konten utama tersusun satu kolom agar tidak terlalu sempit. Navigation desktop juga disembunyikan menggunakan breakpoint `md`.

Kelas yang digunakan antara lain:

```text
grid-cols-1
px-4
sm:px-6
```

Hasil pengujian:

![Tampilan 360 px](./360%20px.png)

### b. Tampilan 768 px

Pada ukuran 768 px, beberapa elemen mulai menggunakan layout yang lebih lebar. Ringkasan nutrisi menggunakan empat kolom melalui breakpoint `md`.

Kelas yang digunakan:

```text
grid-cols-2
md:grid-cols-4
hidden md:flex
```

Hasil pengujian:

![Tampilan 768 px](./768%20px.png)

### c. Tampilan 1280 px

Pada ukuran desktop 1280 px, bagian meal dan progress dibuat menjadi dua area utama. Daftar meal mengambil sekitar 2/3 area, sedangkan progress mengambil 1/3 area.

Kelas yang digunakan:

```text
grid-cols-1
lg:grid-cols-3
lg:col-span-2
```

Penggunaan `lg:grid-cols-3` dipilih agar layout tetap satu kolom pada layar kecil dan berubah menjadi tiga kolom pada layar besar.

Hasil pengujian:

![Tampilan 1280 px](./1280%20px.png)

---

## 3. Audit Aksesibilitas

Audit dilakukan menggunakan **Lighthouse Accessibility**.

### Hasil Audit

| Kondisi | Hasil |
|---|---:|
| Sebelum perbaikan | Error / belum memenuhi beberapa pemeriksaan aksesibilitas |
| Setelah perbaikan | **95/100** |

Bukti hasil audit setelah perbaikan:

![Audit Accessibility 95](./audit%2095.png)

Bukti audit sebelum perbaikan:

![Audit Accessibility Error](./audit%20eror.png)

### Masalah yang ditemukan

Pada audit awal terdapat beberapa pemeriksaan aksesibilitas yang masih bermasalah, terutama berkaitan dengan:

- elemen interaktif dan navigasi keyboard;
- urutan fokus;
- struktur/urutan elemen pada halaman;
- penandaan elemen agar tujuannya lebih jelas;
- kontras warna pada beberapa teks.

### Perbaikan yang dilakukan

Beberapa perubahan yang dilakukan pada kode adalah:

1. Menambahkan `aria-label` pada navigasi utama.
2. Menggunakan elemen `<article>` untuk setiap kartu makanan.
3. Menambahkan `aria-hidden="true"` pada emoji yang hanya bersifat dekoratif.
4. Menambahkan atribut ARIA pada progress bar:
   - `role="progressbar"`
   - `aria-valuemin`
   - `aria-valuemax`
   - `aria-valuenow`
5. Memperbaiki beberapa warna teks yang terlalu redup agar kontrasnya lebih baik.
6. Memberikan hubungan judul dan section menggunakan `aria-labelledby`.
7. Menggunakan struktur `header`, `nav`, `main`, `section`, `article`, dan `footer` agar struktur halaman lebih jelas.

### Pengujian Keyboard

Pengujian manual dilakukan dengan menggunakan tombol **Tab** untuk berpindah antar elemen interaktif.

Elemen tombol pada kartu meal dapat menerima fokus dan dapat digunakan untuk mengubah status meal menjadi **Completed**. Navigasi utama juga menggunakan elemen `<button>` sehingga dapat diakses menggunakan keyboard.

---

## 4. Kendala dan Penyelesaian

Kendala yang ditemukan selama pengerjaan adalah masih kurang memahami penggunaan Git dan beberapa konsep aksesibilitas pada website. Pada awalnya hasil audit Lighthouse masih menunjukkan beberapa error sehingga perlu dilakukan pengecekan ulang pada struktur HTML, warna teks, dan elemen interaktif.

Penyelesaiannya dilakukan dengan bantuan **ChatGPT** untuk memahami masalah Git dan mencari bagian kode yang menyebabkan masalah aksesibilitas. Setelah perubahan dilakukan, hasilnya tetap diverifikasi sendiri dengan menjalankan website dan melakukan audit Lighthouse kembali.

Selain itu, pengaturan responsive juga perlu dicek pada beberapa ukuran layar agar tampilan tidak rusak ketika berpindah dari mobile ke desktop.

---

## 5. Catatan Pemanfaatan AI

AI digunakan selama proses pengerjaan proyek.

### Tools yang digunakan

- **Antigravity** — digunakan untuk membantu membuat interface dan tampilan website FITCORE Meal Plan.
- **ChatGPT** — digunakan untuk membantu memahami Git, menganalisis masalah aksesibilitas, memberikan saran struktur HTML semantik, dan membantu memperbaiki masalah yang ditemukan pada audit Lighthouse.

### Bagian yang dibantu AI

Beberapa bagian yang dibantu antara lain:

1. Pembuatan konsep dan interface Meal Plan.
2. Penjelasan penggunaan Git dan penyelesaian kendala Git.
3. Analisis penyebab hasil Lighthouse masih rendah.
4. Perbaikan semantic HTML dan atribut ARIA.
5. Perbaikan kontras warna dan struktur halaman.

### Verifikasi

Hasil dari AI tidak langsung digunakan tanpa pengecekan. Kode yang diberikan kemudian diterapkan pada project dan diverifikasi dengan menjalankan website, mengecek tampilan pada beberapa ukuran layar, serta melakukan audit Lighthouse kembali.

Hasil audit setelah perbaikan menunjukkan skor **95/100 pada Accessibility**.
