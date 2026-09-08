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
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { DEFAULT_APPS_SCRIPT_URL } from '../data/initialBauData';
import { GalaxyBackground } from './GalaxyBackground';

// Subtle 4-point luxury sparkle star
const SparkleStar: React.FC<{ className?: string }> = ({ className = 'w-3 h-3 text-[#FDE047]' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 0C12.4 6.2 17.8 11.6 24 12C17.8 12.4 12.4 17.8 12 24C11.6 17.8 6.2 12.4 0 12C6.2 11.6 11.6 6.2 12 0Z"
      fill="currentColor"
    />
  </svg>
);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-[#140207] animate-fade-in">
      
      {/* Full-Screen Interactive Deep Crimson Galaxy Nebula Background */}
      <GalaxyBackground className="fixed inset-0 z-0 bg-[#140207]" intensity="full" />

      {/* Luxury Cosmic Glass Card with Glowing Rim Lights */}
      <div className="relative z-10 w-full max-w-md bg-[#22040D]/90 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_-10px_rgba(224,75,126,0.45),0_0_70px_rgba(15,1,6,0.95)] border border-rose-300/30 overflow-hidden my-auto before:content-[''] before:absolute before:top-0 before:left-8 before:right-8 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-[#FFAEC2] before:to-transparent before:shadow-[0_0_15px_#FFAEC2] before:z-30 after:content-[''] after:absolute after:top-12 after:bottom-12 after:right-0 after:w-[1.5px] after:bg-gradient-to-b after:from-transparent after:via-[#FFB4C8]/40 after:to-transparent after:shadow-[0_0_10px_#FFAEC2] after:z-20">
        
        {/* Header Ribbon with Galaxy Nebula Dust & Sparkles */}
        <div className="bg-gradient-to-br from-[#400B17] via-[#5C1527] to-[#25050E] text-white p-6 sm:p-7 text-center relative overflow-hidden border-b border-rose-300/15">
          
          {/* Ambient Glowing Nebula Pockets */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-[#E44176]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-40 h-40 bg-[#FF9BB3]/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-28 bg-[#FFD382]/15 rounded-full blur-2xl pointer-events-none" />
          
          {/* Diagonal Shimmer Gleam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-shimmer-gleam" />

          {/* Sparkling Stars Inside Header */}
          <div className="absolute top-4 right-6 pointer-events-none animate-twinkle">
            <SparkleStar className="w-4 h-4 text-[#FCE3B4] drop-shadow-[0_0_6px_#FCE3B4]" />
          </div>
          <div className="absolute top-10 right-14 pointer-events-none animate-twinkle-fast">
            <SparkleStar className="w-2.5 h-2.5 text-[#FDE047] drop-shadow-[0_0_4px_#FDE047]" />
          </div>
          <div className="absolute top-5 left-7 pointer-events-none animate-twinkle-delay-1">
            <SparkleStar className="w-3.5 h-3.5 text-[#FFAEC2] drop-shadow-[0_0_5px_#FFAEC2]" />
          </div>
          <div className="absolute bottom-4 left-6 pointer-events-none animate-twinkle-delay-2">
            <SparkleStar className="w-3 h-3 text-[#FDE047]/80 drop-shadow-[0_0_4px_#FDE047]" />
          </div>
          <div className="absolute bottom-5 right-8 pointer-events-none animate-twinkle-delay-3">
            <SparkleStar className="w-3.5 h-3.5 text-[#FFF2D4] drop-shadow-[0_0_5px_#FFF2D4]" />
          </div>
          {/* Golden Micro Stardust Particles */}
          <div className="absolute top-8 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FCE3B4] shadow-[0_0_6px_#FCE3B4] pointer-events-none animate-twinkle-delay-1" />
          <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 rounded-full bg-[#FDE047] shadow-[0_0_6px_#FDE047] pointer-events-none animate-twinkle-fast" />

          {/* Ornate Golden-Trimmed Seal Lock Badge */}
          <div className="relative inline-flex items-center justify-center p-0.5 rounded-2xl bg-gradient-to-br from-[#F6D29A] via-[#C9A86A] to-[#8C6022] shadow-[0_0_25px_rgba(224,75,126,0.45)] mb-3">
            <div className="w-13 h-13 rounded-[14px] bg-gradient-to-br from-[#541221] via-[#3B0A16] to-[#1E030B] flex items-center justify-center relative overflow-hidden border border-white/25">
              <div className="absolute inset-0 bg-radial from-[#F7D8A7]/25 to-transparent pointer-events-none" />
              <Lock className="w-6 h-6 text-[#FCE3B4] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10" />
            </div>
            {/* Sparkle pinned on badge corner */}
            <div className="absolute -top-1.5 -right-1.5 animate-twinkle-fast pointer-events-none">
              <SparkleStar className="w-4 h-4 text-[#FFF0C2] drop-shadow-[0_0_6px_#FFDF85]" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8EE] via-[#FDE8C5] to-[#FFF0D4] drop-shadow-sm flex items-center justify-center gap-2">
            <span>{clinicName}</span>
          </h2>

          {/* Subtitle with delicate sparkle star dividers */}
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#E0C18A]/70" />
            <SparkleStar className="w-2.5 h-2.5 text-[#E0C18A]" />
            <p className="text-[11px] uppercase tracking-widest text-[#F5D8B0] font-semibold">
              Buku BAU & Katalog Promo Eksklusif
            </p>
            <SparkleStar className="w-2.5 h-2.5 text-[#E0C18A]" />
            <span className="h-px w-6 bg-gradient-to-l from-transparent to-[#E0C18A]/70" />
          </div>
        </div>

        {/* Form Body - Translucent Dark Cosmic Glass */}
        <div className="p-6 sm:p-7 space-y-4 text-white">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-rose-300/30 text-[#FCE3B4] text-[11px] font-bold tracking-wide uppercase shadow-xs backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047] animate-twinkle" />
              <span>Akses Terproteksi</span>
            </div>
            <p className="text-xs text-rose-200/90 pt-0.5 leading-relaxed font-light">
              Masukkan password otorisasi untuk membuka rincian harga dan treatment.
            </p>

            {/* Connection Status Badge */}
            <div className="pt-1 flex items-center justify-center gap-1.5">
              {activeUrl ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 text-[10px] font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Terhubung ke Google Sheet</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowUrlConfig(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-400/40 text-amber-200 text-[10px] font-medium hover:bg-amber-900/60 transition cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>URL Web App Belum Terhubung (Klik Disini)</span>
                </button>
              )}
            </div>
          </div>

          {/* Sync Success Message */}
          {syncStatus && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-xs rounded-xl flex items-center gap-2 backdrop-blur-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#FCE3B4]">
                  Password Akses
                </label>
                {onRefreshFromAppsScript && (
                  <button
                    type="button"
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="text-[11px] font-semibold text-rose-200 hover:text-white flex items-center gap-1 cursor-pointer transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 text-[#FDE047] ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan dari Sheet'}</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-300/60">
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
                  className={`w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-black/45 border ${
                    isError
                      ? 'border-rose-400 ring-2 ring-rose-500/30 bg-rose-950/40 text-white placeholder-rose-300/40'
                      : 'border-rose-300/30 focus:border-[#FFAEC2] focus:ring-2 focus:ring-[#FFAEC2]/25 focus:bg-black/60 text-white placeholder-rose-200/40'
                  } transition-all outline-none font-medium`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-300/70 hover:text-white transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isError && (
                <div className="mt-2 p-2.5 bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 rounded-xl flex items-start gap-2 backdrop-blur-xs">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Radiant Glowing Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSyncing}
              className="group relative w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#8C1D35] via-[#B82B4E] to-[#731427] hover:from-[#731427] hover:via-[#A12443] hover:to-[#5E1020] active:scale-[0.99] text-white text-sm font-bold shadow-[0_4px_25px_rgba(224,75,126,0.45)] hover:shadow-[0_6px_30px_rgba(224,75,126,0.65)] flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer disabled:opacity-70 border-t border-[#FFAEC2]/50 overflow-hidden"
            >
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FDE047]" />
                  <span>Memverifikasi Akses...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FDE047] animate-twinkle" />
                  <span className="tracking-wide font-bold">Buka Buku Menu</span>
                  <ArrowRight className="w-4 h-4 text-rose-200 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* URL Direct Connect Drawer (Bantuan jika Vercel belum di-redeploy) */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setShowUrlConfig(!showUrlConfig)}
                className="text-rose-200/80 hover:text-white font-medium flex items-center gap-1 transition"
              >
                <Link2 className="w-3.5 h-3.5 text-[#FCE3B4]" />
                <span>{showUrlConfig ? 'Sembunyikan URL Web App' : 'Ganti / Masukkan URL Web App'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                className="text-amber-300 hover:text-amber-100 font-medium flex items-center gap-1 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Bantuan Password</span>
              </button>
            </div>

            {showUrlConfig && (
              <form onSubmit={handleSaveCustomUrl} className="p-3 bg-black/50 rounded-xl border border-rose-300/20 text-xs space-y-2 animate-fade-in backdrop-blur-xs">
                <p className="text-[11px] text-rose-200/90 leading-relaxed">
                  Jika Vercel belum selesai <strong>Redeploy</strong>, Anda dapat memasukkan URL Web App Google Apps Script di sini agar password langsung terhubung ke Google Sheet:
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 bg-black/60 border border-rose-300/30 rounded-lg text-xs outline-none focus:border-[#FFAEC2] text-white placeholder-rose-300/40"
                  />
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="px-3 py-2 bg-gradient-to-r from-[#8C1D35] to-[#591423] text-white font-bold rounded-lg hover:brightness-110 whitespace-nowrap cursor-pointer border-t border-rose-300/30"
                  >
                    Hubungkan
                  </button>
                </div>
              </form>
            )}

            {showTroubleshoot && (
              <div className="p-3.5 bg-black/60 rounded-xl border border-amber-500/30 text-[11px] text-amber-100 space-y-1.5 animate-fade-in backdrop-blur-xs">
                <p className="font-bold text-amber-200">Kenapa password spreadsheet belum terbaca di Vercel?</p>
                <ol className="list-decimal pl-4 space-y-1 text-rose-100/90 leading-relaxed">
                  <li><strong>Vercel Butuh Redeploy:</strong> Setelah menambahkan Environment Variable di Vercel, buka menu <em>Deployments</em> di Vercel &gt; klik <em>(...)</em> &gt; pilih <strong>Redeploy</strong>. Variabel build tidak otomatis aktif tanpa build ulang.</li>
                  <li><strong>Apps Script Wajib "New Version":</strong> Di Google Apps Script, klik <em>Deploy &gt; Manage deployments &gt; Edit (Pensil) &gt; Version: New Version &gt; Deploy</em>.</li>
                  <li><strong>Akses Apps Script Wajib "Anyone":</strong> Pastikan pada kolom <em>Who has access</em> dipilih <strong>Anyone</strong> (bukan Only myself).</li>
                </ol>
              </div>
            )}
          </div>

          {/* Help link & Cache Reset */}
          <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-1.5 text-center">
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={handleContactAdmin}
                className="font-semibold text-[#FCE3B4] hover:text-white hover:underline transition"
              >
                Belum tahu password? CS WhatsApp
              </button>
              <span className="text-white/30">•</span>
              <button
                type="button"
                onClick={handleResetCache}
                className="text-rose-200/80 hover:text-white hover:underline transition"
                title="Hapus cache memori browser"
              >
                Reset Cache
              </button>
            </div>
            <p className="text-[10px] text-rose-200/60 font-light">
              Pengaturan password dapat diatur di sheet <strong>Pengaturan_Klinik</strong> Google Spreadsheet.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

