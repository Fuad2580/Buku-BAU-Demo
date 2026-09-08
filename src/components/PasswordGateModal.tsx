import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Link2, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { DEFAULT_APPS_SCRIPT_URL } from '../data/initialBauData';

interface PasswordGateModalProps {
  correctPassword?: string;
  clinicName?: string;
  csWhatsappNumber?: string;
  webAppUrl?: string;
  onRefreshFromAppsScript?: () => Promise<boolean>;
  onConnectAppsScriptUrl?: (url: string) => Promise<boolean>;
  onUnlock: () => void;
}

export const PasswordGateModal: React.FC<PasswordGateModalProps> = ({
  correctPassword = 'sozo',
  clinicName = 'SOZO Skin Clinic',
  csWhatsappNumber = '6281234567890',
  webAppUrl = '',
  onRefreshFromAppsScript,
  onConnectAppsScriptUrl,
  onUnlock,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showUrlConfig, setShowUrlConfig] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(webAppUrl);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const activeUrl = (webAppUrl || (import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined) || DEFAULT_APPS_SCRIPT_URL).trim();

  // Auto-sync data terbaru dari Google Apps Script saat modal terbuka
  React.useEffect(() => {
    if (onRefreshFromAppsScript && activeUrl && activeUrl.startsWith('http')) {
      onRefreshFromAppsScript().catch(() => {});
    }
  }, [activeUrl, onRefreshFromAppsScript]);

  const handleManualSync = async () => {
    if (!onRefreshFromAppsScript) return;
    setIsSyncing(true);
    setSyncStatus(null);
    setIsError(false);

    try {
      const success = await onRefreshFromAppsScript();
      if (success) {
        setSyncStatus('Berhasil disinkronkan dari Google Spreadsheet!');
        setTimeout(() => setSyncStatus(null), 4000);
      } else {
        setIsError(true);
        setErrorMessage('Gagal menghubungi Web App Google Apps Script. Pastikan izin akses diatur ke "Anyone" dan URL benar.');
      }
    } catch {
      setIsError(true);
      setErrorMessage('Terjadi kendala koneksi ke Google Apps Script.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = customUrlInput.trim();
    if (!targetUrl.startsWith('http')) {
      setIsError(true);
      setErrorMessage('URL harus diawali dengan https://script.google.com/...');
      return;
    }

    if (onConnectAppsScriptUrl) {
      setIsSyncing(true);
      setIsError(false);
      try {
        const ok = await onConnectAppsScriptUrl(targetUrl);
        if (ok) {
          setShowUrlConfig(false);
          setSyncStatus('URL Web App terhubung & password berhasil diperbarui!');
          setTimeout(() => setSyncStatus(null), 4000);
        } else {
          setIsError(true);
          setErrorMessage('Gagal memverifikasi URL Apps Script. Pastikan URL Web App benar dan izinnya "Anyone".');
        }
      } catch {
        setIsError(true);
        setErrorMessage('Gagal memproses koneksi URL.');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = inputPassword.trim();
    if (!entered) {
      setIsError(true);
      setErrorMessage('Silakan masukkan password akses.');
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setSyncStatus(null);

    const localTarget = (correctPassword || '').trim();

    // 1. Prioritas Utama: Verifikasi langsung ke Google Spreadsheet via activeUrl secara realtime
    if (activeUrl && activeUrl.startsWith('http')) {
      try {
        const sep = activeUrl.includes('?') ? '&' : '?';
        const getDataEndpoint = `${activeUrl}${sep}action=getData&_t=${Date.now()}`;
        // Simple GET fetch without custom headers to avoid CORS preflight (OPTIONS)
        const resData = await fetch(getDataEndpoint);
        if (resData.ok) {
          const json = await resData.json();
          if (json && json.config && json.config.ACCESS_PASSWORD !== undefined) {
            const remotePw = String(json.config.ACCESS_PASSWORD).trim();
            if (remotePw) {
              if (entered.toLowerCase() === remotePw.toLowerCase()) {
                // Password cocok dengan Spreadsheet secara live!
                if (onRefreshFromAppsScript) {
                  onRefreshFromAppsScript().catch(() => {});
                }
                setIsSubmitting(false);
                onUnlock();
                return;
              } else {
                // Spreadsheet aktif dan password TIDAK cocok
                setIsSubmitting(false);
                setIsError(true);
                setErrorMessage('Password salah. Silakan periksa kembali password di Google Spreadsheet (Tab Config).');
                return;
              }
            }
          }
        }
      } catch (err) {
        console.warn('Realtime fetch failed, falling back to local verification:', err);
      }

      // Percobaan alternatif ke action=verifyPassword jika ada
      try {
        const sep = activeUrl.includes('?') ? '&' : '?';
        const verifyEndpoint = `${activeUrl}${sep}action=verifyPassword&password=${encodeURIComponent(entered)}&_t=${Date.now()}`;
        const res = await fetch(verifyEndpoint);
        if (res.ok) {
          const vData = await res.json();
          if (vData && vData.valid === true) {
            if (onRefreshFromAppsScript) {
              onRefreshFromAppsScript().catch(() => {});
            }
            setIsSubmitting(false);
            onUnlock();
            return;
          }
        }
      } catch {}
    }

    // 2. Fallback offline / cache lokal jika perangkat sedang tidak ada koneksi
    if (localTarget && entered.toLowerCase() === localTarget.toLowerCase()) {
      setIsSubmitting(false);
      onUnlock();
      return;
    }

    setIsSubmitting(false);
    setIsError(true);
    setErrorMessage(
      activeUrl 
        ? 'Password salah atau belum diperbarui di Web App Apps Script. Pastikan Code.gs terbaru sudah di-Deploy (New Version).'
        : 'Password salah. URL Web App belum terhubung, sehingga website masih menggunakan password default.'
    );
  };

  const handleResetCache = () => {
    try {
      localStorage.removeItem('sozo_bau_web_app_data_v6_settings');
      localStorage.removeItem('sozo_bau_web_app_data_v5_settings');
      localStorage.removeItem('sozo_bau_web_app_data_v4_settings');
      localStorage.removeItem('sozo_app_unlocked');
      sessionStorage.removeItem('sozo_app_unlocked');
    } catch {}
    setSyncStatus('Cache browser di-reset. Memuat ulang...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleContactAdmin = () => {
    const cleanPhone = (csWhatsappNumber || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Halo Admin ${clinicName}, saya memerlukan password akses untuk membuka Buku Menu & Promo BAU.`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-auto">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#6B1D2F] via-[#7d1f35] to-[#6B1D2F] text-white p-6 sm:p-7 text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-28 h-28 bg-[#C9A86A]/20 rounded-full blur-xl pointer-events-none" />

          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-white/10 border border-white/20 text-[#F7D8A7] shadow-inner mb-2.5">
            <Lock className="w-6 h-6 text-[#F7D8A7]" />
          </div>

          <h2 className="text-xl font-bold font-serif tracking-tight text-white">
            {clinicName}
          </h2>
          <p className="text-xs text-rose-100/90 mt-0.5 font-medium">
            Buku Menu BAU & Katalog Promo Eksklusif
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[#6B1D2F] text-[11px] font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Akses Terproteksi
            </div>
            <p className="text-xs text-stone-500 pt-0.5 leading-relaxed">
              Masukkan password otorisasi untuk membuka rincian harga dan treatment.
            </p>

            {/* Connection Status Badge */}
            <div className="pt-1 flex items-center justify-center gap-1.5">
              {activeUrl ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Terhubung ke Google Sheet</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUrlConfig(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium hover:bg-amber-100 transition cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>URL Web App Belum Terhubung (Klik Disini)</span>
                </button>
              )}
            </div>
          </div>

          {/* Sync Success Message */}
          {syncStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  Password Akses
                </label>
                {onRefreshFromAppsScript && (
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="text-[11px] font-semibold text-[#6B1D2F] hover:text-[#521523] flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan dari Sheet'}</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  autoFocus
                  placeholder="Ketik password..."
                  className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-stone-50 border ${
                    isError
                      ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/30'
                      : 'border-stone-300 focus:border-[#6B1D2F] focus:ring-2 focus:ring-rose-100'
                  } transition outline-none font-medium text-stone-800`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isError && (
                <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 text-xs text-rose-700 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSyncing}
              className="w-full py-3 px-4 rounded-xl bg-[#6B1D2F] hover:bg-[#521523] active:scale-[0.99] text-white text-sm font-bold shadow-md shadow-rose-950/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Buka Buku Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* URL Direct Connect Drawer (Bantuan jika Vercel belum di-redeploy) */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowUrlConfig(!showUrlConfig)}
                className="text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 transition"
              >
                <Link2 className="w-3.5 h-3.5 text-[#C9A86A]" />
                <span>{showUrlConfig ? 'Sembunyikan URL Web App' : 'Ganti / Masukkan URL Web App'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan Password</span>
              </button>
            </div>

            {showUrlConfig && (
              <form onSubmit={handleSaveCustomUrl} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 animate-fade-in">
                <p className="text-[11px] text-stone-600">
                  Jika Vercel belum selesai <strong>Redeploy</strong>, Anda dapat memasukkan URL Web App Google Apps Script di sini agar password langsung terhubung ke Google Sheet:
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs outline-none focus:border-[#6B1D2F]"
                  />
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-3 py-2 bg-[#6B1D2F] text-white font-bold rounded-lg hover:bg-[#521523] whitespace-nowrap cursor-pointer"
                  >
                    Hubungkan
                  </button>
                </div>
              </form>
            )}

            {showTroubleshoot && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1.5 animate-fade-in">
                <p className="font-bold">Kenapa password spreadsheet belum terbaca di Vercel?</p>
                <ol className="list-decimal pl-4 space-y-1 text-stone-700">
                  <li><strong>Vercel Butuh Redeploy:</strong> Setelah menambahkan Environment Variable di Vercel, buka menu <em>Deployments</em> di Vercel &gt; klik <em>(...)</em> &gt; pilih <strong>Redeploy</strong>. Variabel build tidak otomatis aktif tanpa build ulang.</li>
                  <li><strong>Apps Script Wajib "New Version":</strong> Di Google Apps Script, klik <em>Deploy &gt; Manage deployments &gt; Edit (Pensil) &gt; Version: New Version &gt; Deploy</em>.</li>
                  <li><strong>Akses Apps Script Wajib "Anyone":</strong> Pastikan pada kolom <em>Who has access</em> dipilih <strong>Anyone</strong> (bukan Only myself).</li>
                </ol>
              </div>
            )}
          </div>

          {/* Help link & Cache Reset */}
          <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-1.5 text-center">
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={handleContactAdmin}
                className="font-semibold text-[#6B1D2F] hover:text-[#521523] hover:underline transition"
              >
                Belum tahu password? CS WhatsApp
              </button>
              <span className="text-stone-300">•</span>
              <button
                type="button"
                onClick={handleResetCache}
                className="text-stone-500 hover:text-stone-800 hover:underline transition"
                title="Hapus cache memori browser"
              >
                Reset Cache
              </button>
            </div>
            <p className="text-[10px] text-stone-400">
              Pengaturan password dapat diatur di sheet <strong>Pengaturan_Klinik</strong> Google Spreadsheet.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

