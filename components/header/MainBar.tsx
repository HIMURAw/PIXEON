import {
  Hand,
  ChevronDown,
  Phone
} from "lucide-react";

import Navbar from "./navbar/Navbar";

export default function MainBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-sm border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="hidden md:grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <Navbar />
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 border-r border-slate-700 pr-4">
            <Hand />
            <span className="text-center">100% secure delivery without contacting the courier.</span>
          </div>

          <div className="flex items-center justify-end gap-4">
            <span className="text-slate-400 font-semibold border-r border-slate-700 pr-4">
              <a className="hover:text-sky-400 transition" href="#">
                Need help?
              </a>{" "}
              Call Us:
              <span className="text-sky-400"> +90 552 833 08 83</span>
            </span>

            {/* Language */}
            <div className="relative group inline-block">
              <div className="flex items-center text-slate-200 font-semibold px-3 py-2 cursor-pointer hover:text-sky-400 transition">
                <span>English</span>
                <ChevronDown size={14} className="ml-2" />
              </div>
              <div className="absolute left-0 mt-1 w-full bg-slate-900 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  English
                </div>
                <div className="px-3 py-2 hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  Türkçe
                </div>
              </div>
            </div>

            {/* Currency */}
            <div className="relative group inline-block">
              <div className="flex items-center text-slate-200 font-semibold px-3 py-2 cursor-pointer hover:text-sky-400 transition">
                <span>USD</span>
                <ChevronDown size={14} className="ml-2" />
              </div>
              <div className="absolute left-0 mt-1 w-full bg-slate-900 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  USD
                </div>
                <div className="px-3 py-2 hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  TRY
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center justify-between gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Hand size={14} />
            %100 Güvenli Teslimat
          </span>

          <a
            href="tel:+905528330883"
            className="flex items-center gap-1 text-sky-400 font-semibold text-xs"
          >
            <Phone size={14} />
            Ara
          </a>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-sky-400">
                <span className="text-xs">EN</span>
                <ChevronDown size={12} />
              </div>
              <div className="absolute right-0 mt-1 bg-slate-900 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 text-xs hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  English
                </div>
                <div className="px-3 py-2 text-xs hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  Türkçe
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-sky-400">
                <span className="text-xs">USD</span>
                <ChevronDown size={12} />
              </div>
              <div className="absolute right-0 mt-1 bg-slate-900 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="px-3 py-2 text-xs hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
                  USD
                </div>
                <div className="px-3 py-2 text-xs hover:bg-sky-500 hover:text-slate-900 cursor-pointer">
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

