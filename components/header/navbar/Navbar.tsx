import Link from "next/link";

export default function Navbar() {
    return (
        <div className="hidden md:flex gap-4">
            <Link href="/hakkimizda" className="hover:text-[#7dd7fb] text-[#696e7f] transition-colors">Hakkımızda</Link>
            <Link href="/hesabim" className="hover:text-[#7dd7fb] text-[#696e7f] transition-colors">Hesabım</Link>
            <Link href="/istek-listesi" className="hover:text-[#7dd7fb] text-[#696e7f] transition-colors">İstek Listesi</Link>
            <Link href="/siparis-takibi" className="hover:text-[#7dd7fb] text-[#696e7f] transition-colors">Sipariş Takibi</Link>
        </div>
    );
}
