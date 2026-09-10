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
  initialBranches,
  DEFAULT_APPS_SCRIPT_URL 
} from './data/initialBauData';
import { 
  Category, 
  TreatmentItem, 
  SinglePromoItem, 
  SubscriptionItem, 
  SkincareKit, 
  ClinicSettings, 
  CartItem,
  BranchLocation,
  SortOption,
  ActiveView
} from './types';

import { Header } from './components/Header';
import { CosmicSidebar } from './components/CosmicSidebar';
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
import { GalaxyBackground } from './components/GalaxyBackground';
import { Sparkles, AlertCircle, CheckCircle, Maximize, Minimize } from 'lucide-react';
import { exportBauToExcel } from './utils/excelExporter';
import { useFullscreen } from './utils/useFullscreen';

const STORAGE_KEY = 'sozo_bau_web_app_data_v7';

function loadInitialSettings(): ClinicSettings {
  let saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
  if (!saved) {
    saved = localStorage.getItem('sozo_bau_web_app_data_v5_settings');
  }
  if (!saved) return initialClinicSettings;
  try {
    const parsed: ClinicSettings = JSON.parse(saved);
    // Pastikan webAppUrl selalu terisi default
    if (!parsed.webAppUrl || !parsed.webAppUrl.startsWith('http')) {
      parsed.webAppUrl = DEFAULT_APPS_SCRIPT_URL;
    }
    return { ...initialClinicSettings, ...parsed, webAppUrl: parsed.webAppUrl || DEFAULT_APPS_SCRIPT_URL };
  } catch {
    return initialClinicSettings;
  }
}

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

function loadInitialSubscriptions(): SubscriptionItem[] {
  let saved = localStorage.getItem(`${STORAGE_KEY}_subscriptions`);
  if (!saved) return initialSubscriptions;

  try {
    const parsed: SubscriptionItem[] = JSON.parse(saved);
    // If the saved data is the old 9-item default, upgrade to the 16 full treatments from spreadsheet
    if (parsed.length < initialSubscriptions.length) {
      localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(initialSubscriptions));
      return initialSubscriptions;
    }
    return parsed;
  } catch {
    return initialSubscriptions;
  }
}

