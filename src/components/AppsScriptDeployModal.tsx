import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code2, 
  Play, 
  Globe, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { APPS_SCRIPT_CODE_GS, APPS_SCRIPT_INDEX_HTML } from '../services/appsScriptTemplate';

interface AppsScriptDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptDeployModal: React.FC<AppsScriptDeployModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'codegs' | 'indexhtml'>('codegs');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Header */}
        <div className="p-5 bg-[#6B1D2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-[#E8BF87]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                Panduan Deploy Google Apps Script (Auto-Create Spreadsheet)
              </h3>
              <p className="text-xs text-rose-200">
                1x Klik Deploy di script.google.com — Spreadsheet otomatis terbuat dan Web App langsung launch!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Step by Step Visual Guide */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#6B1D2F] text-white text-[11px] flex items-center justify-center">1</span>
              Langkah Hubungkan ke Spreadsheet yang Sudah Anda Buat
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#6B1D2F] uppercase">Langkah 1</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <h5 className="font-bold text-xs text-stone-900">Buka Spreadsheet Anda</h5>
                <p className="text-[11px] text-stone-600 mt-1">
                  Buka Google Spreadsheet yang sudah Anda buat di browser. Di menu atas, klik <strong>Ekstensi &gt; Apps Script</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#6B1D2F] uppercase">Langkah 2</span>
                  <Copy className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <h5 className="font-bold text-xs text-stone-900">Salin Kode</h5>
                <p className="text-[11px] text-stone-600 mt-1">
                  Paste tab <strong>Code.gs</strong> ke file <code className="bg-stone-200 px-1 rounded text-[10px]">Code.gs</code>. Lalu tambah file HTML baru bernama <code className="bg-stone-200 px-1 rounded text-[10px]">Index</code> dan paste tab <strong>Index.html</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Langkah 3 (Langsung Tulis)</span>
                  <Play className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <h5 className="font-bold text-xs text-stone-900">Jalankan setupSpreadsheet()</h5>
                <p className="text-[11px] text-stone-700 mt-1">
                  Pilih fungsi <strong>setupSpreadsheet</strong> lalu klik <strong>Run ▶️</strong>. Seluruh sheet Buku BAU otomatis ditulis ke spreadsheet yang Anda buka. <em>Tidak membuat file baru!</em>
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Langkah 4</span>
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <h5 className="font-bold text-xs text-stone-900">Deploy sebagai Web App</h5>
                <p className="text-[11px] text-stone-700 mt-1">
                  Klik <strong>Deploy &gt; New deployment</strong> (atau Manage deployments &gt; Edit &gt; New version). Atur <em>"Who has access: Anyone"</em>. Klik <strong>Deploy</strong>. Selesai!
                </p>
              </div>
            </div>
          </div>

          {/* Solusi Loading Terus Notice */}
          <div className="bg-amber-50/80 border border-amber-200/90 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
              💡
            </div>
            <div>
              <span className="font-bold text-amber-900 block mb-1">
                Catatan Penting Menulis ke Spreadsheet yang Sudah Ada:
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-900/90 leading-relaxed">
                <li>
                  <strong>Tidak Membuat File Baru:</strong> Script otomatis mendeteksi Google Spreadsheet yang sedang Anda buka melalui menu <em>Ekstensi &gt; Apps Script</em> dan langsung mengisi sheet Pengaturan, Kategori, Treatment, Promo, dan Paket ke dalamnya.
                </li>
                <li>
                  <strong>Jika Menggunakan script.google.com Terpisah:</strong> Anda cukup memasukkan link/URL Spreadsheet Anda pada baris <code className="bg-white/80 px-1 py-0.5 rounded font-mono font-bold">var TARGET_SPREADSHEET_ID_OR_URL = "..."</code> di bagian paling atas file Code.gs.
                </li>
                <li>
                  <strong>Izin Google Drive:</strong> Saat pertama kali klik Run pada <strong>setupSpreadsheet</strong>, klik <em>"Review Permissions" &gt; pilih akun Google &gt; "Advanced" &gt; "Go to Untitled/SOZO (unsafe)" &gt; "Allow"</em>.
                </li>
                <li>
                  <strong>Sinkronisasi Dua Arah:</strong> Setiap kali Anda mengedit harga atau teks di sheet Google Spreadsheet tersebut, Web App Anda akan otomatis membaca data terbaru secara real-time!
                </li>
              </ul>
            </div>
          </div>

          {/* Code Viewer Box */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Tab switchers and actions */}
            <div className="bg-stone-900 text-white p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setActiveCodeTab('codegs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeCodeTab === 'codegs' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Code.gs (Backend & Auto-Create Spreadsheet)
                </button>
                <button
                  onClick={() => setActiveCodeTab('indexhtml')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeCodeTab === 'indexhtml' ? 'bg-[#6B1D2F] text-white shadow-xs' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Index.html (Frontend Tampilan Web App)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = activeCodeTab === 'codegs' ? APPS_SCRIPT_CODE_GS : APPS_SCRIPT_INDEX_HTML;
                    const label = activeCodeTab === 'codegs' ? 'Code.gs' : 'Index.html';
                    handleCopy(text, label);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedCode === (activeCodeTab === 'codegs' ? 'Code.gs' : 'Index.html') ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#E8BF87]" />
                      <span>Salin {activeCodeTab === 'codegs' ? 'Code.gs' : 'Index.html'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (activeCodeTab === 'codegs') {
                      handleDownload('Code.gs', APPS_SCRIPT_CODE_GS);
                    } else {
                      handleDownload('Index.html', APPS_SCRIPT_INDEX_HTML);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Unduh file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Code display */}
            <div className="bg-[#1E1E1E] text-stone-200 font-mono text-xs p-4 overflow-x-auto max-h-[42vh] scrollbar-thin">
              <pre className="leading-relaxed">
                {activeCodeTab === 'codegs' ? APPS_SCRIPT_CODE_GS : APPS_SCRIPT_INDEX_HTML}
              </pre>
            </div>
          </div>

          {/* Features note */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 flex items-start gap-3 text-xs text-stone-700">
            <CheckCircle2 className="w-5 h-5 text-[#6B1D2F] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block mb-0.5">
                Fitur Auto-Generated Spreadsheet:
              </span>
              <p className="text-stone-600 leading-relaxed">
                Fungsi <code className="bg-white px-1.5 py-0.5 rounded border border-rose-200 text-[#6B1D2F] font-bold">setupSpreadsheet()</code> akan otomatis membuat file Google Sheets bernama <strong>"SOZO Skin Clinic - Database Buku BAU & Treatment Guide"</strong> dengan tab <em>Kategori</em>, <em>Daftar_Treatment</em>, <em>Promo_Single</em>, <em>Subscription</em>, dan <em>Pengaturan_Klinik</em>. Semua data treatment dan link banner langsung terisi rapi!
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#6B1D2F] hover:underline flex items-center gap-1"
          >
            <span>Buka Google Apps Script Editor</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
