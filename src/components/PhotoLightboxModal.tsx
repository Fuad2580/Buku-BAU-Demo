import React from 'react';
import { X, Plus, Check, Calculator, Sparkles, Tag, MapPin } from 'lucide-react';
import { TreatmentItem } from '../types';

export interface PhotoLightboxData {
  url: string;
  name: string;
  categoryOrGroup?: string;
  originalPrice?: number;
  nonMemberPrice?: number;
  memberPrice?: number;
  outletRestricted?: string;
  inclusions?: string[];
  treatmentItemForCart?: TreatmentItem;
}

interface PhotoLightboxModalProps {
  data: PhotoLightboxData | null;
  onClose: () => void;
  isInCart?: boolean;
  onToggleCart?: (item: TreatmentItem) => void;
  isMemberPrice?: boolean;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  data,
  onClose,
  isInCart,
  onToggleCart,
  isMemberPrice = true,
}) => {
  if (!data) return null;

  const discount = data.originalPrice && data.memberPrice && data.originalPrice > data.memberPrice
    ? Math.round((1 - (data.memberPrice / data.originalPrice)) * 100)
    : 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-stone-200 text-stone-800 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2 h-2 rounded-full bg-[#E6C994]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300 truncate">
              {data.categoryOrGroup || 'Foto Treatment'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-Resolution Photo Viewer (No clipping!) */}
        <div className="bg-stone-950 relative flex items-center justify-center overflow-hidden min-h-[260px] max-h-[420px]">
          <img
            src={data.url}
            alt={data.name}
            className="w-full h-full object-contain max-h-[420px]"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Details & Cart Action */}
        <div className="p-5 space-y-4 overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {data.categoryOrGroup && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                  {data.categoryOrGroup}
                </span>
              )}
              {data.outletRestricted && (
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.outletRestricted}
                </span>
              )}
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900 leading-snug">
              {data.name}
            </h3>
            {data.inclusions && data.inclusions.length > 0 && (
              <p className="text-xs text-stone-500 mt-1">
                {data.inclusions.join(' • ')}
              </p>
            )}
          </div>

          {/* Pricing Info */}
          {(data.memberPrice !== undefined || data.nonMemberPrice !== undefined) && (
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 block">Harga Treatment</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-extrabold text-[#8C1D35]">
                    {isMemberPrice && data.memberPrice !== undefined ? data.memberPrice : data.nonMemberPrice} RB
                  </span>
                  {data.originalPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {data.originalPrice} RB
                    </span>
                  )}
                </div>
              </div>

              {discount > 0 && (
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-xl">
                  Hemat {discount}%
                </span>
              )}
            </div>
          )}

          {/* Action Button: Add to Estimasi Biaya */}
          {onToggleCart && data.treatmentItemForCart && (
            <button
              onClick={() => {
                onToggleCart(data.treatmentItemForCart!);
              }}
              className={`w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                isInCart
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gradient-to-r from-[#8C1D35] to-[#B02848] hover:from-[#73172B] hover:to-[#911F3A] text-white border-t border-[#FFAEC2]/40'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sudah Ada di Kalkulator Estimasi</span>
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" />
                  <span>+ Tambah ke Estimasi Biaya</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
