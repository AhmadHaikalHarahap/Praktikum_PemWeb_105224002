# Dokumen Teknis Modul 5 — Formulir, Validasi, Session, dan Cookie

**Nama/NIM:** Ahmad Haikal Harahap / 105224002  
**Repositori:** https://github.com/AhmadHaikalHarahap/105224002-WifiCheck

## 1. Skema Validasi

### 1.1 Tabel Aturan Validasi Formulir

WiFi Check memiliki formulir assessment yang digunakan untuk memasukkan informasi konfigurasi Wi-Fi. Validasi diperlukan agar data yang dimasukkan sesuai dengan aturan aplikasi sebelum diproses.

| Nama Kolom | Tipe Data | Aturan Validasi | Pesan Galat |
|---|---|---|---|
| SSID | String | Wajib diisi dan tidak boleh hanya berisi spasi | SSID wajib diisi. |
| SSID | String | Maksimal 32 karakter | SSID maksimal 32 karakter. |
| Security Protocol | Enum | Hanya menerima `open`, `wep`, `wpa2`, `wpa3`, atau `unknown` | Pilihan protokol keamanan tidak valid. |
| Notes | String | Opsional, maksimal 250 karakter | Catatan maksimal 250 karakter. |
| WPS Enabled | Boolean | Jika digunakan pada formulir, nilainya harus berupa pilihan aktif atau tidak aktif | Status WPS tidak valid. |

Pada kode yang diperiksa, validasi SSID, pilihan protokol keamanan, dan catatan sudah tersedia di `lib/validation.ts`. Aturan WPS pada tabel merupakan rancangan jika kolom tersebut digunakan pada formulir assessment yang dikembangkan.

### 1.2 Rancangan Skema Zod 4

Zod dapat digunakan untuk memvalidasi data di sisi server sebelum data diproses. Berikut contoh rancangan skema yang dapat disesuaikan dengan kolom formulir WiFi Check.

```typescript
import { z } from "zod";

export const assessmentSchema = z.object({
  ssid: z
    .string()
    .trim()
    .min(1, "SSID wajib diisi.")
    .max(32, "SSID maksimal 32 karakter."),

  securityProtocol: z.enum(
    ["open", "wep", "wpa2", "wpa3", "unknown"],
    {
      error: "Pilihan protokol keamanan tidak valid.",
    }
  ),

  notes: z
    .string()
    .max(250, "Catatan maksimal 250 karakter.")
    .optional(),

  wpsEnabled: z.boolean(),
});
```

**Catatan:** Kode tersebut merupakan rancangan untuk penerapan Zod 4, bukan pernyataan bahwa skema ini sudah digunakan oleh aplikasi. Sebelum diterapkan, sesuaikan nama kolom dan tipe data dengan formulir sebenarnya. Kolom `wpsEnabled` perlu dihapus dari skema jika tidak tersedia pada formulir.

### 1.3 Aturan Semantik

Selain validasi bentuk data, WiFi Check perlu melakukan pemeriksaan semantik, yaitu pemeriksaan terhadap makna atau kondisi data.

Contohnya, apabila protokol keamanan yang dipilih adalah `open`, aplikasi perlu memberikan penilaian bahwa jaringan tersebut tidak menggunakan autentikasi Wi-Fi. Jika WPS aktif, aplikasi juga dapat memberikan rekomendasi untuk menonaktifkannya apabila tidak diperlukan.

Pemeriksaan semantik sebaiknya dilakukan pada bagian pemrosesan server setelah data lolos validasi bentuk. Dengan begitu, aplikasi tidak hanya memeriksa apakah data memiliki format yang benar, tetapi juga dapat menentukan hasil evaluasi keamanan yang sesuai.

## 2. Alur Server Action

### 2.1 Alur Formulir Saat Ini

Berdasarkan kode proyek yang diperiksa, proses assessment saat ini berjalan melalui formulir pada `components/assessment/AssessmentForm.tsx`.

Alur yang digunakan adalah sebagai berikut:

1. Pengguna mengisi formulir assessment WiFi Check.
2. Formulir menjalankan validasi input melalui `validateAssessmentInput(formData)`.
3. Jika terdapat input yang tidak sesuai aturan, proses dihentikan dan validasi memberikan hasil yang sesuai.
4. Jika input lolos validasi, aplikasi menjalankan `performAssessment(formData)`.
5. Hasil assessment ditambahkan melalui `addAssessment`.
6. Pengguna diarahkan ke halaman laporan assessment.

