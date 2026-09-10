import React, { useState, useMemo } from 'react';
import { Repeat, Calendar, ShieldCheck, Sparkles, Image as ImageIcon, Plus, Check, Calculator, Search, RotateCcw } from 'lucide-react';
import { SubscriptionItem, ClinicSettings, CartItem, TreatmentItem } from '../types';
import { CardLightFlare } from './CardLightFlare';
import { PhotoLightboxModal, PhotoLightboxData } from './PhotoLightboxModal';
import { formatNumber } from '../utils/formatters';

interface SubscriptionsSectionProps {
  subscriptions: SubscriptionItem[];
  isMemberPrice: boolean;
  settings: ClinicSettings;
  searchQuery?: string;
  skinGoalFilter?: string;
  cartItems?: CartItem[];
  onToggleCart?: (item: TreatmentItem) => void;
  onClearFilter?: () => void;
}

export const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  subscriptions,
  isMemberPrice,
  settings,
  searchQuery = '',
  skinGoalFilter = '',
  cartItems = [],
  onToggleCart,
  onClearFilter,
}) => {
  const [hoveredSubId, setHoveredSubId] = useState<string | null>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  // Filter subscriptions based on search query and skin goal
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || sub.treatmentName.toLowerCase().includes(q);

      // Skin goal
      let matchGoal = true;
      if (skinGoalFilter) {
        const goal = skinGoalFilter.toLowerCase();
        const tName = sub.treatmentName.toLowerCase();
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = tName.includes('glow') || tName.includes('rejuve') || tName.includes('laser') || tName.includes('vitaran') || tName.includes('pink') || tName.includes('peel');
        } else if (goal.includes('slimm')) {
          matchGoal = tName.includes('slimming') || tName.includes('fat') || tName.includes('body') || tName.includes('contour') || tName.includes('hifu');
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = tName.includes('acne') || tName.includes('scar') || tName.includes('peel') || tName.includes('subcision');
        } else if (goal.includes('aging')) {
          matchGoal = tName.includes('anti-aging') || tName.includes('botox') || tName.includes('filler') || tName.includes('rejur') || tName.includes('profhilo') || tName.includes('hifu');
        } else if (goal.includes('hair removal') || goal.includes('removal')) {
          matchGoal = tName.includes('removal') || tName.includes('underarm');
        } else if (goal === 'hair grow' || goal === 'hair' || (goal.includes('hair') && !goal.includes('removal'))) {
          matchGoal = tName.includes('hair') && !tName.includes('removal');
        } else {
          matchGoal = tName.includes(goal);
        }
      }

      return matchSearch && matchGoal;
    });
  }, [subscriptions, searchQuery, skinGoalFilter]);

  const isTierInCart = (tierId: string) => {
    return cartItems.some((ci) => ci.treatment.id === tierId);
  };

  const handleOpenPhoto = (sub: SubscriptionItem) => {
    if (!sub.photoUrl) return;
    setActiveLightboxData({
      url: sub.photoUrl,
      name: sub.treatmentName,
      categoryOrGroup: 'Paket Langganan',
      originalPrice: sub.package3x?.original,
      nonMemberPrice: sub.package3x?.nonMember,
      memberPrice: sub.package3x?.member,
      inclusions: [
        `Tersedia paket 3x, 6x, hingga 12x sesi`,
        `Harga satuan normal: ${formatNumber(sub.singlePrice)} RB`,
      ],
    });
  };

  return (
    <div className="space-y-6 text-rose-100">
      
      {/* Header Banner */}
      <div className="bg-[#1a030a]/95 rounded-3xl p-6 border border-rose-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-visible">
        <CardLightFlare topPosition="center" />
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 shadow-sm">
              {settings.subscriptionPageBadge || 'Buku BAU Hal. 72 - 80'}
            </span>
            <span className="text-xs font-bold text-[#FFD285] bg-rose-950/60 border border-rose-500/40 px-2.5 py-0.5 rounded-md">
              {settings.subscriptionTagBadge || 'Maksimal Hemat'}
            </span>
            {searchQuery && (
              <span className="text-xs font-semibold text-rose-200 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Search className="w-3 h-3 text-[#FFD285]" />
                Pencarian: "{searchQuery}"
              </span>
            )}
            {skinGoalFilter && (
              <span className="text-xs font-semibold text-amber-200 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFD285]" />
                Goal: {skinGoalFilter}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            {settings.subscriptionTitle || 'Paket Treatment Subscription (Langganan Sesi)'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 mt-1 font-normal">
            {settings.subscriptionSubtitle || 'Dapatkan harga per sesi jauh lebih murah dengan berlangganan paket 3x, 6x, hingga 12x sesi perawatan rutin.'}
          </p>
        </div>

        {/* Validity terms info */}
        <div className="bg-black/50 p-3.5 rounded-2xl border border-rose-500/20 text-xs space-y-1">
          <p className="font-bold text-[#FFD285] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#FFD285]" />
            {settings.subscriptionTermsTitle || 'Masa Berlaku Paket:'}
          </p>
          {(settings.subscriptionTermsList || '• Paket 3x: berlaku hingga 5 bulan\n• Paket 6x: berlaku hingga 8 bulan\n• Paket 12x: berlaku hingga 14 bulan')
            .split('\n')
            .map((term, i) => (
              <p key={i} className="text-rose-200/70 text-[11px]">{term.trim()}</p>
            ))}
        </div>
      </div>

      {/* Subscription Grid */}
      {filteredSubscriptions.length === 0 ? (
        <div className="py-16 text-center bg-[#1a030a]/80 backdrop-blur-2xl rounded-3xl border border-rose-500/25 p-8 shadow-xl">
          <Sparkles className="w-10 h-10 text-rose-400/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            Tidak ditemukan paket langganan yang cocok dengan filter
          </h3>
          <p className="text-xs text-rose-200/70 mt-1 max-w-sm mx-auto">
            {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Coba ubah kata kunci atau reset filter.'}
          </p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubscriptions.map((sub, index) => (
            <div
              key={sub.id}
              className="bg-gradient-to-b from-[#34081b] via-[#230512] to-[#1c030e] rounded-3xl border border-rose-400/40 p-5 shadow-xl hover:border-rose-300/80 hover:shadow-[0_0_30px_rgba(229,57,101,0.25)] transition-all duration-200 flex flex-col justify-between relative overflow-visible"
            >
              <CardLightFlare topPosition="center" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFE29A] bg-[#4a0d24] px-2.5 py-0.5 rounded-lg border border-rose-400/50 shadow-xs">
                    Subscription
                  </span>
                  <span className="text-xs text-rose-100 font-medium">
                    Harga 1x Sesi: <strong className="text-white font-bold">{formatNumber(sub.singlePrice)} RB</strong>
                  </span>
                </div>

                {/* Title with hover popup or click to open modal */}
                <div 
                  className="relative inline-block w-full cursor-pointer"
                  onClick={() => handleOpenPhoto(sub)}
                  onMouseEnter={() => { if (sub.photoUrl) setHoveredSubId(sub.id); }}
                  onMouseLeave={() => setHoveredSubId(null)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug hover:text-[#FFE29A] transition flex-1 drop-shadow-xs">
                      {sub.treatmentName}
                    </h3>
                    {sub.photoUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-100 bg-rose-900/60 hover:bg-rose-800/80 px-2.5 py-0.5 rounded-full border border-rose-400/40 transition shrink-0 shadow-xs">
                        <ImageIcon className="w-3.5 h-3.5 text-[#FFD285]" />
                        <span>Foto</span>
                      </span>
                    )}
                  </div>

                  {hoveredSubId === sub.id && sub.photoUrl && (
                    <div className={`absolute left-0 z-50 w-64 bg-[#260512] backdrop-blur-2xl rounded-2xl shadow-2xl border border-rose-400/60 p-2.5 animate-in fade-in zoom-in-95 pointer-events-none ${
                      index < 3 ? 'top-full mt-2' : '-top-2 transform -translate-y-full'
                    }`}>
                      <div className="aspect-4/3 rounded-xl overflow-hidden bg-black/40 mb-1.5 border border-rose-400/30">
                        <img 
                          src={sub.photoUrl} 
                          alt={sub.treatmentName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-xs font-bold text-white font-serif truncate">{sub.treatmentName}</p>
                      <span className="text-[10px] text-rose-200 block">Klik untuk foto besar</span>
                    </div>
                  )}
                </div>

                {/* Packages Option Rows with "+ Estimasi" for each tier */}
                <div className="mt-4 space-y-2.5">
                  
                  {/* 3x Package */}
                  {sub.package3x && (() => {
                    const tierId = `sub-${sub.id}-3x`;
                    const inCart = isTierInCart(tierId);
                    const itemForCart: TreatmentItem = {
                      id: tierId,
                      categoryId: 'subscriptions',
                      name: `${sub.treatmentName} (Paket 3x)`,
                      subTitle: 'Langganan 3x Sesi (Masa berlaku 5 bulan)',
                      inclusions: [`3x Sesi ${sub.treatmentName}`, 'Masa berlaku hingga 5 bulan'],
                      originalPrice: sub.package3x.original,
                      nonMemberPrice: sub.package3x.nonMember,
                      memberPrice: sub.package3x.member,
                      badge: 'Langganan 3x',
                      photoUrl: sub.photoUrl,
                      sessionsCount: 3,
                      itemType: 'subscription',
                    };

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#400c22]/90 to-[#2c0717]/90 border border-rose-400/35 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">Paket 3x Sesi</span>
                          <span className="text-[11px] text-rose-200/80 font-semibold line-through">
                            {formatNumber(sub.package3x.original)} RB
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <span className="text-sm font-black text-[#FFD285] block drop-shadow-xs">
                              {formatNumber(isMemberPrice ? sub.package3x.member : sub.package3x.nonMember)} RB
                            </span>
                            <span className="text-[11px] text-emerald-300 font-extrabold block">
                              ({formatNumber(isMemberPrice ? sub.package3x.perSessionMember : sub.package3x.perSessionNonMember)} RB/sesi)
                            </span>
                          </div>
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(itemForCart)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-md ${
                                inCart 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gradient-to-r from-[#E53965] to-[#B02848] text-white border border-rose-300/40 hover:brightness-110'
                              }`}
                              title="Tambah ke Estimasi Biaya"
                            >
                              {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{inCart ? '✓' : '+ Estimasi'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4x Package if present */}
                  {sub.package4x && (() => {
                    const tierId = `sub-${sub.id}-4x`;
                    const inCart = isTierInCart(tierId);
                    const itemForCart: TreatmentItem = {
                      id: tierId,
                      categoryId: 'subscriptions',
                      name: `${sub.treatmentName} (Paket 4x)`,
                      subTitle: 'Langganan 4x Sesi',
                      inclusions: [`4x Sesi ${sub.treatmentName}`],
                      originalPrice: sub.package4x.original,
                      nonMemberPrice: sub.package4x.nonMember,
                      memberPrice: sub.package4x.member,
                      badge: 'Langganan 4x',
                      photoUrl: sub.photoUrl,
                      sessionsCount: 4,
                      itemType: 'subscription',
                    };

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#400c22]/90 to-[#2c0717]/90 border border-rose-400/35 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-white block">Paket 4x Sesi</span>
                          <span className="text-[11px] text-rose-200/80 font-semibold line-through">
                            {formatNumber(sub.package4x.original)} RB
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <span className="text-sm font-black text-[#FFD285] block drop-shadow-xs">
                              {formatNumber(isMemberPrice ? sub.package4x.member : sub.package4x.nonMember)} RB
                            </span>
                            <span className="text-[11px] text-emerald-300 font-extrabold block">
                              ({formatNumber(isMemberPrice ? sub.package4x.perSessionMember : sub.package4x.perSessionNonMember)} RB/sesi)
                            </span>
                          </div>
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(itemForCart)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-md ${
                                inCart 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gradient-to-r from-[#E53965] to-[#B02848] text-white border border-rose-300/40 hover:brightness-110'
                              }`}
                              title="Tambah ke Estimasi Biaya"
                            >
                              {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{inCart ? '✓' : '+ Estimasi'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 6x Package */}
                  {sub.package6x && (() => {
                    const tierId = `sub-${sub.id}-6x`;
                    const inCart = isTierInCart(tierId);
                    const itemForCart: TreatmentItem = {
                      id: tierId,
                      categoryId: 'subscriptions',
                      name: `${sub.treatmentName} (Paket 6x)`,
                      subTitle: 'Langganan 6x Sesi (Masa berlaku 8 bulan)',
                      inclusions: [`6x Sesi ${sub.treatmentName}`, 'Masa berlaku hingga 8 bulan'],
                      originalPrice: sub.package6x.original,
                      nonMemberPrice: sub.package6x.nonMember,
                      memberPrice: sub.package6x.member,
                      badge: 'Langganan 6x',
                      photoUrl: sub.photoUrl,
                      sessionsCount: 6,
                      itemType: 'subscription',
                    };

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#4d0f28]/95 to-[#33081b]/95 border border-rose-400/50 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">Paket 6x Sesi</span>
                            <span className="text-[9px] font-extrabold text-white bg-gradient-to-r from-rose-600 to-red-600 px-1.5 py-0.2 rounded shadow-xs">Hemat</span>
                          </div>
                          <span className="text-[11px] text-rose-200/80 font-semibold line-through block">
                            {formatNumber(sub.package6x.original)} RB
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <span className="text-sm font-black text-[#FFD285] block drop-shadow-xs">
                              {formatNumber(isMemberPrice ? sub.package6x.member : sub.package6x.nonMember)} RB
                            </span>
                            <span className="text-[11px] text-emerald-300 font-extrabold block">
                              ({formatNumber(isMemberPrice ? sub.package6x.perSessionMember : sub.package6x.perSessionNonMember)} RB/sesi)
                            </span>
                          </div>
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(itemForCart)}
                              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-md ${
                                inCart 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gradient-to-r from-[#E53965] to-[#B02848] text-white border border-rose-300/40 hover:brightness-110'
                              }`}
                              title="Tambah ke Estimasi Biaya"
                            >
                              {inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{inCart ? '✓' : '+ Estimasi'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 12x Package */}
                  {sub.package12x && (() => {
                    const tierId = `sub-${sub.id}-12x`;
                    const inCart = isTierInCart(tierId);
                    const itemForCart: TreatmentItem = {
                      id: tierId,
                      categoryId: 'subscriptions',
                      name: `${sub.treatmentName} (Paket 12x)`,
                      subTitle: 'Langganan 12x Sesi (Masa berlaku 14 bulan)',
                      inclusions: [`12x Sesi ${sub.treatmentName}`, 'Masa berlaku hingga 14 bulan'],
                      originalPrice: sub.package12x.original,
                      nonMemberPrice: sub.package12x.nonMember,
                      memberPrice: sub.package12x.member,
                      badge: 'Langganan 12x',
                      photoUrl: sub.photoUrl,
                      sessionsCount: 12,
                      itemType: 'subscription',
                    };

                    return (
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-[#442308]/95 to-[#2d1504]/95 border border-amber-400/50 shadow-sm flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">Paket 12x Sesi</span>
                            <span className="text-[9px] font-extrabold text-stone-950 bg-gradient-to-r from-[#FFD285] to-[#E5A84D] px-1.5 py-0.2 rounded shadow-xs">Super Hemat</span>
                          </div>
                          <span className="text-[11px] text-amber-200/80 font-semibold line-through block">
                            {formatNumber(sub.package12x.original)} RB
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <span className="text-sm font-black text-[#FFD285] block drop-shadow-xs">
                              {formatNumber(isMemberPrice ? sub.package12x.member : sub.package12x.nonMember)} RB
                            </span>
                            <span className="text-[11px] text-emerald-300 font-extrabold block">
                              ({formatNumber(isMemberPrice ? sub.package12x.perSessionMember : sub.package12x.perSessionNonMember)} RB/sesi)
                            </span>
                          </div>
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(itemForCart)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0 shadow-md ${
                                inCart 
                                  ? 'bg-emerald-600 text-white' 
                                  : 'bg-gradient-to-r from-[#E53965] to-[#B02848] text-white'
                              }`}
                              title="Tambah ke Estimasi Biaya"
                            >
                              {inCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              <span>{inCart ? '✓' : '+ Estimasi'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-3 border-t border-rose-500/15 flex items-center justify-between">
                <span className="text-[11px] text-rose-300/60 font-medium">
                  Bisa cicilan 0% Paylater
                </span>
                {sub.photoUrl && (
                  <button
                    type="button"
                    onClick={() => handleOpenPhoto(sub)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition border border-rose-500/20 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#FFD285]" />
                    <span>Lihat Foto</span>
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Full-screen Photo Lightbox Modal */}
      <PhotoLightboxModal
        data={activeLightboxData}
        onClose={() => setActiveLightboxData(null)}
        isMemberPrice={isMemberPrice}
      />

    </div>
  );
};
