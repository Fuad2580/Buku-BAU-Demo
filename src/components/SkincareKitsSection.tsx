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
    <div className="space-y-6 text-stone-800">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-visible">
        <CardLightFlare topPosition="center" />
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E6C994] to-[#C9A86A] text-stone-950 shadow-sm">
              Buku BAU Hal. 82 - 85
            </span>
            <span className="text-xs font-bold text-[#8C1D35] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Gift className="w-3 h-3 text-[#8C1D35]" />
              FREE Exclusive SOZO Pouch
            </span>
            {searchQuery && (
              <span className="text-xs font-semibold text-[#8C1D35] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Search className="w-3 h-3" />
                Pencarian: "{searchQuery}"
              </span>
            )}
            {skinGoalFilter && (
              <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Goal: {skinGoalFilter}
              </span>
            )}
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
      {filteredKits.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">
            Tidak ditemukan paket skincare yang cocok dengan filter
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Coba ubah kata kunci atau reset filter.'}
          </p>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="mt-4 px-4 py-2 rounded-xl bg-[#8C1D35] text-white text-xs font-bold hover:bg-[#73172B] transition cursor-pointer inline-flex items-center gap-1.5"
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
                className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-sm hover:shadow-xl hover:border-rose-300/80 transition-all duration-300 flex flex-col justify-between relative overflow-visible"
              >
                <CardLightFlare topPosition="center" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C1D35] bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200/70">
                      Bundling Kit
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
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
                      <h3 className="font-serif font-bold text-base text-stone-900 leading-snug hover:text-[#8C1D35] transition flex-1">
                        {kit.name}
                      </h3>
                      {kit.photoUrl && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-full border border-stone-200 transition shrink-0">
                          <ImageIcon className="w-3 h-3 text-[#8C1D35]" />
                          <span>Foto</span>
                        </span>
                      )}
                    </div>

                    {hoveredKitId === kit.id && kit.photoUrl && (
                      <div className={`absolute left-0 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2.5 animate-in fade-in zoom-in-95 pointer-events-none ${
                        index < 3 ? 'top-full mt-2' : '-top-2 transform -translate-y-full'
                      }`}>
                        <div className="aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-1.5 border border-stone-200">
                          <img 
                            src={kit.photoUrl} 
                            alt={kit.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <p className="text-xs font-bold text-stone-900 font-serif truncate">{kit.name}</p>
                        <span className="text-[10px] text-stone-500">Klik untuk foto besar</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 block line-through">
                      {formatRupiah(kit.originalPrice)}
                    </span>
                    <span className="text-lg font-serif font-extrabold text-[#8C1D35] block">
                      {formatRupiah(kit.promoPrice)}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">
                      Harga sudah termasuk PPN 11%
                    </span>
                  </div>

                  {/* Included Items list */}
                  <div className="mt-4 space-y-1.5">
                    <span className="text-xs font-bold text-stone-800 block">Isi Paket:</span>
                    {kit.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8C1D35] shrink-0"></span>
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Free gift tag */}
                  {kit.freeGift && (
                    <div className="mt-3 p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
                      <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Free: <strong>{kit.freeGift}</strong></span>
                    </div>
                  )}
                </div>

                {/* Add to Estimation Button */}
                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 font-medium">
                    Stok Klinik
                  </span>
                  {onToggleCart && (
                    <button
                      type="button"
                      onClick={() => onToggleCart(treatmentForCart)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        inCart
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#8C1D35] hover:bg-[#73172B] text-white border-t border-[#FFAEC2]/30'
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
                          <span>+ Estimasi Biaya</span>
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
