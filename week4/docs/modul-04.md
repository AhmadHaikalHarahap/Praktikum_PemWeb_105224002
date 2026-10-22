# Modul 4 — Dokumentasi Teknis Next.js App Router

**Nama:** Ahmad Haikal Harahap  
**NIM:** 105224002  
**Proyek:** WiFi Check  
**Repository:** https://github.com/AhmadHaikalHarahap/105224002-WifiCheck

## 1. Peta Rute Aplikasi

Aplikasi WiFi Check menggunakan Next.js App Router. Struktur direktori `app/` digunakan untuk mendefinisikan halaman, layout, dan endpoint API. Berikut peta rute aplikasi.

| URL | File di `app/` | Jenis rute | Isi halaman |
|---|---|---|---|
| `/` | `app/page.tsx` | Statis | Halaman utama yang menampilkan ringkasan dan penilaian keamanan Wi-Fi. |
| `/check` | `app/check/page.tsx` | Statis | Halaman formulir untuk melakukan pemeriksaan konfigurasi Wi-Fi. |
| `/history` | `app/history/page.tsx` | Statis | Halaman riwayat penilaian dengan fitur pencarian dan filter risiko. |
| `/reports/[id]` | `app/reports/[id]/page.tsx` | Dinamis dengan parameter rute | Halaman detail laporan berdasarkan ID penilaian. |
| `/api/fingerprint` | `app/api/fingerprint/route.ts` | Endpoint API | Menerima konfigurasi Wi-Fi melalui metode POST dan menghasilkan fingerprint SHA-256. |
| `/_not-found` | `app/not-found.tsx` | Halaman khusus | Menampilkan halaman ketika rute yang diminta tidak ditemukan. |

Rute `/reports/[id]` menggunakan parameter dinamis `id`. Fungsi `generateStaticParams()` menghasilkan parameter dari data mock penilaian sehingga beberapa laporan dapat dipersiapkan saat proses build.

## 2. Struktur Folder `app/`

Struktur utama direktori `app/` pada proyek WiFi Check adalah sebagai berikut.

```text
app/
├── api/
│   └── fingerprint/
│       └── route.ts
├── check/
│   └── page.tsx
├── history/
│   └── page.tsx
├── reports/
│   └── [id]/
│       ├── page.tsx
│       └── ReportDetailClient.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
├── not-found.tsx
└── page.tsx
```

File `layout.tsx` berfungsi sebagai layout utama yang membungkus halaman aplikasi dengan `AssessmentProvider`. File `page.tsx` pada direktori utama merupakan halaman beranda, sedangkan folder `check` dan `history` masing-masing berisi halaman pemeriksaan dan riwayat penilaian.

Folder `reports/[id]` digunakan untuk menampilkan detail laporan berdasarkan ID. File `page.tsx` pada folder tersebut berfungsi sebagai Server Component yang membungkus `ReportDetailClient.tsx` menggunakan `Suspense`.

Folder `api/fingerprint` berisi `route.ts` yang menangani permintaan POST untuk membuat fingerprint konfigurasi Wi-Fi.

## 3. Perencanaan dan Penggunaan Layout Bersarang

Layout utama aplikasi berada pada `app/layout.tsx`. Layout ini mengatur struktur HTML dasar, metadata aplikasi, font, stylesheet global, serta penyedia context penilaian melalui `AssessmentProvider`.

Layout utama membungkus halaman yang berada di bawah direktori `app/`. Dengan demikian, halaman dapat menggunakan konteks penilaian yang disediakan oleh `AssessmentProvider` tanpa membuat penyedia context yang terpisah pada setiap halaman.

Pada rute detail laporan, `app/reports/[id]/page.tsx` menggunakan `Suspense` dengan tampilan fallback berupa pesan pemuatan laporan. Komponen `ReportDetailClient.tsx` menangani pengambilan ID laporan dan menampilkan detail atau pesan bahwa laporan tidak ditemukan.

Berdasarkan struktur direktori yang diperiksa, belum terdapat file `loading.tsx`, `error.tsx`, atau `template.tsx`. Oleh karena itu, ketiga file tersebut tidak dicatat sebagai implementasi yang sudah tersedia.

## 4. Server Components dan Client Components

