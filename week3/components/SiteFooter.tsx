type SiteFooterProps = {
    namaProduk: string;
};

export default function SiteFooter({
    namaProduk,
}: SiteFooterProps) {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 p-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                <p>
                    &copy; {new Date().getFullYear()} {namaProduk}.
                    Semua hak dilindungi.
                </p>

                <p>
                    Dibuat dengan Next.js dan Tailwind CSS.
                </p>
            </div>
        </footer>
    );
}
