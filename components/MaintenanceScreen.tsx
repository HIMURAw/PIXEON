import { Wrench } from "lucide-react";

export default function MaintenanceScreen({ message }: { message?: string | null }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] px-6 text-center">
      <div className="max-w-md flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Wrench size={28} />
        </div>
        <h1 className="text-3xl font-bold text-white">Bakımdayız</h1>
        <p className="text-slate-400">
          {message?.trim() ||
            "Sitemizde şu anda planlı bakım çalışması yapılıyor. Kısa süre içinde tekrar hizmetinizdeyiz."}
        </p>
      </div>
    </div>
  );
}