Next.js App Router mendukung Server Components dan Client Components. Server Components digunakan untuk bagian yang tidak memerlukan interaktivitas React pada sisi klien, sedangkan Client Components digunakan ketika halaman memerlukan state, event handler, atau API React yang berjalan pada sisi klien.

Pada proyek WiFi Check, pembagian komponen yang ditemukan adalah sebagai berikut.

| File | Jenis komponen | Alasan |
|---|---|---|
| `app/layout.tsx` | Server Component | Tidak menggunakan direktif `'use client'`. |
| `app/reports/[id]/page.tsx` | Server Component | Menggunakan `Suspense` dan `generateStaticParams()` tanpa direktif `'use client'`. |
| `app/page.tsx` | Client Component | Menggunakan direktif `'use client'` dan context penilaian. |
| `app/check/page.tsx` | Client Component | Menggunakan direktif `'use client'` dan menampilkan formulir pemeriksaan. |
| `app/history/page.tsx` | Client Component | Menggunakan state dan memoization untuk pencarian serta filter. |
| `app/reports/[id]/ReportDetailClient.tsx` | Client Component | Menggunakan `React.use()` dan `useAssessments()` untuk mengambil detail laporan. |
| `components/providers/AssessmentProvider.tsx` | Client Component | Menggunakan React Context, `useState`, dan `useCallback`. |

### Penggunaan AssessmentProvider

`AssessmentProvider` menyediakan data penilaian kepada komponen aplikasi melalui React Context. Data awal diambil dari `mockAssessments`, kemudian penilaian baru dapat ditambahkan menggunakan fungsi `addAssessment()`.

Fungsi `getAssessment()` digunakan untuk menemukan data penilaian berdasarkan ID. Jika ID tidak ditemukan, komponen detail laporan menampilkan keadaan laporan tidak ditemukan.

Data baru masih disimpan dalam state React di sisi klien. Dengan demikian, penilaian yang baru ditambahkan belum disimpan secara permanen ke database dan dapat hilang ketika halaman dimuat ulang.

### Pemeriksaan `server-only`

Pencarian teks `server-only` pada berkas TypeScript dan TSX proyek tidak menemukan impor tersebut. Oleh karena itu, dokumentasi ini tidak menyatakan bahwa proteksi menggunakan paket `server-only` telah diterapkan.

## 5. Pengujian Parameter Rute Dinamis

Rute `/reports/[id]` menerima parameter `id` untuk menentukan laporan yang akan ditampilkan. Fungsi `generateStaticParams()` menghasilkan daftar ID berdasarkan data pada `mockAssessments`.

Komponen `ReportDetailClient.tsx` mengambil ID dari parameter rute dan mencari laporan menggunakan `getAssessment(id)`. Jika laporan ditemukan, halaman menampilkan detail penilaian. Jika tidak ditemukan, halaman menampilkan pesan **Report Not Found** dan tautan kembali ke riwayat.

Pengujian parameter rute dilakukan dengan memeriksa laporan yang tersedia dan ID yang tidak terdapat dalam data penilaian. Hasil yang diharapkan adalah detail laporan untuk ID yang valid dan tampilan laporan tidak ditemukan untuk ID yang tidak valid.

Catatan: pengujian manual untuk seluruh variasi ID perlu dilakukan melalui browser sebelum dinyatakan sebagai pengujian yang telah selesai.

## 6. Pengujian Endpoint API Fingerprint

Endpoint `POST /api/fingerprint` digunakan untuk menghasilkan fingerprint konfigurasi Wi-Fi. Implementasi berada di `app/api/fingerprint/route.ts`, sedangkan fungsi pembentukan fingerprint berada di `lib/wifi-fingerprint.ts`.

Input konfigurasi terdiri atas lima atribut:

- `ssid`
- `securityProtocol`
- `passwordProtection`
- `wpsEnabled`
- `firmwareStatus`

Fungsi `createWifiFingerprint()` melakukan validasi terhadap atribut tersebut, membentuk representasi JSON kanonis, lalu menghitung hash menggunakan SHA-256.

### 6.1 Pengujian input valid

Pengujian dilakukan melalui PowerShell dengan konfigurasi berikut:

