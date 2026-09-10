import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// 1. Pengaturan Klinik (matching EXACT format of Google Sheets)
const configData = [
  ["Kunci Parameter", "Nilai", "Keterangan"],
  ["CLINIC_NAME", "SOZO Skin Clinic", "Nama Resmi Klinik"],
  ["PROMO_TITLE", "Rona Cantik Bersemi", "Judul Besar Banner Promo Utama (Bisa Diubah Kapan Saja)"],
  ["PROMO_SUBTITLE", "Dapatkan kulit sehat, cerah, dan bebas masalah dengan penawaran treatment terbaik. Tersedia Cicilan 0% Paylater & Cashback hingga 500 RB!", "Narasi / Deskripsi Promo di Bawah Judul"],
  ["PROMO_BADGE", "Promo Spesial Buku BAU 2026", "Label / Badge di Atas Judul Promo"],
  ["PAYMENT_PARTNERS", "Indodana • Kredivo • Atome • SPayLater • BCA • BRI • Mandiri", "Daftar Partner Cicilan & Pembayaran"],
  ["TAGLINE", "Cicilan 0% Paylater & Cashback hingga 500 RB", "Slogan / Header Web App"],
  ["PERIOD_TEXT", "Berlaku untuk booking periode 1 - 30 September 2026", "Periode Promo Aktif"],
  ["BOOKING_DP", "50000", "Nominal DP Booking Appointment (Rupiah)"],
  ["SERVICE_CHARGE_PCT", "5", "Persentase Service Charge (%)"],
  ["SERVICE_CHARGE_MAX", "150000", "Batas Maksimal Service Charge (Rupiah)"],
  ["VALIDITY_MONTHS", "6", "Masa Berlaku Paket (Bulan)"],
  ["WHATSAPP_CS", "6281234567890", "Nomor WhatsApp CS untuk Booking Order"],
  ["ACCESS_PASSWORD", "sozoskinjayajaya", "Password untuk Membuka Web App Buku Menu (Kosongkan jika ingin publik)"],

  // Banner Kustomisasi
  ["SUBSCRIPTION_PAGE_BADGE", "Buku BAU Hal. 72 - 80", "Badge Halaman Subscription (misal: Buku BAU Hal. 72 - 80)"],
  ["SUBSCRIPTION_TAG_BADGE", "Maksimal Hemat", "Badge Tag Subscription (misal: Maksimal Hemat)"],
  ["SUBSCRIPTION_TITLE", "Paket Treatment Subscription (Langganan Sesi)", "Judul Banner Paket Subscription"],
  ["SUBSCRIPTION_SUBTITLE", "Dapatkan harga per sesi jauh lebih murah dengan berlangganan paket 3x, 6x, hingga 12x sesi perawatan rutin.", "Deskripsi / Narasi di Bawah Judul Subscription"],
  ["SUBSCRIPTION_TERMS_TITLE", "Masa Berlaku Paket:", "Judul Kotak Informasi Masa Berlaku"],
  ["SUBSCRIPTION_TERMS_LIST", "• Paket 3x: berlaku hingga 5 bulan\n• Paket 6x: berlaku hingga 8 bulan\n• Paket 12x: berlaku hingga 14 bulan", "Poin-poin Masa Berlaku Paket Subscription (Gunakan baris baru/Enter)"],

  ["SINGLE_PROMO_PAGE_BADGE", "Buku BAU Hal. 9 - 10", "Badge Halaman Single Promo (misal: Buku BAU Hal. 9 - 10)"],
  ["SINGLE_PROMO_TAG_BADGE", "Harga Satuan Promo", "Badge Tag Single Promo (misal: Harga Satuan Promo)"],
  ["SINGLE_PROMO_TITLE", "Promo Single Treatment", "Judul Banner Single Promo"],
  ["SINGLE_PROMO_SUBTITLE", "Pilihan perawatan satuan dengan harga spesial. Hemat lebih banyak untuk member terdaftar.", "Deskripsi Single Promo"],

  ["SKINCARE_PAGE_BADGE", "Buku BAU Hal. 82 - 85", "Badge Halaman Skincare Kit (misal: Buku BAU Hal. 82 - 85)"],
  ["SKINCARE_TAG_BADGE", "FREE Exclusive SOZO Pouch", "Badge Tag Skincare Kit (misal: FREE Exclusive SOZO Pouch)"],
  ["SKINCARE_TITLE", "Paket Skincare Kit Bundling", "Judul Banner Skincare Kit"],
  ["SKINCARE_SUBTITLE", "Formula dermatologis teruji klinis untuk perawatan harian di rumah. Sudah termasuk PPN 11%.", "Deskripsi Skincare Kit"]
];