Data assessment pada alur yang diperiksa masih menggunakan state aplikasi. Oleh karena itu, penyimpanan data permanen belum dapat dinyatakan tersedia berdasarkan implementasi tersebut.

### 2.2 Rancangan Alur Server Action

Sesuai materi Modul 5, pemrosesan formulir dapat dikembangkan menggunakan Server Action agar validasi tetap dilakukan meskipun validasi di sisi klien dilewati.

Alur yang direncanakan adalah:

1. Pengguna mengirimkan formulir.
2. Server Action menerima data formulir.
3. Data diperiksa menggunakan skema Zod 4 melalui `safeParse`.
4. Jika validasi gagal, server mengembalikan pesan galat untuk kolom yang bermasalah.
5. Jika validasi berhasil, server menjalankan pemeriksaan semantik.
6. Server memproses data assessment.
7. Jika data berhasil diubah atau disimpan, server menjalankan `revalidatePath` jika diperlukan.
8. Server menjalankan `redirect` menuju halaman laporan jika proses berhasil.

### 2.3 Pembagian Berkas

| Berkas/Komponen | Peran | Status |
|---|---|---|
| `components/assessment/AssessmentForm.tsx` | Menampilkan formulir dan menjalankan validasi di sisi klien | Sudah ada |
| `lib/validation.ts` | Memeriksa aturan input formulir | Sudah ada |
| `app/api/fingerprint/route.ts` | Menyediakan endpoint untuk membuat fingerprint konfigurasi Wi-Fi | Sudah ada |
| `lib/wifi-fingerprint.ts` | Menormalisasi data dan menghasilkan hash SHA-256 | Sudah ada |
| `lib/skema.ts` | Tempat skema Zod 4 yang direncanakan | Perlu dibuat jika skema diterapkan |
| Berkas Server Action | Memvalidasi dan memproses formulir di server | Perlu diterapkan dan diuji |

Pembagian tersebut membedakan implementasi yang sudah ditemukan dari rancangan pengembangan. Keberadaan endpoint fingerprint tidak berarti bahwa seluruh proses formulir sudah menggunakan Server Action.

## 3. Bukti Uji Validasi

Pengujian dilakukan untuk mengetahui apakah formulir menerima data yang benar dan menolak data yang tidak sesuai aturan. Pengujian juga perlu mencakup kondisi ketika validasi klien dilewati, misalnya dengan atribut `novalidate`.

Tabel berikut merupakan rencana pengujian berdasarkan aturan validasi yang digunakan atau direncanakan pada WiFi Check.

| No. | Masukan/Kasus Uji | Hasil yang Diharapkan | Hasil Aktual |
|---|---|---|---|
| 1 | SSID diisi dengan nama jaringan yang valid | Data lolos validasi SSID | Belum diuji |
| 2 | SSID dikosongkan | Data ditolak dan muncul pesan SSID wajib diisi | Belum diuji |
| 3 | SSID hanya berisi spasi | Data ditolak setelah proses trim | Belum diuji |
| 4 | SSID melebihi batas panjang yang ditetapkan | Data ditolak | Belum diuji |
| 5 | Protokol keamanan diisi dengan pilihan yang tidak valid | Data ditolak | Belum diuji |
| 6 | Catatan melebihi 250 karakter | Data ditolak | Belum diuji |
| 7 | Validasi klien dilewati menggunakan `novalidate`, kemudian SSID dikosongkan | Server Action menolak data jika validasi server sudah diterapkan | Belum diuji; Server Action belum teridentifikasi |
| 8 | Validasi klien dilewati dan protokol keamanan diberi nilai di luar pilihan yang diizinkan | Server Action menolak data jika validasi server sudah diterapkan | Belum diuji; Server Action belum teridentifikasi |
| 9 | Validasi klien dilewati dan catatan melebihi batas | Server Action menolak data jika validasi server sudah diterapkan | Belum diuji; Server Action belum teridentifikasi |

Kasus nomor 7–9 merupakan pengujian penting untuk membuktikan bahwa validasi server tetap bekerja ketika validasi pada browser dilewati.

