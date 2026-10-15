# Dokumen Teknis Modul 3 — TypeScript dan Komponen React

Nama/NIM: Ahmad Haikal Harahap / 105224002  
Repositori: [https://github.com/AhmadHaikalHarahap/Pemweb-modul1]

## 1. Tipe Data Produk

Tipe data produk didefinisikan menggunakan TypeScript pada berkas `lib/tipe.ts`. Tipe ini digunakan untuk memastikan bahwa setiap item memiliki struktur data yang konsisten dan sesuai dengan kebutuhan aplikasi.

Contoh implementasi:
export type Kategori = "energi" | "lingkungan" | "kampus";

export interface Item {
  id: number;
  judul: string;
  kategori: Kategori;
  deskripsi: string;
  tersedia: boolean;
  gambar?: string;
}

Penjelasan:

- `Kategori` menggunakan union type agar nilai kategori hanya dapat berupa `"energi"`, `"lingkungan"`, atau `"kampus"`. Dengan demikian, kesalahan penulisan kategori dapat dideteksi oleh TypeScript.
- `Item` menggunakan interface untuk mendefinisikan struktur data item, meliputi identitas, judul, kategori, deskripsi, dan status ketersediaan.
- Properti `gambar` bersifat opsional karena tidak semua item harus memiliki gambar.
- Tipe `number`, `string`, dan `boolean` digunakan sesuai dengan karakteristik nilai setiap properti.

Penggunaan tipe data ini membantu meningkatkan konsistensi data, mempermudah pemeliharaan kode, dan mengurangi kesalahan ketika data diteruskan melalui props komponen React.

## 2. Struktur Komponen

Aplikasi menggunakan pendekatan component-based development, yaitu membagi antarmuka menjadi beberapa komponen yang memiliki tanggung jawab tertentu dan dapat digunakan kembali.

### 2.1 Diagram pohon komponen

Struktur berikut merupakan rancangan yang perlu disesuaikan dengan struktur akhir aplikasi.

```text
RootLayout (Server Component)
├── SiteHeader
├── Halaman Utama (Server Component)
│   ├── Bagian
│   │   └── ItemTerbaru (Client Component)
│   └── Bagian
└── SiteFooter

Halaman Katalog (Server Component)
└── Bagian
    └── DaftarItem (Client Component)
        └── KartuItem
```

`DaftarItem` ditetapkan sebagai Client Component karena menggunakan `useState` dan event handler untuk pencarian serta filter kategori. `ItemTerbaru` juga merupakan Client Component apabila mengambil data menggunakan `useEffect`.

Komponen yang tidak memerlukan state atau event interaktif dapat tetap menjadi Server Component sesuai dengan implementasi dan lokasi impornya. Komponen yang diimpor oleh Client Component menjadi bagian dari batas Client Component tersebut.

### 2.2 Tabel komponen

| Nama komponen | Props dan tipe | Tempat digunakan |
|---|---|---|
| `SiteHeader` | `namaProduk: string`, `tautan: Tautan[]` | `app/layout.tsx` |
| `SiteFooter` | `namaProduk: string` | `app/layout.tsx` |
| `Bagian` | `id: string`, `judul: string`, `children: React.ReactNode` | Halaman utama dan katalog |
| `KartuItem` | `item: Item` | Daftar item |
| `DaftarItem` | `items: Item[]` | Halaman katalog |
| `ItemTerbaru` | Tidak memiliki props wajib pada rancangan modul | Halaman utama |

Tabel tersebut menggambarkan props sesuai rancangan modul. Nama dan tipe props perlu diperiksa kembali terhadap kode akhir setiap komponen.

Pemecahan komponen dilakukan untuk mengurangi pengulangan kode, mempermudah pengembangan, dan memisahkan tanggung jawab antarmuka. Props digunakan untuk mengirimkan data dari komponen induk ke komponen anak, sedangkan state digunakan untuk menyimpan data yang dapat berubah akibat interaksi pengguna.

## 3. State dan Interaksi

### 3.1 Tangkapan layar React Developer Tools

**[Sisipkan tangkapan layar tab Components di sini]**

Tangkapan layar diambil ketika halaman katalog sedang dibuka dan komponen `DaftarItem` dipilih pada tab Components. Bukti harus memperlihatkan props `items` dan state `kataKunci` serta `filter` pada bagian Hooks.

### 3.2 Penjelasan alur event hingga render ulang

Komponen `DaftarItem` menggunakan dua state utama:

- `kataKunci`, bertipe `string`, untuk menyimpan teks pencarian yang dimasukkan pengguna.
- `filter`, bertipe `Filter`, untuk menyimpan kategori yang dipilih. Tipe `Filter` merupakan gabungan `Kategori` dan literal `"semua"`.

Alur interaksinya adalah sebagai berikut:

1. Komponen menerima data item melalui props `items`.
2. Pengguna mengetik pada kolom pencarian. Event `onChange` membaca nilai input dan memanggil `setKataKunci`.
3. Ketika tombol kategori diklik, event `onClick` memanggil `setFilter` dengan kategori yang dipilih.
4. Perubahan state menjadwalkan render ulang komponen.
5. Pada proses render, daftar hasil dihitung menggunakan `filter()` berdasarkan kecocokan kata kunci dan kategori.
6. Hasil ditampilkan menggunakan `map()`, dengan `item.id` sebagai `key` yang stabil.
7. Jika tidak ada hasil yang cocok, aplikasi menampilkan pesan "Tidak ada item yang sesuai."

Hasil pencarian tidak perlu disimpan sebagai state terpisah karena dapat dihitung dari props `items` dan kedua state tersebut. Pendekatan ini menghindari penyimpanan data turunan yang berlebihan.

## 4. Pengambilan Data

### 4.1 Tangkapan layar panel Network

**[Sisipkan tangkapan layar panel Network untuk permintaan `/data/item.json` di sini]**

Buka Developer Tools pada peramban, pilih tab Network, kemudian muat ulang halaman. Cari permintaan `item.json` dan pastikan tangkapan layar memperlihatkan URL permintaan, status HTTP, serta jenis permintaan jika tersedia.

Data tiruan disimpan di `public/data/item.json` dan diakses melalui Fetch API menggunakan alamat `/data/item.json`.

### 4.2 Hasil pengujian

| Kondisi | Cara pengujian | Hasil yang diharapkan |
|---|---|---|
| Memuat | Aktifkan throttling jaringan, misalnya Slow 4G, lalu muat halaman | Pesan "Memuat data…" tampil selama data sedang diambil |
| Berhasil | Gunakan alamat `/data/item.json` yang benar dan pastikan JSON valid | Data berhasil dimuat dan tiga item terbaru ditampilkan |
| Gagal | Ubah alamat fetch sementara menjadi `/data/tidak-ada.json` | Respons 404 ditangani dan pesan "Data gagal dimuat. Muat ulang halaman." tampil |

**Hasil pengujian aktual:** Lengkapi tabel ini setelah ketiga kondisi diuji pada aplikasi. Jangan menandai pengujian berhasil sebelum hasilnya diamati.

Fetch API tidak otomatis menolak Promise ketika server mengembalikan status HTTP seperti 404. Oleh karena itu, aplikasi perlu memeriksa `res.ok` dan melempar error apabila respons tidak berhasil. Blok `catch` kemudian menangani kegagalan tersebut dengan mengubah state menjadi `"gagal"`.

## 5. Verifikasi

Pemeriksaan dilakukan menggunakan perintah berikut pada terminal di direktori utama proyek.

### 5.1 Pemeriksaan tipe TypeScript

```bash
npx tsc --noEmit
```

**Keluaran aktual:**

```text
[Tempel keluaran terminal setelah perintah dijalankan]
```

Perintah ini digunakan untuk memeriksa kesesuaian tipe TypeScript tanpa menghasilkan berkas JavaScript. Target verifikasi adalah tidak adanya galat tipe.

### 5.2 Pemeriksaan lint

```bash
npm run lint
```

**Keluaran aktual:**

```text
[Tempel keluaran terminal setelah perintah dijalankan]
```

Perintah ini digunakan untuk memeriksa masalah kode berdasarkan konfigurasi lint proyek. Hasil aktual perlu dicatat, termasuk apabila masih terdapat peringatan atau galat.

## 6. Kendala dan Penyelesaian

Bagian ini mencatat kendala yang benar-benar ditemukan selama implementasi Modul 3 beserta penyelesaiannya.

| Kendala | Penyelesaian |
|---|---|
| [Isi dengan kendala yang ditemukan pada proyek] | [Jelaskan langkah penyelesaiannya] |
| [Isi dengan kendala lain jika ada] | [Jelaskan langkah penyelesaiannya] |

Contoh kendala yang dapat dicatat apabila memang terjadi:

- Galat tipe pada props: sesuaikan tipe props dengan data yang dikirimkan oleh komponen induk.
- Komponen yang menggunakan `useState` tidak dapat dijalankan sebagai Server Component: tambahkan direktif `"use client"` pada komponen yang membutuhkan interaksi.
- Data JSON gagal dimuat: periksa alamat fetch, validitas JSON, status respons pada Network, dan pesan pada Console.
- Peringatan daftar React: gunakan `key` yang unik dan stabil, misalnya `item.id`.

## 7. Catatan Pemanfaatan AI

**Alat:** ChatGPT.

**Perintah utama:** Meminta bantuan menyusun kerangka dokumen teknis Modul 3, menjelaskan tipe data TypeScript, struktur komponen React, alur state dan event, Fetch API, serta langkah verifikasi proyek.

**Bagian yang digunakan:** Penyusunan draf dokumentasi, penjelasan keputusan teknis, dan panduan pengujian.

**Cara verifikasi:** Mencocokkan draf dengan kode aktual dalam repositori, memeriksa props dan state melalui React Developer Tools, menguji kondisi memuat, berhasil, dan gagal pada panel Network, serta menjalankan `npx tsc --noEmit` dan `npm run lint`.

Dokumen akhir dan hasil pengujian diperiksa kembali agar sesuai dengan implementasi aktual. Penggunaan AI dicatat secara transparan sesuai ketentuan praktikum.