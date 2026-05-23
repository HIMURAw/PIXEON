"use client";

import {
  Hand,
  ChevronDown,
  Phone
} from "lucide-react";

import Navbar from "./navbar/Navbar";
import { useSupport } from "@/context/SupportContext";

export default function MainBar() {
  const { openSupport } = useSupport();

  return (
    <div className="bg-slate-900 text-slate-300 text-sm border-b border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="hidden md:grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <Navbar />
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-400 border-r border-slate-700 pr-4">
            <Hand />
            <span className="text-center">PlayStation Dünyasına Ücretsiz ve Hızlı Teslimat.</span>
          </div>

          <div className="flex items-center justify-end gap-4">
            <span className="text-slate-400 font-semibold">
              <a href="support/ticket" className="hover:text-sky-400 transition cursor-pointer">
                Destek mi lazım?
              </a>{" "}
              Bizi Arayın:
              <span className="text-sky-400"> +90 552 833 08 83</span>
            </span>
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
        </div>

      </div>
    </div>
  );
}