export default function App() {
  // Fullscreen support for tablets and mobile devices
  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen();

  // Dynamic header height measurement for sticky frozen filter bar
  const [headerHeight, setHeaderHeight] = useState<number>(88);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const el = document.getElementById('app-main-header');
      if (el) {
        setHeaderHeight(el.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    const timer = setTimeout(updateHeaderHeight, 350);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      clearTimeout(timer);
    };
  }, []);

  // State from local storage or initial data
  const [categories, setCategories] = useState<Category[]>(loadInitialCategories);
  const [treatments, setTreatments] = useState<TreatmentItem[]>(loadInitialTreatments);

  const [singlePromos, setSinglePromos] = useState<SinglePromoItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_singlePromos`);
    return saved ? JSON.parse(saved) : initialSinglePromos;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(loadInitialSubscriptions);
  const [skincareKits, setSkincareKits] = useState<SkincareKit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_skincareKits`);
    return saved ? JSON.parse(saved) : initialSkincareKits;
  });

  const [branches, setBranches] = useState<BranchLocation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_branches`);
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [settings, setSettings] = useState<ClinicSettings>(loadInitialSettings);

  // UI States
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [activeView, setActiveView] = useState<ActiveView>('packages');
  const [skinGoalFilter, setSkinGoalFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [isMemberPrice, setIsMemberPrice] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

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
    localStorage.setItem(`${STORAGE_KEY}_subscriptions`, JSON.stringify(subscriptions));
    localStorage.setItem(`${STORAGE_KEY}_skincareKits`, JSON.stringify(skincareKits));
    localStorage.setItem(`${STORAGE_KEY}_branches`, JSON.stringify(branches));
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [categories, treatments, singlePromos, subscriptions, skincareKits, branches, settings]);

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

  // Dynamically extract all skin goals from treatments (includes standard ones + any typed in Google Spreadsheet)
  const availableSkinGoals = useMemo(() => {
    const baseGoals = [
      "Semua Goals",
      "Glowing",
      "Pink Plumpy",
      "Pigmentation",
      "Anti-Aging",
      "Acne Free",
      "Scar Free",
      "Face Slimming",
      "Body Slimming",
      "Hair Grow",
      "Hair Removal"
    ];
    const set = new Set<string>();
    baseGoals.forEach((bg) => set.add(bg));

    treatments.forEach((t) => {
      if (t.skinGoal && t.skinGoal.trim()) {
        const trimmed = t.skinGoal.trim();
        // If legacy data has "Hair", map it to "Hair Grow" in goals list
        const normalizedGoal = trimmed.toLowerCase() === 'hair' ? 'Hair Grow' : trimmed;
        const exists = Array.from(set).some((s) => s.toLowerCase() === normalizedGoal.toLowerCase());
        if (!exists) {
          set.add(normalizedGoal);
        }
      }
    });

    return Array.from(set);
  }, [treatments]);

  // Filtered Treatments
  const filteredTreatments = useMemo(() => {
    const list = treatments.filter((t) => {
      // Category filter
      const matchCat = selectedCategoryId === 'all' || t.categoryId === selectedCategoryId;
      
      // Skin goal filter
      let matchGoal = true;
      if (skinGoalFilter) {
        if (!t.skinGoal) {
          matchGoal = false;
        } else {
          const tGoal = t.skinGoal.toLowerCase().trim();
          const fGoal = skinGoalFilter.toLowerCase().trim();
          if (fGoal === 'hair' || fGoal === 'hair grow') {
            matchGoal = (tGoal.includes('hair') || tGoal.includes('hair grow')) && !tGoal.includes('removal');
          } else if (fGoal === 'hair removal') {
            matchGoal = tGoal.includes('hair removal') || tGoal.includes('removal');
          } else {
            matchGoal = tGoal.includes(fGoal) || fGoal.includes(tGoal);
          }
        }
      }

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        t.name.toLowerCase().includes(q) ||
        (t.skinGoal && t.skinGoal.toLowerCase().includes(q)) ||
        (t.badge && t.badge.toLowerCase().includes(q)) ||
        t.inclusions.some((inc) => inc.toLowerCase().includes(q));

      return matchCat && matchGoal && matchSearch;
    });

    if (sortBy === 'default') {
      return list;
    }

    return [...list].sort((a, b) => {
      const priceA = isMemberPrice ? a.memberPrice : a.nonMemberPrice;
      const priceB = isMemberPrice ? b.memberPrice : b.nonMemberPrice;

      if (sortBy === 'price-asc') {
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        return priceB - priceA;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name, 'id', { sensitivity: 'base' });
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name, 'id', { sensitivity: 'base' });
      }
      if (sortBy === 'discount-desc') {
        const discA = a.originalPrice > priceA ? (1 - priceA / a.originalPrice) : 0;
        const discB = b.originalPrice > priceB ? (1 - priceB / b.originalPrice) : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [treatments, selectedCategoryId, skinGoalFilter, searchQuery, sortBy, isMemberPrice]);

  // Counts matching current search and skinGoalFilter across all 4 views
  const countsByView = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const goal = skinGoalFilter.toLowerCase().trim();

    // 1. Packages count (all matching packages)
    const pkgCount = treatments.filter((t) => {
      let matchGoal = true;
      if (goal) {
        if (!t.skinGoal) {
          matchGoal = false;
        } else {
          const tGoal = t.skinGoal.toLowerCase().trim();
          if (goal === 'hair' || goal === 'hair grow') {
            matchGoal = (tGoal.includes('hair') || tGoal.includes('hair grow')) && !tGoal.includes('removal');
          } else if (goal === 'hair removal') {
            matchGoal = tGoal.includes('hair removal') || tGoal.includes('removal');
          } else {
            matchGoal = tGoal.includes(goal) || goal.includes(tGoal);
          }
        }
      }
      const matchSearch = !q ||
        t.name.toLowerCase().includes(q) ||
        (t.skinGoal && t.skinGoal.toLowerCase().includes(q)) ||
        (t.badge && t.badge.toLowerCase().includes(q)) ||
        t.inclusions.some((inc) => inc.toLowerCase().includes(q));
      return matchGoal && matchSearch;
    }).length;

    // 2. Single promos count
    const singleCount = singlePromos.filter((item) => {
      const matchSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        (item.outletRestricted && item.outletRestricted.toLowerCase().includes(q));

      let matchGoal = true;
      if (goal) {
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = item.group === 'Glow & Rejuve';
        } else if (goal.includes('slimm')) {
          matchGoal = item.group === 'Slimming & Contouring';
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = item.group === 'Acne & Scar';
        } else if (goal.includes('aging')) {
          matchGoal = item.group === 'Anti-Aging';
        } else if (goal === 'hair' || (goal.includes('hair') && !goal.includes('removal'))) {
          matchGoal = item.group === 'Hair Grow';
        } else if (goal === 'hair removal' || goal.includes('removal')) {
          matchGoal = item.name.toLowerCase().includes('hair removal') || item.name.toLowerCase().includes('underarm') || item.name.toLowerCase().includes('ipl');
        } else {
          matchGoal = item.name.toLowerCase().includes(goal) || item.group.toLowerCase().includes(goal);
        }
      }
      return matchSearch && matchGoal;
    }).length;

    // 3. Subscriptions count
    const subCount = subscriptions.filter((sub) => {
      const matchSearch = !q || sub.treatmentName.toLowerCase().includes(q);
      let matchGoal = true;
      if (goal) {
        const tName = sub.treatmentName.toLowerCase();
        if (goal.includes('glow') || goal.includes('pink') || goal.includes('pigment')) {
          matchGoal = tName.includes('glow') || tName.includes('rejuve') || tName.includes('laser') || tName.includes('vitaran') || tName.includes('pink') || tName.includes('peel');
        } else if (goal.includes('slimm')) {
          matchGoal = tName.includes('slimming') || tName.includes('fat') || tName.includes('body') || tName.includes('contour') || tName.includes('hifu');
        } else if (goal.includes('acne') || goal.includes('scar')) {
          matchGoal = tName.includes('acne') || tName.includes('scar') || tName.includes('peel') || tName.includes('subcision');
        } else if (goal.includes('aging')) {
          matchGoal = tName.includes('anti-aging') || tName.includes('botox') || tName.includes('filler') || tName.includes('rejur') || tName.includes('profhilo') || tName.includes('hifu');
        } else if (goal === 'hair' || (goal.includes('hair') && !goal.includes('removal'))) {
          matchGoal = tName.includes('hair') && !tName.includes('removal');
        } else if (goal === 'hair removal' || goal.includes('removal')) {
          matchGoal = tName.includes('removal') || tName.includes('underarm');
        } else {
          matchGoal = tName.includes(goal);
        }
      }
      return matchSearch && matchGoal;
    }).length;

    // 4. Skincare count
    const skinCount = skincareKits.filter((kit) => {
      const matchSearch = !q ||
        kit.name.toLowerCase().includes(q) ||
        (kit.freeGift && kit.freeGift.toLowerCase().includes(q)) ||
        kit.items.some((it) => it.toLowerCase().includes(q));

      let matchGoal = true;
      if (goal) {
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
    }).length;

    return {
      packages: pkgCount,
      singlePromos: singleCount,
      subscriptions: subCount,
      skincare: skinCount,
    };
  }, [treatments, singlePromos, subscriptions, skincareKits, searchQuery, skinGoalFilter]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSkinGoalFilter('');
    setSelectedCategoryId('all');
    setSortBy('default');
    showToast('Filter pencarian telah direset');
  };

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

  const handleDownloadExcel = () => {
    exportBauToExcel(
      settings,
      categories,
      treatments,
      singlePromos,
      subscriptions,
      branches,
      skincareKits,
      'Buku_BAU_SOZO_September_2026.xlsx'
    );
    showToast('File Excel Buku BAU September 2026 berhasil diunduh!');
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
    subscriptions?: SubscriptionItem[];
    branches?: BranchLocation[];
    skincareKits?: SkincareKit[];
    settings: ClinicSettings;
  }) => {
    setCategories(data.categories);
    setTreatments(data.treatments);
    setSinglePromos(data.singlePromos);
    if (data.subscriptions) setSubscriptions(data.subscriptions);
    if (data.branches) setBranches(data.branches);
    if (data.skincareKits) setSkincareKits(data.skincareKits);
    setSettings(data.settings);
    showToast('Semua data spreadsheet berhasil disimpan dan disinkronkan!');
  };

  // Sync refresh simulation
  const handleRefreshData = async () => {
    setIsSyncing(true);
    const remoteUrl = (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || settings.webAppUrl?.trim() || DEFAULT_APPS_SCRIPT_URL;
    if (remoteUrl && remoteUrl.startsWith('http')) {
      const ok = await handleFetchFromRemoteAppsScript(remoteUrl);
      setIsSyncing(false);
      if (ok) return;
    }

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
      const sep = url.includes('?') ? '&' : '?';
      const endpoint = `${url}${sep}action=getData&_t=${Date.now()}`;
      // Note: Do NOT add custom headers like Cache-Control/Pragma because Google Apps Script does not support CORS preflight OPTIONS requests.
      const res = await fetch(endpoint);
      if (!res.ok) return false;
      const data = await res.json();
      if (data && data.treatments && data.categories) {
        setCategories(data.categories);
        setTreatments(data.treatments);
        if (data.singlePromos) setSinglePromos(data.singlePromos);
        if (data.subscriptions && data.subscriptions.length > 0) setSubscriptions(data.subscriptions);
        if (data.skincareKits && data.skincareKits.length > 0) setSkincareKits(data.skincareKits);
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
            
            // Subscription banner fields
            subscriptionPageBadge: data.config.SUBSCRIPTION_PAGE_BADGE || prev.subscriptionPageBadge,
            subscriptionTagBadge: data.config.SUBSCRIPTION_TAG_BADGE || prev.subscriptionTagBadge,
            subscriptionTitle: data.config.SUBSCRIPTION_TITLE || prev.subscriptionTitle,
            subscriptionSubtitle: data.config.SUBSCRIPTION_SUBTITLE || prev.subscriptionSubtitle,
            subscriptionTermsTitle: data.config.SUBSCRIPTION_TERMS_TITLE || prev.subscriptionTermsTitle,
            subscriptionTermsList: data.config.SUBSCRIPTION_TERMS_LIST || prev.subscriptionTermsList,

            // Single treatment banner fields
            singlePromoPageBadge: data.config.SINGLE_PROMO_PAGE_BADGE || prev.singlePromoPageBadge,
            singlePromoTagBadge: data.config.SINGLE_PROMO_TAG_BADGE || prev.singlePromoTagBadge,
            singlePromoTitle: data.config.SINGLE_PROMO_TITLE || prev.singlePromoTitle,
            singlePromoSubtitle: data.config.SINGLE_PROMO_SUBTITLE || prev.singlePromoSubtitle,

            // Skincare kits banner fields
            skincarePageBadge: data.config.SKINCARE_PAGE_BADGE || prev.skincarePageBadge,
            skincareTagBadge: data.config.SKINCARE_TAG_BADGE || prev.skincareTagBadge,
            skincareTitle: data.config.SKINCARE_TITLE || prev.skincareTitle,
            skincareSubtitle: data.config.SKINCARE_SUBTITLE || prev.skincareSubtitle,

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
    const remoteUrl = (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || settings.webAppUrl?.trim() || DEFAULT_APPS_SCRIPT_URL;
    if (remoteUrl && remoteUrl.startsWith('http')) {
      handleFetchFromRemoteAppsScript(remoteUrl);
    }
  }, []);

  // Check if app is locked by password
  const isAppLocked = Boolean(settings.accessPassword && settings.accessPassword.trim() !== '') && !isUnlocked;

  // If locked, render ONLY the lock screen so the menu/catalog behind it is NEVER exposed
  if (isAppLocked) {
    return (
      <div className="min-h-screen bg-[#140207] text-white flex flex-col justify-center items-center relative overflow-hidden selection:bg-[#E44176] selection:text-white">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#25050F]/95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium border border-rose-300/30 backdrop-blur-xl animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <PasswordGateModal
          correctPassword={settings.accessPassword}
          clinicName={settings.clinicName}
          csWhatsappNumber={settings.csWhatsappNumber}
          webAppUrl={settings.webAppUrl || (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) || DEFAULT_APPS_SCRIPT_URL}
          onRefreshFromAppsScript={async () => {
            const url = (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined)?.trim() || settings.webAppUrl?.trim() || DEFAULT_APPS_SCRIPT_URL;
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
          onDownloadExcel={handleDownloadExcel}
          onUnlock={() => {
            sessionStorage.setItem('sozo_app_unlocked', 'true');
            setIsUnlocked(true);
            showToast('Akses Buku Menu berhasil dibuka!');
          }}
        />

        {/* Floating Fullscreen Button on Gate Screen */}
        {isFullscreenSupported && (
          <button
            onClick={() => {
              toggleFullscreen();
              showToast(isFullscreen ? 'Keluar dari layar penuh' : 'Mode layar penuh aktif');
            }}
            title={isFullscreen ? "Keluar Layar Penuh" : "Buka Layar Penuh (Hilangkan Toolbar Chrome)"}
            className={`fixed bottom-6 left-6 z-50 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold transition-all border cursor-pointer ${
              isFullscreen
                ? 'bg-[#25050F]/90 hover:bg-[#340715] text-rose-200 border-rose-400/40'
                : 'bg-gradient-to-r from-[#8C2941] to-[#5C1626] text-[#FFF3D6] border-[#E6C994]/50 hover:border-[#E6C994] shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
            }`}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-[#FFD285]" /> : <Maximize className="w-3.5 h-3.5 text-[#FFD285]" />}
            <span>{isFullscreen ? 'Keluar Fullscreen' : 'Full Screen'}</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <GalaxyBackground className="min-h-screen text-rose-100 flex flex-col antialiased relative selection:bg-[#E53965] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e030a]/95 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium border border-rose-500/40 backdrop-blur-2xl animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Quick Full Screen Toggle Button (Optimized for Android / Tablet kiosk usage) */}
      {isFullscreenSupported && (
        <button
          onClick={() => {
            toggleFullscreen();
            showToast(isFullscreen ? 'Keluar dari mode layar penuh' : 'Mode layar penuh aktif (Toolbar Chrome disembunyikan)');
          }}
          title={isFullscreen ? 'Keluar dari Layar Penuh (ESC)' : 'Mode Layar Penuh (Hilangkan Toolbar Chrome)'}
          className={`fixed bottom-6 left-6 z-40 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold transition-all border cursor-pointer group select-none ${
            isFullscreen
              ? 'bg-[#1C030B]/90 hover:bg-[#280510] text-rose-200 hover:text-white border-rose-400/40 shadow-[0_8px_25px_rgba(0,0,0,0.7)]'
              : 'bg-gradient-to-r from-[#8C2941] via-[#6B1D2F] to-[#450916] text-[#FFF3D6] border-[#E6C994]/50 hover:border-[#E6C994] shadow-[0_8px_30px_rgba(140,41,65,0.45)] hover:scale-105 active:scale-95'
          }`}
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-4 h-4 text-[#FFD285] transition-transform group-hover:scale-110" />
              <span>Keluar Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize className="w-4 h-4 text-[#FFD285] transition-transform group-hover:scale-110" />
              <span>Full Screen</span>
            </>
          )}
        </button>
      )}

      {/* Main Brand Header with mobile menu button support */}
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
        onDownloadExcel={handleDownloadExcel}
        isSyncing={isSyncing}
        onLockApp={() => {
          sessionStorage.removeItem('sozo_app_unlocked');
          setIsUnlocked(false);
          showToast('Buku Menu telah dikunci.');
        }}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
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

      {/* Main Content Layout with Cosmic Sidebar on large screens */}
      <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
          
          {/* Cosmic Sidebar - Persistent navigation matching reference mockup */}
          <CosmicSidebar
            activeView={activeView}
            onSelectView={(v) => {
              setActiveView(v);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            countsByView={countsByView}
            onOpenBranches={() => setIsBranchesOpen(true)}
            onLockApp={settings.accessPassword ? () => {
              sessionStorage.removeItem('sozo_app_unlocked');
              setIsUnlocked(false);
              showToast('Buku Menu telah dikunci.');
            } : undefined}
            settings={settings}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />

          {/* Main Interactive Content */}
          <main className="flex-1 w-full min-w-0 space-y-6">
          
            {/* Category & Section Navigation + Sort By Feature */}
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
              countsByView={countsByView}
              searchQuery={searchQuery}
              onClearFilter={handleClearAllFilters}
              availableSkinGoals={availableSkinGoals}
              sortBy={sortBy}
              onSortChange={setSortBy}
              stickyTopOffset={headerHeight}
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
                  <div className="py-20 text-center bg-[#1a030a]/95 rounded-3xl border border-rose-500/25 p-8 shadow-xl">
                    <Sparkles className="w-10 h-10 text-rose-400/40 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">
                      Tidak ditemukan treatment yang sesuai kriteria pencarian
                    </h3>
                    <p className="text-xs text-rose-200/70 mt-1 max-w-sm mx-auto">
                      Coba ganti kata kunci pencarian atau pilih kategori lain untuk melihat daftar treatment lainnya.
                    </p>
                    <button
                      onClick={handleClearAllFilters}
                      className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E53965] to-[#B02848] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-md"
                    >
                      Reset Filter & Tampilkan Semua
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                searchQuery={searchQuery}
                skinGoalFilter={skinGoalFilter}
                cartItems={cartItems}
                onToggleCart={handleToggleCart}
                onClearFilter={handleClearAllFilters}
              />
            )}

            {/* VIEW 3: SUBSCRIPTIONS */}
            {activeView === 'subscriptions' && (
              <SubscriptionsSection
                subscriptions={subscriptions}
                isMemberPrice={isMemberPrice}
                settings={settings}
                searchQuery={searchQuery}
                skinGoalFilter={skinGoalFilter}
                cartItems={cartItems}
                onToggleCart={handleToggleCart}
                onClearFilter={handleClearAllFilters}
              />
            )}

            {/* VIEW 4: SKINCARE KITS */}
            {activeView === 'skincare' && (
              <SkincareKitsSection
                kits={skincareKits}
                settings={settings}
                searchQuery={searchQuery}
                skinGoalFilter={skinGoalFilter}
                cartItems={cartItems}
                onToggleCart={handleToggleCart}
                onClearFilter={handleClearAllFilters}
              />
            )}

          </main>
        </div>
      </div>

      {/* Luxury Cosmic Footer */}
      <footer className="bg-[#120106]/90 backdrop-blur-xl text-rose-200/70 border-t border-rose-500/20 py-6 px-4 sm:px-6 mt-12 relative z-10 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-white tracking-wide">SOZO SKIN CLINIC</span>
            <span className="text-[10px] bg-gradient-to-r from-[#FFD285] to-[#E5A84D] text-stone-950 px-2.5 py-0.5 rounded-full font-extrabold shadow-sm">
              BUKU BAU 2026
            </span>
          </div>
          <div className="text-rose-300/50 text-xs">
            © {new Date().getFullYear()} SOZO Skin Clinic. Seluruh data disinkronkan otomatis via Google Spreadsheet.
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
        subscriptions={subscriptions}
        branches={branches}
        skincareKits={skincareKits}
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

    </GalaxyBackground>
  );
}
