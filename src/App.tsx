/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  initialCategories, 
  initialTreatments, 
  initialSinglePromos, 
  initialSubscriptions, 
  initialSkincareKits, 
  initialClinicSettings,
  initialBranches 
} from './data/initialBauData';
import { 
  Category, 
  TreatmentItem, 
  SinglePromoItem, 
  SubscriptionItem, 
  SkincareKit, 
  ClinicSettings, 
  CartItem,
  BranchLocation
} from './types';

import { Header } from './components/Header';
import { PromoHero } from './components/PromoHero';
import { CategoryNav } from './components/CategoryNav';
import { CategoryBanner } from './components/CategoryBanner';
import { TreatmentCard } from './components/TreatmentCard';
import { TreatmentCalculatorModal } from './components/TreatmentCalculatorModal';
import { SinglePromosSection } from './components/SinglePromosSection';
import { SubscriptionsSection } from './components/SubscriptionsSection';
import { SkincareKitsSection } from './components/SkincareKitsSection';
import { BranchesModal } from './components/BranchesModal';
import { SpreadsheetEditorModal } from './components/SpreadsheetEditorModal';
import { AppsScriptDeployModal } from './components/AppsScriptDeployModal';
import { PasswordGateModal } from './components/PasswordGateModal';
import { Sparkles, FileSpreadsheet, Code2, AlertCircle, CheckCircle } from 'lucide-react';

const STORAGE_KEY = 'sozo_bau_web_app_data_v5';

// Helper to ensure Treatment Recommendation and newly added items are always loaded
function loadInitialCategories(): Category[] {
  let saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
  if (!saved) {
    saved = localStorage.getItem('sozo_bau_web_app_data_v1_categories') ||
            localStorage.getItem('sozo_bau_web_app_data_v2_categories') ||
            localStorage.getItem('sozo_bau_web_app_data_v3_categories');
  }

  if (!saved) return initialCategories;

  try {
    const parsed: Category[] = JSON.parse(saved);
    // Guarantee "treatment-recommendation" is present and placed first
    const hasRec = parsed.some((c) => c.id === 'treatment-recommendation');
    const defaultRec = initialCategories.find((c) => c.id === 'treatment-recommendation')!;

    if (!hasRec) {
      return [defaultRec, ...parsed];
    } else {
      const existing = parsed.find((c) => c.id === 'treatment-recommendation') || defaultRec;
      const rest = parsed.filter((c) => c.id !== 'treatment-recommendation');
      return [existing, ...rest];
    }
  } catch {
    return initialCategories;
  }
}

function loadInitialTreatments(): TreatmentItem[] {
  let saved = localStorage.getItem(`${STORAGE_KEY}_treatments`);
  if (!saved) {
    saved = localStorage.getItem('sozo_bau_web_app_data_v1_treatments') ||
            localStorage.getItem('sozo_bau_web_app_data_v2_treatments') ||
            localStorage.getItem('sozo_bau_web_app_data_v3_treatments');
  }

  if (!saved) return initialTreatments;

  try {
    const parsed: TreatmentItem[] = JSON.parse(saved);
    const recTreatments = initialTreatments.filter((t) => t.categoryId === 'treatment-recommendation');
    const missingRecs = recTreatments.filter((rt) => !parsed.some((t) => t.id === rt.id));

    if (missingRecs.length > 0) {
      return [...missingRecs, ...parsed];
    }
    return parsed;
  } catch {
    return initialTreatments;
  }
}

