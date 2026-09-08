import React, { useState } from 'react';
import { Repeat, Calendar, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SubscriptionItem, ClinicSettings } from '../types';

interface SubscriptionsSectionProps {
  subscriptions: SubscriptionItem[];
  isMemberPrice: boolean;
  settings: ClinicSettings;
}

export const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  subscriptions,
  isMemberPrice,
  settings,
}) => {
  const [hoveredSubId, setHoveredSubId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#F7EADB] text-[#6B1D2F]">
              Buku BAU Hal. 72 - 80
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              Maksimal Hemat
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Paket Treatment Subscription (Langganan Sesi)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Dapatkan harga per sesi jauh lebih murah dengan berlangganan paket 3x, 6x, hingga 12x sesi perawatan rutin.
          </p>
        </div>

        {/* Validity terms info */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
          <p className="font-bold text-stone-800 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#6B1D2F]" />
            Masa Berlaku Paket:
          </p>
          <p className="text-stone-600 text-[11px]">• Paket 3x: berlaku hingga 5 bulan</p>
          <p className="text-stone-600 text-[11px]">• Paket 6x: berlaku hingga 8 bulan</p>
          <p className="text-stone-600 text-[11px]">• Paket 12x: berlaku hingga 14 bulan</p>
        </div>
      </div>

      {/* Subscription Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B1D2F] bg-rose-50 px-2 py-0.5 rounded">
                  Subscription
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  Harga 1x Sesi: <strong className="text-stone-800">{sub.singlePrice} RB</strong>
                </span>
              </div>

              {/* Title with hover popup */}
              <div 
                className="relative inline-block w-full"
                onMouseEnter={() => { if (sub.photoUrl) setHoveredSubId(sub.id); }}
                onMouseLeave={() => setHoveredSubId(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif font-bold text-base text-stone-900 leading-snug hover:text-[#6B1D2F] cursor-pointer flex-1">
                    {sub.treatmentName}
                  </h3>
                  {sub.photoUrl && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">
                      <ImageIcon className="w-3 h-3 text-[#6B1D2F]" />
                      <span>Foto</span>
                    </span>
                  )}
                </div>

                {hoveredSubId === sub.id && sub.photoUrl && (
                  <div className="absolute left-0 -top-2 transform -translate-y-full z-50 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 animate-in fade-in zoom-in-95 pointer-events-auto">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-stone-100">
                      <img 
                        src={sub.photoUrl} 
                        alt={sub.treatmentName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-xs font-bold text-stone-800 font-serif truncate">{sub.treatmentName}</p>
                    <span className="text-[10px] text-stone-500">Preview Paket Sesi</span>
                  </div>
                )}
              </div>

              {/* Packages Option Rows */}
              <div className="mt-4 space-y-2.5">
                
                {/* 3x Package */}
                {sub.package3x && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">Paket 3x Sesi</span>
                      <span className="text-[10px] text-stone-400 block line-through">
                        {sub.package3x.original} RB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#6B1D2F]">
                        {isMemberPrice ? sub.package3x.member : sub.package3x.nonMember} RB
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        ({isMemberPrice ? sub.package3x.perSessionMember : sub.package3x.perSessionNonMember} RB/sesi)
                      </span>
                    </div>
                  </div>
                )}

                {/* 4x Package if present */}
                {sub.package4x && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-900">Paket 4x Sesi</span>
                      <span className="text-[10px] text-stone-400 block line-through">
                        {sub.package4x.original} RB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#6B1D2F]">
                        {isMemberPrice ? sub.package4x.member : sub.package4x.nonMember} RB
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        ({isMemberPrice ? sub.package4x.perSessionMember : sub.package4x.perSessionNonMember} RB/sesi)
                      </span>
                    </div>
                  </div>
                )}

                {/* 6x Package */}
                {sub.package6x && (
                  <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-stone-900">Paket 6x Sesi</span>
                        <span className="text-[9px] font-extrabold text-white bg-[#6B1D2F] px-1.5 py-0.2 rounded">Hemat</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block line-through">
                        {sub.package6x.original} RB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#6B1D2F]">
                        {isMemberPrice ? sub.package6x.member : sub.package6x.nonMember} RB
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        ({isMemberPrice ? sub.package6x.perSessionMember : sub.package6x.perSessionNonMember} RB/sesi)
                      </span>
                    </div>
                  </div>
                )}

                {/* 12x Package */}
                {sub.package12x && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-stone-900">Paket 12x Sesi</span>
                        <span className="text-[9px] font-extrabold text-stone-900 bg-[#C9A86A] px-1.5 py-0.2 rounded">Super Hemat</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block line-through">
                        {sub.package12x.original} RB
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-[#6B1D2F]">
                        {isMemberPrice ? sub.package12x.member : sub.package12x.nonMember} RB
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold block">
                        ({isMemberPrice ? sub.package12x.perSessionMember : sub.package12x.perSessionNonMember} RB/sesi)
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Action */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Bisa cicilan 0% Paylater
              </span>
              {sub.photoUrl ? (
                <a
                  href={sub.photoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#6B1D2F] hover:text-white text-stone-700 text-xs font-bold flex items-center gap-1.5 transition border border-stone-200"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Lihat Foto</span>
                </a>
              ) : (
                <span className="text-[11px] text-stone-400">Semua Cabang</span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
