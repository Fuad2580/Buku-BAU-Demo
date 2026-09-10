import React from 'react';
import { Sparkles, ShieldCheck, Tag, CreditCard, Percent, ArrowRight } from 'lucide-react';
import { ClinicSettings } from '../types';

// Subtle 4-point luxury sparkle star
const SparkleStar: React.FC<{ className?: string }> = ({ className = 'w-3 h-3 text-[#FDE047]' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 0C12.4 6.2 17.8 11.6 24 12C17.8 12.4 12.4 17.8 12 24C11.6 17.8 6.2 12.4 0 12C6.2 11.6 11.6 6.2 12 0Z"
      fill="currentColor"
    />
  </svg>
);

interface PromoHeroProps {
  settings: ClinicSettings;
  isMemberPrice: boolean;
  onTogglePriceMode: () => void;
  onSetPriceMode?: (isMember: boolean) => void;
  totalTreatments: number;
  totalPromos: number;
}

export const PromoHero: React.FC<PromoHeroProps> = ({
  settings,
  isMemberPrice,
  onTogglePriceMode,
  onSetPriceMode,
  totalTreatments,
  totalPromos,
}) => {
  const handleSelectMember = () => {
    if (onSetPriceMode) {
      onSetPriceMode(true);
    } else if (!isMemberPrice) {
      onTogglePriceMode();
    }
  };

  const handleSelectNonMember = () => {
    if (onSetPriceMode) {
      onSetPriceMode(false);
    } else if (isMemberPrice) {
      onTogglePriceMode();
    }
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#380712] via-[#5C1425] to-[#2B050E] text-white py-7 px-4 sm:px-6 shadow-inner border-b border-[#521321]">
      {/* Decorative Glow Elements & Sparkles */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-[#E44176]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-40 bg-[#FFD382]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none animate-shimmer-gleam" />

      {/* Floating Sparkles in Promo Banner */}
      <div className="absolute top-4 right-1/4 pointer-events-none animate-twinkle hidden sm:block">
        <SparkleStar className="w-4 h-4 text-[#FCE3B4]/70 drop-shadow-[0_0_6px_#FCE3B4]" />
      </div>
      <div className="absolute top-8 left-12 pointer-events-none animate-twinkle-delay-1 hidden sm:block">
        <SparkleStar className="w-3 h-3 text-[#FFAEC2]/70 drop-shadow-[0_0_4px_#FFAEC2]" />
      </div>
      <div className="absolute bottom-6 right-12 pointer-events-none animate-twinkle-delay-2 hidden sm:block">
        <SparkleStar className="w-4 h-4 text-[#FDE047]/60 drop-shadow-[0_0_5px_#FDE047]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Main Campaign Info */}
          <div className="max-w-3xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-[#E6C994] to-[#C9A86A] text-stone-950 font-black text-[11px] tracking-wide uppercase shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-stone-900 animate-twinkle" />
                {settings.promoBadge || 'Promo Spesial Buku BAU 2026'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-rose-100 text-xs border border-white/15 backdrop-blur-xs">
                {settings.periodText}
              </span>
            </div>

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF7EC] via-[#FDE8C5] to-[#FFF0D4] tracking-tight flex items-center gap-2">
                <span>{settings.promoTitle || 'Merdeka Berani Glowing'}</span>
                <span className="inline-block animate-twinkle-fast">
                  <SparkleStar className="w-5 h-5 text-[#FDE047] drop-shadow-[0_0_8px_#FDE047]" />
                </span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-rose-100 font-light leading-relaxed">
              {settings.promoSubtitle || 'Dapatkan kulit sehat, cerah, dan bebas masalah dengan penawaran treatment terbaik. Tersedia Cicilan 0% Paylater & Cashback hingga 500 RB!'}
            </p>

            {/* Badges and Terms summary */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-rose-200">
              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10">
                <CreditCard className="w-3.5 h-3.5 text-[#E8BF87]" />
                <span>{settings.paymentPartners || 'Indodana • Kredivo • Atome • SPayLater • BCA • BRI • Mandiri'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E8BF87]" />
                <span>DP Booking Rp {Number(settings.bookingDp || 50000).toLocaleString('id-ID')} (Masa Berlaku {settings.packageValidityMonths || 6} Bulan)</span>
              </div>
            </div>
          </div>

          {/* Member Price Toggle & Quick Metrics */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-3">
            {/* Price Switcher Card */}
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-md flex flex-col gap-2 min-w-[260px]">
              <div className="text-[11px] font-semibold text-rose-200 flex items-center justify-between">
                <span>Tampilan Harga:</span>
                <span className="text-[#E8BF87] font-bold">
                  {isMemberPrice ? '⭐ Mode Member' : 'Regular Non-Member'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 bg-black/25 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handleSelectNonMember}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    !isMemberPrice 
                      ? 'bg-white text-[#6B1D2F] shadow' 
                      : 'text-rose-200 hover:text-white'
                  }`}
                >
                  Non-Member
                </button>
                <button
                  type="button"
                  onClick={handleSelectMember}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                    isMemberPrice 
                      ? 'bg-[#C9A86A] text-stone-900 shadow' 
                      : 'text-rose-200 hover:text-white'
                  }`}
                >
                  ⭐ Member
                </button>
              </div>
              <p className="text-[10px] text-rose-200/80 text-center italic">
                {isMemberPrice ? 'Harga Member lebih hemat hingga ratusan ribu!' : 'Klik Member untuk melihat harga diskon eksklusif'}
              </p>
            </div>

            {/* Micro Stats */}
            <div className="flex items-center justify-end gap-4 text-xs text-rose-200/90 px-1">
              <div>
                <span className="font-bold text-white">{totalTreatments}</span> Treatment Aktif
              </div>
              <div>•</div>
              <div>
                <span className="font-bold text-[#E8BF87]">{totalPromos}</span> Promo Spesial
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
