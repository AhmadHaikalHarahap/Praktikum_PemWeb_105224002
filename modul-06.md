# Dokumen Teknis Modul 6 – PostgreSQL dan Prisma ORM

**Nama:** Ahmad Haikal Harahap  
**NIM:** 105224002  
**Proyek:** WiFi Check  
**Repository:** https://github.com/AhmadHaikalHarahap/105224002-WifiCheck

## 1. Rancangan Data

### 1.1 Deskripsi Database

WiFi Check merupakan aplikasi berbasis web yang digunakan untuk melakukan evaluasi awal terhadap keamanan konfigurasi jaringan WiFi. Pada pengembangannya, aplikasi ini menggunakan PostgreSQL sebagai database dan Prisma ORM sebagai penghubung antara aplikasi dengan database.

Database WiFi Check dirancang untuk menyimpan hasil evaluasi keamanan WiFi beserta temuan keamanan yang dihasilkan dari setiap proses assessment.

Terdapat dua entitas utama yang digunakan, yaitu Assessment dan Finding.

### 1.2 Entitas Assessment

Assessment merupakan tabel utama yang digunakan untuk menyimpan hasil pemeriksaan keamanan jaringan WiFi. Setiap data assessment berisi informasi mengenai konfigurasi jaringan, tingkat risiko, ringkasan hasil pemeriksaan, dan rekomendasi keamanan.

Atribut yang terdapat pada tabel Assessment adalah:

| Atribut | Tipe Data | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| ssid | VARCHAR(32) | Nama jaringan WiFi |
| securityProtocol | String | Protokol keamanan WiFi |
| passwordProtection | String | Status perlindungan password |
| wpsEnabled | String | Status fitur WPS |
| firmwareStatus | String | Status firmware router |
| notes | VARCHAR(250) | Catatan tambahan |
| riskLevel | String | Tingkat risiko keamanan |
| summary | TEXT | Ringkasan hasil pemeriksaan |
| recommendations | JSON | Rekomendasi keamanan |
| createdAt | DateTime | Waktu pembuatan assessment |

Kolom `id` menggunakan UUID sebagai primary key agar setiap assessment memiliki identitas yang berbeda. Sementara itu, kolom `createdAt` menggunakan nilai waktu otomatis ketika data dibuat.

### 1.3 Entitas Finding

Finding merupakan tabel yang digunakan untuk menyimpan temuan atau masalah keamanan yang ditemukan dalam suatu assessment.

Atribut yang terdapat pada tabel Finding adalah:

| Atribut | Tipe Data | Keterangan |
|---|---|---|
| id | UUID | Primary Key |
| assessmentId | UUID | Foreign Key ke tabel Assessment |
| title | VARCHAR(120) | Judul temuan keamanan |
| description | TEXT | Penjelasan temuan |
| severity | String | Tingkat keparahan temuan |
| isManual | Boolean | Penanda temuan yang ditambahkan secara manual |

Tabel Finding memiliki kolom `assessmentId` sebagai foreign key yang menghubungkan setiap temuan dengan assessment yang sesuai.

### 1.4 Relasi Antarentitas

Hubungan antara Assessment dan Finding menggunakan relasi One-to-Many (1:N).

Artinya, satu assessment dapat memiliki beberapa finding, tetapi satu finding hanya dimiliki oleh satu assessment.

Relasi ini digunakan karena satu pemeriksaan keamanan WiFi dapat menghasilkan lebih dari satu temuan. Sebagai contoh, sebuah assessment dapat menemukan bahwa fitur WPS masih aktif dan firmware router sudah usang.

Dengan adanya relasi tersebut, data hasil pemeriksaan dapat disimpan secara terstruktur dan lebih mudah dikelola.

### 1.5 Constraint dan Aturan Relasi

Database WiFi Check menggunakan beberapa constraint, yaitu:

