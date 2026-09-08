/**
 * =========================================================================
 * SOZO SKIN CLINIC - BUKU BAU & PROMO INTERAKTIF
 * Google Apps Script Engine & Database Synchronizer
 * =========================================================================
 * 
 * 🟢 SEMUA PENGATURAN & DATA DAPAT DIUBAH LANGSUNG DARI GOOGLE SPREADSHEET:
 * - Judul Promo (Merdeka Berani Glowing) & Narasi di bawahnya
 * - Kategori & Banner Foto/PDF
 * - Seluruh Treatment di tiap kategori
 * - Promo Single Treatment & Ala Carte
 * - Paket Subscription / Multisesi (3x, 6x, 12x)
 * - Daftar Lokasi Cabang Klinik SOZO se-Indonesia
 * - Paket Skincare & Homecare Kit
 * 
 * PETUNJUK PENGGUNAAN DI SPREADSHEET YANG SUDAH DIBUAT:
 * 1. Buka file Google Spreadsheet Anda di browser.
 * 2. Di menu atas, klik: [Ekstensi] > [Apps Script].
 * 3. Hapus kode bawaan di Code.gs, lalu paste SELURUH isi file ini.
 * 4. Tambahkan file HTML dengan nama "Index" (klik tombol '+' > HTML), lalu paste isi Index.html.
 * 5. Di dropdown fungsi sebelah tombol "Run", pilih: setupSpreadsheet lalu klik "Run ▶️".
 *    -> Script LANGSUNG MENULIS semua sheet ke Spreadsheet yang sedang dibuka!
 *    -> TIDAK PERNAH MEMBUAT SPREADSHEET BARU LAGI!
 * 6. Klik tombol biru "Deploy" di kanan atas > "New deployment" > pilih tipe "Web app":
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Klik "Deploy" -> Selesai! Web app Anda sudah aktif dan terhubung real-time.
 * =========================================================================
 */

// OPTIONAL: Masukkan link/URL atau ID spreadsheet jika script dijalankan di script.google.com terpisah.
// Biarkan KOSONG ("") jika dibuka lewat menu [Ekstensi] > [Apps Script] di Spreadsheet Anda!
var TARGET_SPREADSHEET_ID_OR_URL = "";

var SCRIPT_PROP_KEY = 'SOZO_SPREADSHEET_ID';

/**
 * Mencari spreadsheet tujuan yang sudah dibuat oleh user.
 * TIDAK AKAN PERNAH membuat spreadsheet baru.
 */
function getTargetSpreadsheet() {
  var ss = null;

  // 1. Prioritas Utama: Buka dari Spreadsheet aktif (Container-bound script)
  try {
    var activeSs = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSs && activeSs.getId()) {
      PropertiesService.getScriptProperties().setProperty(SCRIPT_PROP_KEY, activeSs.getId());
      return activeSs;
    }
  } catch (eActive) {
    // Diabaikan jika bukan container-bound
  }

  // 2. Cek variabel TARGET_SPREADSHEET_ID_OR_URL jika diisi
  if (typeof TARGET_SPREADSHEET_ID_OR_URL !== 'undefined' && TARGET_SPREADSHEET_ID_OR_URL && TARGET_SPREADSHEET_ID_OR_URL.trim() !== '') {
    var rawInput = TARGET_SPREADSHEET_ID_OR_URL.trim();
    var idMatch = rawInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
    var targetId = idMatch ? idMatch[1] : rawInput;
    try {
      ss = SpreadsheetApp.openById(targetId);
      if (ss) {
        PropertiesService.getScriptProperties().setProperty(SCRIPT_PROP_KEY, ss.getId());
        return ss;
      }
    } catch (eId) {
      Logger.log("Peringatan: Gagal membuka spreadsheet dari TARGET_SPREADSHEET_ID_OR_URL: " + eId.toString());
    }
  }

  // 3. Cek Script Properties dari run sebelumnya
  var existingId = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_KEY);
  if (existingId) {
    try {
      ss = SpreadsheetApp.openById(existingId);
      if (ss) return ss;
    } catch (eProp) {}
  }

  return null;
}

/**
 * Menulis seluruh struktur database Buku BAU ke Spreadsheet yang sedang dibuka.
 */
