import React, { useState } from 'react';
import { Sparkles, Plus, Check, MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { TreatmentItem, ClinicSettings } from '../types';
import { CardLightFlare } from './CardLightFlare';

interface TreatmentCardProps {
  treatment: TreatmentItem;
  isMemberPrice: boolean;
  isInCart: boolean;
  onToggleCart: (item: TreatmentItem) => void;
  settings: ClinicSettings;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  isMemberPrice,
  isInCart,
  onToggleCart,
}) => {
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const activePrice = isMemberPrice ? treatment.memberPrice : treatment.nonMemberPrice;
  const originalPrice = treatment.originalPrice;
  const savingsAmount = originalPrice > activePrice ? originalPrice - activePrice : 0;
  const discountPercent = originalPrice > 0 ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  return (
    <div className={`bg-gradient-to-b from-[#34081b] via-[#230512] to-[#1c030e] rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-visible relative group shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_45px_rgba(229,57,101,0.25)] ${
      isInCart 
        ? 'border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_12px_40px_rgba(16,185,129,0.35)]' 
        : 'border-rose-400/40 hover:border-rose-300/80'
    }`}>
      {/* Luminous glowing light flare matching reference photo */}
      <CardLightFlare topPosition="center" />

      {/* Top Banner Badges */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          {treatment.skinGoal ? (
            <span className="text-xs font-bold text-[#FFE29A] bg-[#4a0d24] px-3 py-1 rounded-xl border border-rose-400/50 shadow-xs">
              {treatment.skinGoal}
            </span>
          ) : <span />}

          <div className="flex items-center gap-1.5">
            {treatment.isNewPromo && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-red-500 text-white px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.45)] animate-pulse">
                Promo Baru
              </span>
            )}
            {treatment.badge && (
              <span className="text-[10px] font-bold bg-amber-500/20 text-[#FFE099] px-2.5 py-0.5 rounded-full border border-amber-400/60 shadow-xs">
                {treatment.badge}
              </span>
            )}
          </div>
        </div>

        {/* Treatment Title with Hover Photo Popover */}
        <div 
          className="relative inline-block w-full"
          onMouseEnter={() => setShowPhotoPreview(true)}
          onMouseLeave={() => setShowPhotoPreview(false)}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white leading-snug group-hover:text-[#FFE29A] transition cursor-pointer flex-1 drop-shadow-xs">
              {treatment.name}
            </h3>
            {treatment.photoUrl && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-100 bg-rose-900/60 border border-rose-400/40 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs hover:bg-rose-800/80 transition">
                <ImageIcon className="w-3.5 h-3.5 text-[#FFD285]" />
                <span className="text-[10px]">Foto</span>
              </span>
            )}
          </div>

          {/* Pop-up Foto Treatment saat kursor diarahkan ke nama treatment */}
          {showPhotoPreview && treatment.photoUrl && (
            <div className="absolute z-50 left-0 -top-2 transform -translate-y-full w-72 bg-[#260512] rounded-2xl shadow-2xl border border-rose-400/60 p-2.5 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
              <div className="relative rounded-xl overflow-hidden bg-black/60 aspect-4/3 mb-2 border border-rose-400/30">
                <img 
                  src={treatment.photoUrl} 
                  alt={treatment.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-2.5">
                  <p className="text-white text-xs font-bold font-serif leading-tight drop-shadow-xs line-clamp-1">
                    {treatment.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className="text-rose-200/90 font-medium">Preview Foto Treatment</span>
                <a 
                  href={treatment.photoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#FFD285] font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Buka Foto</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Inclusions / Content of Treatment - Brightened & High Contrast */}
        <div className="mt-3.5 bg-gradient-to-b from-[#400c22]/90 to-[#2c0717]/90 rounded-2xl p-3.5 border border-rose-400/35 shadow-inner">
          <p className="text-[11px] uppercase font-black text-[#FFE29A] tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD285]" />
            <span>Isi Rangkaian Treatment:</span>
          </p>
          <ul className="space-y-2">
            {treatment.inclusions.map((item, idx) => (
              <li key={idx} className="text-[13px] text-white font-medium flex items-start gap-2.5 leading-snug">
                <span className="w-2 h-2 rounded-full bg-[#FF4D7E] mt-1 shrink-0 shadow-[0_0_8px_#FF4D7E] border border-white/40"></span>
                <span className="leading-tight text-white">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outlet Notes if restricted */}
        {treatment.outletNotes && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-200 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="italic">{treatment.outletNotes}</span>
          </div>
        )}
      </div>

      {/* Pricing & Footer Actions - Brightened & High Contrast */}
      <div className="p-5 pt-4 mt-4 border-t border-rose-400/35 bg-gradient-to-b from-[#38091d]/85 to-[#240412]/95 rounded-b-3xl">
        
        {/* Price display */}
        <div className="flex items-end justify-between gap-2 mb-3.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-rose-200 font-semibold line-through opacity-80">
                {originalPrice} RB
              </span>
              {discountPercent > 0 && (
                <span className="text-xs font-black text-emerald-200 bg-emerald-900/90 px-2 py-0.5 rounded-md border border-emerald-400/60 shadow-xs">
                  Hemat {discountPercent}%
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-black text-[#FFD285] tracking-tight drop-shadow-[0_2px_10px_rgba(255,210,133,0.35)]">
                {activePrice}
              </span>
              <span className="text-sm font-black text-[#FFD285]">RB</span>
              <span className="text-xs font-bold text-rose-100 ml-1.5 px-2 py-0.5 rounded-md bg-white/10 border border-white/15">
                ({isMemberPrice ? 'Member' : 'Non-Member'})
              </span>
            </div>
          </div>

          {/* Member Badge / Non-Member comparison */}
          <div className="text-right">
            <span className="text-[11px] font-bold text-rose-200 block mb-1">
              {isMemberPrice ? 'Non-Member' : 'Harga Spesial'}
            </span>
            {isMemberPrice ? (
              <span className="text-sm font-black text-white bg-black/40 px-2.5 py-1 rounded-lg border border-rose-400/30 inline-block">
                {treatment.nonMemberPrice} RB
              </span>
            ) : (
              <div className="relative inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 font-black shadow-[0_0_15px_rgba(255,210,133,0.45)]">
                <span className="text-[10px] font-black tracking-wide uppercase">MEMBER</span>
                <span className="text-xs font-black ml-1.5">{treatment.memberPrice} RB</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Action Button */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCart(treatment)}
            className={`w-full py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isInCart
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]'
                : 'bg-gradient-to-r from-[#E53965] via-[#C9204B] to-[#9E1438] hover:from-[#FF4D7E] hover:to-[#B81943] text-white border border-rose-300/60 shadow-[0_4px_20px_rgba(229,57,101,0.4)] hover:brightness-110 active:scale-[0.99]'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Sudah Masuk Estimasi Biaya</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#FFD285]" />
                <span>+ Tambah ke Estimasi Biaya</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
