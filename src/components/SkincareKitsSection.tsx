import React, { useState, useMemo } from 'react';
import { Package, Gift, Sparkles, Check, Plus, Image as ImageIcon, Search, RotateCcw } from 'lucide-react';
import { SkincareKit, ClinicSettings, CartItem, TreatmentItem } from '../types';
import { CardLightFlare } from './CardLightFlare';
import { PhotoLightboxModal, PhotoLightboxData } from './PhotoLightboxModal';

interface SkincareKitsSectionProps {
  kits: SkincareKit[];
  settings: ClinicSettings;
  searchQuery?: string;
  skinGoalFilter?: string;
  cartItems?: CartItem[];
  onToggleCart?: (item: TreatmentItem) => void;
  onClearFilter?: () => void;
}

export const SkincareKitsSection: React.FC<SkincareKitsSectionProps> = ({
  kits,
  settings,
  searchQuery = '',
  skinGoalFilter = '',
  cartItems = [],
  onToggleCart,
  onClearFilter,
}) => {
  const [hoveredKitId, setHoveredKitId] = useState<string | null>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Filter kits based on search query and skin goal
  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      // Search query
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        kit.name.toLowerCase().includes(q) ||
        (kit.freeGift && kit.freeGift.toLowerCase().includes(q)) ||
        kit.items.some((it) => it.toLowerCase().includes(q));

      // Skin goal
      let matchGoal = true;
      if (skinGoalFilter) {
        const goal = skinGoalFilter.toLowerCase();
        const kName = kit.name.toLowerCase();
        const itStr = kit.items.join(' ').toLowerCase();
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = kName.includes('glow') || kName.includes('bright') || itStr.includes('glow') || itStr.includes('bright') || itStr.includes('niacinamide');
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = kName.includes('acne') || itStr.includes('acne') || itStr.includes('salicylic') || itStr.includes('tea tree');
        } else if (goal.includes('aging')) {
          matchGoal = kName.includes('aging') || itStr.includes('retinol') || itStr.includes('collagen') || itStr.includes('peptide');
        } else {
          matchGoal = kName.includes(goal) || itStr.includes(goal);
        }
      }

      return matchSearch && matchGoal;
    });
  }, [kits, searchQuery, skinGoalFilter]);

  const mapToTreatmentItem = (kit: SkincareKit): TreatmentItem => ({
    id: `skincare-${kit.id}`,
    categoryId: 'skincare',
    name: kit.name,
    subTitle: 'Paket Skincare Bundling',
    inclusions: kit.items,
    originalPrice: Math.round(kit.originalPrice / 1000),
    nonMemberPrice: Math.round(kit.promoPrice / 1000),
    memberPrice: Math.round(kit.promoPrice / 1000),
    unitPriceInRupiah: kit.promoPrice,
    badge: kit.freeGift ? `Free ${kit.freeGift}` : 'Skincare Kit',
    photoUrl: kit.photoUrl,
    itemType: 'skincare',
  });

  const isKitInCart = (kitId: string) => {
    return cartItems.some((ci) => ci.treatment.id === `skincare-${kitId}` || ci.treatment.id === kitId);
  };

  const handleOpenPhoto = (kit: SkincareKit) => {
    if (!kit.photoUrl) return;
    setActiveLightboxData({
      url: kit.photoUrl,
      name: kit.name,
      categoryOrGroup: 'Paket Skincare Kit',
      inclusions: kit.items,
      treatmentItemForCart: mapToTreatmentItem(kit),
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
              {settings.skincarePageBadge || 'Buku BAU Hal. 82 - 85'}
            </span>
            <span className="text-xs font-bold text-[#FFD285] bg-rose-950/60 border border-rose-500/40 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Gift className="w-3 h-3 text-[#FFD285]" />
              {settings.skincareTagBadge || 'FREE Exclusive SOZO Pouch'}
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
            {settings.skincareTitle || 'Paket Skincare Kit Bundling'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 mt-1 font-normal">
            {settings.skincareSubtitle || 'Formula dermatologis teruji klinis untuk perawatan harian di rumah. Sudah termasuk PPN 11%.'}
          </p>
        </div>

        {/* Free gift banner */}
        <div className="bg-black/50 p-3.5 rounded-2xl border border-rose-500/20 text-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] text-white flex items-center justify-center font-bold border-t border-[#FFAEC2]/40 shadow-sm">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">BONUS FREE POUCH</span>
            <span className="text-rose-300/70 text-[11px]">Setiap pembelian paket skincare di seluruh klinik</span>
          </div>
        </div>
      </div>

      {/* Skincare Cards */}
      {filteredKits.length === 0 ? (
        <div className="py-16 text-center bg-[#1a030a]/80 backdrop-blur-2xl rounded-3xl border border-rose-500/25 p-8 shadow-xl">
          <Sparkles className="w-10 h-10 text-rose-400/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            Tidak ditemukan paket skincare yang cocok dengan filter
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
          {filteredKits.map((kit, index) => {
            const discount = kit.originalPrice > kit.promoPrice 
              ? Math.round((1 - (kit.promoPrice / kit.originalPrice)) * 100) 
              : 0;
            const inCart = isKitInCart(kit.id);
            const treatmentForCart = mapToTreatmentItem(kit);

            return (
              <div
                key={kit.id}
                className="bg-gradient-to-b from-[#34081b] via-[#230512] to-[#1c030e] rounded-3xl border border-rose-400/40 p-5 shadow-xl hover:border-rose-300/80 hover:shadow-[0_0_30px_rgba(229,57,101,0.25)] transition-all duration-200 flex flex-col justify-between relative overflow-visible"
              >
                <CardLightFlare topPosition="center" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFE29A] bg-[#4a0d24] px-2.5 py-0.5 rounded-lg border border-rose-400/50 shadow-xs">
                      Bundling Kit
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-black text-emerald-200 bg-emerald-900/90 px-2 py-0.5 rounded-md border border-emerald-400/60 shadow-xs">
                        Hemat {discount}%
                      </span>
                    )}
                  </div>

                  {/* Title & Photo trigger */}
                  <div 
                    className="relative inline-block w-full cursor-pointer"
                    onClick={() => handleOpenPhoto(kit)}
                    onMouseEnter={() => { if (kit.photoUrl) setHoveredKitId(kit.id); }}
                    onMouseLeave={() => setHoveredKitId(null)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-white leading-snug hover:text-[#FFE29A] transition flex-1 drop-shadow-xs">
                        {kit.name}
                      </h3>
                      {kit.photoUrl && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-100 bg-rose-900/60 hover:bg-rose-800/80 px-2.5 py-0.5 rounded-full border border-rose-400/40 transition shrink-0 shadow-xs">
                          <ImageIcon className="w-3.5 h-3.5 text-[#FFD285]" />
                          <span>Foto</span>
                        </span>
                      )}
                    </div>

                    {hoveredKitId === kit.id && kit.photoUrl && (
                      <div className={`absolute left-0 z-50 w-64 bg-[#260512] backdrop-blur-2xl rounded-2xl shadow-2xl border border-rose-400/60 p-2.5 animate-in fade-in zoom-in-95 pointer-events-none ${
                        index < 3 ? 'top-full mt-2' : '-top-2 transform -translate-y-full'
                      }`}>
                        <div className="aspect-4/3 rounded-xl overflow-hidden bg-black/40 mb-1.5 border border-rose-400/30">
                          <img 
                            src={kit.photoUrl} 
                            alt={kit.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-xs font-bold text-white font-serif truncate">{kit.name}</p>
                        <span className="text-[10px] text-rose-200 block">Klik untuk foto besar</span>
                      </div>
                    )}
                  </div>

                  {/* Price - Brightened */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-b from-[#400c22]/90 to-[#2c0717]/90 border border-rose-400/35 shadow-inner">
                    <span className="text-[11px] text-rose-200/80 font-semibold block line-through">
                      {formatRupiah(kit.originalPrice)}
                    </span>
                    <span className="text-xl font-serif font-black text-[#FFD285] block drop-shadow-[0_2px_8px_rgba(255,210,133,0.3)]">
                      {formatRupiah(kit.promoPrice)}
                    </span>
                    <span className="text-[11px] text-rose-200 font-medium mt-0.5 block">
                      Harga sudah termasuk PPN 11%
                    </span>
                  </div>

                  {/* Included Items list - High Contrast */}
                  <div className="mt-4 p-3 rounded-2xl bg-black/30 border border-rose-400/25 space-y-2">
                    <span className="text-xs font-extrabold text-[#FFE29A] block">Isi Paket:</span>
                    {kit.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-white font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#FF4D7E] shrink-0 shadow-[0_0_6px_#FF4D7E]"></span>
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Free gift tag */}
                  {kit.freeGift && (
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-200">
                      <Gift className="w-3.5 h-3.5 text-[#FFD285] shrink-0" />
                      <span>Free: <strong className="text-white font-bold">{kit.freeGift}</strong></span>
                    </div>
                  )}
                </div>

                {/* Add to Estimation Button */}
                <div className="mt-5 pt-3 border-t border-rose-400/30 flex items-center justify-between gap-2">
                  <span className="text-xs text-rose-200 font-medium">
                    Stok Klinik
                  </span>
                  {onToggleCart && (
                    <button
                      type="button"
                      onClick={() => onToggleCart(treatmentForCart)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                        inCart
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-[#E53965] to-[#B02848] text-white hover:brightness-110 border border-rose-300/40'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ditambahkan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Estimasi Biaya</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Full-screen Photo Lightbox Modal */}
      <PhotoLightboxModal
        data={activeLightboxData}
        onClose={() => setActiveLightboxData(null)}
        isInCart={activeLightboxData ? isKitInCart(activeLightboxData.treatmentItemForCart?.id.replace('skincare-', '') || '') : false}
        onToggleCart={onToggleCart}
      />

    </div>
  );
};