// 2. Kategori
const categoriesData = [
  ["ID Kategori", "Nama Kategori", "Deskripsi", "Link Foto atau PDF Banner", "Badge", "Urutan"],
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

// 3. Daftar Treatment & Paket (from Internal Memo September 2026)
const treatmentsData = [
  [
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
  ],

  // 1. Treatment Recommendation
  ["rec-01", "treatment-recommendation", "Diamond Glow", "Glowing", "1x IPL Glow, 1x Diamond Peel, 1x Collagen Mask", 797, 459, 399, "Paling Diminati", true, "", "https://images.unsplash.com/photo-1512290900672-1f4f9f257a41?auto=format&fit=crop&w=800&q=80"],
  ["rec-02", "treatment-recommendation", "Dazzling Glow", "Glowing", "1x Massage, 1x Rejuve Laser, 1x Glow Peel", 1746, 889, 829, "Favorit", false, "", "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"],
  ["rec-03", "treatment-recommendation", "DNA White", "Glowing", "1x Massage, 1x Extraction, 2x Rejuve Laser, 1x Sozo Pink Bomb, 1x Collagen Mask, 1x Biolight Rejuve", 5992, 3295, 3149, "Ultimate Glowing", true, "", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
  ["rec-04", "treatment-recommendation", "Korean Glow Booster", "Pink Plumpy", "1x Pink Lips Booster, 1x Panda Eye Booster", 3498, 1799, 1749, "Lips & Eye", true, "", "https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80"],
  ["rec-05", "treatment-recommendation", "Meso Clear Skin Intensive Acne Combo", "Acne Free", "1x Acne clear facial, 1x Rejuve Laser, 2x Meso acne, 2x Biolight Acne", 2494, 1811, 1711, "Solusi Jerawat", false, "", "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&w=800&q=80"],
  ["rec-06", "treatment-recommendation", "30 Days Acne Program Ultimate", "Acne Free", "1x Acne Laser, 2x Biolight Acne, 1x IPL Acne, 7 Skin Products (Facial Wash, Acne Solution, Day Cream, Night Cream, Moisturizer, Acne Sunscreen, Acne Spot), 2x Acne Injection, 1x Microbotox", 5942, 2502, 2352, "Program 30 Hari", true, "", ""],
  ["rec-07", "treatment-recommendation", "60 Days Acne Program Ultimate", "Acne Free", "1x Acne Laser, 3x Biolight Acne, 2x Acne Peel, 2x IPL Acne, 7 Skincare Products, 4x Acne Injection, 1x Microbotox", 7396, 3354, 3204, "Program 60 Hari", true, "", ""],
  ["rec-08", "treatment-recommendation", "Scar Fighter", "Scar Free", "1x Laser CO2 Scar - Full face, 1x Growth Factor Serum, 1x Subsisi", 1997, 1199, 1099, "Bopeng Pudar", false, "", "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"],
  ["rec-09", "treatment-recommendation", "Scar Repair PRP I", "Scar Free", "1x PRP, 1x Biolight Rejuve, 1x Collagen Mask, 1x Subsisi", 1996, 1376, 1309, "Regenerasi Kulit", false, "", ""],
  ["rec-10", "treatment-recommendation", "Premium Subscision", "Scar Free", "1x Rejuran Scar, 1x Subsisi, 1x Mini facial", 5947, 3389, 3290, "Dokter Pilihan", true, "", ""],
  ["rec-11", "treatment-recommendation", "Korean Legs", "Body Care", "1x IPL Glow, 1x Hair Removal Large, 1x Body Whitening Peel", 1497, 699, 657, "Kaki Mulus", false, "", "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"],
  ["rec-12", "treatment-recommendation", "Korean Back I", "Body Care", "1x IPL Acne, 1x Backne Peel, 1x Skincare Product: Acne Lotion", 1047, 699, 599, "Punggung Mulus", false, "", ""],
  ["rec-13", "treatment-recommendation", "Underarm Brightening", "Body Care", "1x IPL Glow, 1x Underarm Peeling", 698, 379, 379, "Ketiak Cerah", false, "", ""],
  ["rec-14", "treatment-recommendation", "Radiant Skin Glow", "Body Care", "1x Premium Glow Infusion, 2x Lightening Supplement (60 tablet)", 1797, 1699, 1599, "Infus Glowing", false, "", ""],
  ["rec-15", "treatment-recommendation", "Korean V Shape I", "Face Slimming", "2x Meso V Line, 2x Radiofrequency Face, Botox Standard 40 Unit", 5392, 4049, 3949, "V-Shape", false, "", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"],
  ["rec-16", "treatment-recommendation", "Korea V Shape II", "Face Slimming", "1x Meso V Line, Botox Standard (40 unit), 1x Filler dagu", 6394, 5499, 5249, "V-Shape + Dagu", true, "", ""],
  ["rec-17", "treatment-recommendation", "2 IN 1 Meso V Line + RF Face", "Face Slimming", "1x Meso V Line, 1x Radiofrequency Face", 1498, 1099, 1049, "Ekonomis", false, "", ""],
  ["rec-18", "treatment-recommendation", "Instant Slimming", "Body Slimming", "1x Meso Slim Body Premium, 1x Meso Metabolic Boost, 1x RF Body", 4896, 2199, 2099, "Best Seller", false, "", "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"],
  ["rec-19", "treatment-recommendation", "Bye Bye Fat Advanced", "Body Slimming", "3x Meso Slim Body Premium, 2x Radiofrequency Body, 2x Ultra Sculpt*", 7993, 4299, 4099, "Lengkap", false, "", ""],
  ["rec-20", "treatment-recommendation", "3-in-1 Weight Control", "Body Slimming", "Fat Block 14, Crave Block 14, 1x Ultrasculpt", 2899, 1249, 1249, "Kontrol Nafsu Makan", true, "", ""],
  ["rec-21", "treatment-recommendation", "PRP Hair Growth Combo", "Hair", "1x PRP Hair, 1x Biolight Hair, 1x FREE Custom Hair Serum, 1x Hair Vitamin", 2446, 1520, 1470, "Rambut Lebat", false, "", "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80"],
  ["rec-22", "treatment-recommendation", "90 Days Hair Growth Program", "Hair", "4x Hair Grow Booster, 4x Biolight Hair, 3x Customer Hair Serum, Hair Vitamin (3 bulan)", 8297, 4513, 4313, "Program 3 Bulan", true, "", ""],
  ["rec-23", "treatment-recommendation", "Hair Grow Booster Advanced Combo", "Hair", "2x Hair Grow Booster, 2x Biolight Hair, 2x Custom Hair Serum, 1x Hair Vitamin", 3993, 2788, 2688, "Advanced Combo", false, "", ""],
  ["rec-24", "treatment-recommendation", "Express Hair Therapy", "Hair", "1x Massage, 1x Custom Hair Serum, 1x High Frequency, 1x Biolight Hair", 699, 505, 405, "Ekspres 45 Mnt", false, "", ""],

  // 2. Paket Glowing Skin
  ["glow-01", "glowing-skin", "Vitaran H Glow Boost", "Glowing", "1x Vitaran H Single, 2x Rejuve Laser", 3638, 2799, 2749, "Best Value", true, "", ""],
  ["glow-02", "glowing-skin", "Double Vitaran H Glow Boost", "Glowing", "1x Vitaran H Double, 2x Rejuve Laser", 6707, 4099, 4049, "Double Dose", true, "", ""],
  ["glow-03", "glowing-skin", "Vitaran Poly Booster Glow Boost", "Glowing", "1x Vitaran Poly Booster, 2x Rejuve Laser", 4638, 3599, 3549, "Poly Booster", true, "", ""],
  ["glow-04", "glowing-skin", "2 in 1 LHALA Brightening Combo", "Glowing", "1x IPL Glow, 1x LhaLa Peel", 1188, 599, 549, "Favorit", false, "", ""],
  ["glow-05", "glowing-skin", "3in1 LHALA Korean Glow", "Glowing", "1x Korean LHALA Peel, 1x Glow Facial, 1x Rejuve Laser", 2926, 999, 949, "Top Choice", true, "", ""],
  ["glow-06", "glowing-skin", "4in1 LHALA DermaGlow", "Glowing", "1x Korean LHALA Peel, 1x 3in1 DermaGlow", 3788, 1749, 1699, "DermaGlow", false, "", ""],
  ["glow-07", "glowing-skin", "LHALA DNA Glow", "Glowing", "1x Korean LHALA Peel, 1x DNA Glow, 1x Rejuve Laser", 3526, 1949, 1899, "Salmon DNA", false, "", ""],
  ["glow-08", "glowing-skin", "LHALA Glass Skin Glow", "Glowing", "1x Korean LHALA Peel, 1x Korean Glass Skin, 1x Rejuve Laser", 4026, 2249, 2199, "Glass Skin", false, "", ""],
  ["glow-09", "glowing-skin", "LHALA Pink Glow", "Glowing", "1x Korean LHALA Peel, 1x Sozo Pink Bomb, 1x Rejuve Laser", 4426, 2599, 2499, "Pink Glow", false, "", ""],
  ["glow-10", "glowing-skin", "Korean LHALA Brightening Boost", "Glowing", "1x Whitening Booster, 1x Sozo Pink Bomb, 2x Rejuve Laser, 2x Korean LHALA Peel", 10450, 4799, 4699, "Brightening Boost", false, "", ""],
  ["glow-11", "glowing-skin", "Korean LHALA Glass Skin Boost", "Glowing", "1x Whitening Booster, 1x Sozo Pink Bomb, 1x Microtox, 4x Rejuve Laser, 4x Korean LHALA Peel, 4x Biolight", 19000, 6949, 6849, "Glass Skin Ultimate", true, "", ""],
  ["glow-12", "glowing-skin", "White Booster Glow", "Glowing", "1x Whitening Booster, 1x Rejuve Laser", 4736, 1999, 1899, "White Booster", false, "", ""],
  ["glow-13", "glowing-skin", "LHALA White Glow", "Glowing", "1x Whitening Booster, 1x Rejuve Laser, 1x Korean LHALA Peel", 5525, 2299, 2199, "", false, "", ""],
  ["glow-14", "glowing-skin", "Intensive White Glow", "Glowing", "1x Whitening Booster, 2x Rejuve Laser, 1x Whitening Infusion", 7173, 3099, 2999, "Intensive", false, "", ""],
  ["glow-15", "glowing-skin", "2-in-1 Brightening Combo", "Glowing", "1x IPL Glow, 1x Glow Peel", 698, 399, 369, "Hemat", false, "", ""],
  ["glow-16", "glowing-skin", "Diamond Glow", "Glowing", "1x IPL Glow, 1x Diamond Peel, 1x Collagen Mask", 797, 459, 399, "Best Seller", false, "", ""],
  ["glow-17", "glowing-skin", "Dazzling Glow", "Glowing", "1x Massage, 1x Rejuve Laser, 1x Glow Peel", 1746, 889, 829, "Favorit", false, "", ""],
  ["glow-18", "glowing-skin", "Radiance Glow", "Glowing", "1x Massage, 1x Collagen Mask, 2x Laser Rejuve, 1x Glow Peel", 2769, 1349, 1299, "Radiance", false, "", ""],
  ["glow-19", "glowing-skin", "Luminous DNA Glow", "Glowing", "1x DNA Glow Skinbooster, 1x Laser Rejuve", 2698, 1749, 1649, "DNA Glow", false, "", ""],
  ["glow-20", "glowing-skin", "Korean Glow Booster", "Pink Plumpy", "1x Pink Lips Booster, 1x Panda Eye Booster", 3498, 1799, 1749, "Plumpy Glow", false, "", ""],
  ["glow-21", "glowing-skin", "Korean Glass Skin", "Glowing", "1x Glass Skinbooster, 1x Laser Rejuve", 3198, 2199, 1999, "Diskon s/d 35%", false, "", ""],
  ["glow-22", "glowing-skin", "Signature Glass Skin", "Glowing", "1x Sozo Pink Bomb, 1x Laser Rejuve", 4198, 3199, 2999, "Signature", false, "", ""],
  ["glow-23", "glowing-skin", "Korean Lift Glow", "Glowing", "Botox Upper Face standard 30 units, 1x Nucleofill, 1x Rejuve Laser", 9798, 5899, 5749, "Lift & Glow", false, "", ""],
  ["glow-24", "glowing-skin", "Radiant Lift Combo", "Glowing", "1x Nucleofill, 1x Rejuran", 12998, 7599, 7349, "Combo Sultan", false, "", ""],
  ["glow-25", "glowing-skin", "Ultimate Youth", "Glowing", "2x Massage, 2x Extraction, 2x Rejuve Laser (Nanolux/Picolux), 1x Sozo Pink Bomb, 1x Aqua Shine Skinbooster, 2x Collagen Mask, 2x Biolight Rejuve", 9187, 5299, 5149, "Youth Full", false, "", ""],
  ["glow-26", "glowing-skin", "Juvelook Glow Boost", "Glowing", "1x Juvelook, 2x Rejuve Laser", 13196, 6299, 6199, "Juvelook", false, "", ""],
  ["glow-27", "glowing-skin", "Juvelook Radiance Boost", "Glowing", "1x Juvelook, 2x Rejuve Laser, 2x IPL Glow", 13196, 6499, 6399, "Juvelook + IPL", false, "", ""],
  ["glow-28", "glowing-skin", "Juvelook Contour Glow", "Glowing", "1x Juvelook, 2x Rejuve Laser, 1x HIFU Cheek", 14395, 7089, 6989, "Juvelook + HIFU", false, "", ""],
  ["glow-29", "glowing-skin", "Juvelook Lifted Glow", "Glowing", "1x Juvelook, 2x Rejuve Laser, 1x Liftera Cheek", 17195, 7999, 7899, "Juvelook + Liftera", false, "", ""],
  ["glow-30", "glowing-skin", "Jalupro Glow Boost", "Glowing", "1x Jalupro, 2x Rejuve Laser", 10596, 4999, 4899, "Jalupro", false, "", ""],
  ["glow-31", "glowing-skin", "Jalupro Radiance Boost", "Glowing", "1x Jalupro, 2x Rejuve Laser, 2x IPL Glow", 10596, 5199, 5099, "", false, "", ""],
  ["glow-32", "glowing-skin", "Jalupro Contour Glow", "Glowing", "1x Jalupro, 2x Rejuve Laser, 1x HIFU Cheek", 10596, 5789, 5689, "", false, "", ""],
  ["glow-33", "glowing-skin", "Jalupro Lifted Glow", "Glowing", "1x Jalupro, 2x Rejuve Laser, 1x Liftera Cheek", 10596, 6649, 6549, "", false, "", ""],
  ["glow-34", "glowing-skin", "Exosome Glow Boost", "Glowing", "1x Exosome Face ASCE, 2x Rejuve Laser", 10396, 4899, 4799, "Exosome ASCE", false, "", ""],
  ["glow-35", "glowing-skin", "Exosome Radiance Boost", "Glowing", "1x Exosome Face ASCE, 2x Rejuve Laser, 2x IPL Glow", 11194, 5099, 4999, "", false, "", ""],
  ["glow-36", "glowing-skin", "Exosome Scar Solution", "Glowing", "1x Exosome Face ASCE, 1x Growth Factor Serum, 2x CO2 Laser Full Face, 2x Biolight", 11794, 5345, 5045, "Scar Solution", false, "", ""],
  ["glow-37", "glowing-skin", "Rejuran HB Glow Boost", "Glowing", "1x Rejuran HB, 2x Rejuve Laser", 10196, 4799, 4699, "Rejuran HB", false, "", ""],
  ["glow-38", "glowing-skin", "Rejuran HB Radiance Boost", "Glowing", "1x Rejuran HB, 2x Rejuve Laser, 2x IPL Glow", 10994, 4999, 4899, "", false, "", ""],
  ["glow-39", "glowing-skin", "Rejuran I Glow Boost", "Glowing", "1x Rejuran I, 2x Rejuve Laser", 8196, 3799, 3699, "Rejuran I Mata", false, "", ""],
  ["glow-40", "glowing-skin", "Rejuran I Radiance Boost", "Glowing", "1x Rejuran I, 2x Rejuve Laser, 2x IPL Glow", 8994, 3999, 3899, "", false, "", ""],
  ["glow-41", "glowing-skin", "Rejuran I Contour Glow", "Glowing", "1x Rejuran I, 2x Rejuve Laser, 1x HIFU Eyelift", 9195, 4248, 4148, "", false, "", ""],
  ["glow-42", "glowing-skin", "Rejuran I Lifted Glow", "Glowing", "1x Rejuran I, 2x Rejuve Laser, 1x Liftera Eyelift", 9195, 4248, 4148, "", false, "", ""],
  ["glow-43", "glowing-skin", "Rejuran Healer Glow Boost", "Glowing", "1x Rejuran Healer, 2x Rejuve Laser", 8497, 4349, 4249, "Rejuran Healer", false, "", ""],
  ["glow-44", "glowing-skin", "Rejuran Healer Radiance Boost", "Glowing", "1x Rejuran Healer, 2x Rejuve Laser, 2x IPL Glow", 8994, 4549, 4449, "", false, "", ""],
  ["glow-45", "glowing-skin", "Nucleofill Glow Boost", "Glowing", "1x Nucleofill, 2x Rejuve Laser", 8497, 4649, 4549, "Nucleofill", false, "", ""],
  ["glow-46", "glowing-skin", "Nucleofill Radiance Boost", "Glowing", "1x Nucleofill, 2x Rejuve Laser, 2x IPL Glow", 8994, 4849, 4749, "", false, "", ""],
  ["glow-47", "glowing-skin", "Nucleofill Contour Glow", "Glowing", "1x Nucleofill, 2x Rejuve Laser, 1x HIFU Eyelift", 9395, 5698, 5498, "", false, "", ""],
  ["glow-48", "glowing-skin", "Nucleofill Lifted Glow", "Glowing", "1x Nucleofill, 2x Rejuve Laser, 1x Liftera Cheek", 12195, 6299, 6099, "", false, "", ""],
  ["glow-49", "glowing-skin", "Rejuran + Nucleofill Glow Boost", "Glowing", "1x Nucleofill, 1x Rejuran Healer, 4x Rejuve Laser", 16994, 8848, 8648, "Super Duo", false, "", ""],
  ["glow-50", "glowing-skin", "Profhilo Glow Boost", "Glowing", "1x Profhilo, 2x Rejuve Laser", 8997, 7449, 7349, "Profhilo", false, "", ""],
  ["glow-51", "glowing-skin", "Profhilo Radiance Boost", "Glowing", "1x Profhilo, 2x Rejuve Laser, 2x IPL Glow", 9795, 7649, 7549, "", false, "", ""],
  ["glow-52", "glowing-skin", "Profhilo Contour Glow", "Glowing", "1x Profhilo, 2x Rejuve Laser, 1x HIFU Cheek", 10196, 8498, 8298, "", false, "", ""],
  ["glow-53", "glowing-skin", "Profhilo Lifted Glow", "Glowing", "1x Profhilo, 2x Rejuve Laser, 1x Liftera Cheek", 12996, 9099, 8899, "", false, "", ""],
  ["glow-54", "glowing-skin", "3-in-1 DermaGlow", "Glowing", "1x Dermapen, 1x Salmon DNA Skinbooster, 1x Pico Laser Rejuve", 2999, 1549, 1499, "DermaGlow", false, "", ""],
  ["glow-55", "glowing-skin", "3-in-1 DermaGlow + HIFU Cheek", "Glowing", "1x 3-in-1 DermaGlow, 1x HIFU Cheek", 4198, 1999, 1799, "", false, "", ""],
  ["glow-56", "glowing-skin", "Sylfirm X + Rejuran Healer*", "Glowing", "1x Sylfirm X, 1x Rejuran Healer", 14498, 7298, 7298, "Sylfirm X", false, "Arteri", ""],
  ["glow-57", "glowing-skin", "Sylfirm X + Nucleofill*", "Glowing", "1x Sylfirm X, 1x Nucleofill", 14498, 7698, 7698, "Sylfirm X", false, "Arteri", ""],
  ["glow-58", "glowing-skin", "Sylfirm X + Jalupro*", "Glowing", "1x Sylfirm X, 1x Jalupro", 16599, 7898, 7898, "Sylfirm X", false, "Arteri", ""],

  // 3. Paket Pink Plumpy
  ["pink-01", "pink-plumpy", "Sakura Pink Lips", "Pink Plumpy", "1x Baby Pink Lips, 1x Pink Lips Laser", 999, 649, 549, "Bibir Merona", false, "", ""],

  // 4. Paket Pigmentation
  ["pigm-01", "pigmentation", "Melasma Repair Therapy", "Pigmentation", "1x Meso Pigment Face, 1x Picolux Laser", 2649, 1028, 1028, "Melasma", false, "", ""],
  ["pigm-02", "pigmentation", "Xela Rederm Glow Boost", "Pigmentation", "1x Xela Rederm, 2x Rejuve Laser", 10596, 4999, 4899, "Xela Rederm", false, "", ""],
  ["pigm-03", "pigmentation", "Xela Rederm Radiance Boost", "Pigmentation", "1x Xela Rederm, 2x Rejuve Laser, 2x IPL Glow", 10796, 5249, 5149, "", false, "", ""],
  ["pigm-04", "pigmentation", "Triple Melasma Repair Therapy", "Pigmentation", "3x Meso Pigment Face, 3x Pico Rejuve Laser", 5892, 3037, 2737, "3x Sesi", false, "", ""],
  ["pigm-05", "pigmentation", "Xela Melasma Repair Therapy", "Pigmentation", "1x Xela Rederm, 2x Meso Pigment Face, 3x Pico Rejuve Laser, 1x IPL Glow", 14690, 7356, 6956, "Xela Combo", false, "", ""],
  ["pigm-06", "pigmentation", "Triple Xela Melasma Repair Therapy", "Pigmentation", "3x Xela Rederm, 3x Pico Rejuve Laser, 2x IPL Glow", 27999, 13647, 13347, "Triple Xela", false, "", ""],
  ["pigm-07", "pigmentation", "Ultimate Triple Melasma Repair Therapy", "Pigmentation", "3x Meso Pigment Face, 3x Pico Rejuve Laser, Custom Skincare (Cleanser, Night Cream, Antibiotic Cream, Sunscreen, Serum)", 6532, 3537, 3237, "Ultimate + Skincare", false, "", ""],
  ["pigm-08", "pigmentation", "Ultimate Xela Melasma Repair Therapy", "Pigmentation", "1x Xela Rederm, 2x Meso Pigment Face, 3x Pico Rejuve Laser, 1x IPL Glow, Custom Skincare (5 Produk)", 15330, 7856, 7456, "Ultimate Xela", false, "", ""],
  ["pigm-09", "pigmentation", "Ultimate Triple Xela Melasma Repair Therapy", "Pigmentation", "3x Xela Rederm, 3x Pico Rejuve Laser, 2x IPL Glow, Custom Skincare (5 Produk)", 33226, 14897, 14447, "Super Ultimate", false, "", ""],
  ["pigm-10", "pigmentation", "Body Dark Spot Repair 1cc", "Pigmentation", "1x Meso Pigment Body 1cc, 1x Body Rejuve Laser", 3448, 1399, 1299, "Flek Tubuh 1cc", false, "", ""],
  ["pigm-11", "pigmentation", "Body Dark Spot Repair 3cc", "Pigmentation", "1x Meso Pigment Body 3cc, 1x Body Rejuve Laser", 6348, 2299, 2199, "Flek Tubuh 3cc", false, "", ""],
  ["pigm-12", "pigmentation", "Triple Body Dark Spot Repair 1cc", "Pigmentation", "3x Meso Pigment 1cc, 3x Body Rejuve", 9738, 4494, 4044, "3x Sesi 1cc", false, "", ""],
  ["pigm-13", "pigmentation", "Triple Body Dark Spot Repair 3cc", "Pigmentation", "3x Meso Pigment 3cc, 3x Body Rejuve", 19044, 7294, 6844, "3x Sesi 3cc", false, "", ""],
  ["pigm-14", "pigmentation", "Ultimate Body Dark Spot Repair 1cc", "Pigmentation", "1x Meso Pigment Body 1cc, 1x Body Rejuve Laser, 1x Body Whitening Peel, 1x IPL Glow", 4146, 1899, 1799, "Lengkap 1cc", false, "", ""],
  ["pigm-15", "pigmentation", "Ultimate Body Dark Spot Repair 3cc", "Pigmentation", "1x Meso Pigment Body 3cc, 1x Body Rejuve Laser, 1x Body Whitening Peel, 1x IPL Glow", 7046, 2749, 2649, "Lengkap 3cc", false, "", ""],

  // 5. Paket Anti-Aging
  ["anti-01", "anti-aging", "Rewind Signature Face Lift", "Anti-Aging", "1x Ultracol 200, 1x Novuma, 1x Bi-Dens", 26000, 15749, 15549, "Signature Trio", true, "", ""],
  ["anti-02", "anti-aging", "Rewind Duo Collagen Lift", "Anti-Aging", "1x Ultracol 200, 1x Novuma", 18000, 11298, 11198, "Duo Collagen", false, "", ""],
  ["anti-03", "anti-aging", "RMDA PRP", "Anti-Aging", "1x Salmon DNA Hair, 1x PRP, 1x Hair Serum, 1x Hair Vitamin", 4500, 2863, 2763, "", false, "", ""],
  ["anti-04", "anti-aging", "HIFU & Filler Full Face Contour", "Anti-Aging", "1x HIFU Full Face, 1x Premium Korean Filler (1cc)", 5298, 4549, 4399, "HIFU + Filler", false, "", ""],
  ["anti-05", "anti-aging", "Liftera & Filler Full Face Contour", "Anti-Aging", "1x Liftera Full Face, 1x Premium Korean Filler (1cc)", 11798, 7099, 6949, "Liftera + Filler", false, "", ""],
  ["anti-06", "anti-aging", "Eye Wrinkle Lift", "Anti-Aging", "1x Botox Std 30 Unit, 1x Jalupro, 1x HIFU Eye", 11699, 6149, 5999, "Kerutan Mata", false, "", ""],
  ["anti-07", "anti-aging", "Liftera - Eye Wrinkle Lift", "Anti-Aging", "1x Botox Std 30 Unit, 1x Jalupro, 1x HIFU Liftera Eye", 12199, 6349, 6199, "Liftera Eye", false, "", ""],
  ["anti-08", "anti-aging", "Eye Wrinkle Repair & Rejuve", "Anti-Aging", "1x Botox Std 30 Unit, 1x Rejuran I, 1x HIFU Eye", 9297, 4849, 4699, "Rejuran I Eye", false, "", ""],
  ["anti-09", "anti-aging", "Liftera - Eye Wrinkle Repair & Rejuve", "Anti-Aging", "1x Botox Std 30 Unit, 1x Rejuran I, 1x HIFU Liftera Eye", 9797, 5049, 4899, "", false, "", ""],
  ["anti-10", "anti-aging", "Sylfirm Upper Face Wrinkle Free", "Anti-Aging", "1x Botox Std 30 Unit, 1x Jalupro, 2x Sylfirm", 26698, 12499, 12399, "Sylfirm Upper Face", false, "Arteri", ""],
  ["anti-11", "anti-aging", "Liftera x Sylfirm Upper Face Wrinkle Free", "Anti-Aging", "1x Botox Std 30 Unit, 1x Jalupro, 1x Liftera Eyelift, 2x Sylfirm", 28197, 13148, 12998, "", false, "Arteri", ""],
  ["anti-12", "anti-aging", "Signature Pore & Texture Refinement", "Anti-Aging", "1x Restylane, 2x Sylfirm", 23796, 10698, 10598, "Restylane", false, "Arteri", ""],
  ["anti-13", "anti-aging", "Pore & Texture Refine - PRP Regeneration", "Anti-Aging", "1x Restylane, 1x PRP, 2x Sylfirm", 25295, 11679, 11479, "PRP + Sylfirm", false, "Arteri", ""],
  ["anti-14", "anti-aging", "Pore & Texture Refine - Exosome Repair", "Anti-Aging", "1x Restylane, 1x Exosome face, 2x Sylfirm", 32194, 14798, 14598, "Exosome Repair", false, "Arteri", ""],
  ["anti-15", "anti-aging", "Pore & Texture Refine - Hydration Lift", "Anti-Aging", "1x Restylane, 1x Profhilo, 2x Sylfirm", 30795, 17499, 17299, "Profhilo Lift", false, "Arteri", ""],
  ["anti-16", "anti-aging", "Pore & Texture Refine - Hydration Peptide Lift", "Anti-Aging", "1x Restylane, 1x Jalupro, 2x Sylfirm", 32396, 14999, 14799, "Jalupro Peptide", false, "Arteri", ""],
  ["anti-17", "anti-aging", "Nefertiti Lift - Korean Premium", "Anti-Aging", "Botox Standard 60 Units, 1x Hifu Double Chin", 5199, 3119, 3119, "Nefertiti Lift", false, "", ""],
  ["anti-18", "anti-aging", "Nefertiti Lift - European Premium", "Anti-Aging", "Botox Standard 60 Units, 1x Liftera Double Chin & Neck, 1x Picolux Laser", 12399, 7639, 7439, "European Lift", false, "", ""],
  ["anti-19", "anti-aging", "Neck & Shoulder Contouring - Korean Premium", "Anti-Aging", "Botox Standard 100 Units, 1x HIFU Neck", 8099, 4695, 4595, "Shoulder Botox", false, "", ""],
  ["anti-20", "anti-aging", "Neck Shoulder Contouring - European Premium", "Anti-Aging", "Botox Premium 100 units, 1x Liftera Double Chin & Neck, 1x Body Rejuve Laser Nano Shoulder", 17998, 10396, 10196, "European Premium", false, "", ""],
  ["anti-21", "anti-aging", "Wrinkle Collagen Reset", "Anti-Aging", "Botox Standard 50 units, 1x Juvelook 6cc", 12000, 7299, 6999, "Juvelook Reset", false, "", ""],
  ["anti-22", "anti-aging", "Wrinkle Volume Reset", "Anti-Aging", "Botox Standard 50 units, 1x Novuma", 12500, 8399, 8099, "Novuma Reset", false, "", ""],
  ["anti-23", "anti-aging", "Full Face Botox Lift", "Anti-Aging", "Botox Standard 50 units, Filler Korea Premium Soft 1cc", 7299, 6069, 5769, "Full Face Lift", false, "", ""],
  ["anti-24", "anti-aging", "Contour Reset + Maintenance", "Anti-Aging", "Botox Standard 50 units, ThreadLift - Facelift 4 Benang, 1x Liftera Full Face", 16698, 11150, 10850, "Tanam Benang", false, "", ""],

  // 6. Paket Acne Free
  ["acne-01", "acne-free", "2 in 1 Acne Combo", "Acne Free", "1x IPL Acne, 1x Acne Peel", 698, 399, 399, "Hemat 45%", false, "", ""],
  ["acne-02", "acne-free", "Pore Detox", "Acne Free", "2x Biolight Acne, 1x IPL Acne, 1x Acne Peel, FREE 7 Skincare Products (Facial Wash, Acne Solution, Day Cream, Night Cream, Moisturizer, Acne Sunscreen, Acne Spot)", 1593, 761, 761, "Free Skincare", true, "", ""],
  ["acne-03", "acne-free", "30 Days Acne Program", "Acne Free", "1x Acne laser, 2x Biolight Acne, 2x Acne Injection, FREE 7 Skincare Products", 3046, 1611, 1461, "Program 30 Hari", false, "", ""],
  ["acne-04", "acne-free", "60 Days Acne Program", "Acne Free", "1x Acne laser, 3x Biolight Acne, 2x IPL Acne, 2x Acne Peel, 4x Acne Injection, FREE 7 Skincare Products", 3984, 2417, 2267, "Program 60 Hari", false, "", ""],
  ["acne-05", "acne-free", "Meso Clear Skin Acne Combo", "Acne Free", "2x IPL acne, 2x Meso Acne (2cc), 2x Biolight acne", 1994, 1611, 1511, "Clear Skin", false, "", ""],
  ["acne-06", "acne-free", "Meso Redness Acne Combo", "Acne Free", "1x acne clear facial, 1x Meso redness, 1x Meso Acne, 1x IPL Acne", 1696, 1299, 1199, "Redness", false, "", ""],
  ["acne-07", "acne-free", "Meso Redness Relief Advanced Combo", "Acne Free", "2x IPL Acne, 2x meso redness, 2x meso acne", 2394, 1699, 1599, "Redness Relief", false, "", ""],

  // 7. Paket Scar Free
  ["scar-01", "scar-free", "Post Acne Spots Booster", "Scar Free", "1x Vitamin AEC Acne Booster, 1x Retinoic Peel 1.5 cc, 1x Biolight Acne, FREE Skincare : AIC", 3197, 1299, 1249, "Spots Booster", false, "", ""],
  ["scar-02", "scar-free", "Post Acne Repair Therapy", "Scar Free", "1x Vitamin AEC Acne Booster, 1x Retinoic Peel 1.5 cc, 2x IPL Glow, 2x Biolight Acne, FREE Skincare : AIC", 4194, 1649, 1599, "Repair Therapy", false, "", ""],
  ["scar-03", "scar-free", "Scar Fighter + Restylane Scar", "Scar Free", "1x Laser C02 - Full Face, 1x Restylane Scar, 1x Subsisi, 1x Biolight Rejuve", 9596, 4699, 4599, "Restylane", false, "", ""],
  ["scar-04", "scar-free", "Premium Scar Repair PRP I", "Scar Free", "1x PRP, 1x Biolight Rejuve, 1x Collagen Mask, 1x Subsisi, 1x Rejuran Scar", 7695, 4279, 4079, "Rejuran Scar", false, "", ""],
  ["scar-05", "scar-free", "PRP Scar Repair Advanced", "Scar Free", "4x PRP, 2x Biolight Rejuve, 2x Collagen Mask, 2x Subsisi", 7390, 4419, 4319, "4x PRP", false, "", ""],
  ["scar-06", "scar-free", "PRP Scar Repair + Restylane Scar", "Scar Free", "1x PRP, 1x Restylane Scar, 1x Subsisi, 1x Biolight Rejuve", 9596, 4978, 4879, "", false, "", ""],
  ["scar-07", "scar-free", "PRP Scar Glow Repair", "Scar Free", "4x PRP, 2x Biolight Rejuve, 2x Collagen Mask, 2x Subsisi, 1x Rejuran Scar, 1x Mini facial", 13038, 7619, 7419, "Glow Repair", false, "", ""],
  ["scar-08", "scar-free", "PRP + Restylane Scar", "Scar Free", "1x PRP, 1x Restylane Scar", 9297, 4779, 4679, "", false, "", ""],
  ["scar-09", "scar-free", "Goodbye Pores Program*", "Scar Free", "2x Laser CO2 Pores / Rejuve, 2x Growth Factor Serum, 2x Collagen Mask, 2x Biolight", 4192, 1799, 1549, "Pores Free", false, "", ""],
  ["scar-10", "scar-free", "CO2 Scar Repair Advance*", "Scar Free", "4x Laser CO2 Scar - Full face, 1x Subsisi, 4x Growth Factor Serum, 3x Collagen Mask, 4x Biolight Acne", 8285, 3799, 3799, "4x CO2", false, "", ""],
  ["scar-11", "scar-free", "C02 + Restylane Scar", "Scar Free", "1x Laser C02 - Full Face, 1x Restylane Scar", 9297, 4299, 4199, "", false, "", ""],
  ["scar-12", "scar-free", "Premium Scar Fighter*", "Scar Free", "1x Laser CO2 Scar - Full Face, 1x Subsisi, 1x Rejuran Scar, 1x Biolight Rejuve", 7496, 3799, 3599, "Premium", false, "", ""],
  ["scar-13", "scar-free", "Ultimate Scar Solution*", "Scar Free", "1x Laser CO2 Scar - Full face, 1x Growth Factor Serum, 1x Subsisi, 1x PRP", 3496, 1679, 1679, "Ultimate Scar", false, "", ""],

  // 8. Paket Body Slimming
  ["bslim-01", "body-slimming", "3-in-1 Weight Control", "Body Slimming", "Fat Block 14, Crave Block 14, 1x Ultrasculpt", 2899, 1249, 1249, "Suplemen + Alat", false, "", ""],
  ["bslim-02", "body-slimming", "Meso Slim Body Premium + RF", "Body Slimming", "1x Meso Slim Body Premium, 1x Radiofrequency Body", 2398, 1449, 1299, "", false, "", ""],
  ["bslim-03", "body-slimming", "Meso Slim Body Premium + Ultra Sculpt", "Body Slimming", "1x Meso Slim Body Premium, 1x Ultra Sculpt", 2298, 1449, 1299, "", false, "", ""],
  ["bslim-04", "body-slimming", "Fat Burn Laser + Meso Slim Body Premium*", "Body Slimming", "1x Fat Burn Laser, 1x Meso Slim Body Premium", 2999, 1899, 1799, "Fat Burn Laser", false, "Arteri, Tebet", ""],
  ["bslim-05", "body-slimming", "Fat Reduction Therapy*", "Body Slimming", "4x Fat Burn Laser, 2x Meso Slim Body Premium", 9198, 5499, 5399, "", false, "Arteri, Tebet", ""],
  ["bslim-06", "body-slimming", "Ultra Sculpt + Lymph Drain", "Body Slimming", "1x Ultra Sculpt, 1x Lymph Drain", 1898, 699, 649, "Detox", false, "", ""],
  ["bslim-07", "body-slimming", "Meso CelluLift + RF Body", "Body Slimming", "1x Meso CelluLift, 1x Radiofrequency Body", 2498, 1299, 1199, "Selulit", false, "", ""],
  ["bslim-08", "body-slimming", "Meso BloatAway + Lymph Drain", "Body Slimming", "1x Meso BloatAway*, 1x Lymph Drain*", 2398, 949, 899, "Perut Buncit", false, "Arteri, PIK, Medan", ""],
  ["bslim-09", "body-slimming", "Lymphatic Reset", "Body Slimming", "1x Lymph Drain*, 1x Meso Metabolic Boost, 1x Radiofrequency", 3597, 1349, 1449, "", false, "", ""],
  ["bslim-10", "body-slimming", "Meso Metabolic Boost + Ultra Sculpt", "Body Slimming", "1x Meso Metabolic Boost, 1x Ultra Sculpt*", 2398, 1099, 999, "Metabolic", false, "", ""],
  ["bslim-11", "body-slimming", "Meso Metabolic Boost + CaloBurn", "Body Slimming", "1x Meso Metabolic Boost, 1x CaloBurn*", 2498, 1099, 999, "CaloBurn", false, "Benhil, PDB, Bintaro", ""],
  ["bslim-12", "body-slimming", "Meso Metabolic Boost + RF", "Body Slimming", "1x Meso Metabolic Boost, 1x Radiofrequency Body", 2498, 1149, 1049, "", false, "", ""],
  ["bslim-13", "body-slimming", "HIFU Arm & Bra Fat", "Body Slimming", "1x HIFU Arm*, 1x HIFU Bra Fat*", 2698, 1399, 1299, "Lemak Bra", false, "", ""],
  ["bslim-14", "body-slimming", "Slim & Sculpt Arm", "Body Slimming", "1x Meso Slim Body Premium, 1x HIFU Arm*", 2898, 2199, 2099, "Lengan Ramping", false, "", ""],
  ["bslim-15", "body-slimming", "Slim & Sculpt Arm Advanced", "Body Slimming", "1x Meso Slim Body Premium, 1x HIFU Arm*, 1x Ultrasculpt*", 3797, 2699, 2599, "", false, "", ""],
  ["bslim-16", "body-slimming", "Advanced Slimming", "Body Slimming", "Twin Slimming Solution / Twin Lipo Solution, 1x Meso Slim Body Premium, 1x RF Body", 3724, 1999, 1849, "Lengkap", false, "", ""],
  ["bslim-17", "body-slimming", "Ultimate Slimming", "Body Slimming", "2x Meso Metabolic Boost, 2x Meso Slim Body Premium, 8x RF/Ultrasculpt*, 4x Consultation", 14584, 6399, 6299, "Paket Intensif", false, "", ""],
  ["bslim-18", "body-slimming", "Ultimate Slimming Max", "Body Slimming", "2x Meso Metabolic Boost, 2x Meso Slim Body Premium, 8x RF/Ultrasculpt*, 4x Consultation, Fat Block (14), Crave Block (14)", 16584, 7199, 7099, "Ultimate Max", false, "", ""],
  ["bslim-19", "body-slimming", "Body slimming premium I", "Body Slimming", "4x Meso Slim Body Premium, 3x RF Body", 8593, 4999, 4799, "", false, "", ""],
  ["bslim-20", "body-slimming", "Instant Slimming", "Body Slimming", "1x Meso Slim Body Premium, 1x Meso Metabolic Boost, 1x RF Body", 4896, 2199, 2099, "Best Seller", false, "", ""],
  ["bslim-21", "body-slimming", "Bye Bye Fat Advanced", "Body Slimming", "3x Meso Slim Body Premium, 2x Radiofrequency Body, 2x Ultra Sculpt*", 7993, 4299, 4099, "Advanced", false, "", ""],

  // 9. Produk Slimming
  ["bslim-p01", "body-slimming", "Fat Block Slimming Lite", "Body Slimming", "Lipo Slim (60 kapsul), Green Slim (60 kapsul), Fat Block 7", 1626, 765, 765, "Produk", false, "", ""],
  ["bslim-p02", "body-slimming", "Fat Block Slimming", "Body Slimming", "Lipo Slim (60 kapsul), Green Slim (60 kapsul), Fat Block 14", 1926, 895, 895, "Produk", false, "", ""],
  ["bslim-p03", "body-slimming", "Weight Control Lite", "Body Slimming", "Fat Block 14, Crave Block 14", 2000, 910, 910, "Produk", false, "", ""],
  ["bslim-p04", "body-slimming", "Weight Control Max", "Body Slimming", "Fat Block 30, Crave Block 30", 4000, 1800, 1800, "Produk", false, "", ""],
  ["bslim-p05", "body-slimming", "Fat Away", "Body Slimming", "Fat Block (14), Meso Slim Body Premium, Radiofrequency", 2998, 1749, 1649, "Produk + Alat", false, "", ""],
  ["bslim-p06", "body-slimming", "Calorie Control", "Body Slimming", "Crave Block (14), 1x Meso Slim Body Premium, 1x Radiofrequency", 3998, 1999, 1899, "", false, "", ""],
  ["bslim-p07", "body-slimming", "Block and Burn", "Body Slimming", "Fat block (14), 1x Meso Metabolic Boost, 1x Radiofrequency", 3998, 1749, 1699, "", false, "", ""],
  ["bslim-p08", "body-slimming", "Triple Fat Burn", "Body Slimming", "Fat Block (14), Crave Block (14), 1x Meso Slim Body Premium, 1x Radiofrequency", 4598, 2299, 2199, "", false, "", ""],
  ["bslim-p09", "body-slimming", "Twin Slimming Solution", "Body Slimming", "Lipo Slim (60 kapsul), Green Slim (60 kapsul)", 1326, 615, 615, "Twin Slim", false, "", ""],
  ["bslim-p10", "body-slimming", "Twin Lipo Solution", "Body Slimming", "2x Lipo Slim (120 kapsul)", 1326, 615, 615, "Twin Lipo", false, "", ""],
  ["bslim-p11", "body-slimming", "Complete Weight Control Lite", "Body Slimming", "Crave Block (14), Fat Block (14), Calorie Burn (14)", 3400, 1480, 1480, "3-in-1 Suplemen", false, "", ""],
  ["bslim-p12", "body-slimming", "Fat Burn Duo Lite", "Body Slimming", "Fat Block (14), Calorie Burn (14)", 2000, 890, 890, "", false, "", ""],
  ["bslim-p13", "body-slimming", "Metabolic Burn", "Body Slimming", "Calorie Burn (14), 1x Meso Metabolic Boost, 1x Radiofrequency", 3998, 1849, 1749, "", false, "", ""],
  ["bslim-p14", "body-slimming", "Complete Weight Control Max", "Body Slimming", "Crave Block (30), Fat Block (30), Calorie Burn (30)", 6800, 2989, 2989, "Paket 30 Hari", false, "", ""],
  ["bslim-p15", "body-slimming", "Fat Burn Duo Max", "Body Slimming", "Fat Block (30), Calorie Burn (30)", 4000, 1749, 1749, "", false, "", ""],
  ["bslim-p16", "body-slimming", "Slim Control Duo Lite", "Body Slimming", "14 pcs Crave Block, 14 pcs Calorie Burn", 2800, 1240, 1240, "", false, "", ""],
  ["bslim-p17", "body-slimming", "Slim Control Duo Max", "Body Slimming", "30 pcs Crave Block, 30 pcs Calorie Burn", 5600, 2429, 2429, "", false, "", ""],

  // 10. Paket Face Slimming
  ["fslim-01", "face-slimming", "Korean V Shape I", "Face Slimming", "2x Meso V Line, 2x Radiofrequency Face, Botox Standard 40 Unit", 5392, 4049, 3949, "V-Shape", false, "", ""],
  ["fslim-02", "face-slimming", "Korean V Shape II", "Face Slimming", "1x Meso V Line, Botox Standard (40 unit), 1x Filler dagu", 6394, 5499, 5249, "V-Shape + Dagu", false, "", ""],
  ["fslim-03", "face-slimming", "Korean V Shape III", "Face Slimming", "1x Meso V Line, Botox standard 40 units, 1x Filler Dagu, Facelift 4 Benang", 10843, 7899, 7699, "Benang + Filler", false, "", ""],
  ["fslim-04", "face-slimming", "Korean V-Lift (Signature HIFU)", "Face Slimming", "1x Meso V line, 1x HIFU double chin*", 1998, 1399, 1399, "HIFU", false, "", ""],
  ["fslim-05", "face-slimming", "Korean V-Lift (Liftera2)", "Face Slimming", "1x Meso V line, 1x Liftera2 HIFU double chin*", 2498, 1699, 1599, "Liftera2", false, "", ""],
  ["fslim-06", "face-slimming", "Korean V-Lift II (Signature HIFU)", "Face Slimming", "1x Meso V line, 1x HIFU double chin*, Botox standard 40 units", 4798, 3199, 3099, "", false, "", ""],
  ["fslim-07", "face-slimming", "Korean V-Lift II (Liftera2)", "Face Slimming", "1x Meso V line, 1x Liftera2 HIFU double chin*, Botox standard 40 units", 5658, 3299, 3199, "", false, "", ""],
  ["fslim-08", "face-slimming", "2-in-1 Meso V Line + HIFU Full Face*", "Face Slimming", "1x Meso V Line, 1x HIFU Full Face*", 2498, 1999, 1949, "HIFU Face", false, "", ""],
  ["fslim-09", "face-slimming", "2-in-1 Meso V Line + Liftera2 Full Face*", "Face Slimming", "1x Meso V Line, 1x HIFU Liftera2 Full Face*", 8998, 4599, 4599, "Liftera Face", false, "", ""],
  ["fslim-10", "face-slimming", "Cheek Lift (Signature HIFU)", "Face Slimming", "1x Meso V Line, 1x HIFU Cheek", 2198, 1999, 1949, "", false, "", ""],
  ["fslim-11", "face-slimming", "Cheek Lift (Liftera2)", "Face Slimming", "1x Meso V Line, 1x HIFU Liftera2 Cheek", 4998, 2799, 2699, "", false, "", ""],
  ["fslim-12", "face-slimming", "Total Lift & Sculpt*", "Face Slimming", "1x HIFU Full Face*, 1x HIFU Arm*", 2998, 2249, 2149, "Wajah & Lengan", false, "", ""],

  // 11. Paket Thick & Healthy Hair
  ["hair-01", "thick-healthy-hair", "Beard Grow", "Hair", "1x Microneedle beard grow serum", 999, 749, 649, "Brewok", false, "", ""],
  ["hair-02", "thick-healthy-hair", "Brow Grow", "Hair", "1x Microneedle brow grow serum", 899, 599, 499, "Alis", false, "", ""],
  ["hair-03", "thick-healthy-hair", "Salmon DNA Hair", "Hair", "1x Microneedle Salmon DNA hair serum", 2199, 1749, 1649, "Salmon DNA", false, "", ""],
  ["hair-04", "thick-healthy-hair", "Hair Grow Booster Combo", "Hair", "1x Hair Grow Booster, 1x Biolight Hair, FREE Custom Hair Serum", 1847, 1220, 1120, "Booster Combo", false, "", ""],
  ["hair-05", "thick-healthy-hair", "Hair Grow Booster Combo For Men", "Hair", "1x Hair Grow Booster, 1x Biolight Hair, Hair Loss Blocker for MEN (1 bln), FREE Custom Hair Serum", 2096, 1399, 1299, "Khusus Pria", false, "", ""],
  ["hair-06", "thick-healthy-hair", "Scalp Facial*", "Hair", "1x Oxy spray, 1x Scalp Scrub, 1x High Frequency, 1x Phototherapy, 1x Laser treatment", 799, 499, 349, "Detox Kulit Kepala", false, "Arteri, Bekasi, Semarang", ""],
  ["hair-07", "thick-healthy-hair", "Scalp Facial Lite*", "Hair", "1x Oxy spray, 1x High Frequency, 1x Phototherapy, 1x Laser treatment", 699, 249, 199, "Lite", false, "Arteri, Bekasi, Semarang", ""],
  ["hair-08", "thick-healthy-hair", "Onsen Spa* (60 Menit)", "Hair", "13 langkah relaksasi dan pembersihan kulit kepala (60 menit)", 1400, 599, 549, "Japanese Onsen", false, "Puri, Mampang", ""],
  ["hair-09", "thick-healthy-hair", "Onsen Spa Lite* (45 Menit)", "Hair", "9 langkah relaksasi dan pembersihan kulit kepala (45 menit)", 1000, 399, 349, "Onsen Lite", false, "Puri, Mampang", ""],
  ["hair-10", "thick-healthy-hair", "90 Days Hair Restoration Program", "Hair", "2x Hair Grow Booster, 2x PRP Hair Grow, 4x Biolight Hair, FREE 3x Custom Hair Serum, Hair Vitamin (3 bulan)", 8736, 5013, 4813, "Restoration", false, "", ""],
  ["hair-11", "thick-healthy-hair", "90 Days Hair Grow For Men", "Hair", "4x Hair Grow Booster, 4x Biolight Hair, Hair Vitamin (3 bln), Hair Grow Support (3 bln), Hair Loss Blocker for MEN (3 bln), FREE 3x Custom Hair Serum", 9387, 5499, 5299, "Pria 90 Hari", false, "", ""],
  ["hair-12", "thick-healthy-hair", "90 DAYS PRP HAIR GROW PROGRAM", "Hair", "4x PRP Hair Grow, 4x Biolight Hair, FREE 3x Custom Hair Serum, Hair Vitamin (3 bulan)", 9484, 5513, 5413, "PRP 90 Hari", false, "", ""],
  ["hair-13", "thick-healthy-hair", "Exosome hair", "Hair", "1x Microneedle Exosome hair serum", 7598, 3849, 3749, "Exosome", false, "", ""],
  ["hair-14", "thick-healthy-hair", "Exosome Hair Grow Combo", "Hair", "1x Exosome Hair Grow, 1x Biolight Hair, FREE 1x Custom Hair Serum, Hair Vitamin 1 bulan", 8295, 4370, 4270, "Exosome Combo", false, "", ""],
  ["hair-15", "thick-healthy-hair", "180 days Hair Growth Program", "Hair", "8x Hair Grow Booster, 8x Biolight Hair, FREE 6x Customer Hair Serum, Hair Vitamin (6 bulan)", 14716, 8727, 8427, "Program 6 Bulan", false, "", ""],
  ["hair-16", "thick-healthy-hair", "180 days Hair Restoration Program", "Hair", "4x Hair Grow Booster, 4x PRP Hair Grow, 8x Biolight Hair, FREE 6x Custom Hair Serum, Hair Vitamin (6 bulan)", 17472, 9328, 9128, "Restoration 6 Bulan", false, "", ""],

  // 12. Paket Body Care
  ["bcare-01", "body-care", "Korean Arms**", "Body Care", "1x IPL Glow, 1x Hair Removal Medium, 1x Body Whitening Peel", 1197, 547, 497, "Lengan Mulus", false, "", ""],
  ["bcare-02", "body-care", "Underarm Brightening", "Body Care", "1x IPL Glow, 1x Underarm Peeling", 698, 379, 379, "Ketiak Cerah", false, "", ""],
  ["bcare-03", "body-care", "Double Underarm Brightening**", "Body Care", "1x IPL Glow, 1x Body Rejuve Laser Underarm", 1398, 749, 699, "Double Laser", false, "", ""],
  ["bcare-04", "body-care", "Underarm Brightening Laser", "Body Care", "1x IPL Glow, 1x Underarm Peeling, 1x Body Rejuve Laser Underarm", 1697, 899, 849, "Komplit Ketiak", false, "", ""],
  ["bcare-05", "body-care", "Korean Legs", "Body Care", "1x IPL Glow, 1x Hair Removal Large, 1x Body Whitening Peel", 1497, 699, 657, "Kaki Mulus", false, "", ""],
  ["bcare-06", "body-care", "Korean Back I", "Body Care", "1x IPL Acne, 1x Backne Peel, Skincare Product: Acne Lotion (1)", 1047, 699, 599, "Punggung Jerawat", false, "", ""],
  ["bcare-07", "body-care", "Korean Back II**", "Body Care", "1x IPL Glow, 1x Body Whitening Peel", 698, 549, 549, "Punggung Cerah", false, "", ""],
  ["bcare-08", "body-care", "Korean Back Facial", "Body Care", "Facial pembersihan komedo dan relaksasi punggung", 1499, 799, 749, "Back Facial", false, "", ""],
  ["bcare-09", "body-care", "Intimate glow**", "Body Care", "1x IPL Hair removal brazilian VI, 1x Intimate peeling", 898, 599, 499, "Intimate Area", false, "", ""],
  ["bcare-10", "body-care", "Radiant Skin Glow", "Body Care", "1x Premium Glow Infusion, 2x Lightening Supplement (60 tablet)", 1797, 1699, 1599, "Infus + Vitamin", false, "", ""],
  ["bcare-11", "body-care", "Signature Skin Brightening", "Body Care", "1x Immune Glow Infusion, Lightening Supplements 30 caps", 1149, 1049, 949, "Immune Glow", false, "", ""],
  ["bcare-12", "body-care", "Platinum Skin Brightening", "Body Care", "2x Premium glow infusion, Premium lightening supplement (60 tablet), 1x Mini facial, 1x Glow peel", 4844, 3999, 3799, "Platinum", false, "", ""],
  ["bcare-13", "body-care", "Ultimate Skin Brightening", "Body Care", "3x Premium glow infusion, Premium lightening supplement (120 tablet), 2x Mini facial, 1x Dazzling Glow peel", 8590, 6599, 6449, "Ultimate Sultan", false, "", ""],

  // 13. Paket Botox
  ["botox-01", "botox", "Botox 1u Standard", "", "1 Unit Botox Standard", 70, 50, 50, "Per Unit", false, "", ""],
  ["botox-02", "botox", "Botox 10u Standard", "", "10 Unit Botox Standard (Dahi / Kerutan Halus)", 700, 499, 499, "10 Unit", false, "", ""],
  ["botox-03", "botox", "Botox 50u Standard", "", "50 Unit Botox Standard (Masseter Rahang / V-Shape)", 3500, 2250, 2250, "50 Unit", false, "", ""],
  ["botox-04", "botox", "Botox 100u Standard", "", "100 Unit Botox Standard (Full Face / Multi-Area)", 7000, 4000, 4000, "100 Unit", false, "", ""],
  ["botox-05", "botox", "Botox 10u Premium", "", "10 Unit Botox Premium (Allergan / Dysport)", 1200, 999, 999, "Premium", false, "", ""],
  ["botox-06", "botox", "Botox 50u Premium", "", "50 Unit Botox Premium", 6000, 4250, 4250, "Premium 50u", false, "", ""],
  ["botox-07", "botox", "Botox 100u Premium", "", "100 Unit Botox Premium", 12000, 6999, 6999, "Premium 100u", false, "", ""],
  ["botox-08", "botox", "Botox underarm standard (100 units)", "", "100 Unit Botox Standard untuk bebas keringat ketiak berlebih", 7000, 3499, 3299, "Anti Keringat", false, "", ""],
  ["botox-09", "botox", "Botox underarm premium (100 units)", "", "100 Unit Botox Premium untuk bebas keringat ketiak berlebih", 12000, 7499, 7299, "Premium Ketiak", false, "", ""],

  // 14. Paket Hair Removal IPL & DPL
  ["hr-01", "hair-removal", "IPL Underarm Hair Removal (Buy 2 Get 3)", "", "3 Sesi Underarm Hair Removal IPL", 747, 349, 349, "Buy 2 Get 3", false, "", ""],
  ["hr-02", "hair-removal", "IPL Underarm + Glow (Buy 2 Get 3)", "", "3 Sesi Underarm Hair Removal IPL + Glow", 1347, 597, 747, "", false, "", ""],
  ["hr-03", "hair-removal", "IPL Underarm 1 Tahun Unlimited", "", "12 Sesi Perawatan Underarm Hair Removal IPL selama 1 Tahun", 2988, 1199, 1199, "1 Tahun (12x)", false, "", ""],
  ["hr-04", "hair-removal", "IPL Underarm + Glow 1 Tahun Unlimited", "", "12 Sesi Underarm + Glow selama 1 Tahun", 5388, 2799, 2799, "1 Tahun (12x)", false, "", ""],
  ["hr-05", "hair-removal", "IPL Medium / Brazilian V (Buy 2 Get 3)", "", "3 Sesi Brazilian V IPL", 1497, 998, 998, "", false, "", ""],
  ["hr-06", "hair-removal", "IPL Medium / Brazilian V 1 Tahun", "", "12 Sesi Brazilian V IPL selama 1 Tahun", 5988, 2899, 2899, "1 Tahun", false, "", ""],
  ["hr-07", "hair-removal", "IPL Brazilian VI (Buy 2 Get 3)", "", "3 Sesi Brazilian VI IPL", 1797, 1198, 1198, "", false, "", ""],
  ["hr-08", "hair-removal", "IPL Brazilian VI 1 Tahun", "", "12 Sesi Brazilian VI IPL selama 1 Tahun", 7188, 3199, 3199, "1 Tahun", false, "", ""],
  ["hr-09", "hair-removal", "IPL Large / Legs (Buy 2 Get 3)", "", "3 Sesi Large Hair Removal IPL", 2397, 1598, 1598, "", false, "", ""],
  ["hr-10", "hair-removal", "IPL Large / Legs 1 Tahun", "", "12 Sesi Large Hair Removal IPL selama 1 Tahun", 9588, 4499, 4499, "1 Tahun", false, "", ""],
  ["hr-11", "hair-removal", "DPL Hair Removal Underarm (Buy 4 Get 6)", "", "6 Sesi DPL Underarm (Rp 249rb/sesi)", 2094, 1494, 1494, "DPL Buy 4 Get 6", false, "Tanjung Duren, Benhil, Surabaya", ""],
  ["hr-12", "hair-removal", "DPL Hair Removal Underarm (Buy 8 Get 10)", "", "10 Sesi DPL Underarm (Rp 229rb/sesi)", 3490, 2290, 2290, "DPL Buy 8 Get 10", false, "Tanjung Duren, Benhil, Surabaya", ""],
  ["hr-13", "hair-removal", "DPL Underarm + Glow (Buy 4 Get 6)", "", "6 Sesi DPL Underarm + Glow (Rp 319rb/sesi)", 2994, 1914, 1914, "", false, "Tanjung Duren, Benhil, Surabaya", ""],
  ["hr-14", "hair-removal", "DPL Brazilian VI (Buy 4 Get 6)", "", "6 Sesi DPL Brazilian VI (Rp 339rb/sesi)", 4194, 2034, 2034, "", false, "Tanjung Duren, Benhil, Surabaya", ""],
  ["hr-15", "hair-removal", "DPL Hair Removal Laser Hands (Buy 4 Get 6)", "", "6 Sesi DPL Hands (Rp 349rb/sesi)", 3594, 2094, 2094, "", false, "Tanjung Duren, Benhil, Surabaya", ""],
  ["hr-16", "hair-removal", "DPL Hair Removal Laser Legs (Buy 4 Get 6)", "", "6 Sesi DPL Legs (Rp 449rb/sesi)", 5394, 2694, 2694, "", false, "Tanjung Duren, Benhil, Surabaya", ""]
];

// 4. Promo Single Treatment
const singlePromosData = [
  ["ID", "Grup Treatment", "Nama Treatment", "Harga Normal (RB)", "Non-Member (RB)", "Member (RB)", "Khusus Outlet", "Link Foto Treatment"],
  ["sp-01", "Glow and Rejuve", "Vitaran H Single", 2500, 1999, 1949, "", ""],
  ["sp-02", "Glow and Rejuve", "Vitaran H Double", 5000, 3499, 3499, "", ""],
  ["sp-03", "Glow and Rejuve", "Vitaran H Ultimate", 10000, 6499, 6449, "", ""],
  ["sp-04", "Glow and Rejuve", "Vitaran Poly Booster", 3500, 2999, 2949, "", ""],
  ["sp-05", "Glow and Rejuve", "Whitening Booster", 3598, 1799, 1699, "", ""],
  ["sp-06", "Glow and Rejuve", "Korean LHALA Peel", 789, 399, 399, "", ""],
  ["sp-07", "Glow and Rejuve", "3x Korean LHALA Peel", 2367, 1099, 1099, "", ""],
  ["sp-08", "Glow and Rejuve", "6x Korean LHALA Peel", 4734, 1999, 1999, "", ""],
  ["sp-09", "Glow and Rejuve", "Sozo Pink Bomb", 2999, 2499, 2399, "", ""],
  ["sp-10", "Glow and Rejuve", "Rejuran Healer", 6499, 3999, 3899, "", ""],
  ["sp-11", "Glow and Rejuve", "Rejuran I", 6198, 3099, 2999, "", ""],
  ["sp-12", "Glow and Rejuve", "Nucleofill", 6499, 3999, 3849, "", ""],
  ["sp-13", "Glow and Rejuve", "Collagen Stimulator Neauvia Hydro Deluxe", 6999, 4399, 4299, "Arteri, Bogor, BSD, Cinere, Karawaci, KPG, PIK, TJD, Medan, Greenlake, Bekasi", ""],
  ["sp-14", "Glow and Rejuve", "Profhilo", 6999, 6899, 6749, "", ""],
  ["sp-15", "Glow and Rejuve", "Xela Rederm", 8598, 4499, 4399, "", ""],
  ["sp-16", "Glow and Rejuve", "Jalupro", 8600, 4399, 4299, "", ""],
  ["sp-17", "Glow and Rejuve", "Rejuran HB", 8198, 4099, 3999, "", ""],
  ["sp-18", "Glow and Rejuve", "Exosome Face 5cc", 8398, 4199, 4099, "", ""],
  ["sp-19", "Glow and Rejuve", "Juvelook 6cc", 11198, 5599, 5499, "", ""],
  ["sp-20", "Glow and Rejuve", "Diamond Laser Facial", 1499, 999, 899, "", ""],
  ["sp-21", "Glow and Rejuve", "Eternal bloom peel", 599, 499, 449, "", ""],
  ["sp-22", "Glow and Rejuve", "Sylfirm X*", 7999, 3999, 3999, "Arteri", ""],
  ["sp-23", "Glow and Rejuve", "Premium glow infusion", 1199, 1099, 1049, "", ""],
  ["sp-24", "Glow and Rejuve", "Pro Reset Facial by DERMALOGICA - Hydrating", 1399, 845, 799, "", ""],
  ["sp-25", "Glow and Rejuve", "Pro Reset Facial by DERMALOGICA - Acne Clear", 1399, 845, 799, "", ""],
  ["sp-26", "Glow and Rejuve", "Korean Eye treatment*", 599, 349, 299, "Surabaya, Bandung, Semarang, Medan, Makassar, Cirebon, Jogja, Solo, Malang", ""],
  ["sp-27", "Glow and Rejuve", "Body rejuve laser", 1998, 999, 949, "", ""],
  ["sp-28", "Glow and Rejuve", "Body Rejuve Laser Underarm", 999, 649, 599, "", ""],
  ["sp-29", "Glow and Rejuve", "Meso Pigment Body 1cc (New)", 1450, 699, 599, "", ""],
  ["sp-30", "Glow and Rejuve", "Meso Pigment Body 3cc (New)", 4350, 1699, 1599, "", ""],
  ["sp-31", "Glow and Rejuve", "Korean DermaSalmon Skinbooster*", 699, 549, 499, "Cirebon, Solo, Semarang, Karawang", ""],
  ["sp-32", "Glow and Rejuve", "RejuraShine Dermabooster*", 2999, 999, 949, "", ""],
  ["sp-33", "Glow and Rejuve", "Mochi Glow Dermabooster*", 2397, 799, 749, "", ""],
  ["sp-34", "Glow and Rejuve", "Aqua Baby Dermabooster*", 1899, 599, 549, "", ""],
  ["sp-35", "Glow and Rejuve", "10 Steps Hollywood Face & Eye Brightening Therapy*", 799, 449, 399, "Cirebon, Solo, Malang, Jambi, Tasikmalaya, Padang", ""],
  ["sp-36", "Glow and Rejuve", "7 Steps Hollywood Face Brightening Therapy*", 499, 349, 329, "Cirebon, Solo, Malang, Jambi, Tasikmalaya, Padang", ""],
  ["sp-37", "Glow and Rejuve", "Glow Reset Laser Facial - Rejuran Shine*", 4546, 1399, 1349, "Pekanbaru, Samarinda, Jambi, Tasikmalaya, Padang, Karawang", ""],
  ["sp-38", "Glow and Rejuve", "Glow Reset Laser Facial - Mochi Glow*", 3944, 1099, 1049, "Pekanbaru, Samarinda, Jambi, Tasikmalaya, Padang, Karawang", ""],
  ["sp-39", "Glow and Rejuve", "Glow Reset Laser Facial - Aqua Baby*", 3446, 899, 849, "Pekanbaru, Samarinda, Jambi, Tasikmalaya, Padang, Karawang", ""],
  ["sp-40", "Glow and Rejuve", "Glow Fusion Laser Therapy - Rejuran Shine*", 5145, 1499, 1449, "Cirebon, Solo, Jambi, Tasikmalaya, Padang, Karawang", ""],
  ["sp-41", "Glow and Rejuve", "Glow Fusion Laser Therapy - Mochi Glow*", 4543, 1199, 1149, "Cirebon, Solo, Jambi, Tasikmalaya, Padang, Karawang", ""],
  ["sp-42", "Glow and Rejuve", "Glow Fusion Laser Therapy - Aqua Baby*", 4045, 999, 949, "Cirebon, Solo, Jambi, Tasikmalaya, Padang, Karawang", ""],

  // Slimming and Contouring
  ["sp-43", "Slimming and Contouring", "HIFU (Double chin/neck area/Eye)*", 999, 649, 599, "Outlet tertentu", ""],
  ["sp-44", "Slimming and Contouring", "HIFU Cheek*", 1199, 1099, 999, "Outlet tertentu", ""],
  ["sp-45", "Slimming and Contouring", "HIFU Full Face*", 1499, 1249, 1149, "Outlet tertentu", ""],
  ["sp-46", "Slimming and Contouring", "HIFU Arm*", 1499, 1049, 949, "Outlet tertentu", ""],
  ["sp-47", "Slimming and Contouring", "HIFU Bra Fat*", 1199, 649, 599, "Outlet tertentu", ""],
  ["sp-48", "Slimming and Contouring", "Fat Burn Laser (per Area)*", 1600, 799, 749, "Arteri, Tebet", ""],
  ["sp-49", "Slimming and Contouring", "Fat Burn Laser (per 2 Area)*", 3200, 1499, 1449, "Arteri, Tebet", ""],
  ["sp-50", "Slimming and Contouring", "Liftera2 HIFU Mid Lower Face (Cheek)*", 3999, 1999, 1899, "Tanjung Duren, Tebet, Arteri, Bali, Manyar, Gading Serpong, Manado, Makassar", ""],
  ["sp-51", "Slimming and Contouring", "Liftera2 HIFU Double Chin + neck*", 3099, 1299, 1199, "Tanjung Duren, Tebet, Arteri, Bali, Manyar, Gading Serpong, Manado, Makassar", ""],
  ["sp-52", "Slimming and Contouring", "Liftera2 HIFU Upper Face (Forehead & Temple) / Eyelift", 1499, 699, 599, "Tanjung Duren, Tebet, Arteri, Bali, Manyar, Gading Serpong, Manado, Makassar", ""],
  ["sp-53", "Slimming and Contouring", "Liftera2 HIFU Full Face*", 7999, 3999, 3899, "Tanjung Duren, Tebet, Arteri, Bali, Manyar, Gading Serpong, Manado, Makassar", ""],
  ["sp-54", "Slimming and Contouring", "Ultrasculpt*", 899, 449, 399, "Semua outlet kecuali Tanjung Barat & Karawaci", ""],
  ["sp-55", "Slimming and Contouring", "CaloBurn*", 999, 399, 349, "Benhil, Pondok Bambu, Bintaro", ""],

  // Acne & Scar
  ["sp-56", "Acne & Scar", "Laser CO2 Scar - Full face*", 1499, 799, 699, "Arteri, Benhil, Bekasi, PDB, BSD, Bintaro, TJD, Cinere, Kemang, PIK, KPG, Bandung, Medan, Makassar, Rawamangun", ""],
  ["sp-57", "Acne & Scar", "PRP wajah", 1499, 1079, 979, "", ""],
  ["sp-58", "Acne & Scar", "Acne Laser Facial", 1499, 999, 899, "", ""],
  ["sp-59", "Acne & Scar", "Rejuran scar", 5499, 3099, 2999, "", ""],
  ["sp-60", "Acne & Scar", "Restylane Scar", 7798, 3999, 3899, "", ""],
  ["sp-61", "Acne & Scar", "Acne Micro Botox Standard (20 Unit)", 1898, 949, 849, "", ""],
  ["sp-62", "Acne & Scar", "Acne Micro Botox Hydration Standard (20 Unit)", 2896, 1448, 1348, "", ""],
  ["sp-63", "Acne & Scar", "PRP stretchmark", 1499, 899, 899, "", ""],
  ["sp-64", "Acne & Scar", "PRP Stretchmark Double Dose", 2998, 1759, 1659, "", ""],

  // Hair Grow
  ["sp-65", "Hair Grow", "Hair Grow", 1499, 1299, 1149, "", ""],
  ["sp-66", "Hair Grow", "PRP Hair grow", 1799, 1099, 999, "", ""],

  // Anti Aging
  ["sp-67", "Anti Aging", "Ultracol 100", 7000, 4999, 4949, "Arteri, Bandung, Benhil, Bintaro, Bogor, BSD, Cinere, Depok, Gading Serpong, JGC, Karawaci, KPG, Mangga Besar, PIK, Tangcity, Tanjung Barat, Tebet, TJD", ""],
  ["sp-68", "Anti Aging", "Ultracol 200", 9000, 5599, 5549, "Outlet tertentu", ""],
  ["sp-69", "Anti Aging", "Novuma", 9000, 5899, 5849, "Outlet tertentu", ""],
  ["sp-70", "Anti Aging", "Bi-Dens", 8000, 4699, 4599, "Outlet tertentu", ""]
];

// 5. Paket Subscription (Langganan Sesi)
const subscriptionData = [
  [
    "ID", "Nama Treatment", "Harga Single (RB)",
    "3x Normal", "3x Non-Member", "3x Member", "3x Sesi/Member",
    "6x Normal", "6x Non-Member", "6x Member", "6x Sesi/Member",
    "12x Normal", "12x Non-Member", "12x Member", "12x Sesi/Member",
    "Link Foto Treatment"
  ],
  ["sub-01", "Laser (Nanolux / Picolux)", 1199, 3597, 1978, 1878, 626, 7194, 3237, 3137, 522, 14388, 5755, 5655, 471, ""],
  ["sub-02", "Diamond Laser Facial", 1499, 4497, 2248, 2148, 716, 8994, 4317, 4217, 702, "", "", "", "", ""],
  ["sub-03", "IPL Glow", 399, 1197, 897, 797, 265, 2394, 1556, 1456, 242, "", "", "", "", ""],
  ["sub-04", "HIFU Full Face", 1149, 4497, 2847, 2649, 883, 8994, 5394, 5099, 849, "", "", "", "", ""],
  ["sub-05", "Korean LHALA Peel", 789, 2367, 1099, 1099, 366, 4734, 1999, 1999, 333, "", "", "", "", ""],
  ["sub-06", "PRP Wajah & Skin Regeneration", 1499, 4497, 2850, 2697, 899, 8994, 5200, 4999, 833, "", "", "", "", ""]
];

// 6. Skincare Kits (from Internal Memo Section 12)
const skincareData = [
  ["ID Produk", "Nama Paket Skincare", "Harga Normal (Rp)", "Harga Promo (Rp)", "Isi Produk (Pisahkan koma)", "Free Gift / Bonus", "Link Foto Produk"],
  ["sk-01", "Acne Smooth Skin Kit", 599000, 437786, "1 Facial Wash, 1 Acne solution, 1 Day Cream, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen", "FREE Exclusive SOZO Pouch", ""],
  ["sk-02", "Acne Calm & Clear Kit", 699000, 496037, "1 Facial Wash, 1 Acne solution, 1 Day Cream, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen", "FREE Exclusive SOZO Pouch", ""],
  ["sk-03", "Acne Deep Clear Kit", 799000, 540848, "1 Facial Wash, 1 Acne solution, 1 Day Cream, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen", "FREE Exclusive SOZO Pouch", ""],
  ["sk-04", "Acne Balance Kit", 704470, 396581, "1 Facial Wash, 1 Acne solution, 1 Night Cream, 1 Moisturizer, 1 Acne Sunscreen, 1 Serum", "FREE Exclusive SOZO Pouch", ""],
  ["sk-05", "Radiance Bright Kit", 649000, 475418, "1 Facial Wash, 1 Serum, 1 Night Cream, 1 Moisturizer, 1 Sunscreen", "FREE Exclusive SOZO Pouch", ""],
  ["sk-06", "Forever Young Kit", 649000, 475418, "1 Facial Wash, 1 Serum, 1 Night Cream, 1 Moisturizer, 1 Sunscreen", "FREE Exclusive SOZO Pouch", ""],
  ["sk-07", "Paket Anti Hair Fall", 580000, 550000, "1 Custom Hair Serum, 1 Hair Vitamin", "FREE Exclusive SOZO Pouch", ""]
];

// 7. Lokasi Cabang SOZO
const branchesData = [
  ["ID Cabang", "Kota", "Nama Cabang", "Alamat Lengkap", "Nomor WhatsApp / Telp", "Jam Operasional"],
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

// Create workbook
const wb = XLSX.utils.book_new();

const wsConfig = XLSX.utils.aoa_to_sheet(configData);
XLSX.utils.book_append_sheet(wb, wsConfig, "Pengaturan_Klinik");

const wsCat = XLSX.utils.aoa_to_sheet(categoriesData);
XLSX.utils.book_append_sheet(wb, wsCat, "Kategori");

const wsTreat = XLSX.utils.aoa_to_sheet(treatmentsData);
XLSX.utils.book_append_sheet(wb, wsTreat, "Daftar_Treatment");

const wsSingle = XLSX.utils.aoa_to_sheet(singlePromosData);
XLSX.utils.book_append_sheet(wb, wsSingle, "Promo_Single");

const wsSub = XLSX.utils.aoa_to_sheet(subscriptionData);
XLSX.utils.book_append_sheet(wb, wsSub, "Subscription_Paket");

const wsBranches = XLSX.utils.aoa_to_sheet(branchesData);
XLSX.utils.book_append_sheet(wb, wsBranches, "Daftar_Klinik_Cabang");

const wsSkincare = XLSX.utils.aoa_to_sheet(skincareData);
XLSX.utils.book_append_sheet(wb, wsSkincare, "Skincare_Homecare");

// Ensure public directory exists
const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'Buku_BAU_SOZO_September_2026.xlsx');
XLSX.writeFile(wb, outputPath);
console.log(`Successfully generated Excel file at: ${outputPath}`);
