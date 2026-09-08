import React, { useState } from 'react';
import { Sparkles, Plus, Check, MapPin, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { TreatmentItem, ClinicSettings } from '../types';

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
    <div className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-visible relative group ${
      isInCart 
        ? 'border-[#6B1D2F] ring-2 ring-[#6B1D2F]/20 shadow-md' 
        : 'border-stone-200/80 hover:border-stone-300 hover:shadow-md'
    }`}>
      
      {/* Top Banner Badges */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          {treatment.skinGoal ? (
            <span className="text-[11px] font-semibold text-[#8C2941] bg-[#FDF2F4] px-2.5 py-0.5 rounded-md">
              {treatment.skinGoal}
            </span>
          ) : <span />}

          <div className="flex items-center gap-1.5">
            {treatment.isNewPromo && (
              <span className="text-[10px] font-extrabold uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                Promo Baru
              </span>
            )}
            {treatment.badge && (
              <span className="text-[10px] font-bold bg-[#C9A86A]/25 text-[#541523] px-2 py-0.5 rounded-full border border-[#C9A86A]/30">
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
            <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug group-hover:text-[#6B1D2F] transition cursor-pointer flex-1">
              {treatment.name}
            </h3>
            {treatment.photoUrl && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C2941] bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full shrink-0">
                <ImageIcon className="w-3 h-3 text-[#6B1D2F]" />
                <span className="text-[10px]">Foto</span>
              </span>
            )}
          </div>

          {/* Pop-up Foto Treatment saat kursor diarahkan ke nama treatment */}
          {showPhotoPreview && treatment.photoUrl && (
            <div className="absolute z-50 left-0 -top-2 transform -translate-y-full w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
              <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-4/3 mb-2 border border-stone-100">
                <img 
                  src={treatment.photoUrl} 
                  alt={treatment.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                  <p className="text-white text-xs font-bold font-serif leading-tight drop-shadow-xs line-clamp-1">
                    {treatment.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className="text-stone-500 font-medium">Preview Foto Treatment</span>
                <a 
                  href={treatment.photoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#6B1D2F] font-bold hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Buka Foto</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Inclusions / Content of Treatment */}
        <div className="mt-3.5 bg-stone-50/90 rounded-xl p-3 border border-stone-100/90">
          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C9A86A]" />
            Isi Rangkaian Treatment:
          </p>
          <ul className="space-y-1.5">
            {treatment.inclusions.map((item, idx) => (
              <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B1D2F] mt-1.5 shrink-0"></span>
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Outlet Notes if restricted */}
        {treatment.outletNotes && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60">
            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="italic">{treatment.outletNotes}</span>
          </div>
        )}
      </div>

      {/* Pricing & Footer Actions */}
      <div className="p-5 pt-4 mt-4 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl">
        
        {/* Price display */}
        <div className="flex items-end justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-400 line-through">
                {originalPrice} RB
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  Hemat {discountPercent}%
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-[#6B1D2F] tracking-tight">
                {activePrice}
              </span>
              <span className="text-xs font-bold text-[#6B1D2F]">RB</span>
              <span className="text-[11px] text-stone-500 font-medium ml-1">
                ({isMemberPrice ? 'Member' : 'Non-Member'})
              </span>
            </div>
          </div>

          {/* Secondary Price preview */}
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block">
              {isMemberPrice ? 'Non-Member' : 'Harga Member'}
            </span>
            <span className="text-xs font-semibold text-stone-600">
              {isMemberPrice ? `${treatment.nonMemberPrice} RB` : `⭐ ${treatment.memberPrice} RB`}
            </span>
          </div>
        </div>

        {/* Card Action Button (Tanpa tombol WhatsApp booking langsung) */}
        <div>
          <button
            type="button"
            onClick={() => onToggleCart(treatment)}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isInCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#6B1D2F] hover:bg-[#521523] text-white'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4" />
                <span>Sudah Masuk Kalkulator Estimasi</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#E8BF87]" />
                <span>+ Tambah ke Kalkulator Estimasi</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