function setupSpreadsheet() {
  var ss = getTargetSpreadsheet();
  
  if (!ss) {
    var errorMsg = "PERHATIAN: Google Spreadsheet tujuan belum terhubung!\n\n" +
      "Script ini diatur khusus untuk MENULIS KE SPREADSHEET YANG SUDAH ADA (bukan membuat baru).\n\n" +
      "Cara menghubungkan:\n" +
      "1. Buka file Google Spreadsheet yang sudah Anda buat di Google Drive.\n" +
      "2. Klik menu [Ekstensi] > [Apps Script].\n" +
      "3. Paste script ini di sana, lalu jalankan fungsi 'setupSpreadsheet'.\n\n" +
      "ATAU jika menggunakan script.google.com terpisah:\n" +
      "Isi variabel TARGET_SPREADSHEET_ID_OR_URL di baris 33 dengan link Spreadsheet Anda.";
    Logger.log(errorMsg);
    throw new Error(errorMsg);
  }

  Logger.log("Menulis seluruh data Buku BAU ke Spreadsheet: " + ss.getName() + " (" + ss.getUrl() + ")");

  var headerBg = "#6B1D2F";
  var headerColor = "#FFFFFF";

  // =========================================================================
  // TAB 1: PENGATURAN KLINIK & PROMO BANNER (SEMUA BISA DIUBAH DI SHEET INI)
  // =========================================================================
  var sheetConfig = getOrCreateSheet(ss, "Pengaturan_Klinik");
  sheetConfig.clear();
  sheetConfig.appendRow(["Kunci Parameter", "Nilai", "Keterangan"]);
  formatHeader(sheetConfig, headerBg, headerColor);
  
  var configData = [
    ["CLINIC_NAME", "SOZO Skin Clinic", "Nama Resmi Klinik"],
    ["PROMO_TITLE", "Merdeka Berani Glowing", "Judul Besar Banner Promo Utama (Bisa Diubah Kapan Saja)"],
    ["PROMO_SUBTITLE", "Dapatkan kulit sehat, cerah, dan bebas masalah dengan penawaran treatment terbaik. Tersedia Cicilan 0% Paylater & Cashback hingga 500 RB!", "Narasi / Deskripsi Promo di Bawah Judul"],
    ["PROMO_BADGE", "Promo Spesial Buku BAU 2026", "Label / Badge di Atas Judul Promo"],
    ["PAYMENT_PARTNERS", "Indodana • Kredivo • Atome • SPayLater • BCA • BRI • Mandiri", "Daftar Partner Cicilan & Pembayaran"],
    ["TAGLINE", "Merdeka Berani Glowing - Cicilan 0% Paylater & Cashback hingga 500 RB", "Slogan / Header Web App"],
    ["PERIOD_TEXT", "Berlaku untuk booking periode 1 - 31 Agustus 2026", "Periode Promo Aktif"],
    ["BOOKING_DP", "50000", "Nominal DP Booking Appointment (Rupiah)"],
    ["SERVICE_CHARGE_PCT", "5", "Persentase Service Charge (%)"],
    ["SERVICE_CHARGE_MAX", "150000", "Batas Maksimal Service Charge (Rupiah)"],
    ["VALIDITY_MONTHS", "6", "Masa Berlaku Paket (Bulan)"],
    ["WHATSAPP_CS", "6281234567890", "Nomor WhatsApp CS untuk Booking Order"],
    ["ACCESS_PASSWORD", "sozo", "Password untuk Membuka Web App Buku Menu (Kosongkan jika ingin publik)"]
  ];
  sheetConfig.getRange(2, 1, configData.length, 3).setValues(configData);
  sheetConfig.autoResizeColumns(1, 3);

  // =========================================================================
  // TAB 2: KATEGORI & LINK FOTO/PDF BANNER
  // =========================================================================
  var sheetKat = getOrCreateSheet(ss, "Kategori");
  sheetKat.clear();
  sheetKat.appendRow(["ID Kategori", "Nama Kategori", "Deskripsi", "Link Foto atau PDF Banner", "Badge", "Urutan"]);
  formatHeader(sheetKat, headerBg, headerColor);

  var categoriesData = [
    ["treatment-recommendation", "Treatment Recommendation", "Kumpulan rekomendasi treatment terfavorit, paling dicari, dan terbukti efektif pilihan dokter dermatologis SOZO.", "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=1200&q=80", "Paling Diminati", 1],
    ["glowing-skin", "Glowing Skin", "Kombinasi laser, booster & peeling terkini untuk kulit cerah bercahaya, plumpy, dan bebas kusam.", "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=1200&q=80", "Terpopuler", 2],
    ["pink-plumpy", "Pink Plumpy", "Perawatan bibir & area mata agar tampak merona segar, sehat bervolume, dan bebas garis halus.", "https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=1200&q=80", "Trending", 3],
    ["pigmentation", "Pigmentation & Melasma", "Solusi intensif melasma, flek hitam membandel, dan hiperpigmentasi wajah maupun tubuh.", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80", "", 4],
    ["anti-aging", "Anti-Aging & Lifting", "Rejuvenasi mendalam, collagen stimulator, HIFU Liftera2 & botox untuk kulit kencang awet muda.", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", "Best Value", 5],
    ["acne-free", "Acne Free", "Program kuratif jerawat aktif, komedo, peradangan & kontrol sebum menyeluruh.", "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&w=1200&q=80", "", 6],
    ["scar-free", "Scar Free & Bopeng", "Laser CO2 Fractional, subsisi medis, PRP, dan Rejuran Scar untuk tekstur kulit halus rata.", "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80", "Rekomendasi", 7],
    ["face-slimming", "Face Slimming & V-Shape", "Membentuk kontur rahang V-Shape ideal & mengencangkan double chin tanpa operasi.", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80", "", 8],
    ["body-slimming", "Body Slimming & Contouring", "Meso Slim Premium, RF Body, Ultrasculpt, Lymph Drain & suplemen penghancur lemak.", "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80", "Best Seller", 9],
    ["body-care", "Body Care & Brightening", "Pencerah ketiak, lipatan, punggung, kaki mulus bebas noda & infus glowing multivitamin.", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", "", 10],
    ["thick-healthy-hair", "Thick & Healthy Hair", "Terapi rambut rontok, kebotakan dini, PRP Hair & Japanese Onsen Head Spa relaksasi.", "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80", "", 11],
    ["botox", "Botox Standard & Premium", "Relaksasi kerutan dahi, crow feet, peramping masseter rahang & ketiak bebas keringat berlebih.", "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80", "", 12],
    ["hair-removal", "Hair Removal IPL & DPL", "Bebas bulu halus permanen tanpa rasa sakit untuk underarm, kaki, tangan, dan bikini line.", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", "Unlimited", 13]
  ];
  sheetKat.getRange(2, 1, categoriesData.length, 6).setValues(categoriesData);
  sheetKat.autoResizeColumns(1, 6);

  // =========================================================================
  // TAB 3: DAFTAR TREATMENT & PAKET PER KATEGORI (12 KOLOM TERSTANDARISASI)
  // =========================================================================
  var sheetTreat = getOrCreateSheet(ss, "Daftar_Treatment");
  sheetTreat.clear();
  sheetTreat.appendRow([
    "ID Treatment",
    "ID Kategori",
    "Nama Treatment",
    "Skin Goal",
    "Rincian Isi Treatment (Pisahkan koma)",
    "Harga Normal (RB)",
    "Harga Promo Non-Member (RB)",
    "Harga Promo Member (RB)",
    "Badge Promo",
    "Promo Baru? (TRUE/FALSE)",
    "Khusus Outlet Tertentu",
    "Link Foto Treatment"
  ]);
  formatHeader(sheetTreat, headerBg, headerColor);

  var rawTreatments = [
    // 1. Treatment Recommendation
    ["rec-01", "treatment-recommendation", "Diamond Glow Ultimate Combo", "Glowing", "1x Diamond Peel, 1x IPL Glow Silk, 1x Collagen Peptide Mask", 899, 489, 429, "Top Recommendation", true, "", "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=800&q=80"],
    ["rec-02", "treatment-recommendation", "Korean Glass Skin LHALA Booster", "Glowing", "1x Korean LHALA Peel, 1x Rejuve Laser, 1x SOZO Pink Bomb Booster", 2990, 1299, 1199, "Dokter Favorit", true, "", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
    ["rec-03", "treatment-recommendation", "Picolux Melasma & Pigment Erase", "Pigmentation", "1x Meso Pigment Intensive, 1x Picolux Laser Spot, 1x Soothing Cooling Mask", 2649, 1099, 1028, "Hasil Nyata", false, "", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"],
    ["rec-04", "treatment-recommendation", "Meso Clear Skin Intensive Acne Combo", "Acne Free", "1x Acne Clear Facial, 1x Rejuve Laser, 2x Meso Acne, 2x Biolight Acne", 2494, 1811, 1711, "Solusi Jerawat", false, "", "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&w=800&q=80"],
    ["rec-05", "treatment-recommendation", "V-Shape Face Slimming Signature", "Face Slimming", "1x Meso Lipolysis Double Chin, 1x RF Contouring Jawline, 1x Face Slimming Serum", 2199, 1149, 999, "V-Line Instan", false, "", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],

    // 2. Glowing Skin
    ["glow-01", "glowing-skin", "Diamond Glow", "Glowing", "1x IPL Glow, 1x Diamond Peel, 1x Collagen Mask", 797, 459, 399, "Rekomendasi", true, "", "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=800&q=80"],
    ["glow-02", "glowing-skin", "Dazzling Glow", "Glowing", "1x Massage, 1x Rejuve Laser, 1x Glow Peel", 1746, 889, 829, "Best Seller", false, "", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"],
    ["glow-03", "glowing-skin", "DNA White", "Glowing", "1x Massage, 1x Extraction, 2x Rejuve Laser, 1x SOZO Pink Bomb, 1x Collagen Mask, 1x Biolight Rejuve", 5992, 3295, 3149, "Ultimate", false, "", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
    ["glow-04", "glowing-skin", "Vitaran H Glow Boost", "Glowing", "1x Vitaran H Single, 2x Rejuve Laser", 3638, 2799, 2749, "", true, "", ""],
    ["glow-07", "glowing-skin", "2 in 1 LHALA Brightening Combo", "Glowing", "1x IPL Glow, 1x LhaLa Peel", 1188, 599, 549, "Hemat 50%", false, "", ""],
    ["glow-08", "glowing-skin", "3in1 LHALA Korean Glow", "Glowing", "1x Korean LHALA Peel, 1x Glow Facial, 1x Rejuve Laser", 2926, 999, 949, "Hemat 65%", false, "", ""],
    ["glow-13", "glowing-skin", "Korean LHALA Brightening Boost", "Glowing", "1x Whitening Booster, 1x SOZO Pink Bomb, 2x Rejuve Laser, 2x Korean LHALA Peel", 10450, 4799, 4699, "Favorit", false, "", ""],
    ["glow-16", "glowing-skin", "Juvelook Glow Boost", "Glowing", "1x Juvelook, 2x Rejuve Laser", 13196, 6299, 6199, "", false, "", ""],
    ["glow-20", "glowing-skin", "Profhilo Glow Boost", "Glowing", "1x Profhilo, 2x Rejuve Laser", 8997, 7449, 7349, "", false, "", ""],
    ["glow-21", "glowing-skin", "Sylfirm X + Rejuran Healer", "Glowing", "1x Sylfirm X, 1x Rejuran Healer", 14498, 7298, 7298, "", false, "Hanya di cabang Arteri", ""],

    // 3. Pink Plumpy
    ["pink-01", "pink-plumpy", "Korean Glow Booster (Lips & Eyes)", "Pink Plumpy", "1x Pink Lips Booster, 1x Panda Eye Booster", 3498, 1799, 1749, "Best Value", true, "", ""],
    ["pink-02", "pink-plumpy", "Sakura Pink Lips", "Pink Plumpy", "1x Baby Pink Lips, 1x Pink Lips Laser", 999, 649, 549, "", false, "", ""],

    // 4. Pigmentation & Melasma
    ["pigm-01", "pigmentation", "Melasma Repair Therapy", "Pigmentation", "1x Meso Pigment Face, 1x Picolux Laser", 2649, 1028, 1028, "Efektif", false, "", ""],
    ["pigm-03", "pigmentation", "Triple Melasma Repair Therapy", "Pigmentation", "3x Meso Pigment Face, 3x Picolux Laser", 5892, 3037, 2737, "Paket 3x Sesi", false, "", ""],
    ["pigm-04", "pigmentation", "Xela Melasma Repair Therapy", "Pigmentation", "1x Xela Rederm, 2x Meso Pigment Face, 3x Pico Rejuve Laser, 1x IPL Glow", 14690, 7356, 6956, "", false, "", ""],

    // 5. Anti-Aging & Lifting
    ["anti-01", "anti-aging", "Rewind Signature Face Lift", "Anti-Aging", "1x Ultracol 200, 1x Novuma, 1x Bi-Dens", 26000, 15749, 15549, "Signature", true, "", ""],
    ["anti-05", "anti-aging", "Eye Wrinkle Lift", "Anti-Aging", "1x Botox Standard 30 Unit, 1x Jalupro, 1x HIFU Eye", 11699, 6149, 5999, "", false, "", ""],
    ["anti-06", "anti-aging", "Nefertiti Lift - Korean Premium", "Anti-Aging", "Botox Standard 60 Units, 1x HIFU Double Chin", 5199, 3119, 3119, "Favorit", false, "", ""],

    // 6. Acne Free
    ["acne-01", "acne-free", "Meso Clear Skin Intensive Acne Combo", "Acne Free", "1x Acne Clear Facial, 1x Rejuve Laser, 2x Meso Acne, 2x Biolight Acne", 2494, 1811, 1711, "Rekomendasi", false, "", ""],
    ["acne-02", "acne-free", "30 Days Acne Program Ultimate", "Acne Free", "1x Acne Laser, 2x Biolight Acne, 1x IPL Acne, 2x Acne Injection, 1x Microbotox, 7 Skincare Products", 5941, 2502, 2352, "Program 30 Hari", true, "", ""],
    ["acne-04", "acne-free", "2-in-1 Acne Combo", "Acne Free", "1x IPL Acne, 1x Acne Peel", 698, 399, 399, "Budget Friendly", false, "", ""],

    // 7. Scar Free & Bopeng
    ["scar-01", "scar-free", "Scar Fighter", "Scar Free", "1x Laser CO2 Scar - Full face, 1x Growth Factor Serum, 1x Subsisi", 1997, 1199, 1099, "Bopeng", false, "", ""],
    ["scar-03", "scar-free", "Premium Subscision + Rejuran Scar", "Scar Free", "1x Rejuran Scar, 1x Subsisi, 1x Mini facial", 5947, 3389, 3290, "Hasil Maksimal", false, "", ""],

    // 8. Face Slimming
    ["fslim-01", "face-slimming", "Korean V Shape I", "Face Slimming", "2x Meso V Line, 2x Radiofrequency Face, Botox Standard 40 Unit", 5392, 4049, 3949, "V-Line", false, "", ""],
    ["fslim-04", "face-slimming", "Korean V-Lift Signature", "Face Slimming", "1x Meso V Line, 1x HIFU Double Chin*", 1998, 1399, 1399, "", false, "Hanya di cabang dengan alat HIFU", ""],

    // 9. Body Slimming
    ["bslim-01", "body-slimming", "Instant Slimming", "Body Slimming", "1x Meso Slim Body Premium, 1x Meso Metabolic Boost, 1x Radiofrequency Body", 4896, 2199, 2099, "Best Seller", false, "", ""],
    ["bslim-03", "body-slimming", "3-in-1 Weight Control", "Body Slimming", "1x Ultrasculpt*, 14 Fat Block, 14 Crave Block", 2899, 1249, 1249, "Combo Suplemen", false, "", ""],

    // 10. Thick & Healthy Hair
    ["hair-01", "thick-healthy-hair", "PRP Hair Growth Combo", "Hair", "1x PRP Hair, 1x Biolight Hair, 1x Custom Hair Serum (FREE), 1x Hair Vitamin", 2446, 1520, 1470, "Rekomendasi", false, "", ""],
    ["hair-04", "thick-healthy-hair", "Japanese Onsen Spa* (60 Menit)", "Hair", "13 langkah relaksasi dan pembersihan mendalam kulit kepala (60 menit)", 1400, 599, 549, "Relaksasi", false, "Puri dan Mampang", ""],

    // 11. Botox Standard & Premium
    ["botox-02", "botox", "Botox Standard 50 Unit", "", "50 Unit Botox Standard untuk rahang masseter / kerutan", 3500, 2250, 2250, "Best Seller", false, "", ""],
    ["botox-03", "botox", "Botox Standard 100 Unit", "", "100 Unit Botox Standard untuk multi area / slimming rahang", 7000, 4000, 4000, "Hemat 3 Juta", false, "", ""],

    // 12. Hair Removal IPL & DPL
    ["hr-01", "hair-removal", "Underarm Hair Removal (Buy 2 Get 3)", "", "3 Sesi Underarm Hair Removal IPL (Bayar 2 sesi)", 747, 349, 349, "Beli 2 Dapat 3", false, "", ""],
    ["hr-03", "hair-removal", "Underarm 1 Tahun Unlimited", "", "Bebas treatment Underarm Hair Removal selama 1 tahun penuh", 2988, 1199, 1199, "1 Tahun Unlimited", false, "", ""]
  ];

  // Normalisasi agar setiap baris tepat memiliki 12 kolom
  var normalizedTreatments = rawTreatments.map(function(row) {
    var r = row.slice(0);
    while (r.length < 12) {
      r.push("");
    }
    return r.slice(0, 12);
  });

  sheetTreat.getRange(2, 1, normalizedTreatments.length, 12).setValues(normalizedTreatments);
  sheetTreat.autoResizeColumns(1, 12);

  // =========================================================================
  // TAB 4: PROMO SINGLE TREATMENT & ALA CARTE
  // =========================================================================
  var sheetSingle = getOrCreateSheet(ss, "Promo_Single");
  sheetSingle.clear();
  sheetSingle.appendRow(["ID", "Grup Treatment", "Nama Treatment", "Harga Normal (RB)", "Non-Member (RB)", "Member (RB)", "Khusus Outlet", "Link Foto Treatment"]);
  formatHeader(sheetSingle, headerBg, headerColor);

  var singleData = [
    ["sp-01", "Glow & Rejuve", "Vitaran H Single", 2500, 1999, 1949, "", ""],
    ["sp-02", "Glow & Rejuve", "Korean LHALA Peel", 789, 399, 399, "", ""],
    ["sp-03", "Glow & Rejuve", "SOZO Pink Bomb", 2999, 2499, 2399, "", ""],
    ["sp-04", "Glow & Rejuve", "Rejuran Healer", 6499, 3999, 3899, "", ""],
    ["sp-07", "Glow & Rejuve", "Profhilo", 6999, 6899, 6749, "", ""],
    ["sp-08", "Glow & Rejuve", "Jalupro", 8600, 4399, 4299, "", ""],
    ["sp-10", "Glow & Rejuve", "Juvelook 6cc", 11198, 5599, 5499, "", ""],
    ["sp-12", "Glow & Rejuve", "Sylfirm X*", 7999, 3999, 3999, "Arteri", ""],
    ["sp-17", "Slimming & Contouring", "HIFU Full Face*", 1499, 1249, 1149, "", ""],
    ["sp-18", "Slimming & Contouring", "HIFU Liftera2 Full Face*", 7999, 3999, 3899, "", ""],
    ["sp-19", "Slimming & Contouring", "Ultrasculpt*", 899, 449, 399, "", ""],
    ["sp-22", "Acne & Scar", "Laser CO2 Scar Full Face*", 1499, 799, 699, "", ""],
    ["sp-23", "Acne & Scar", "PRP Wajah", 1499, 1079, 979, "", ""],
    ["sp-28", "Anti-Aging", "Ultracol 100", 7000, 4999, 4949, "", ""],
    ["sp-29", "Anti-Aging", "Ultracol 200", 9000, 5599, 5549, "", ""],
    ["sp-32", "Hair Grow", "Hair Grow", 1499, 1299, 1149, "", ""],
    ["sp-33", "Hair Grow", "PRP Hair Grow", 1799, 1099, 999, "", ""]
  ];
  sheetSingle.getRange(2, 1, singleData.length, 8).setValues(singleData);
  sheetSingle.autoResizeColumns(1, 8);

  // =========================================================================
  // TAB 5: PAKET SUBSCRIPTION / MULTISESI (3X, 6X, 12X)
  // =========================================================================
  var sheetSub = getOrCreateSheet(ss, "Subscription_Paket");
  sheetSub.clear();
  sheetSub.appendRow([
    "ID", "Nama Treatment", "Harga Single (RB)",
    "3x Normal", "3x Non-Member", "3x Member", "3x Sesi/Member",
    "6x Normal", "6x Non-Member", "6x Member", "6x Sesi/Member",
    "12x Normal", "12x Non-Member", "12x Member", "12x Sesi/Member",
    "Link Foto Treatment"
  ]);
  formatHeader(sheetSub, headerBg, headerColor);

  var subData = [
    ["sub-01", "Laser (Nanolux / Picolux)", 1199, 3597, 1978, 1878, 626, 7194, 3237, 3137, 522, 14388, 5755, 5655, 471, ""],
    ["sub-02", "Diamond Laser Facial", 1499, 4497, 2248, 2148, 716, 8994, 4317, 4217, 702, "", "", "", "", ""],
    ["sub-04", "IPL Glow", 399, 1197, 897, 797, 265, 2394, 1556, 1456, 242, "", "", "", "", ""],
    ["sub-06", "HIFU Full Face", 1149, 4497, 2847, 2649, 883, 8994, 5394, 5099, 849, "", "", "", "", ""]
  ];
  sheetSub.getRange(2, 1, subData.length, 16).setValues(subData);
  sheetSub.autoResizeColumns(1, 16);

  // =========================================================================
  // TAB 6: DAFTAR KLINIK & CABANG SOZO (BISA DITAMBAH / DIUBAH DI SHEET)
  // =========================================================================
  var sheetBranches = getOrCreateSheet(ss, "Daftar_Klinik_Cabang");
  sheetBranches.clear();
  sheetBranches.appendRow(["ID Cabang", "Kota", "Nama Cabang", "Alamat Lengkap", "Nomor WhatsApp / Telp", "Jam Operasional"]);
  formatHeader(sheetBranches, headerBg, headerColor);

  var branchesData = [
    ["b-01", "Jakarta Selatan", "SOZO Arteri", "Jl. Iskandar Muda No.68A, RT.3/RW.2, Kebayoran Lama Utara", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-02", "Jakarta Selatan", "SOZO Kemang", "Jl. Kemang Raya No.72, RT.4/RW.2, Bangka, Kec. Mampang Prapatan", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-03", "Jakarta Selatan", "SOZO Tebet", "Jl. Tebet Utara Dalam No. 3A RT. 003 RW 002 Blok V", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-04", "Jakarta Pusat", "SOZO Benhil", "Jl. Bendungan Hilir No. 8 RT 11/RW 3, Tanah Abang", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-05", "Jakarta Barat", "SOZO Tanjung Duren", "Jl. Tanjung Duren Raya, No. 41D", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-06", "Jakarta Barat", "SOZO Puri Indah", "Jl. Puri Indah Raya Blok T1 No.3A, Kembangan", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-07", "Jakarta Utara", "SOZO PIK", "Ruko Arcade, Jl. Pantai Indah Utara 2, RT 2/RW 7, Penjaringan", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-08", "Jakarta Utara", "SOZO Kelapa Gading", "Boulevard Raya Blok H4 No.6, Klp. Gading Timur", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-09", "Bandung", "SOZO Bandung Pajajaran", "Jl. Pajajaran No. 68, Pamoyanan, Cicendo, Bandung", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-10", "Surabaya", "SOZO Surabaya Darmo", "Office Park, Jl. Mayjend. Jonosewojo, Surabaya", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-11", "Surabaya", "SOZO Surabaya Manyar", "Jl. Manyar Kertoarjo No.10A, Mojo, Gubeng, Surabaya", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-12", "Medan", "SOZO Medan Iskandar Muda", "Jl. Iskandar Muda No.23, Merdeka, Medan Baru", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-13", "Bali", "SOZO Bali Renon", "Jl. Raya Puputan No.190 B, Renon, Denpasar Selatan", "6281234567890", "10:00 - 20:00 WITA"],
    ["b-14", "Semarang", "SOZO Semarang Karangkidul", "Jl. Mayjend Sutoyo No.93 Karangkidul, Semarang", "6281234567890", "10:00 - 20:00 WIB"],
    ["b-15", "Yogyakarta", "SOZO Yogyakarta Diponegoro", "Jl. Pangeran Diponegoro No. 58, Jetis, Kota Yogyakarta", "6281234567890", "10:00 - 20:00 WIB"]
  ];
  sheetBranches.getRange(2, 1, branchesData.length, 6).setValues(branchesData);
  sheetBranches.autoResizeColumns(1, 6);

  // =========================================================================
  // TAB 7: PAKET SKINCARE & HOMECARE (BISA DIATUR DI SHEET)
  // =========================================================================
  var sheetSkincare = getOrCreateSheet(ss, "Skincare_Homecare");
  sheetSkincare.clear();
  sheetSkincare.appendRow(["ID Produk", "Nama Paket Skincare", "Harga Normal (Rp)", "Harga Promo (Rp)", "Isi Produk (Pisahkan koma)", "Free Gift / Bonus", "Link Foto Produk"]);
  formatHeader(sheetSkincare, headerBg, headerColor);

  var skincareData = [
    ["sk-01", "Acne Ultimate Complete Kit", 899000, 599000, "1 Facial Wash, 1 Toner BHA, 1 Serum Niacinamide, 1 Acne Day Cream, 1 Acne Night Gel, 1 Spot Treatment", "Free Exclusive Pouch & Spatula", ""],
    ["sk-02", "Acne Calm & Clear Kit", 699000, 496037, "1 Facial Wash, 1 Acne Solution, 1 Day Cream, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen", "Free Exclusive SOZO Pouch", ""],
    ["sk-03", "Acne Deep Clear Kit", 799000, 540848, "1 Facial Wash, 1 Acne Solution, 1 Day Cream, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen", "Free Exclusive SOZO Pouch", ""],
    ["sk-04", "Acne Balance Kit", 704470, 396581, "1 Facial Wash, 1 Acne Solution, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen, 1 Serum", "Free Exclusive SOZO Pouch", ""],
    ["sk-05", "Radiance Bright Kit", 649000, 475418, "1 Facial Wash, 1 Serum, 1 Night Cream, 1 Moisturizer, 1 Sunscreen", "Free Exclusive SOZO Pouch", ""],
    ["sk-06", "Forever Young Kit", 649000, 475418, "1 Facial Wash, 1 Serum, 1 Night Cream, 1 Moisturizer, 1 Sunscreen", "Free Exclusive SOZO Pouch", ""],
    ["sk-07", "Paket Anti Hair Fall", 580000, 550000, "1 Custom Hair Serum, 1 Hair Vitamin", "Free Consultation", ""]
  ];
  sheetSkincare.getRange(2, 1, skincareData.length, 7).setValues(skincareData);
  sheetSkincare.autoResizeColumns(1, 7);

  // Bersihkan sheet bawaan (Sheet1) jika masih kosong
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sheet 1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() <= 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  Logger.log("SETUP BERHASIL! 7 Tab Database Buku BAU SOZO Skin Clinic siap digunakan di: " + ss.getUrl());
  return {
    status: "success",
    spreadsheetUrl: ss.getUrl(),
    spreadsheetId: ss.getId(),
    message: "Berhasil menulis seluruh pengaturan, promo, kategori, treatment, cabang, dan skincare ke Spreadsheet!"
  };
}

function formatHeader(sheet, bgColor, textColor) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var range = sheet.getRange(1, 1, 1, lastCol);
  range.setBackground(bgColor);
  range.setFontColor(textColor);
  range.setFontWeight("bold");
  sheet.setFrozenRows(1);
}

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function doGet(e) {
  if (e && e.parameter && (e.parameter.action === 'getData' || e.parameter.api === 'true')) {
    var data = getAllBauData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var template = HtmlService.createTemplateFromFile('Index');
  try {
    template.initialDataJson = JSON.stringify(getAllBauData());
  } catch(err) {
    template.initialDataJson = JSON.stringify(getFallbackBauData("Gagal inisialisasi awal: " + err.toString()));
  }
  return template.evaluate()
    .setTitle('SOZO Skin Clinic - Buku BAU Interaktif')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function runAutoSetupFromWeb() {
  try {
    return setupSpreadsheet();
  } catch (err) {
    return {
      status: "error",
      message: "Gagal menulis ke Spreadsheet: " + err.toString()
    };
  }
}

/**
 * Membaca seluruh data dari 7 Tab di Spreadsheet secara real-time.
 */
function getAllBauData() {
  try {
    var ss = getTargetSpreadsheet();

    if (!ss) {
      return getFallbackBauData("Spreadsheet belum terhubung. Buka file Google Spreadsheet Anda, klik [Ekstensi] > [Apps Script] dan jalankan setupSpreadsheet(), atau isi TARGET_SPREADSHEET_ID_OR_URL di Code.gs.");
    }
    
    // 1. Tab Pengaturan_Klinik
    var configSheet = ss.getSheetByName("Pengaturan_Klinik");
    var config = {};
    if (configSheet && configSheet.getLastRow() > 1) {
      var cVals = configSheet.getRange(2, 1, configSheet.getLastRow() - 1, 2).getValues();
      for (var i = 0; i < cVals.length; i++) {
        if (cVals[i][0]) config[cVals[i][0]] = cVals[i][1];
      }
    }

    // 2. Tab Kategori
    var katSheet = ss.getSheetByName("Kategori");
    var categories = [];
    if (katSheet && katSheet.getLastRow() > 1) {
      var kVals = katSheet.getRange(2, 1, katSheet.getLastRow() - 1, 6).getValues();
      for (var j = 0; j < kVals.length; j++) {
        if (kVals[j][0]) {
          categories.push({
            id: String(kVals[j][0]),
            name: String(kVals[j][1]),
            description: String(kVals[j][2]),
            pdfOrPhotoUrl: String(kVals[j][3]),
            badge: String(kVals[j][4]),
            order: Number(kVals[j][5]) || 0
          });
        }
      }
    }

    // 3. Tab Daftar_Treatment
    var treatSheet = ss.getSheetByName("Daftar_Treatment");
    var treatments = [];
    if (treatSheet && treatSheet.getLastRow() > 1) {
      var lastCol = treatSheet.getLastColumn();
      var tVals = treatSheet.getRange(2, 1, treatSheet.getLastRow() - 1, lastCol).getValues();
      for (var k = 0; k < tVals.length; k++) {
        if (tVals[k][0]) {
          var incStr = String(tVals[k][4] || "");
          var incArr = incStr ? incStr.split(',').map(function(s) { return s.trim(); }) : [];
          treatments.push({
            id: String(tVals[k][0]),
            categoryId: String(tVals[k][1]),
            name: String(tVals[k][2]),
            skinGoal: String(tVals[k][3] || ""),
            inclusions: incArr,
            originalPrice: Number(tVals[k][5]) || 0,
            nonMemberPrice: Number(tVals[k][6]) || 0,
            memberPrice: Number(tVals[k][7]) || 0,
            badge: String(tVals[k][8] || ""),
            isNewPromo: lastCol >= 10 ? Boolean(tVals[k][9]) : false,
            outletNotes: lastCol >= 11 ? String(tVals[k][10] || "") : "",
            photoUrl: lastCol >= 12 ? String(tVals[k][11] || "") : ""
          });
        }
      }
    }

    // 4. Tab Promo_Single
    var singleSheet = ss.getSheetByName("Promo_Single");
    var singlePromos = [];
    if (singleSheet && singleSheet.getLastRow() > 1) {
      var sVals = singleSheet.getRange(2, 1, singleSheet.getLastRow() - 1, Math.max(singleSheet.getLastColumn(), 7)).getValues();
      for (var m = 0; m < sVals.length; m++) {
        if (sVals[m][0]) {
          singlePromos.push({
            id: String(sVals[m][0]),
            group: String(sVals[m][1]),
            name: String(sVals[m][2]),
            originalPrice: Number(sVals[m][3]) || 0,
            nonMemberPrice: Number(sVals[m][4]) || 0,
            memberPrice: Number(sVals[m][5]) || 0,
            outletRestricted: String(sVals[m][6] || ""),
            photoUrl: sVals[m][7] ? String(sVals[m][7]) : ""
          });
        }
      }
    }

    // 5. Tab Daftar_Klinik_Cabang
    var branchSheet = ss.getSheetByName("Daftar_Klinik_Cabang");
    var branches = [];
    if (branchSheet && branchSheet.getLastRow() > 1) {
      var bVals = branchSheet.getRange(2, 1, branchSheet.getLastRow() - 1, Math.max(branchSheet.getLastColumn(), 6)).getValues();
      for (var b = 0; b < bVals.length; b++) {
        if (bVals[b][0]) {
          branches.push({
            id: String(bVals[b][0]),
            city: String(bVals[b][1] || ""),
            name: String(bVals[b][2] || ""),
            address: String(bVals[b][3] || ""),
            phone: String(bVals[b][4] || ""),
            operatingHours: String(bVals[b][5] || "")
          });
        }
      }
    }

    // 6. Tab Skincare_Homecare
    var skinSheet = ss.getSheetByName("Skincare_Homecare");
    var skincareKits = [];
    if (skinSheet && skinSheet.getLastRow() > 1) {
      var skVals = skinSheet.getRange(2, 1, skinSheet.getLastRow() - 1, Math.max(skinSheet.getLastColumn(), 7)).getValues();
      for (var sk = 0; sk < skVals.length; sk++) {
        if (skVals[sk][0]) {
          var itemsStr = String(skVals[sk][4] || "");
          var itemsArr = itemsStr ? itemsStr.split(',').map(function(s) { return s.trim(); }) : [];
          skincareKits.push({
            id: String(skVals[sk][0]),
            name: String(skVals[sk][1]),
            originalPrice: Number(skVals[sk][2]) || 0,
            promoPrice: Number(skVals[sk][3]) || 0,
            items: itemsArr,
            freeGift: String(skVals[sk][5] || ""),
            photoUrl: String(skVals[sk][6] || "")
          });
        }
      }
    }

    // Jika spreadsheet kosong atau data belum ada, kembalikan data bawaan
    if (categories.length === 0 || treatments.length === 0) {
      return getFallbackBauData("Spreadsheet ditemukan namun data sheet masih kosong. Menggunakan data bawaan Buku BAU.");
    }

    return {
      status: "success",
      config: config,
      categories: categories,
      treatments: treatments,
      singlePromos: singlePromos,
      branches: branches,
      skincareKits: skincareKits,
      spreadsheetUrl: ss.getUrl(),
      lastUpdated: new Date().toISOString()
    };
  } catch (err) {
    Logger.log("Error in getAllBauData: " + err.toString());
    return getFallbackBauData("Koneksi Spreadsheet tertunda: " + err.toString());
  }
}

function getFallbackBauData(warningMsg) {
  return {
    status: "fallback",
    warning: warningMsg,
    config: {
      CLINIC_NAME: "SOZO Skin Clinic",
      PROMO_TITLE: "Merdeka Berani Glowing",
      PROMO_SUBTITLE: "Dapatkan kulit sehat, cerah, dan bebas masalah dengan penawaran treatment terbaik. Tersedia Cicilan 0% Paylater & Cashback hingga 500 RB!",
      PROMO_BADGE: "Promo Spesial Buku BAU 2026",
      PAYMENT_PARTNERS: "Indodana • Kredivo • Atome • SPayLater • BCA • BRI • Mandiri",
      TAGLINE: "Merdeka Berani Glowing - Cicilan 0% Paylater & Cashback hingga 500 RB",
      PERIOD_TEXT: "Berlaku untuk booking periode 1 - 31 Agustus 2026",
      BOOKING_DP: "50000",
      SERVICE_CHARGE_PCT: "5",
      SERVICE_CHARGE_MAX: "150000",
      VALIDITY_MONTHS: "6",
      WHATSAPP_CS: "6281234567890"
    },
    categories: [
      { id: "treatment-recommendation", name: "Treatment Recommendation", description: "Kumpulan rekomendasi treatment terfavorit, paling dicari, dan terbukti efektif pilihan dokter dermatologis SOZO.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=1200&q=80", badge: "Paling Diminati", order: 1 },
      { id: "glowing-skin", name: "Glowing Skin", description: "Kombinasi laser, booster & peeling terkini untuk kulit cerah bercahaya, plumpy, dan bebas kusam.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=1200&q=80", badge: "Terpopuler", order: 2 },
      { id: "pink-plumpy", name: "Pink Plumpy", description: "Perawatan bibir & area mata agar tampak merona segar, sehat bervolume, dan bebas garis halus.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=1200&q=80", badge: "Trending", order: 3 },
      { id: "pigmentation", name: "Pigmentation & Melasma", description: "Solusi intensif melasma, flek hitam membandel, dan hiperpigmentasi wajah maupun tubuh.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80", badge: "", order: 4 },
      { id: "anti-aging", name: "Anti-Aging & Lifting", description: "Rejuvenasi mendalam, collagen stimulator, HIFU Liftera2 & botox untuk kulit kencang awet muda.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", badge: "Best Value", order: 5 },
      { id: "acne-free", name: "Acne Free", description: "Program kuratif jerawat aktif, komedo, peradangan & kontrol sebum menyeluruh.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&w=1200&q=80", badge: "", order: 6 },
      { id: "scar-free", name: "Scar Free & Bopeng", description: "Laser CO2 Fractional, subsisi medis, PRP, dan Rejuran Scar untuk tekstur kulit halus rata.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1200&q=80", badge: "Rekomendasi", order: 7 },
      { id: "face-slimming", name: "Face Slimming & V-Shape", description: "Membentuk kontur rahang V-Shape ideal & mengencangkan double chin tanpa operasi.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80", badge: "", order: 8 },
      { id: "body-slimming", name: "Body Slimming & Contouring", description: "Meso Slim Premium, RF Body, Ultrasculpt, Lymph Drain & suplemen penghancur lemak.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80", badge: "Best Seller", order: 9 },
      { id: "body-care", name: "Body Care & Brightening", description: "Pencerah ketiak, lipatan, punggung, kaki mulus bebas noda & infus glowing multivitamin.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80", badge: "", order: 10 },
      { id: "thick-healthy-hair", name: "Thick & Healthy Hair", description: "Terapi rambut rontok, kebotakan dini, PRP Hair & Japanese Onsen Head Spa relaksasi.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80", badge: "", order: 11 },
      { id: "botox", name: "Botox Standard & Premium", description: "Relaksasi kerutan dahi, crow feet, peramping masseter rahang & ketiak bebas keringat berlebih.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80", badge: "", order: 12 },
      { id: "hair-removal", name: "Hair Removal IPL & DPL", description: "Bebas bulu halus permanen tanpa rasa sakit untuk underarm, kaki, tangan, dan bikini line.", pdfOrPhotoUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", badge: "Unlimited", order: 13 }
    ],
    treatments: [
      { id: "rec-01", categoryId: "treatment-recommendation", name: "Diamond Glow Ultimate Combo", skinGoal: "Glowing", inclusions: ["1x Diamond Peel", "1x IPL Glow Silk", "1x Collagen Peptide Mask"], originalPrice: 899, nonMemberPrice: 489, memberPrice: 429, badge: "Top Recommendation", isNewPromo: true, outletNotes: "", photoUrl: "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=800&q=80" },
      { id: "glow-01", categoryId: "glowing-skin", name: "Diamond Glow", skinGoal: "Glowing", inclusions: ["1x IPL Glow", "1x Diamond Peel", "1x Collagen Mask"], originalPrice: 797, nonMemberPrice: 459, memberPrice: 399, badge: "Rekomendasi", isNewPromo: true, outletNotes: "", photoUrl: "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=800&q=80" },
      { id: "glow-02", categoryId: "glowing-skin", name: "Dazzling Glow", skinGoal: "Glowing", inclusions: ["1x Massage", "1x Rejuve Laser", "1x Glow Peel"], originalPrice: 1746, nonMemberPrice: 889, memberPrice: 829, badge: "Best Seller", isNewPromo: false, outletNotes: "", photoUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80" },
      { id: "glow-03", categoryId: "glowing-skin", name: "DNA White", skinGoal: "Glowing", inclusions: ["1x Massage", "1x Extraction", "2x Rejuve Laser", "1x SOZO Pink Bomb", "1x Collagen Mask", "1x Biolight Rejuve"], originalPrice: 5992, nonMemberPrice: 3295, memberPrice: 3149, badge: "Ultimate", isNewPromo: false, outletNotes: "", photoUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" },
      { id: "glow-04", categoryId: "glowing-skin", name: "Vitaran H Glow Boost", skinGoal: "Glowing", inclusions: ["1x Vitaran H Single", "2x Rejuve Laser"], originalPrice: 3638, nonMemberPrice: 2799, memberPrice: 2749, badge: "", isNewPromo: true, outletNotes: "", photoUrl: "" },
      { id: "glow-07", categoryId: "glowing-skin", name: "2 in 1 LHALA Brightening Combo", skinGoal: "Glowing", inclusions: ["1x IPL Glow", "1x LhaLa Peel"], originalPrice: 1188, nonMemberPrice: 599, memberPrice: 549, badge: "Hemat 50%", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "glow-08", categoryId: "glowing-skin", name: "3in1 LHALA Korean Glow", skinGoal: "Glowing", inclusions: ["1x Korean LHALA Peel", "1x Glow Facial", "1x Rejuve Laser"], originalPrice: 2926, nonMemberPrice: 999, memberPrice: 949, badge: "Hemat 65%", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "pink-01", categoryId: "pink-plumpy", name: "Korean Glow Booster (Lips & Eyes)", skinGoal: "Pink Plumpy", inclusions: ["1x Pink Lips Booster", "1x Panda Eye Booster"], originalPrice: 3498, nonMemberPrice: 1799, memberPrice: 1749, badge: "Best Value", isNewPromo: true, outletNotes: "", photoUrl: "" },
      { id: "pigm-01", categoryId: "pigmentation", name: "Melasma Repair Therapy", skinGoal: "Pigmentation", inclusions: ["1x Meso Pigment Face", "1x Picolux Laser"], originalPrice: 2649, nonMemberPrice: 1028, memberPrice: 1028, badge: "Efektif", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "anti-01", categoryId: "anti-aging", name: "Rewind Signature Face Lift", skinGoal: "Anti-Aging", inclusions: ["1x Ultracol 200", "1x Novuma", "1x Bi-Dens"], originalPrice: 26000, nonMemberPrice: 15749, memberPrice: 15549, badge: "Signature", isNewPromo: true, outletNotes: "", photoUrl: "" },
      { id: "acne-01", categoryId: "acne-free", name: "Meso Clear Skin Intensive Acne Combo", skinGoal: "Acne Free", inclusions: ["1x Acne Clear Facial", "1x Rejuve Laser", "2x Meso Acne", "2x Biolight Acne"], originalPrice: 2494, nonMemberPrice: 1811, memberPrice: 1711, badge: "Rekomendasi", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "scar-01", categoryId: "scar-free", name: "Scar Fighter", skinGoal: "Scar Free", inclusions: ["1x Laser CO2 Scar - Full face", "1x Growth Factor Serum", "1x Subsisi"], originalPrice: 1997, nonMemberPrice: 1199, memberPrice: 1099, badge: "Bopeng", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "fslim-01", categoryId: "face-slimming", name: "Korean V Shape I", skinGoal: "Face Slimming", inclusions: ["2x Meso V Line", "2x Radiofrequency Face", "Botox Standard 40 Unit"], originalPrice: 5392, nonMemberPrice: 4049, memberPrice: 3949, badge: "V-Line", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "bslim-01", categoryId: "body-slimming", name: "Instant Slimming", skinGoal: "Body Slimming", inclusions: ["1x Meso Slim Body Premium", "1x Meso Metabolic Boost", "1x Radiofrequency Body"], originalPrice: 4896, nonMemberPrice: 2199, memberPrice: 2099, badge: "Best Seller", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "hair-01", categoryId: "thick-healthy-hair", name: "PRP Hair Growth Combo", skinGoal: "Hair", inclusions: ["1x PRP Hair", "1x Biolight Hair", "1x Custom Hair Serum (FREE)", "1x Hair Vitamin"], originalPrice: 2446, nonMemberPrice: 1520, memberPrice: 1470, badge: "Rekomendasi", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "botox-02", categoryId: "botox", name: "Botox Standard 50 Unit", skinGoal: "Botox", inclusions: ["50 Unit Botox Standard untuk rahang masseter / kerutan"], originalPrice: 3500, nonMemberPrice: 2250, memberPrice: 2250, badge: "Best Seller", isNewPromo: false, outletNotes: "", photoUrl: "" },
      { id: "hr-01", categoryId: "hair-removal", name: "Underarm Hair Removal (Buy 2 Get 3)", skinGoal: "Hair Removal", inclusions: ["3 Sesi Underarm Hair Removal IPL (Bayar 2 sesi)"], originalPrice: 747, nonMemberPrice: 349, memberPrice: 349, badge: "Beli 2 Dapat 3", isNewPromo: false, outletNotes: "", photoUrl: "" }
    ],
    singlePromos: [
      { id: "sp-01", group: "Glow & Rejuve", name: "Vitaran H Single", originalPrice: 2500, nonMemberPrice: 1999, memberPrice: 1949, outletRestricted: "" },
      { id: "sp-02", group: "Glow & Rejuve", name: "Korean LHALA Peel", originalPrice: 789, nonMemberPrice: 399, memberPrice: 399, outletRestricted: "" },
      { id: "sp-03", group: "Glow & Rejuve", name: "SOZO Pink Bomb", originalPrice: 2999, nonMemberPrice: 2499, memberPrice: 2399, outletRestricted: "" },
      { id: "sp-04", group: "Glow & Rejuve", name: "Rejuran Healer", originalPrice: 6499, nonMemberPrice: 3999, memberPrice: 3899, outletRestricted: "" },
      { id: "sp-17", group: "Slimming & Contouring", name: "HIFU Full Face", originalPrice: 1499, nonMemberPrice: 1249, memberPrice: 1149, outletRestricted: "" }
    ],
    branches: [
      { id: "b-01", city: "Jakarta Selatan", name: "SOZO Arteri", address: "Jl. Iskandar Muda No.68A, RT.3/RW.2, Kebayoran Lama Utara", phone: "6281234567890", operatingHours: "10:00 - 20:00 WIB" },
      { id: "b-02", city: "Jakarta Selatan", name: "SOZO Kemang", address: "Jl. Kemang Raya No.72, RT.4/RW.2, Bangka, Kec. Mampang Prapatan", phone: "6281234567890", operatingHours: "10:00 - 20:00 WIB" },
      { id: "b-06", city: "Jakarta Barat", name: "SOZO Puri Indah", address: "Jl. Puri Indah Raya Blok T1 No.3A, Kembangan", phone: "6281234567890", operatingHours: "10:00 - 20:00 WIB" },
      { id: "b-07", city: "Jakarta Utara", name: "SOZO PIK", address: "Ruko Arcade, Jl. Pantai Indah Utara 2, RT 2/RW 7, Penjaringan", phone: "6281234567890", operatingHours: "10:00 - 20:00 WIB" }
    ],
    skincareKits: [
      { id: "sk-01", name: "Acne Ultimate Complete Kit", originalPrice: 899000, promoPrice: 599000, items: ["1 Facial Wash", "1 Toner BHA", "1 Serum Niacinamide", "1 Acne Day Cream", "1 Acne Night Gel", "1 Spot Treatment"], freeGift: "Free Exclusive Pouch & Spatula" }
    ],
    spreadsheetUrl: "",
    lastUpdated: new Date().toISOString()
  };
}