export default function App() {
  // State from local storage or initial data
  const [categories, setCategories] = useState<Category[]>(loadInitialCategories);
  const [treatments, setTreatments] = useState<TreatmentItem[]>(loadInitialTreatments);

  const [singlePromos, setSinglePromos] = useState<SinglePromoItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_singlePromos`);
    return saved ? JSON.parse(saved) : initialSinglePromos;
  });

  const [subscriptions] = useState<SubscriptionItem[]>(initialSubscriptions);
  const [skincareKits] = useState<SkincareKit[]>(initialSkincareKits);

  const [branches, setBranches] = useState<BranchLocation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_branches`);
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialClinicSettings;
  });

  // UI States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [activeView, setActiveView] = useState<'packages' | 'single-promos' | 'subscriptions' | 'skincare'>('packages');
  const [skinGoalFilter, setSkinGoalFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMemberPrice, setIsMemberPrice] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart / Estimator State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSpreadsheetEditorOpen, setIsSpreadsheetEditorOpen] = useState(false);
  const [isAppsScriptGuideOpen, setIsAppsScriptGuideOpen] = useState(false);
  const [isBranchesOpen, setIsBranchesOpen] = useState(false);

  // Lock / Password State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('sozo_app_unlocked') === 'true';
  });

  // Instant check on mount to ensure Treatment Recommendation is active in state
  useEffect(() => {
    setCategories((prev) => {
      if (!prev.some((c) => c.id === 'treatment-recommendation')) {
        const defaultRec = initialCategories.find((c) => c.id === 'treatment-recommendation')!;
        return [defaultRec, ...prev];
      }
      return prev;
    });

    setTreatments((prev) => {
      const recTreatments = initialTreatments.filter((t) => t.categoryId === 'treatment-recommendation');
      const missing = recTreatments.filter((rt) => !prev.some((t) => t.id === rt.id));
      if (missing.length > 0) {
        return [...missing, ...prev];
      }
      return prev;
    });
  }, []);

  // Auto save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    localStorage.setItem(`${STORAGE_KEY}_treatments`, JSON.stringify(treatments));
    localStorage.setItem(`${STORAGE_KEY}_singlePromos`, JSON.stringify(singlePromos));
    localStorage.setItem(`${STORAGE_KEY}_branches`, JSON.stringify(branches));
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [categories, treatments, singlePromos, branches, settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Treatment counts per category
  const treatmentCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    treatments.forEach((t) => {
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1;
    });
    return counts;
  }, [treatments]);

  // Selected Category Object
  const selectedCategory = useMemo(() => {
    if (selectedCategoryId === 'all') return null;
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Filtered Treatments
  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      // Category filter
      const matchCat = selectedCategoryId === 'all' || t.categoryId === selectedCategoryId;
      
      // Skin goal filter
      const matchGoal = !skinGoalFilter || (t.skinGoal && t.skinGoal.toLowerCase().includes(skinGoalFilter.toLowerCase()));

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        t.name.toLowerCase().includes(q) ||
        (t.skinGoal && t.skinGoal.toLowerCase().includes(q)) ||
        (t.badge && t.badge.toLowerCase().includes(q)) ||
        t.inclusions.some((inc) => inc.toLowerCase().includes(q));

      return matchCat && matchGoal && matchSearch;
    });
  }, [treatments, selectedCategoryId, skinGoalFilter, searchQuery]);

  // Cart operations
  const handleToggleCart = (item: TreatmentItem) => {
    setCartItems((prev) => {
      const exists = prev.find((ci) => ci.treatment.id === item.id);
      if (exists) {
        showToast(`Dihapus dari kalkulator estimasi: ${item.name}`);
        return prev.filter((ci) => ci.treatment.id !== item.id);
      } else {
        showToast(`Ditambahkan ke kalkulator: ${item.name}`);
        return [...prev, { treatment: item, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.treatment.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.treatment.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Category Banner photo/PDF link update (In-place)
  const handleUpdateCategoryPhotoUrl = (categoryId: string, newUrl: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, pdfOrPhotoUrl: newUrl } : cat))
    );
    showToast('Tautan foto / PDF kategori berhasil diperbarui!');
  };

  // Data save from in-app spreadsheet manager
  const handleSaveSpreadsheetData = (data: {
    categories: Category[];
    treatments: TreatmentItem[];
    singlePromos: SinglePromoItem[];
    settings: ClinicSettings;
  }) => {
    setCategories(data.categories);
    setTreatments(data.treatments);
    setSinglePromos(data.singlePromos);
    setSettings(data.settings);
    showToast('Semua data spreadsheet berhasil disimpan dan disinkronkan!');
  };

  // Sync refresh simulation
  const handleRefreshData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setCategories((prev) => {
        if (!prev.some((c) => c.id === 'treatment-recommendation')) {
          const rec = initialCategories.find((c) => c.id === 'treatment-recommendation');
          return rec ? [rec, ...prev] : prev;
        }
        return prev;
      });
      setTreatments((prev) => {
        const recTreatments = initialTreatments.filter((t) => t.categoryId === 'treatment-recommendation');
        const missing = recTreatments.filter((rt) => !prev.some((t) => t.id === rt.id));
        return missing.length > 0 ? [...missing, ...prev] : prev;
      });
      setSettings((prev) => ({
        ...prev,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }));
      showToast('Data berhasil disinkronkan!');
    }, 500);
  };

  // Fetch from remote Apps Script Web App URL if user deployed it
  const handleFetchFromRemoteAppsScript = async (url: string): Promise<boolean> => {
    try {
      const endpoint = url.includes('?') ? `${url}&action=getData` : `${url}?action=getData`;
      const res = await fetch(endpoint);
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.treatments && data.categories) {
        setCategories(data.categories);
        setTreatments(data.treatments);
        if (data.singlePromos) setSinglePromos(data.singlePromos);
        if (data.branches && data.branches.length > 0) setBranches(data.branches);
        if (data.config) {
          setSettings((prev) => ({
            ...prev,
            clinicName: data.config.CLINIC_NAME || prev.clinicName,
            promoTitle: data.config.PROMO_TITLE || prev.promoTitle,
            promoSubtitle: data.config.PROMO_SUBTITLE || prev.promoSubtitle,
            promoBadge: data.config.PROMO_BADGE || prev.promoBadge,
            paymentPartners: data.config.PAYMENT_PARTNERS || prev.paymentPartners,
            tagline: data.config.TAGLINE || prev.tagline,
            periodText: data.config.PERIOD_TEXT || prev.periodText,
            bookingDp: data.config.BOOKING_DP ? Number(data.config.BOOKING_DP) : prev.bookingDp,
            serviceChargePercent: data.config.SERVICE_CHARGE_PCT ? Number(data.config.SERVICE_CHARGE_PCT) : prev.serviceChargePercent,
            serviceChargeMax: data.config.SERVICE_CHARGE_MAX ? Number(data.config.SERVICE_CHARGE_MAX) : prev.serviceChargeMax,
            packageValidityMonths: data.config.VALIDITY_MONTHS ? Number(data.config.VALIDITY_MONTHS) : prev.packageValidityMonths,
            csWhatsappNumber: data.config.WHATSAPP_CS || prev.csWhatsappNumber,
            accessPassword: data.config.ACCESS_PASSWORD !== undefined ? String(data.config.ACCESS_PASSWORD) : prev.accessPassword,
            lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          }));
        }
        showToast('Sinkronisasi live dari Google Apps Script Web App berhasil!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Remote fetch error:', err);
      return false;
    }
  };

  // Auto-fetch on mount if remote Apps Script URL is set (e.g. from Vercel env or saved settings)
  useEffect(() => {
    const remoteUrl = (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || settings.webAppUrl?.trim();
    if (remoteUrl && remoteUrl.startsWith('http')) {
      handleFetchFromRemoteAppsScript(remoteUrl);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-800 flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900/95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-white/10 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Brand Header */}
      <Header
        settings={settings}
        cartItems={cartItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSpreadsheetEditor={() => setIsSpreadsheetEditorOpen(true)}
        onOpenAppsScriptGuide={() => setIsAppsScriptGuideOpen(true)}
        onOpenBranches={() => setIsBranchesOpen(true)}
        onRefreshData={handleRefreshData}
        isSyncing={isSyncing}
        onLockApp={() => {
          sessionStorage.removeItem('sozo_app_unlocked');
          setIsUnlocked(false);
          showToast('Buku Menu telah dikunci.');
        }}
      />

      {/* Promotional Hero Banner */}
      <PromoHero
        settings={settings}
        isMemberPrice={isMemberPrice}
        onTogglePriceMode={() => setIsMemberPrice(!isMemberPrice)}
        onSetPriceMode={setIsMemberPrice}
        totalTreatments={treatments.length}
        totalPromos={treatments.filter((t) => t.isNewPromo).length}
      />

      {/* Main Interactive Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        
        {/* Category & Section Navigation */}
        <CategoryNav
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => {
            setSelectedCategoryId(id);
            if (activeView !== 'packages') setActiveView('packages');
          }}
          activeView={activeView}
          onChangeView={setActiveView}
          skinGoalFilter={skinGoalFilter}
          onSelectSkinGoal={setSkinGoalFilter}
          treatmentCountsByCategory={treatmentCountsByCategory}
        />

        {/* VIEW 1: TREATMENT PACKAGES BY CATEGORY */}
        {activeView === 'packages' && (
          <div>
            {/* Category Banner with Photo or PDF Link */}
            {selectedCategory && (
              <CategoryBanner
                category={selectedCategory}
                onUpdatePhotoUrl={handleUpdateCategoryPhotoUrl}
              />
            )}

            {/* Treatment Cards Grid */}
            {filteredTreatments.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
                <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">
                  Tidak ditemukan treatment yang sesuai kriteria pencarian
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Coba ganti kata kunci pencarian atau pilih kategori lain untuk melihat daftar treatment lainnya.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSkinGoalFilter('');
                    setSelectedCategoryId('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#6B1D2F] text-white text-xs font-bold hover:bg-[#521523] transition cursor-pointer"
                >
                  Reset Filter & Tampilkan Semua
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTreatments.map((treatment) => {
                  const isInCart = cartItems.some((ci) => ci.treatment.id === treatment.id);
                  return (
                    <TreatmentCard
                      key={treatment.id}
                      treatment={treatment}
                      isMemberPrice={isMemberPrice}
                      isInCart={isInCart}
                      onToggleCart={handleToggleCart}
                      settings={settings}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SINGLE TREATMENT PROMOS */}
        {activeView === 'single-promos' && (
          <SinglePromosSection
            singlePromos={singlePromos}
            isMemberPrice={isMemberPrice}
            settings={settings}
          />
        )}

        {/* VIEW 3: SUBSCRIPTIONS */}
        {activeView === 'subscriptions' && (
          <SubscriptionsSection
            subscriptions={subscriptions}
            isMemberPrice={isMemberPrice}
            settings={settings}
          />
        )}

        {/* VIEW 4: SKINCARE KITS */}
        {activeView === 'skincare' && (
          <SkincareKitsSection
            kits={skincareKits}
            settings={settings}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#48121E] text-rose-100 border-t border-rose-950 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif font-bold text-base text-white">SOZO SKIN CLINIC</span>
              <span className="text-[10px] bg-[#C9A86A] text-stone-900 px-1.5 py-0.2 rounded font-bold">
                BUKU BAU 2026
              </span>
            </div>
            <p className="text-rose-200/80 max-w-lg leading-relaxed">
              Platform interaktif Buku BAU berbasis Google Spreadsheet & Google Apps Script. 
              Semua harga, treatment, promo baru, dan link foto/PDF tersinkronisasi otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSpreadsheetEditorOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#E8BF87]" />
              <span>Kelola Data Spreadsheet</span>
            </button>
            <button
              onClick={() => setIsAppsScriptGuideOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#C9A86A] hover:bg-[#b59254] text-stone-900 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Deploy Google Apps Script</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Treatment Estimator & Booking Modal */}
      <TreatmentCalculatorModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        settings={settings}
      />

      {/* 2. In-App Spreadsheet Editor & Live Sync */}
      <SpreadsheetEditorModal
        isOpen={isSpreadsheetEditorOpen}
        onClose={() => setIsSpreadsheetEditorOpen(false)}
        categories={categories}
        treatments={treatments}
        singlePromos={singlePromos}
        settings={settings}
        onSaveData={handleSaveSpreadsheetData}
        onFetchFromRemoteAppsScript={handleFetchFromRemoteAppsScript}
      />

      {/* 3. Google Apps Script Code & Deployment Walkthrough */}
      <AppsScriptDeployModal
        isOpen={isAppsScriptGuideOpen}
        onClose={() => setIsAppsScriptGuideOpen(false)}
      />

      {/* 4. Branches & Outlets Modal */}
      <BranchesModal
        isOpen={isBranchesOpen}
        onClose={() => setIsBranchesOpen(false)}
        branches={branches}
      />

      {/* 5. Password Lock Gate (Full screen lock if password is set and not unlocked) */}
      {Boolean(settings.accessPassword && settings.accessPassword.trim() !== '') && !isUnlocked && (
        <PasswordGateModal
          correctPassword={settings.accessPassword}
          clinicName={settings.clinicName}
          csWhatsappNumber={settings.csWhatsappNumber}
          webAppUrl={settings.webAppUrl || (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) || ''}
          onRefreshFromAppsScript={async () => {
            const url = (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || settings.webAppUrl?.trim();
            if (url && url.startsWith('http')) {
              return await handleFetchFromRemoteAppsScript(url);
            }
            return false;
          }}
          onConnectAppsScriptUrl={async (newUrl: string) => {
            setSettings((prev) => ({ ...prev, webAppUrl: newUrl }));
            const success = await handleFetchFromRemoteAppsScript(newUrl);
            if (success) {
              setSettings((prev) => ({ ...prev, webAppUrl: newUrl }));
            }
            return success;
          }}
          onUnlock={() => {
            sessionStorage.setItem('sozo_app_unlocked', 'true');
            setIsUnlocked(true);
            showToast('Akses Buku Menu berhasil dibuka!');
          }}
        />
      )}

    </div>
  );
}