1. Primary Key pada kolom `id` di tabel Assessment dan Finding.
2. Foreign Key pada kolom `assessmentId` di tabel Finding.
3. UUID sebagai identitas unik setiap data.
4. Index pada kolom `createdAt` dan `riskLevel` di tabel Assessment.
5. Index pada kolom `assessmentId` dan `severity` di tabel Finding.

Relasi antara kedua tabel menggunakan aturan `onDelete: Cascade`.

Aturan tersebut berarti ketika sebuah assessment dihapus, seluruh finding yang berhubungan dengan assessment tersebut juga akan dihapus secara otomatis.

Penggunaan Cascade dipilih karena data finding merupakan bagian dari hasil pemeriksaan assessment. Dengan demikian, tidak akan ada data finding yang tertinggal tanpa data assessment induknya.

## 2. Skema dan Migrasi

### 2.1 Penggunaan Prisma ORM

WiFi Check menggunakan Prisma ORM versi 7 sebagai Object Relational Mapper (ORM). Prisma digunakan untuk mempermudah pengelolaan database melalui kode TypeScript tanpa harus menuliskan seluruh perintah SQL secara manual.

Konfigurasi database menggunakan PostgreSQL sebagai provider.

Berikut konfigurasi generator dan datasource pada `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

Prisma Client dihasilkan ke folder `lib/generated/prisma` dan digunakan oleh aplikasi untuk menjalankan operasi terhadap database.

### 2.2 Model Assessment dan Finding

Model Assessment digunakan untuk menyimpan hasil pemeriksaan keamanan WiFi.

```prisma
model Assessment {
  id                 String   @id @default(uuid()) @db.Uuid
  ssid               String   @db.VarChar(32)
  securityProtocol   String
  passwordProtection String
  wpsEnabled         String
  firmwareStatus     String
  notes              String   @default("") @db.VarChar(250)
  riskLevel          String
  summary            String   @db.Text
  recommendations    Json
  createdAt          DateTime @default(now())

  findings           Finding[]

  @@index([createdAt])
  @@index([riskLevel])
}
```

Model Finding digunakan untuk menyimpan temuan keamanan yang berhubungan dengan assessment.

```prisma
model Finding {
  id           String     @id @default(uuid()) @db.Uuid
  assessmentId String     @db.Uuid
  title        String     @db.VarChar(120)
  description  String     @db.Text
  severity     String
  isManual     Boolean    @default(false)
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)

  @@index([assessmentId])
  @@index([severity])
}
```

Kedua model tersebut menjadi dasar struktur tabel database WiFi Check.

### 2.3 Konfigurasi Prisma

Konfigurasi Prisma terdapat pada file `prisma.config.ts`.

```typescript
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

Koneksi ke database menggunakan variabel lingkungan `DATABASE_URL` yang disimpan dalam file `.env`.

Penggunaan file `.env` bertujuan agar informasi koneksi database tidak ditulis secara langsung di dalam kode program.

### 2.4 Proses Migrasi Database

Migrasi merupakan proses untuk menerapkan perubahan struktur database berdasarkan model yang sudah didefinisikan dalam `schema.prisma`.

Pada pengembangan WiFi Check terdapat empat migrasi yang telah dibuat:

| No. | Nama Migrasi | Keterangan |
|---|---|---|
| 1 | 20261102111239_init | Membuat struktur awal tabel Assessment |
| 2 | 20261102112437_add_finding_relation | Menambahkan tabel Finding dan relasinya |
| 3 | 20261102112957_improve_assessment_relation | Menyempurnakan relasi Assessment dan Finding |
| 4 | 20261102121237_add_manual_finding | Menambahkan atribut untuk mendukung finding manual |

Seluruh file migrasi disimpan di dalam folder `prisma/migrations`.

Dengan menggunakan migrasi, perubahan struktur database dapat dicatat secara berurutan sehingga struktur database dapat dikelola dan dikembangkan tanpa harus membuat ulang seluruh tabel.

## 3. Seed dan Prisma Client

### 3.1 Pengertian dan Fungsi Seed

Seed merupakan proses memasukkan data awal ke dalam database. Pada WiFi Check, seed digunakan untuk menyediakan data contoh assessment dan finding sehingga aplikasi dapat diuji tanpa harus memasukkan seluruh data secara manual.