```json
{
  "ssid": "WiFi-Test",
  "securityProtocol": "wpa2",
  "passwordProtection": "enabled",
  "wpsEnabled": "disabled",
  "firmwareStatus": "up-to-date"
}
```

Hasil aktual pengujian:

```text
algorithm      : SHA-256
schemaVersion  : 1
fingerprint    : 3fe701a1f0a89c1c78b2e4d3d155ea5f0bf40e282b6652330fafaf739499555a
```

Hasil tersebut menunjukkan bahwa API berhasil memproses konfigurasi yang diuji dan menghasilkan fingerprint SHA-256.

### 6.2 Pengujian JSON tidak valid

Pengujian kedua menggunakan body JSON yang tidak valid:

```text
{invalid-json}
```

Hasil aktual menunjukkan:

```text
Status HTTP: 400
```

Hasil ini sesuai dengan implementasi API yang mengembalikan HTTP 400 ketika body permintaan tidak dapat diparsing sebagai JSON yang valid.

## 7. Hasil Verifikasi Proyek

Verifikasi dilakukan menggunakan TypeScript, ESLint, dan proses build Next.js.

| Perintah | Hasil aktual |
|---|---|
| `npx tsc --noEmit` | Selesai tanpa output kesalahan. |
| `npm run lint` | ESLint berjalan tanpa pesan kesalahan atau peringatan yang terlihat. |
| `npm run build` | Build berhasil, proses TypeScript selesai, dan halaman statis berhasil dibuat. |
| Pengujian API input valid | Menghasilkan fingerprint SHA-256. |
| Pengujian API JSON tidak valid | Menghasilkan HTTP 400. |

Hasil build menampilkan rute `/`, `/check`, dan `/history` sebagai halaman statis. Endpoint `/api/fingerprint` ditampilkan sebagai rute dinamis yang diproses sesuai permintaan. Rute `/reports/[id]` menggunakan Partial Prerendering dengan beberapa jalur laporan yang dipersiapkan dari data mock.

Hasil tersebut menunjukkan bahwa pemeriksaan tipe TypeScript, lint, build, dan dua skenario pengujian API telah dijalankan. Pengujian browser tambahan tetap diperlukan untuk memverifikasi interaksi antarmuka dan variasi parameter laporan.

## 8. Kendala dan Solusi

Pada pengujian awal API, permintaan menghasilkan kesalahan karena server belum dapat diakses melalui `localhost:3000`. Setelah server Next.js dijalankan, permintaan dapat diterima.

Pengujian input awal juga menghasilkan HTTP 400 karena atribut yang dikirim belum sesuai dengan struktur `WifiFingerprintInput`. Setelah input disesuaikan dengan lima atribut yang diperlukan, API berhasil menghasilkan fingerprint SHA-256.

Kendala tersebut diselesaikan dengan memeriksa implementasi `route.ts` dan `lib/wifi-fingerprint.ts`, menjalankan server development, serta menyesuaikan payload pengujian dengan tipe input yang digunakan.

## 9. Penggunaan Bantuan AI

Bantuan AI digunakan untuk membantu memahami struktur Next.js App Router, membedakan Server Components dan Client Components, menyusun peta rute, serta mengidentifikasi penyebab kegagalan pengujian API.

Saran yang diberikan diperiksa kembali dengan kode sumber dan hasil perintah terminal. Hasil pengujian yang dicatat dalam dokumen menggunakan keluaran aktual dari proyek. Keputusan akhir mengenai kode dan dokumentasi tetap dilakukan oleh pengembang.

## 10. Kesimpulan

Proyek WiFi Check menggunakan Next.js App Router dengan halaman utama, halaman pemeriksaan, riwayat penilaian, rute detail laporan dinamis, dan endpoint API fingerprint. Pembagian Server Components dan Client Components dilakukan sesuai kebutuhan pemrosesan dan interaktivitas.

Pengujian menunjukkan bahwa TypeScript, ESLint, dan build berjalan tanpa kesalahan yang terlihat. Endpoint fingerprint juga berhasil menghasilkan hash SHA-256 untuk input valid dan mengembalikan HTTP 400 untuk JSON yang tidak valid.

Data penilaian baru pada implementasi saat ini masih disimpan di memori React dan belum menggunakan penyimpanan database permanen.

