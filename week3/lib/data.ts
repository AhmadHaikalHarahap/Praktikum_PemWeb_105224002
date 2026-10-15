import type { Item } from "./tipe";

export const daftarItem: Item[] = [
  {
    id: 1,
    judul: "Panel surya atap",
    kategori: "energi",
    deskripsi: "Pemantauan produksi listrik harian.",
    tersedia: true,
  },
  {
    id: 2,
    judul: "Turbin angin",
    kategori: "energi",
    deskripsi: "Pemanfaatan energi angin untuk menghasilkan listrik.",
    tersedia: true,
  },
  {
    id: 3,
    judul: "Mobil listrik",
    kategori: "transportasi",
    deskripsi: "Kendaraan listrik yang ramah lingkungan.",
    tersedia: true,
  },
  {
    id: 4,
    judul: "Lampu LED pintar",
    kategori: "elektronik",
    deskripsi: "Lampu hemat energi yang dapat dikendalikan secara otomatis.",
    tersedia: true,
  },
  {
    id: 5,
    judul: "Sistem pemanen air hujan",
    kategori: "lingkungan",
    deskripsi: "Sistem pengumpulan air hujan untuk kebutuhan sehari-hari.",
    tersedia: false,
  },
  {
    id: 6,
    judul: "Tempat sampah pintar",
    kategori: "lingkungan",
    deskripsi: "Tempat sampah dengan sensor untuk membantu pengelolaan sampah.",
    tersedia: true,
  },
];