Implementasi seed disimpan dalam file:

`prisma/seed.ts`

Data contoh yang dimasukkan terdiri dari dua assessment, yaitu:

1. WiFi Kost Aman, yang memiliki tingkat risiko rendah dan konfigurasi keamanan yang relatif baik.
2. WiFi Kost Testing, yang memiliki tingkat risiko tinggi karena masih memiliki beberapa konfigurasi yang perlu diperbaiki, seperti WPS yang aktif dan firmware router yang sudah usang.

Setiap assessment juga memiliki beberapa finding yang menjelaskan kondisi keamanan jaringan tersebut.

### 3.2 Metode Upsert

Pada proses seed, WiFi Check menggunakan metode `upsert()` dari Prisma Client.

Metode upsert merupakan gabungan dari proses create dan update. Apabila data dengan ID tertentu belum tersedia, maka data baru akan dibuat. Namun, apabila data sudah tersedia, maka data tersebut akan diperbarui.

Penggunaan upsert bertujuan agar proses seed dapat dijalankan kembali tanpa menghasilkan data assessment yang berulang dengan ID yang sama.

Pada bagian finding, proses update juga menggunakan `deleteMany` dan `create` untuk mengganti temuan lama dengan data temuan terbaru.

### 3.3 Konfigurasi Seed

Perintah seed dikonfigurasi melalui file `prisma.config.ts`.

```typescript
migrations: {
  path: "prisma/migrations",
  seed: "tsx prisma/seed.ts",
},
```

Selain itu, pada `package.json` terdapat script untuk menjalankan seed:

```json
"db:seed": "prisma db seed"
```

Dengan konfigurasi tersebut, seed dapat dijalankan menggunakan perintah:

```bash
npm run db:seed
```

### 3.4 Penggunaan Prisma Client

Prisma Client merupakan bagian dari Prisma ORM yang digunakan untuk melakukan komunikasi antara aplikasi dengan database.

Pada WiFi Check, Prisma Client digunakan untuk menjalankan berbagai operasi database, seperti membuat data assessment, mengambil data, memperbarui data, menghapus data, dan mengelola relasi antara assessment dengan finding.

Prisma Client dihasilkan ke dalam folder `lib/generated/prisma`.

Untuk proses seed, aplikasi menggunakan `PrismaPg` sebagai driver adapter agar Prisma Client dapat terhubung dengan PostgreSQL.

Dengan adanya Prisma Client, pengelolaan database menjadi lebih praktis karena operasi database dapat dilakukan menggunakan kode TypeScript.

## 4. Operasi CRUD

CRUD merupakan singkatan dari Create, Read, Update, dan Delete. Keempat operasi tersebut digunakan untuk mengelola data yang tersimpan di dalam database.

Pada WiFi Check, CRUD digunakan untuk mengelola data Assessment dan Finding.

### 4.1 Create

Create merupakan operasi untuk menambahkan data baru ke dalam database.

Pada WiFi Check, operasi ini digunakan ketika pengguna melakukan pemeriksaan keamanan WiFi dan menyimpan hasil assessment.

Data yang disimpan meliputi SSID, protokol keamanan, status password, status WPS, kondisi firmware, tingkat risiko, ringkasan, dan rekomendasi keamanan.

Prisma menyediakan metode `create()` untuk memasukkan data baru ke dalam database.

### 4.2 Read

Read merupakan operasi untuk mengambil dan menampilkan data dari database.

Pada WiFi Check, operasi read digunakan untuk menampilkan daftar assessment yang telah dibuat serta melihat detail hasil pemeriksaan.

Data finding juga dapat ditampilkan berdasarkan assessment yang dipilih.

Prisma menyediakan beberapa metode untuk membaca data, antara lain:

- `findMany()` untuk mengambil banyak data.
- `findUnique()` untuk mengambil satu data berdasarkan nilai unik.
- `findFirst()` untuk mengambil data pertama yang sesuai dengan kondisi pencarian.

