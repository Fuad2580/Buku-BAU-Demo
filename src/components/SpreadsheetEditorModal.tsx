import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Save, 
  Trash2, 
  FileSpreadsheet, 
  Layers, 
  Tag, 
  Settings, 
  RefreshCw, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  RotateCcw,
  Download
} from 'lucide-react';
import { Category, TreatmentItem, SinglePromoItem, ClinicSettings, SubscriptionItem, SkincareKit, BranchLocation } from '../types';
import { 
  initialCategories, 
  initialTreatments, 
  initialSinglePromos, 
  initialClinicSettings,
  initialSubscriptions,
  initialBranches,
  initialSkincareKits
} from '../data/initialBauData';
import { exportBauToExcel } from '../utils/excelExporter';

interface SpreadsheetEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  treatments: TreatmentItem[];
  singlePromos: SinglePromoItem[];
  settings: ClinicSettings;
  subscriptions?: SubscriptionItem[];
  branches?: BranchLocation[];
  skincareKits?: SkincareKit[];
  onSaveData: (data: {
    categories: Category[];
    treatments: TreatmentItem[];
    singlePromos: SinglePromoItem[];
    settings: ClinicSettings;
  }) => void;
  onFetchFromRemoteAppsScript: (url: string) => Promise<boolean>;
}