**Bukti pengujian yang perlu dilengkapi:**

- Screenshot formulir ketika input tidak valid.
- Screenshot pesan galat pada kolom yang bermasalah.
- Screenshot hasil pengujian ketika validasi klien dilewati.
- Hasil aktual dari pengujian setelah fitur terkait diterapkan.

Screenshot dan hasil aktual perlu diisi berdasarkan pengujian langsung, bukan berdasarkan perkiraan.

## 4. Session dan Cookie

### 4.1 Penggunaan Session dan Cookie

Session digunakan untuk mempertahankan informasi autentikasi pengguna selama sesi penggunaan aplikasi. Cookie dapat digunakan oleh browser untuk menyimpan pengenal session yang dikirim kembali ke server pada permintaan berikutnya.

Pada kode WiFi Check yang diperiksa, implementasi login, session, dan cookie autentikasi belum teridentifikasi. Oleh karena itu, fitur tersebut belum dapat dinyatakan sudah berjalan.

Apabila autentikasi ditambahkan, cookie session dapat dikonfigurasi menggunakan atribut berikut.

| Atribut Cookie | Fungsi | Ancaman yang Dikurangi |
|---|---|---|
| `HttpOnly` | Mencegah JavaScript membaca cookie secara langsung | Mengurangi risiko pencurian cookie melalui XSS |
| `Secure` | Mengirim cookie hanya melalui koneksi HTTPS | Mengurangi risiko cookie dicuri melalui koneksi yang tidak aman |
| `SameSite=Lax` | Membatasi pengiriman cookie lintas situs pada sejumlah konteks permintaan | Mengurangi risiko serangan CSRF |
| `Max-Age` | Menentukan masa berlaku cookie dalam detik | Membatasi lamanya cookie berlaku |

Pengaturan cookie tersebut perlu diterapkan sesuai mekanisme autentikasi yang digunakan. Atribut cookie saja tidak menggantikan pemeriksaan session dan otorisasi di server.

### 4.2 Rencana Pengujian Session dan Cookie

| No. | Kasus Uji | Hasil yang Diharapkan | Hasil Aktual |
|---|---|---|---|
| 1 | Pengguna mengakses halaman yang membutuhkan autentikasi tanpa session | Akses ditolak atau diarahkan ke halaman masuk | Belum diuji; autentikasi belum teridentifikasi |
| 2 | Pengguna mengirim cookie session palsu | Server menolak session yang tidak valid | Belum diuji |
| 3 | Pengguna melakukan logout | Session dinonaktifkan dan cookie dihapus atau dibuat kedaluwarsa | Belum diuji |
| 4 | Pengguna menggunakan cookie session lama setelah logout | Server menolak session lama | Belum diuji |

### 4.3 Bukti Pengujian

Bukti yang perlu ditambahkan setelah fitur session diterapkan:

- Screenshot panel **Application** pada browser yang menunjukkan cookie session, dengan nilai sensitif disamarkan.
- Screenshot header `Set-Cookie` dari panel **Network**, dengan nilai cookie disamarkan.
- Screenshot hasil pengujian cookie palsu dan logout.

Karena fitur session dan cookie belum teridentifikasi pada kode yang diperiksa, bukti tersebut belum dapat disertakan sebagai hasil aktual.

## 5. Keputusan Teknis

### 5.1 Validasi Klien dan Server

Validasi klien berguna untuk memberikan umpan balik dengan cepat kepada pengguna. Namun, validasi tersebut dapat dilewati melalui browser atau dengan mengirimkan permintaan secara langsung.

Karena itu, validasi server tetap diperlukan sebelum data diproses. Penggunaan Zod 4 dapat membantu memastikan data yang diterima sesuai dengan tipe dan aturan yang ditetapkan.

### 5.2 Session di Server Dibandingkan Token di Cookie

Untuk aplikasi yang menggunakan login, pola session di server dapat dipilih agar status session dan pencabutan akses dapat dikendalikan oleh server. Browser cukup menyimpan pengenal session pada cookie dengan atribut keamanan yang sesuai.

Sebaliknya, token yang disimpan di cookie memerlukan pertimbangan tambahan mengenai masa berlaku, validasi token, dan pencabutan akses. Pemilihan pendekatan harus disesuaikan dengan kebutuhan aplikasi dan mekanisme autentikasi yang diterapkan.