### 4.3 Update

Update merupakan operasi untuk memperbarui data yang sudah tersimpan di dalam database.

Pada WiFi Check, operasi ini dapat digunakan untuk memperbarui informasi assessment atau temuan keamanan yang dikelola melalui aplikasi.

Prisma menyediakan metode `update()` untuk memperbarui data berdasarkan kondisi tertentu.

Dengan operasi ini, perubahan informasi dapat disimpan tanpa harus menghapus dan membuat ulang seluruh data assessment.

### 4.4 Delete

Delete merupakan operasi untuk menghapus data dari database.

Pada WiFi Check, operasi delete digunakan untuk menghapus assessment atau finding yang sudah tidak diperlukan.

Prisma menyediakan metode `delete()` untuk menghapus satu data berdasarkan identitasnya.

Selain itu, relasi Assessment dan Finding menggunakan `onDelete: Cascade`, sehingga penghapusan assessment juga akan menghapus seluruh finding yang terhubung dengannya.

### 4.5 Penanganan Error

Penanganan error diperlukan untuk mengantisipasi kegagalan ketika aplikasi melakukan operasi database.

Beberapa kode error Prisma yang perlu diperhatikan adalah:

| Kode Error | Keterangan |
|---|---|
| P2002 | Terjadi pelanggaran constraint unik |
| P2003 | Terjadi pelanggaran foreign key |
| P2025 | Data yang dicari untuk operasi tidak ditemukan |

Dengan penanganan error, aplikasi dapat memberikan informasi yang lebih jelas ketika proses penyimpanan, pembaruan, atau penghapusan data mengalami kegagalan.

Penanganan tersebut juga membantu menjaga agar aplikasi tidak berhenti secara tiba-tiba ketika terjadi kesalahan pada proses database.

## 5. Transaksi dan Rollback

### 5.1 Pengertian Transaksi

Transaksi merupakan mekanisme database yang digunakan untuk menjalankan beberapa operasi sebagai satu kesatuan.

Transaksi memiliki prinsip ACID, yaitu:

1. Atomicity: Seluruh operasi dalam transaksi berhasil dilakukan atau seluruhnya dibatalkan.
2. Consistency: Data harus tetap berada dalam kondisi yang konsisten.
3. Isolation: Transaksi yang berjalan tidak boleh menghasilkan kondisi data yang saling mengganggu.
4. Durability: Perubahan yang sudah berhasil disimpan akan tetap tersimpan di database.

Pada WiFi Check, transaksi relevan digunakan ketika beberapa operasi database saling berhubungan, terutama ketika mengelola data assessment beserta finding.

### 5.2 Implementasi Transaksi pada Prisma

Prisma menyediakan fitur `$transaction()` untuk menjalankan beberapa operasi database dalam satu transaksi.

Contoh penggunaan transaksi adalah sebagai berikut:

```typescript
await prisma.$transaction(async (tx) => {
  const assessment = await tx.assessment.create({
    data: {
      ssid: "WiFi Testing",
      securityProtocol: "wpa2",
      passwordProtection: "enabled",
      wpsEnabled: "disabled",
      firmwareStatus: "up-to-date",
      riskLevel: "low",
      summary: "Contoh assessment transaksi",
      recommendations: ["Gunakan password yang kuat"],
    },
  });

  await tx.finding.create({
    data: {
      assessmentId: assessment.id,
      title: "Pemeriksaan keamanan",
      description: "Contoh finding dalam transaksi",
      severity: "low",
    },
  });
});
```

Contoh tersebut menunjukkan bahwa pembuatan assessment dan finding dapat dijalankan dalam satu transaksi.

Apabila salah satu operasi mengalami kegagalan, transaksi akan dibatalkan sehingga perubahan yang belum berhasil dikomit tidak disimpan sebagian.

### 5.3 Rollback

Rollback merupakan proses pembatalan perubahan database ketika transaksi mengalami kegagalan.

