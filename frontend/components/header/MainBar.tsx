import {
  Hand,
  ChevronDown,
  Phone
} from "lucide-react";

import Navbar from "./navbar/Navbar";

export default function MainBar() {
  return (
    <div className="bg-black text-gray-300 text-sm border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="hidden md:flex items-center justify-between">
          <Navbar />

          <div className="flex items-center gap-2 text-gray-400 border-r border-gray-600 pr-4">
            <Hand />
            <span>Kuryeyle iletişime geçmeden %100 güvenli teslimat.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#696e7f] font-semibold border-r border-gray-600 pr-4">
              <a className="hover:text-[#7dd7fb]" href="#">Need help?</a> Call Us:
              <span className="text-cyan-400"> +90 552 833 08 83</span>
            </span>

            <div className="relative group inline-block">
              <div className="flex items-center text-white font-bold px-3 py-2 cursor-pointer">
                <span>English</span>
                <ChevronDown size={14} className="ml-2" />
              </div>
              <div className="absolute left-0 mt-1 w-full bg-black border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  English
                </div>
                <div className="px-3 py-2 hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  Türkçe
                </div>
              </div>
            </div>

            <div className="relative group inline-block">
              <div className="flex items-center text-white font-bold px-3 py-2 cursor-pointer">
                <span>USD</span>
                <ChevronDown size={14} className="ml-2" />
              </div>
              <div className="absolute left-0 mt-1 w-full bg-black border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  USD
                </div>
                <div className="px-3 py-2 hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  TRY
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:hidden items-center justify-between gap-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Hand size={14} />
            %100 Güvenli Teslimat
          </span>

          <a href="tel:+905528330883" className="flex items-center gap-1 text-cyan-400 font-semibold text-xs">
            <Phone size={14} />
            Ara
          </a>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-xs">EN</span>
                <ChevronDown size={12} />
              </div>
              <div className="absolute right-0 mt-1 bg-black border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 text-xs hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  English
                </div>
                <div className="px-3 py-2 text-xs hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  Türkçe
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="text-xs">USD</span>
                <ChevronDown size={12} />
              </div>
              <div className="absolute right-0 mt-1 bg-black border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 text-xs hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  USD
                </div>
                <div className="px-3 py-2 text-xs hover:bg-[#7dd7fb] hover:text-black cursor-pointer">
                  TRY
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
