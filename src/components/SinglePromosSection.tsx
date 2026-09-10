import React, { useState, useMemo } from 'react';
import { Tag, MapPin, Sparkles, Image as ImageIcon, Plus, Check, Calculator, Search, RotateCcw } from 'lucide-react';
import { SinglePromoItem, ClinicSettings, CartItem, TreatmentItem } from '../types';
import { CardLightFlare } from './CardLightFlare';
import { PhotoLightboxModal, PhotoLightboxData } from './PhotoLightboxModal';

interface SinglePromosSectionProps {
  singlePromos: SinglePromoItem[];
  isMemberPrice: boolean;
  settings: ClinicSettings;
  searchQuery?: string;
  skinGoalFilter?: string;
  cartItems?: CartItem[];
  onToggleCart?: (item: TreatmentItem) => void;
  onClearFilter?: () => void;
}

export const SinglePromosSection: React.FC<SinglePromosSectionProps> = ({
  singlePromos,
  isMemberPrice,
  settings,
  searchQuery = '',
  skinGoalFilter = '',
  cartItems = [],
  onToggleCart,
  onClearFilter,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('Semua');
  const [hoveredPhoto, setHoveredPhoto] = useState<{ id: string; url: string; name: string; rowIndex: number } | null>(null);
  const [activeLightboxData, setActiveLightboxData] = useState<PhotoLightboxData | null>(null);

  const groups = ['Semua', 'Glow & Rejuve', 'Slimming & Contouring', 'Acne & Scar', 'Anti-Aging', 'Hair Grow'];

  // Helper to map single promo item to TreatmentItem for cart calculation
  const mapToTreatmentItem = (item: SinglePromoItem): TreatmentItem => ({
    id: `single-${item.id}`,
    categoryId: 'single-promos',
    name: item.name,
    subTitle: item.group,
    inclusions: [`1x ${item.name} (${item.group})`],
    originalPrice: item.originalPrice,
    nonMemberPrice: item.nonMemberPrice,
    memberPrice: item.memberPrice,
    badge: 'Single Promo',
    outletNotes: item.outletRestricted,
    photoUrl: item.photoUrl,
    itemType: 'single',
  });

  // Filtered single promos based on selected group, search query, and skin goal
  const filteredPromos = useMemo(() => {
    return singlePromos.filter((item) => {
      // 1. Group filter
      const matchGroup = selectedGroup === 'Semua' || item.group === selectedGroup;

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.outletRestricted && item.outletRestricted.toLowerCase().includes(q));

      // 3. Skin goal filter
      let matchGoal = true;
      if (skinGoalFilter) {
        const goal = skinGoalFilter.toLowerCase();
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = item.group === 'Glow & Rejuve';
        } else if (goal.includes('slimm')) {
          matchGoal = item.group === 'Slimming & Contouring';
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = item.group === 'Acne & Scar';
        } else if (goal.includes('aging')) {
          matchGoal = item.group === 'Anti-Aging';
        } else if (goal.includes('hair removal') || goal.includes('removal')) {
          matchGoal = item.name.toLowerCase().includes('hair removal') || item.name.toLowerCase().includes('underarm') || item.name.toLowerCase().includes('ipl');
        } else if (goal === 'hair grow' || goal === 'hair' || (goal.includes('hair') && !goal.includes('removal'))) {
          matchGoal = item.group === 'Hair Grow';
        } else {
          matchGoal = item.name.toLowerCase().includes(goal) || item.group.toLowerCase().includes(goal);
        }
      }

      return matchGroup && matchSearch && matchGoal;
    });
  }, [singlePromos, selectedGroup, searchQuery, skinGoalFilter]);

  const handleOpenPhoto = (item: SinglePromoItem) => {
    if (!item.photoUrl) return;
    setActiveLightboxData({
      url: item.photoUrl,
      name: item.name,
      categoryOrGroup: item.group,
      originalPrice: item.originalPrice,
      nonMemberPrice: item.nonMemberPrice,
      memberPrice: item.memberPrice,
      outletRestricted: item.outletRestricted,
      treatmentItemForCart: mapToTreatmentItem(item),
    });
  };

  const isItemInCart = (itemId: string) => {
    return cartItems.some((ci) => ci.treatment.id === `single-${itemId}` || ci.treatment.id === itemId);
  };

  return (
    <div className="space-y-6 text-rose-100">
      
      {/* Intro Header */}
      <div className="bg-[#1a030a]/95 rounded-3xl p-6 border border-rose-500/25 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-visible">
        <CardLightFlare topPosition="center" />
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 shadow-sm">
              {settings.singlePromoPageBadge || 'Buku BAU Hal. 9 - 10'}
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
              {settings.singlePromoTagBadge || 'Harga Satuan Promo'}
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
            {settings.singlePromoTitle || 'Promo Single Treatment'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-200/80 mt-1 font-normal">
            {settings.singlePromoSubtitle || 'Pilihan perawatan satuan dengan harga spesial. Hemat lebih banyak untuk member terdaftar.'}
          </p>
        </div>

        {/* Group Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-black/50 border border-rose-500/20 rounded-2xl">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setSelectedGroup(grp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedGroup === grp
                  ? 'bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 shadow-[0_0_12px_rgba(255,210,133,0.35)]'
                  : 'text-rose-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>
      </div>

      {/* Special Highlights: Botox 5% & Filler Threadlift 10% */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#2a040e] to-[#1d0309] p-4 rounded-2xl border border-rose-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-[#FFD285] uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-white">Botox Premium (min. 50 unit)</h4>
            <p className="text-xs text-rose-200/70">Diskon 5% • Maksimal Potongan 150 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] text-white text-sm font-extrabold shadow-md border-t border-rose-300/40">
            Diskon 5%
          </span>
        </div>

        <div className="bg-gradient-to-r from-[#2a040e] to-[#1d0309] p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wide">Voucher Diskon</span>
            <h4 className="text-base font-bold font-serif text-white">Filler & Threadlift Benang</h4>
            <p className="text-xs text-rose-200/70">Diskon 10% • Maksimal Potongan 400 RB</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 text-sm font-extrabold shadow-md">
            Diskon 10%
          </span>
        </div>
      </div>

      {/* Table of Single Promos */}
      {filteredPromos.length === 0 ? (
        <div className="py-16 text-center bg-[#1a030a]/80 backdrop-blur-2xl rounded-3xl border border-rose-500/25 p-8 shadow-xl">
          <Sparkles className="w-10 h-10 text-rose-400/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            Tidak ditemukan treatment satuan yang cocok dengan filter
          </h3>
          <p className="text-xs text-rose-200/70 mt-1 max-w-sm mx-auto">
            {searchQuery ? `Tidak ada hasil untuk pencarian "${searchQuery}".` : 'Coba ubah kategori grup atau reset filter.'}
          </p>
          {onClearFilter && (
            <button
              onClick={() => {
                setSelectedGroup('Semua');
                onClearFilter();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer inline-flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="bg-[#1a030a]/95 rounded-3xl border border-rose-500/25 shadow-2xl overflow-visible relative">
          <CardLightFlare topPosition="center" />
          <div className="overflow-x-auto rounded-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/50 text-rose-200 text-xs font-bold font-serif uppercase tracking-wider border-b border-rose-500/20">
                  <th className="p-3.5 pl-5">Treatment</th>
                  <th className="p-3.5">Kategori Grup</th>
                  <th className="p-3.5">Harga Normal</th>
                  <th className="p-3.5">Non-Member</th>
                  <th className="p-3.5">Harga Member</th>
                  <th className="p-3.5">Khusus Outlet</th>
                  <th className="p-3.5 pr-5 text-right">Aksi & Estimasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10 text-xs text-rose-100/90">
                {filteredPromos.map((item, index) => {
                  const discount = item.originalPrice > item.memberPrice 
                    ? Math.round((1 - (item.memberPrice / item.originalPrice)) * 100)
                    : 0;
                  const inCart = isItemInCart(item.id);
                  const treatmentForCart = mapToTreatmentItem(item);

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.04] transition">
                      <td className="p-3.5 pl-5 font-bold text-white relative">
                        <div 
                          className="inline-block cursor-pointer relative group/item"
                          onClick={() => handleOpenPhoto(item)}
                          onMouseEnter={() => {
                            if (item.photoUrl) {
                              setHoveredPhoto({ id: item.id, url: item.photoUrl, name: item.name, rowIndex: index });
                            }
                          }}
                          onMouseLeave={() => setHoveredPhoto(null)}
                        >
                          <span className="group-hover/item:text-[#FFD285] transition flex items-center gap-1.5 font-bold">
                            {item.name}
                            {item.photoUrl && (
                              <span className="p-1 rounded-md bg-white/10 group-hover/item:bg-white/20 text-[#FFD285] transition">
                                <ImageIcon className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </span>

                          {/* Hover preview tooltip */}
                          {hoveredPhoto?.id === item.id && (
                            <div 
                              className={`absolute left-0 z-50 w-64 bg-[#1e040c]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-rose-500/30 p-2.5 animate-in fade-in zoom-in-95 pointer-events-none ${
                                index < 3 ? 'top-full mt-2' : '-top-2 transform -translate-y-full'
                              }`}
                            >
                              <div className="aspect-4/3 rounded-xl overflow-hidden bg-black/40 mb-1.5 border border-rose-500/20">
                                <img 
                                  src={hoveredPhoto.url} 
                                  alt={hoveredPhoto.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <p className="text-xs font-bold text-white font-serif truncate">{hoveredPhoto.name}</p>
                              <span className="text-[10px] text-rose-300/70 block">Klik untuk foto besar & tambah ke estimasi</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 text-rose-200 text-[11px] font-medium border border-rose-500/20">
                          {item.group}
                        </span>
                      </td>

                      <td className="p-3.5 text-rose-300/40 line-through">
                        {item.originalPrice} RB
                      </td>

                      <td className={`p-3.5 font-semibold ${!isMemberPrice ? 'text-[#FFD285] font-bold text-sm' : 'text-rose-200/80'}`}>
                        {item.nonMemberPrice} RB
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isMemberPrice ? 'text-sm text-[#FFD285]' : 'text-rose-200/90'}`}>
                            {item.memberPrice} RB
                          </span>
                          {discount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.2 rounded">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-rose-300/60 italic text-[11px]">
                        {item.outletRestricted ? (
                          <span className="flex items-center gap-1 text-[#FFD285] font-medium">
                            <MapPin className="w-3 h-3 text-[#FFD285] shrink-0" />
                            {item.outletRestricted}
                          </span>
                        ) : (
                          'Semua Outlet'
                        )}
                      </td>

                      <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* Photo Button */}
                          {item.photoUrl && (
                            <button
                              type="button"
                              onClick={() => handleOpenPhoto(item)}
                              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-rose-200 hover:text-white text-[11px] font-semibold transition border border-rose-500/20 flex items-center gap-1 cursor-pointer"
                              title="Lihat Foto Treatment"
                            >
                              <ImageIcon className="w-3 h-3 text-[#FFD285]" />
                              <span>Foto</span>
                            </button>
                          )}

                          {/* + Estimasi Button */}
                          {onToggleCart && (
                            <button
                              type="button"
                              onClick={() => onToggleCart(treatmentForCart)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                                inCart
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-gradient-to-r from-[#E53965] to-[#B02848] hover:opacity-95 text-white border-t border-rose-300/30'
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
                                  <span>+ Estimasi</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full-screen Photo Lightbox Modal */}
      <PhotoLightboxModal
        data={activeLightboxData}
        onClose={() => setActiveLightboxData(null)}
        isInCart={activeLightboxData ? isItemInCart(activeLightboxData.treatmentItemForCart?.id.replace('single-', '') || '') : false}
        onToggleCart={onToggleCart}
        isMemberPrice={isMemberPrice}
      />

    </div>
  );
};