Sebagai contoh, ketika proses pembuatan assessment berhasil tetapi proses pembuatan finding mengalami error di dalam transaksi, seluruh perubahan dalam transaksi tersebut akan dibatalkan.

Dengan mekanisme ini, database dapat terhindar dari kondisi ketika sebagian data berhasil tersimpan sementara data lain gagal disimpan.

### 5.4 Hubungan Transaksi dengan Cascade

Selain transaksi, WiFi Check juga menggunakan aturan `onDelete: Cascade` pada relasi Assessment dan Finding.

Aturan ini membantu menjaga konsistensi data ketika assessment dihapus karena seluruh finding yang berkaitan akan ikut terhapus.

Dengan demikian, hubungan antarentitas tetap terjaga dan tidak menghasilkan data finding yang tidak memiliki assessment induk.

## 6. Skenario Uji

Pengujian dilakukan untuk mengetahui apakah struktur database dan operasi pengolahan data pada WiFi Check sudah sesuai dengan kebutuhan aplikasi.

Pengujian mencakup proses CRUD, hubungan antarentitas, dan transaksi database.

Berikut sepuluh skenario pengujian yang digunakan:

| No. | Skenario Pengujian | Hasil yang Diharapkan |
|---|---|---|
| 1 | Menambahkan assessment baru | Data assessment berhasil disimpan ke database |
| 2 | Menampilkan daftar assessment | Seluruh data assessment dapat ditampilkan |
| 3 | Melihat detail assessment | Informasi assessment ditampilkan sesuai ID |
| 4 | Memperbarui assessment | Data berhasil diperbarui sesuai perubahan |
| 5 | Menghapus assessment | Data assessment berhasil dihapus |
| 6 | Menambahkan finding | Finding berhasil disimpan dengan assessmentId yang sesuai |
| 7 | Menampilkan finding | Data finding dapat ditampilkan berdasarkan assessment |
| 8 | Menghapus finding | Finding yang dipilih berhasil dihapus |
| 9 | Menghapus assessment yang memiliki finding | Assessment dan seluruh finding terkait ikut terhapus |
| 10 | Menguji transaksi ketika terjadi error | Seluruh perubahan dalam transaksi dibatalkan apabila salah satu operasi gagal |

### 6.1 Analisis Hasil Pengujian

Sepuluh skenario tersebut digunakan untuk mengevaluasi fungsi utama database WiFi Check.

Pengujian Create memastikan data baru dapat disimpan, sedangkan Read memastikan data dapat diambil dan ditampilkan dengan benar.

Pengujian Update dan Delete digunakan untuk memastikan data dapat diperbarui maupun dihapus sesuai kebutuhan.

Pengujian relasi dilakukan untuk memastikan setiap finding memiliki hubungan dengan assessment yang benar. Selain itu, pengujian Cascade dilakukan untuk memastikan penghapusan assessment juga menghapus finding yang berkaitan.

Pengujian transaksi dilakukan untuk mengetahui apakah database dapat mempertahankan konsistensi data ketika salah satu operasi mengalami kegagalan.

Persentase keberhasilan pengujian dapat dihitung menggunakan rumus:

**Persentase Keberhasilan = (Jumlah Pengujian Berhasil / Total Pengujian) × 100%**

Berdasarkan ketentuan pengujian, target keberhasilan minimal adalah 90% dari seluruh skenario yang diuji.

## 7. Kendala dan Penyelesaian

Selama proses pengembangan WiFi Check, terdapat beberapa kendala teknis yang berkaitan dengan konfigurasi database, Prisma ORM, dan pengelolaan relasi.

### 7.1 Konfigurasi PostgreSQL

Salah satu hal yang perlu diperhatikan adalah konfigurasi koneksi PostgreSQL agar aplikasi dapat terhubung dengan database.

Penyelesaiannya adalah mengatur variabel `DATABASE_URL` pada file `.env` dan memastikan informasi koneksi sesuai dengan database yang digunakan.

### 7.2 Perbedaan Konfigurasi Prisma ORM 7