Pada kondisi proyek yang diperiksa, kedua pendekatan tersebut masih menjadi pertimbangan pengembangan karena implementasi autentikasi belum teridentifikasi.

### 5.3 Peran `proxy.ts` dan Pemeriksaan di Server

`proxy.ts` dapat digunakan untuk melakukan pemeriksaan awal terhadap permintaan, misalnya memeriksa keberadaan informasi session sebelum pengguna melanjutkan ke halaman tertentu.

Namun, pemeriksaan pada `proxy.ts` tidak boleh menjadi satu-satunya lapisan keamanan. Server Action atau fungsi server yang memproses data tetap perlu memeriksa session dan hak akses sebelum menjalankan operasi yang dilindungi.

Dengan demikian, pemeriksaan awal pada `proxy.ts` membantu alur navigasi, sedangkan pemeriksaan di server memastikan operasi penting tidak dilakukan oleh pengguna yang tidak berhak.

### 5.4 Fingerprint SHA-256

WiFi Check memiliki endpoint `POST /api/fingerprint` untuk menghasilkan fingerprint konfigurasi. Implementasinya menggunakan SHA-256 terhadap data konfigurasi yang dinormalisasi dan diserialisasi secara konsisten.

SHA-256 merupakan fungsi hash, bukan enkripsi. Hasil hash tidak dimaksudkan untuk mengembalikan konfigurasi asli. Fitur fingerprint juga tidak menggantikan validasi formulir maupun pemeriksaan autentikasi untuk fitur lainnya.

## 6. Kendala dan Penyelesaian

Selama pemeriksaan proyek dan penyusunan dokumen Modul 5, terdapat beberapa hal yang perlu diperhatikan.

| Kendala | Penyelesaian atau Tindak Lanjut |
|---|---|
| Validasi formulir yang ditemukan masih dilakukan di sisi klien. | Validasi server perlu ditambahkan menggunakan skema Zod 4 sebelum data diproses. |
| Aturan panjang SSID pada formulir menggunakan jumlah karakter, sedangkan fingerprint memeriksa panjang byte UTF-8. | Aturan validasi perlu diselaraskan agar hasilnya konsisten, terutama untuk SSID yang menggunakan karakter Unicode. |
| Data assessment menggunakan state aplikasi dan belum terbukti disimpan secara permanen. | Penyimpanan persisten dapat ditambahkan pada pengembangan selanjutnya sesuai kebutuhan backend dan database. |
| Implementasi login, session, dan cookie belum teridentifikasi pada kode yang diperiksa. | Fitur tersebut perlu diterapkan apabila diwajibkan pada tahap Modul 5, kemudian diuji sebelum dinyatakan berhasil. |
| Bukti pengujian dan screenshot belum tersedia dalam dokumen. | Aplikasi perlu dijalankan, skenario pengujian dicoba, dan screenshot hasil aktual ditambahkan. |

Dari hasil pemeriksaan tersebut, WiFi Check sudah memiliki dasar formulir, validasi di sisi klien, serta fitur fingerprint konfigurasi. Namun, penerapan validasi server, session, cookie, dan bukti pengujiannya masih perlu dilengkapi agar sesuai dengan kebutuhan Modul 5.

## 7. Catatan Pemanfaatan AI

- **Alat yang digunakan:** ChatGPT.
- **Bagian yang dibantu:** menyusun kerangka dokumen teknis, menjelaskan validasi formulir, menyusun rancangan skema Zod 4, menjelaskan session dan cookie, serta menyusun skenario pengujian.
- **Sumber pemeriksaan:** Modul 5 Praktikum Pengembangan Aplikasi Web dan kode pada repositori WiFi Check, terutama `components/assessment/AssessmentForm.tsx`, `lib/validation.ts`, `app/api/fingerprint/route.ts`, dan `lib/wifi-fingerprint.ts`.
- **Cara verifikasi:** isi dokumen dibandingkan dengan struktur kode proyek. Implementasi dan pengujian lanjutan perlu diperiksa langsung melalui editor, terminal, dan browser. Bagian yang masih berupa rancangan harus disesuaikan setelah kode benar-benar diterapkan.

