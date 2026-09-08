import React, { useState } from 'react';
import { Package, Gift, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { SkincareKit, ClinicSettings } from '../types';
import { CardLightFlare } from './CardLightFlare';

interface SkincareKitsSectionProps {
  kits: SkincareKit[];
  settings: ClinicSettings;
}

export const SkincareKitsSection: React.FC<SkincareKitsSectionProps> = ({
  kits,
}) => {
  const [hoveredKitId, setHoveredKitId] = useState<string | null>(null);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6 text-stone-800">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-visible">
        <CardLightFlare topPosition="center" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E6C994] to-[#C9A86A] text-stone-950 shadow-sm">
              Buku BAU Hal. 82 - 85
            </span>
            <span className="text-xs font-bold text-[#8C1D35] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Gift className="w-3 h-3 text-[#8C1D35]" />
              FREE Exclusive SOZO Pouch
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Paket Skincare Kit Bundling
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
            Formula dermatologis teruji klinis untuk perawatan harian di rumah. Sudah termasuk PPN 11%.
          </p>
        </div>

        {/* Free gift banner */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#8C1D35] to-[#B02848] text-white flex items-center justify-center font-bold border-t border-[#FFAEC2]/40 shadow-xs">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-stone-900 block">BONUS FREE POUCH</span>
            <span className="text-stone-500 text-[11px]">Setiap pembelian paket skincare di seluruh klinik</span>
          </div>
        </div>
      </div>

      {/* Skincare Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kits.map((kit) => {
          const discount = kit.originalPrice > kit.promoPrice 
            ? Math.round((1 - (kit.promoPrice / kit.originalPrice)) * 100) 
            : 0;

          return (
            <div
              key={kit.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm hover:shadow-xl hover:border-rose-300/80 transition-all duration-300 flex flex-col justify-between relative overflow-visible"
            >
              <CardLightFlare topPosition="center" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C1D35] bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200/70">
                    Skincare BPOM
                  </span>
                  {kit.freeGift && (
                    <span className="text-[10px] font-bold bg-[#C9A86A]/20 text-stone-900 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#C9A86A]/40">
                      <Gift className="w-3 h-3 text-[#8C1D35]" />
                      {kit.freeGift}
                    </span>
                  )}
                </div>

                {/* Kit Name with hover popup */}
                <div
                  className="relative inline-block w-full"
                  onMouseEnter={() => { if (kit.photoUrl) setHoveredKitId(kit.id); }}
                  onMouseLeave={() => setHoveredKitId(null)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug hover:text-[#8C1D35] cursor-pointer flex-1">
                      {kit.name}
                    </h3>
                    {kit.photoUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        <ImageIcon className="w-3 h-3 text-[#8C1D35]" />
                        <span>Foto</span>
                      </span>
                    )}
                  </div>

                  {hoveredKitId === kit.id && kit.photoUrl && (
                    <div className="absolute left-0 -top-2 transform -translate-y-full z-50 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 animate-in fade-in zoom-in-95 pointer-events-auto">
                      <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
                        <img 
                          src={kit.photoUrl} 
                          alt={kit.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-xs font-bold text-stone-900 font-serif truncate">{kit.name}</p>
                      <span className="text-[10px] text-stone-500">Preview Paket Skincare</span>
                    </div>
                  )}
                </div>

                {/* Items in kit */}
                <div className="mt-3 bg-stone-50 rounded-2xl p-3 border border-stone-200/70">
                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Isi Paket Skincare:
                  </p>
                  <ul className="space-y-1">
                    {kit.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-stone-700 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Price and Action */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-stone-400 line-through">
                      {formatRupiah(kit.originalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        Hemat {discount}%
                      </span>
                    )}
                  </div>
                  <div className="text-lg font-extrabold text-[#8C1D35] mt-0.5">
                    {formatRupiah(kit.promoPrice)}
                  </div>
                </div>

                {kit.photoUrl ? (
                  <a
                    href={kit.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-[#8C1D35] hover:text-white text-stone-700 text-xs font-bold flex items-center gap-1.5 transition border border-stone-200"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#8C1D35]" />
                    <span>Lihat Foto</span>
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-stone-400 py-2">
                    Tersedia di Klinik
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