Pada Prisma ORM versi 7 terdapat perubahan dalam pengaturan koneksi database dan konfigurasi Prisma.

Hal ini mengharuskan penggunaan file `prisma.config.ts` untuk mengatur lokasi schema, direktori migrasi, konfigurasi seed, dan koneksi database.

Penyelesaiannya adalah menyesuaikan konfigurasi dengan Prisma ORM versi 7 serta menggunakan driver adapter PostgreSQL melalui package `@prisma/adapter-pg`.

### 7.3 Pengaturan Relasi Database

Dalam pengembangan WiFi Check, data Finding membutuhkan hubungan dengan data Assessment.

Kendala yang perlu diperhatikan adalah memastikan setiap finding memiliki `assessmentId` yang sesuai.

Penyelesaiannya adalah menggunakan foreign key dan mendefinisikan relasi menggunakan atribut `@relation` pada `schema.prisma`.

Selain itu, aturan `onDelete: Cascade` diterapkan agar data finding ikut terhapus ketika assessment induknya dihapus.

### 7.4 Pengelolaan Data Seed

Data seed diperlukan agar aplikasi memiliki data contoh untuk keperluan pengembangan dan pengujian.

Untuk menghindari data duplikat ketika seed dijalankan kembali, digunakan metode `upsert()`.

Metode ini memungkinkan data diperbarui apabila sudah tersedia atau dibuat apabila belum tersedia.

### 7.5 Pengelolaan Struktur Database

Perubahan struktur database selama pengembangan perlu dicatat agar tidak menyebabkan ketidaksesuaian antara schema Prisma dengan database PostgreSQL.

Penyelesaiannya adalah menggunakan migration sehingga setiap perubahan struktur database dapat dikelola secara bertahap dan memiliki riwayat yang jelas.

## 8. Catatan Pemanfaatan AI

Dalam proses pengembangan proyek WiFi Check, Artificial Intelligence (AI) digunakan sebagai alat bantu untuk memahami konsep, menyelesaikan kendala teknis, dan membantu proses pengembangan aplikasi.

AI yang digunakan dalam pengerjaan proyek ini adalah:

1. **ChatGPT**

   Digunakan untuk membantu memahami konsep PostgreSQL, Prisma ORM, relasi database, migrasi, seed, operasi CRUD, transaksi, serta membantu penyusunan dokumentasi teknis.

2. **Antigravity**

   Digunakan sebagai alat bantu dalam proses pengembangan aplikasi, penyesuaian kode program, dan pemeriksaan implementasi fitur WiFi Check.

### 8.1 Bagian yang Dibantu oleh AI

Beberapa bagian yang dibantu menggunakan AI antara lain:

- Memahami perancangan struktur database Assessment dan Finding.
- Membantu konfigurasi PostgreSQL dan Prisma ORM.
- Membantu memahami proses migrasi database.
- Membantu penyusunan seed menggunakan metode upsert.
- Membantu memahami implementasi operasi CRUD.
- Membantu menganalisis kendala teknis selama pengembangan aplikasi.
- Membantu menyusun dokumentasi teknis sesuai kerangka Modul 6.

### 8.2 Verifikasi Hasil AI

Hasil yang diberikan oleh AI tidak langsung digunakan tanpa pemeriksaan.

Setiap perubahan kode tetap diperiksa kembali melalui Visual Studio Code dan dijalankan menggunakan terminal untuk memastikan tidak terdapat kesalahan implementasi.

Pemeriksaan juga dilakukan dengan melihat kesesuaian antara schema Prisma, konfigurasi database, file migrasi, dan struktur aplikasi WiFi Check.

Dengan demikian, AI berperan sebagai alat bantu dalam proses pembelajaran dan pengembangan, sedangkan pemahaman, pemeriksaan, dan penyelesaian akhir tetap dilakukan oleh pengembang.

---

**Repository GitHub:** https://github.com/AhmadHaikalHarahap/105224002-WifiCheck

**File Dokumentasi:** `docs/praktikum/modul-06.md`

**Branch:** `main`