export const SpreadsheetEditorModal: React.FC<SpreadsheetEditorModalProps> = ({
  isOpen,
  onClose,
  categories: initialCategories,
  treatments: initialTreatments,
  singlePromos: initialSinglePromos,
  settings: initialSettings,
  subscriptions,
  branches,
  skincareKits,
  onSaveData,
  onFetchFromRemoteAppsScript,
}) => {
  const [activeTab, setActiveTab] = useState<'treatments' | 'categories' | 'single' | 'settings' | 'connect' | 'excel'>('treatments');
  
  // Local state for editing
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [treatments, setTreatments] = useState<TreatmentItem[]>(initialTreatments);
  const [singlePromos, setSinglePromos] = useState<SinglePromoItem[]>(initialSinglePromos);
  const [settings, setSettings] = useState<ClinicSettings>(initialSettings);

  const handleDownloadExcel = () => {
    exportBauToExcel(
      settings,
      categories,
      treatments,
      singlePromos,
      subscriptions || initialSubscriptions,
      branches || initialBranches,
      skincareKits || initialSkincareKits,
      'Buku_BAU_SOZO_September_2026.xlsx'
    );
  };
  
  // Remote Web App URL input
  const [remoteUrl, setRemoteUrl] = useState(initialSettings.webAppUrl || '');
  const [remoteStatus, setRemoteStatus] = useState<string>('');
  const [isFetchingRemote, setIsFetchingRemote] = useState(false);

  // New treatment form state
  const [isAddingTreatment, setIsAddingTreatment] = useState(false);
  const [newTreatment, setNewTreatment] = useState<Partial<TreatmentItem>>({
    name: '',
    categoryId: 'glowing-skin',
    skinGoal: 'Glowing',
    inclusions: ['1x Treatment Spesial'],
    originalPrice: 1000,
    nonMemberPrice: 599,
    memberPrice: 499,
    badge: 'Promo Baru',
    isNewPromo: true,
    outletNotes: '',
  });
  const [newInclusionText, setNewInclusionText] = useState('');

  if (!isOpen) return null;

  const handleApplyChanges = () => {
    onSaveData({
      categories,
      treatments,
      singlePromos,
      settings: {
        ...settings,
        webAppUrl: remoteUrl,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    });
    onClose();
  };

  const handleAddTreatment = () => {
    if (!newTreatment.name) return;
    const item: TreatmentItem = {
      id: `treat-${Date.now()}`,
      categoryId: newTreatment.categoryId || 'glowing-skin',
      name: newTreatment.name || 'Treatment Baru',
      skinGoal: newTreatment.skinGoal || 'Glowing',
      inclusions: newInclusionText ? newInclusionText.split(',').map(s => s.trim()).filter(Boolean) : ['1x Treatment'],
      originalPrice: Number(newTreatment.originalPrice) || 0,
      nonMemberPrice: Number(newTreatment.nonMemberPrice) || 0,
      memberPrice: Number(newTreatment.memberPrice) || 0,
      badge: newTreatment.badge || '',
      isNewPromo: Boolean(newTreatment.isNewPromo),
      outletNotes: newTreatment.outletNotes || '',
      photoUrl: newTreatment.photoUrl || '',
    };

    setTreatments([item, ...treatments]);
    setIsAddingTreatment(false);
    setNewTreatment({
      name: '',
      categoryId: 'glowing-skin',
      skinGoal: 'Glowing',
      inclusions: [],
      originalPrice: 1000,
      nonMemberPrice: 599,
      memberPrice: 499,
      badge: 'Promo Baru',
      isNewPromo: true,
      outletNotes: '',
    });
    setNewInclusionText('');
  };

  const handleDeleteTreatment = (id: string) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  const handleUpdateTreatmentCell = (id: string, field: keyof TreatmentItem, value: any) => {
    setTreatments(treatments.map(t => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleUpdateCategoryCell = (id: string, field: keyof Category, value: any) => {
    setCategories(categories.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const handleTestRemoteSync = async () => {
    if (!remoteUrl) {
      setRemoteStatus('Silakan masukkan Web App URL Google Apps Script Anda.');
      return;
    }
    setIsFetchingRemote(true);
    setRemoteStatus('Menghubungi endpoint Google Apps Script...');
    try {
      const ok = await onFetchFromRemoteAppsScript(remoteUrl);
      if (ok) {
        setRemoteStatus('✅ Berhasil terhubung dan data disinkronkan dari Spreadsheet langsung!');
      } else {
        setRemoteStatus('❌ Gagal membaca data dari URL. Pastikan deployment diatur ke "Who has access: Anyone".');
      }
    } catch (e: any) {
      setRemoteStatus(`❌ Error: ${e.message}`);
    } finally {
      setIsFetchingRemote(false);
    }
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan semua data ke default asli Buku BAU 2026 (termasuk Treatment Recommendation)?')) {
      setCategories(initialCategories);
      setTreatments(initialTreatments);
      setSinglePromos(initialSinglePromos);
      setSettings(initialClinicSettings);
      alert('Data berhasil dikembalikan ke default. Silakan klik "Terapkan Perubahan" untuk menyimpan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-[#6B1D2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[#E8BF87]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Spreadsheet Database Manager (Buku BAU)
              </h3>
              <p className="text-xs text-rose-200">
                Edit seluruh konten, harga, rincian treatment, link PDF/foto & promo secara langsung
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer border border-emerald-400/40"
              title="Unduh file Excel (.xlsx) dengan 7 sheet lengkap untuk Google Sheets"
            >
              <Download className="w-3.5 h-3.5 text-emerald-100" />
              <span className="hidden sm:inline">Download Excel (.xlsx)</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-3 bg-stone-100 border-b border-stone-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('excel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'excel' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 border border-emerald-300/60'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>📥 Download & Panduan Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => setActiveTab('treatments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'treatments' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sheet: Daftar Treatment ({treatments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'categories' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Sheet: Kategori & Link PDF/Foto ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'single' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Sheet: Promo Single ({singlePromos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sheet: Pengaturan Klinik</span>
          </button>

          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'connect' ? 'bg-[#C9A86A] text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Koneksi URL Apps Script</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          
          {/* TAB 1: DAFTAR TREATMENT */}
          {activeTab === 'treatments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-800 text-sm">Tabel: Daftar_Treatment</h4>
                  <p className="text-xs text-stone-500">
                    Ketik langsung di sel kolom tabel untuk mengubah harga, isi rangkaian, atau nama treatment.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddingTreatment(!isAddingTreatment)}
                  className="px-3 py-1.5 rounded-xl bg-[#6B1D2F] text-white text-xs font-bold hover:bg-[#521523] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Treatment / Promo Baru</span>
                </button>
              </div>

              {/* Add Treatment Drawer/Form */}
              {isAddingTreatment && (
                <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6B1D2F] uppercase tracking-wide">
                      Formulir Tambah Treatment Baru
                    </span>
                    <button
                      onClick={() => setIsAddingTreatment(false)}
                      className="text-xs text-stone-400 hover:text-stone-700"
                    >
                      ✕ Batal
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Nama Treatment</label>
                      <input
                        type="text"
                        value={newTreatment.name}
                        onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
                        placeholder="Contoh: Laser Glass Skin Glow"
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Kategori</label>
                      <select
                        value={newTreatment.categoryId}
                        onChange={(e) => setNewTreatment({ ...newTreatment, categoryId: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Skin Goal</label>
                      <input
                        type="text"
                        value={newTreatment.skinGoal}
                        onChange={(e) => setNewTreatment({ ...newTreatment, skinGoal: e.target.value })}
                        placeholder="Contoh: Glowing, Acne, dll"
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Harga Normal (RB)</label>
                      <input
                        type="number"
                        value={newTreatment.originalPrice}
                        onChange={(e) => setNewTreatment({ ...newTreatment, originalPrice: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Promo Non-Member (RB)</label>
                      <input
                        type="number"
                        value={newTreatment.nonMemberPrice}
                        onChange={(e) => setNewTreatment({ ...newTreatment, nonMemberPrice: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Promo Member (RB)</label>
                      <input
                        type="number"
                        value={newTreatment.memberPrice}
                        onChange={(e) => setNewTreatment({ ...newTreatment, memberPrice: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">Badge Promo</label>
                      <input
                        type="text"
                        value={newTreatment.badge}
                        onChange={(e) => setNewTreatment({ ...newTreatment, badge: e.target.value })}
                        placeholder="Contoh: Promo Merdeka, Hemat 50%"
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Rincian Isi Treatment (Pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={newInclusionText}
                        onChange={(e) => setNewInclusionText(e.target.value)}
                        placeholder="Contoh: 1x Rejuve Laser, 1x Glow Peel, 1x Collagen Mask"
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block mb-1">
                        Link URL Foto Treatment (Opsional)
                      </label>
                      <input
                        type="text"
                        value={newTreatment.photoUrl || ''}
                        onChange={(e) => setNewTreatment({ ...newTreatment, photoUrl: e.target.value })}
                        placeholder="https://... link foto/gambar treatment"
                        className="w-full text-xs p-2 rounded-lg bg-white border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleAddTreatment}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition cursor-pointer"
                    >
                      Tambahkan ke Database
                    </button>
                  </div>
                </div>
              )}

              {/* Table of Treatments */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#6B1D2F] text-white font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 pl-3">Nama Treatment</th>
                        <th className="p-2.5">Kategori ID</th>
                        <th className="p-2.5">Normal (RB)</th>
                        <th className="p-2.5">Non-Member</th>
                        <th className="p-2.5">Member (RB)</th>
                        <th className="p-2.5">Badge Promo</th>
                        <th className="p-2.5">Catatan Outlet</th>
                        <th className="p-2.5">Link Foto Treatment</th>
                        <th className="p-2.5 pr-3 text-center">Hapus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {treatments.map((t) => (
                        <tr key={t.id} className="hover:bg-rose-50/50">
                          <td className="p-2 pl-3">
                            <input
                              type="text"
                              value={t.name}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'name', e.target.value)}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white focus:border-[#6B1D2F]"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={t.categoryId}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'categoryId', e.target.value)}
                              className="bg-transparent text-[11px] p-0.5 rounded border border-transparent hover:border-stone-300"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="number"
                              value={t.originalPrice}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'originalPrice', Number(e.target.value))}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white"
                            />
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="number"
                              value={t.nonMemberPrice}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'nonMemberPrice', Number(e.target.value))}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white font-semibold"
                            />
                          </td>
                          <td className="p-2 w-20">
                            <input
                              type="number"
                              value={t.memberPrice}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'memberPrice', Number(e.target.value))}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white font-bold text-[#6B1D2F]"
                            />
                          </td>
                          <td className="p-2 w-28">
                            <input
                              type="text"
                              value={t.badge || ''}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'badge', e.target.value)}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={t.outletNotes || ''}
                              onChange={(e) => handleUpdateTreatmentCell(t.id, 'outletNotes', e.target.value)}
                              placeholder="Kosongkan jika semua outlet"
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px] italic"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={t.photoUrl || ''}
                                onChange={(e) => handleUpdateTreatmentCell(t.id, 'photoUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px]"
                              />
                              {t.photoUrl && (
                                <a
                                  href={t.photoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#6B1D2F] hover:text-[#521523] p-0.5"
                                  title="Lihat foto"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-2 pr-3 text-center">
                            <button
                              onClick={() => handleDeleteTreatment(t.id)}
                              className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                              title="Hapus treatment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KATEGORI & LINK FOTO/PDF */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-stone-800 text-sm">Tabel: Kategori & Link PDF/Foto Banner</h4>
                <p className="text-xs text-stone-500">
                  Untuk tiap kategori, Anda cukup memasukkan link gambar web atau link file PDF dari Google Drive.
                </p>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#6B1D2F] text-white font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 pl-3">ID Kategori</th>
                        <th className="p-2.5">Nama Kategori</th>
                        <th className="p-2.5">Deskripsi Singkat</th>
                        <th className="p-2.5">Link Foto atau PDF Dokumen</th>
                        <th className="p-2.5">Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-rose-50/50">
                          <td className="p-2 pl-3 font-mono text-[11px] text-stone-500">
                            {cat.id}
                          </td>
                          <td className="p-2 font-bold text-stone-800">
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => handleUpdateCategoryCell(cat.id, 'name', e.target.value)}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={cat.description}
                              onChange={(e) => handleUpdateCategoryCell(cat.id, 'description', e.target.value)}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px]"
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={cat.pdfOrPhotoUrl || ''}
                                onChange={(e) => handleUpdateCategoryCell(cat.id, 'pdfOrPhotoUrl', e.target.value)}
                                placeholder="Link Google Drive PDF atau URL Foto..."
                                className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px]"
                              />
                              {cat.pdfOrPhotoUrl && (
                                <a
                                  href={cat.pdfOrPhotoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#6B1D2F] hover:underline p-1 shrink-0"
                                  title="Buka tautan"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-2 w-28">
                            <input
                              type="text"
                              value={cat.badge || ''}
                              onChange={(e) => handleUpdateCategoryCell(cat.id, 'badge', e.target.value)}
                              className="w-full bg-transparent px-1 py-0.5 rounded border border-transparent hover:border-stone-300 focus:bg-white text-[11px]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROMO SINGLE */}
          {activeTab === 'single' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-stone-800 text-sm">Tabel: Promo_Single</h4>
                <p className="text-xs text-stone-500">
                  Daftar perawatan satuan dengan harga normal, non-member, dan harga promo member.
                </p>
              </div>

              <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[50vh]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#6B1D2F] text-white font-bold sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 pl-3">Treatment</th>
                        <th className="p-2.5">Grup Kategori</th>
                        <th className="p-2.5">Harga Normal (RB)</th>
                        <th className="p-2.5">Non-Member (RB)</th>
                        <th className="p-2.5">Member (RB)</th>
                        <th className="p-2.5">Khusus Outlet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {singlePromos.map((sp) => (
                        <tr key={sp.id} className="hover:bg-rose-50/50">
                          <td className="p-2 pl-3 font-semibold text-stone-800">
                            {sp.name}
                          </td>
                          <td className="p-2 text-stone-600 text-[11px]">
                            {sp.group}
                          </td>
                          <td className="p-2 text-stone-400">
                            {sp.originalPrice} RB
                          </td>
                          <td className="p-2 font-semibold text-stone-700">
                            {sp.nonMemberPrice} RB
                          </td>
                          <td className="p-2 font-bold text-[#6B1D2F]">
                            {sp.memberPrice} RB
                          </td>
                          <td className="p-2 text-stone-500 text-[11px] italic">
                            {sp.outletRestricted || 'Semua Outlet'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PENGATURAN KLINIK */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h4 className="font-bold text-stone-800 text-sm">Tabel: Pengaturan_Klinik</h4>
                <p className="text-xs text-stone-500">
                  Parameter operasional klinik, batasan service charge, DP booking, dan nomor kontak CS.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Nama Klinik</label>
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                    className="w-full p-2 bg-white rounded-xl border border-stone-300"
                  />
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-[#6B1D2F] block text-xs">
                    Pengaturan Banner Promo Utama (Hero Section)
                  </span>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Judul Promo Utama (e.g. Merdeka Berani Glowing)</label>
                    <input
                      type="text"
                      value={settings.promoTitle || ''}
                      onChange={(e) => setSettings({ ...settings, promoTitle: e.target.value })}
                      placeholder="Merdeka Berani Glowing"
                      className="w-full p-2 bg-white rounded-xl border border-stone-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Narasi / Deskripsi Promo di Bawah Judul</label>
                    <textarea
                      value={settings.promoSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, promoSubtitle: e.target.value })}
                      placeholder="Dapatkan kulit sehat, cerah, dan bebas masalah..."
                      rows={2}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge / Label Promo</label>
                      <input
                        type="text"
                        value={settings.promoBadge || ''}
                        onChange={(e) => setSettings({ ...settings, promoBadge: e.target.value })}
                        placeholder="Promo Spesial Buku BAU 2026"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Periode Promo Aktif</label>
                      <input
                        type="text"
                        value={settings.periodText}
                        onChange={(e) => setSettings({ ...settings, periodText: e.target.value })}
                        placeholder="Berlaku untuk booking periode..."
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Partner Pembayaran / Cicilan Paylater</label>
                    <input
                      type="text"
                      value={settings.paymentPartners || ''}
                      onChange={(e) => setSettings({ ...settings, paymentPartners: e.target.value })}
                      placeholder="Indodana • Kredivo • Atome • SPayLater • BCA..."
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                {/* Banner Section: Subscription */}
                <div className="p-3 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#6B1D2F] block text-xs">
                      Banner Paket Treatment Subscription (Langganan Sesi)
                    </span>
                    <span className="text-[10px] text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-semibold">
                      Tab: Pengaturan_Klinik
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Halaman (Hal Buku BAU)</label>
                      <input
                        type="text"
                        value={settings.subscriptionPageBadge || ''}
                        onChange={(e) => setSettings({ ...settings, subscriptionPageBadge: e.target.value })}
                        placeholder="Buku BAU Hal. 72 - 80"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={settings.subscriptionTagBadge || ''}
                        onChange={(e) => setSettings({ ...settings, subscriptionTagBadge: e.target.value })}
                        placeholder="Maksimal Hemat"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Judul Banner Subscription</label>
                    <input
                      type="text"
                      value={settings.subscriptionTitle || ''}
                      onChange={(e) => setSettings({ ...settings, subscriptionTitle: e.target.value })}
                      placeholder="Paket Treatment Subscription (Langganan Sesi)"
                      className="w-full p-2 bg-white rounded-xl border border-stone-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Deskripsi / Subjudul</label>
                    <textarea
                      value={settings.subscriptionSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, subscriptionSubtitle: e.target.value })}
                      placeholder="Dapatkan harga per sesi jauh lebih murah..."
                      rows={2}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Judul Masa Berlaku</label>
                      <input
                        type="text"
                        value={settings.subscriptionTermsTitle || ''}
                        onChange={(e) => setSettings({ ...settings, subscriptionTermsTitle: e.target.value })}
                        placeholder="Masa Berlaku Paket:"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Poin-poin Masa Berlaku (Gunakan Baris Baru)</label>
                      <textarea
                        value={settings.subscriptionTermsList || ''}
                        onChange={(e) => setSettings({ ...settings, subscriptionTermsList: e.target.value })}
                        placeholder="• Paket 3x: berlaku hingga 5 bulan&#10;• Paket 6x: berlaku hingga 8 bulan&#10;• Paket 12x: berlaku hingga 14 bulan"
                        rows={3}
                        className="w-full p-2 bg-white rounded-xl border border-stone-300 text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Section: Single Promo */}
                <div className="p-3 bg-stone-100/80 border border-stone-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-stone-800 block text-xs">
                    Banner Promo Single Treatment
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Halaman</label>
                      <input
                        type="text"
                        value={settings.singlePromoPageBadge || ''}
                        onChange={(e) => setSettings({ ...settings, singlePromoPageBadge: e.target.value })}
                        placeholder="Buku BAU Hal. 9 - 10"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={settings.singlePromoTagBadge || ''}
                        onChange={(e) => setSettings({ ...settings, singlePromoTagBadge: e.target.value })}
                        placeholder="Harga Satuan Promo"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Judul Banner</label>
                    <input
                      type="text"
                      value={settings.singlePromoTitle || ''}
                      onChange={(e) => setSettings({ ...settings, singlePromoTitle: e.target.value })}
                      placeholder="Promo Single Treatment"
                      className="w-full p-2 bg-white rounded-xl border border-stone-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Deskripsi</label>
                    <textarea
                      value={settings.singlePromoSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, singlePromoSubtitle: e.target.value })}
                      placeholder="Pilihan perawatan satuan dengan harga spesial..."
                      rows={2}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                {/* Banner Section: Skincare Kit */}
                <div className="p-3 bg-stone-100/80 border border-stone-200 rounded-xl space-y-2.5">
                  <span className="font-bold text-stone-800 block text-xs">
                    Banner Paket Skincare Kit Bundling
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Halaman</label>
                      <input
                        type="text"
                        value={settings.skincarePageBadge || ''}
                        onChange={(e) => setSettings({ ...settings, skincarePageBadge: e.target.value })}
                        placeholder="Buku BAU Hal. 82 - 85"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={settings.skincareTagBadge || ''}
                        onChange={(e) => setSettings({ ...settings, skincareTagBadge: e.target.value })}
                        placeholder="FREE Exclusive SOZO Pouch"
                        className="w-full p-2 bg-white rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Judul Banner</label>
                    <input
                      type="text"
                      value={settings.skincareTitle || ''}
                      onChange={(e) => setSettings({ ...settings, skincareTitle: e.target.value })}
                      placeholder="Paket Skincare Kit Bundling"
                      className="w-full p-2 bg-white rounded-xl border border-stone-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Deskripsi</label>
                    <textarea
                      value={settings.skincareSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, skincareSubtitle: e.target.value })}
                      placeholder="Formula dermatologis teruji klinis..."
                      rows={2}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Slogan / Tagline Header Web App</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full p-2 bg-white rounded-xl border border-stone-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">DP Booking Appointment (Rp)</label>
                    <input
                      type="number"
                      value={settings.bookingDp}
                      onChange={(e) => setSettings({ ...settings, bookingDp: Number(e.target.value) })}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Service Charge (%)</label>
                    <input
                      type="number"
                      value={settings.serviceChargePercent}
                      onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Batas Maksimal Service Charge (Rp)</label>
                    <input
                      type="number"
                      value={settings.serviceChargeMax}
                      onChange={(e) => setSettings({ ...settings, serviceChargeMax: Number(e.target.value) })}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Nomor WhatsApp CS (tanpa +)</label>
                    <input
                      type="text"
                      value={settings.csWhatsappNumber}
                      onChange={(e) => setSettings({ ...settings, csWhatsappNumber: e.target.value })}
                      className="w-full p-2 bg-white rounded-xl border border-stone-300"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-amber-950 block text-xs">
                      🔒 Password Akses Web App (Katalog Buku Menu)
                    </label>
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                      Tab Sheet: ACCESS_PASSWORD
                    </span>
                  </div>
                  <input
                    type="text"
                    value={settings.accessPassword || ''}
                    onChange={(e) => setSettings({ ...settings, accessPassword: e.target.value })}
                    placeholder="Contoh: sozo2026 (Kosongkan jika ingin tanpa password)"
                    className="w-full p-2 bg-white rounded-xl border border-stone-300 font-mono text-sm font-semibold"
                  />
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Jika diisi, pengunjung web app harus memasukkan password ini untuk membuka buku menu. Bisa diganti sewaktu-waktu di kolom <code>ACCESS_PASSWORD</code> tab <strong>Pengaturan_Klinik</strong> Google Spreadsheet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REMOTE APPS SCRIPT SYNC */}
          {activeTab === 'connect' && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-amber-700" />
                  Hubungkan ke Web App URL Google Apps Script Anda
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Jika Anda sudah melakukan deployment script ke Google Apps Script (sebagai Web App), 
                  tempelkan Web App URL tersebut di sini. Aplikasi ini akan langsung membaca data spreadsheet 
                  asli secara langsung (live sync)!
                </p>
              </div>

              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Google Apps Script Web App URL:
                  </label>
                  <input
                    type="url"
                    value={remoteUrl}
                    onChange={(e) => setRemoteUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full text-xs p-2.5 rounded-xl bg-white border border-stone-300 font-mono focus:outline-none focus:ring-1 focus:ring-[#6B1D2F]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTestRemoteSync}
                    disabled={isFetchingRemote}
                    className="px-4 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRemote ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi & Tarik Data</span>
                  </button>
                </div>

                {remoteStatus && (
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs font-medium text-stone-700">
                    {remoteStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EXCEL SOURCE & DOWNLOAD GUIDE */}
          {activeTab === 'excel' && (
            <div className="max-w-4xl space-y-6">
              {/* Primary Download Banner */}
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 text-white shadow-lg border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-semibold backdrop-blur-xs border border-white/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Format Resmi Buku BAU SOZO September 2026
                  </div>
                  <h4 className="font-serif text-2xl font-bold tracking-tight">
                    File Excel Siap Download (.xlsx)
                  </h4>
                  <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                    File ini telah dikonversi persis sesuai struktur 7 Sheet database web app ini, termasuk pembaruan internal memo terbaru (Rona Cantik Bersemi, password <code>sozoskinjayajaya</code>, periode September 2026, dan harga paket).
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                  <button
                    onClick={handleDownloadExcel}
                    className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-emerald-700" />
                    <span>Unduh Excel (.xlsx)</span>
                  </button>
                  <a
                    href="/Buku_BAU_SOZO_September_2026.xlsx"
                    download="Buku_BAU_SOZO_September_2026.xlsx"
                    className="text-center text-xs text-emerald-200 hover:text-white underline"
                  >
                    Atau unduh direct link statis
                  </a>
                </div>
              </div>

              {/* Step by Step Guide: How to use with Google Sheets */}
              <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
                <h4 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
                  Cara Memakai File Excel Ini Sebagai Sumber Google Spreadsheet
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      1
                    </div>
                    <h5 className="font-bold text-stone-800">Unduh & Buka Google Sheets</h5>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Klik tombol hijau <strong>"Unduh Excel (.xlsx)"</strong> di atas. Kemudian buka <strong>Google Drive</strong> atau ketik <code>sheets.new</code> di browser Anda.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <h5 className="font-bold text-stone-800">Impor ke Google Sheets</h5>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Klik menu <strong>File &gt; Impor &gt; Upload</strong>, lalu pilih file <code>Buku_BAU_SOZO_September_2026.xlsx</code>. Pilih lokasi impor: <strong>"Ganti spreadsheet"</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                      3
                    </div>
                    <h5 className="font-bold text-stone-800">Deploy Apps Script (Code.gs)</h5>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      Di Google Sheets Anda, klik <strong>Ekstensi &gt; Apps Script</strong>. Masukkan script dari modal <strong>Deploy Guide</strong>, lalu deploy sebagai Web App (Akses: <em>Siapa Saja / Anyone</em>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown of the 7 Sheets */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900">
                  Rincian 7 Sheet yang Terdapat di Dalam File Excel:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">1. Sheet: Pengaturan_Klinik</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Berisi parameter kunci seperti CLINIC_NAME, PROMO_TITLE ('Rona Cantik Bersemi'), PERIOD_TEXT, ACCESS_PASSWORD, WHATSAPP_CS, dll.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">2. Sheet: Kategori</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Berisi ID kategori, nama kategori, deskripsi, link banner foto / PDF halaman buku BAU, dan urutan tampilan.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">3. Sheet: Daftar_Treatment</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Daftar menu lengkap per kategori, Treatment Recommendation, skin goal, rincian tindakan, harga normal, non-member, dan member.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">4. Sheet: Promo_Single</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Promo satuan 5 grup (Glow & Rejuve, Slimming & Contouring, Acne & Scar, Anti-Aging, Hair Grow).
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">5. Sheet: Subscription_Paket</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Paket langganan hemat sesi 3x, 6x, hingga 12x beserta hitungan harga per sesi.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-[#6B1D2F] block">6. Sheet: Daftar_Klinik_Cabang</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Daftar seluruh 50+ cabang SOZO Skin Clinic di berbagai kota, alamat lengkap, dan jam operasional.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 sm:col-span-2">
                    <span className="font-bold text-[#6B1D2F] block">7. Sheet: Skincare_Homecare</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      Paket bundling skincare homecare (Acne Smooth Skin Kit, Acne Calm & Clear, Deep Clear, Radiance Bright, Forever Young) + Free Exclusive SOZO Pouch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefault}
              className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1.5 transition cursor-pointer"
              title="Kembalikan semua data ke default asli Buku BAU 2026 (termasuk Treatment Recommendation)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
              <span>Reset ke Data Default BAU</span>
            </button>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Perubahan langsung tersimpan ke sistem aplikasi.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleApplyChanges}
              className="px-5 py-2 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#E8BF87]" />
              <span>Terapkan Perubahan (Update Web App)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
