"use client";

import { useState } from "react";

export default function ContactPage() {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [pesan, setPesan] = useState("");
    const [terkirim, setTerkirim] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nama.trim() || !email.trim() || !pesan.trim()) {
            return;
        }

        setTerkirim(true);
        setNama("");
        setEmail("");
        setPesan("");
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12">
            <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hubungi Kami
                    </h1>
                    <p className="mt-3 text-gray-600">
                        Punya pertanyaan atau saran? Kami senang mendengar dari kamu.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    <section className="rounded-xl bg-blue-700 p-8 text-white">
                        <h2 className="text-2xl font-semibold">
                            Informasi Kontak
                        </h2>

                        <p className="mt-4 leading-7 text-blue-100">
                            Silakan hubungi kami jika kamu ingin mengetahui
                            lebih lanjut tentang informasi dan daftar item
                            yang tersedia di website ini.
                        </p>

                        <div className="mt-8 space-y-6">
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="mt-1 text-blue-100">
                                    info@website.com
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Jam Operasional</h3>
                                <p className="mt-1 text-blue-100">
                                    Senin - Jumat
                                </p>
                                <p className="text-blue-100">
                                    08.00 - 16.00 WIB
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Lokasi</h3>
                                <p className="mt-1 text-blue-100">
                                    Indonesia
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Kirim Pesan
                        </h2>

                        {terkirim && (
                            <p
                                role="status"
                                className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-800"
                            >
                                Pesan berhasil diproses. Terima kasih sudah menghubungi kami!
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="nama"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Nama Lengkap
                                </label>
                                <input
                                    id="nama"
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Masukkan nama kamu"
                                    required
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nama@email.com"
                                    required
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="pesan"
                                    className="mb-2 block font-medium text-gray-700"
                                >
                                    Pesan
                                </label>
                                <textarea
                                    id="pesan"
                                    value={pesan}
                                    onChange={(e) => setPesan(e.target.value)}
                                    placeholder="Tuliskan pesan kamu..."
                                    required
                                    rows={5}
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                            >
                                Kirim Pesan
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
