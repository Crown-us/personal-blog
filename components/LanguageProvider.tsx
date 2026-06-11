"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T>(obj: { id: T; en: T }) => T;
  dict: Record<string, string>;
  tExtension: (ext: any) => any;
  tSourceCode: (code: any) => any;
  tBlog: (post: any) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// A simple dictionary for global UI elements to avoid inline objects everywhere
const uiTranslations: Record<Language, Record<string, string>> = {
  id: {
    "nav.home": "Beranda",
    "nav.devtools": "DevTools",
    "nav.sourceCode": "Source Code",
    "nav.bundles": "Bundel",
    "nav.showcase": "Showcase",
    "nav.blog": "Tutorial",
    "nav.compare": "Bandingkan",
    "nav.console": "Konsol",
    "nav.submit": "Kirim Produk",
    "nav.deals": "Deals",
    "nav.search": "Cari produk, kategori, pembuat...",
    "nav.searchPlaceholder": "Cari di marketplace...",
    "common.featured": "Pilihan Editor",
    "common.popular": "Alat Dev Populer",
    "common.popularSourceCode": "Source Code Terpopuler",
    "common.seeAll": "Lihat semua",
    "common.viewDetails": "Lihat Detail",
    "common.categories": "Kategori",
    "common.browseCategories": "Cari Berdasarkan Kategori",
    "common.bundles": "Paket Sumber Daya Kurasi",
    "common.tutorials": "Tutorial Terbaru",
    "common.trending": "Sedang Tren",
    "compare.trayTitle": "Bandingkan Produk",
    "compare.clear": "Bersihkan",
  },
  en: {
    "nav.home": "Home",
    "nav.devtools": "DevTools",
    "nav.sourceCode": "Source Code",
    "nav.bundles": "Bundles",
    "nav.showcase": "Showcase",
    "nav.blog": "Blog",
    "nav.compare": "Compare",
    "nav.console": "Console",
    "nav.submit": "Submit Tool",
    "nav.deals": "Deals",
    "nav.search": "Search devtools, categories, or creators...",
    "nav.searchPlaceholder": "Search marketplace...",
    "common.featured": "Editor's Picks",
    "common.popular": "Popular Developer Tools",
    "common.popularSourceCode": "Popular Source Codes",
    "common.seeAll": "See all",
    "common.viewDetails": "View Details",
    "common.categories": "Categories",
    "common.browseCategories": "Browse by Category",
    "common.bundles": "Curated Resource Bundles",
    "common.tutorials": "Latest Tutorials",
    "common.trending": "Trending",
    "compare.trayTitle": "Compare Products",
    "compare.clear": "Clear",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    const storedLang = localStorage.getItem("preferred-language") as Language;
    if (storedLang === "id" || storedLang === "en") {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const t = <T,>(obj: { id: T; en: T }): T => {
    return obj[language];
  };

  const dict = uiTranslations[language];

  // Dynamic translators for data entities
  const tExtension = (ext: any) => {
    if (!ext) return ext;
    if (language === "en") return ext; // Default mock data is English

    const translations: Record<string, { name?: string; tagline?: string; description?: string; trustBadge?: string; categoryName?: string }> = {
      "ext-1": {
        name: "ChatGPT Sidebar & Pengunggah File",
        tagline: "Akses ChatGPT 4o, Claude 3.5, dan Gemini Pro instan di tab mana saja. Unggah PDF & file dokumen besar langsung.",
        description: "Maksimalkan kekuatan AI secara berdampingan saat Anda browsing. ChatGPT Sidebar mengintegrasikan kemampuan model canggih langsung ke panel samping browser Anda. Ringkas artikel, jelaskan kode rumit, buat draf email, dan terjemahkan halaman dengan cepat. Versi 2.4 menambahkan pengunggahan file langsung (PDF, DOCX, CSV) dan kemampuan OCR otomatis untuk gambar. Dirancang untuk developer, peneliti, dan pembuat konten.",
        trustBadge: "Terbaik Untuk Developer",
        categoryName: "Alat AI"
      },
      "ext-2": {
        name: "Monica - Copilot AI Anda",
        tagline: "Chat dengan GPT-4, Claude 3.5, dan Gemini. Cari, tulis, terjemahkan, dan tangkap halaman web dengan mudah.",
        description: "Monica adalah asisten AI all-in-one Anda, dilengkapi dengan model LLM canggih (GPT-4, Claude 3, Gemini). Cukup tekan Cmd+M atau Ctrl+M untuk mengobrol dengan Monica, menulis blog, merangkum artikel, menerjemahkan PDF, atau mencari web dengan wawasan AI instan. Sangat cocok untuk pembuat konten dan tugas browser harian.",
        trustBadge: "Pilihan Editor",
        categoryName: "Alat AI"
      },
      "ext-3": {
        name: "Perplexity - Pendamping Pencarian AI",
        tagline: "Dapatkan jawaban instan dengan kutipan sumber untuk setiap pertanyaan langsung di browser Anda.",
        description: "Perplexity AI menggantikan pencarian tradisional dengan jawaban instan, interaktif, dan dikutip sepenuhnya. Sorot teks apa saja atau ajukan pertanyaan langsung. Perplexity mencari web secara langsung, menyusun sumber daya terbaik, dan menyintesis jawaban bersih dengan kutipan sumber. Sangat berguna untuk riset.",
        trustBadge: "Terbaik Untuk Riset",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-4": {
        name: "Merlin - Asisten ChatGPT di Chrome",
        tagline: "Rangkum video YouTube, terjemahkan artikel, dan buat balasan LinkedIn & Gmail instan dengan AI.",
        description: "Merlin adalah asisten ChatGPT kustom Anda di Chrome. Dengan Merlin, Anda dapat merangkum video YouTube panjang dalam sekali klik, menulis postingan LinkedIn dengan konversi tinggi, membalas email di Gmail secara profesional, dan mendapatkan respon GPT-4 di samping hasil Google Search.",
        trustBadge: "Favorit Profesional",
        categoryName: "Alat AI"
      },
      "ext-5": {
        name: "Sider - Sidebar AI & Penerjemah",
        tagline: "Pendamping AI untuk membaca, menulis, dan coding. Terjemahkan teks dan jelaskan logika di halaman mana saja.",
        description: "Sider adalah sidebar browser cerdas yang dirancang untuk membantu aktivitas membaca, menulis, dan pemrograman harian Anda. Didukung oleh GPT-4, Claude, dan Gemini untuk menjelaskan blok kode yang rumit, memeriksa kesalahan tata bahasa, menulis draf teks, dan menyediakan terjemahan bahasa akurat.",
        trustBadge: "Populer Minggu Ini",
        categoryName: "Alat AI"
      },
      "ext-6": {
        name: "MaxAI.me - Gunakan AI 1-Klik di Mana Saja",
        tagline: "Tulis ulang, ringkas, balas, dan terjemahkan teks instan di situs web mana pun dengan GPT-4 dan Claude.",
        description: "MaxAI.me menghadirkan AI generatif 1-klik langsung di kursor browsing Anda. Sorot teks apa pun di situs web mana pun untuk menulis ulang, merangkum, memeriksa tata bahasa, menerjemahkan, atau membalas secara instan. Mendukung GPT-4, Claude 3, dan Gemini. Mempercepat pengerjaan email, dokumen, dan bacaan sosial.",
        trustBadge: "Terbaik Untuk Produktivitas",
        categoryName: "Alat AI"
      },
      "ext-7": {
        name: "Octotree: Pohon Kode GitHub",
        tagline: "GitHub lebih bertenaga. Pohon file visual untuk penelusuran repositori cepat dan tinjauan kode.",
        description: "Ekstensi browser yang meningkatkan penelusuran repositori GitHub. Alat ini menampilkan pohon folder interaktif dan cepat di sidebar yang memungkinkan pengembang menelusuri kode sumber, mencari file, dan memeriksa merge request tanpa memuat ulang halaman terus-menerus.",
        trustBadge: "Terbaik Untuk Developer",
        categoryName: "Alat Developer"
      },
      "ext-8": {
        name: "daily.dev: Berita Developer",
        tagline: "Cara termudah untuk tetap terupdate tentang berita teknologi. Feed yang dikuratori untuk rekayasawan perangkat lunak.",
        description: "Tingkatkan layar tab baru browser Anda menjadi pembaca berita yang sangat personal dan terkurasi. Alat ini mengumpulkan postingan teknik, tutorial, pembaruan rilis, dan panduan pengembang dari ratusan portal teknologi utama.",
        trustBadge: "Sedang Tren Minggu Ini",
        categoryName: "Produktivitas"
      },
      "ext-9": {
        name: "Clear Cache: Pembersih Satu Klik",
        tagline: "Hapus cookie browser, penyimpanan, cache, dan riwayat dengan satu klik mudah.",
        description: "Alat utilitas ringan yang dirancang untuk pengembang web. Instan menghapus cache aplikasi, file cookie aktif, penyimpanan lokal HTML5, file database, dan unduhan dengan satu klik dari bilah alat browser.",
        trustBadge: "Terbaik Untuk Developer",
        categoryName: "Alat Developer"
      },
      "ext-10": {
        name: "Session Buddy: Pengelola Tab",
        tagline: "Penjelajah tab dan pengelola sesi terpadu. Simpan tab yang terbuka dan pulihkan nanti.",
        description: "Pengelola sesi yang bersih dan cepat untuk pengguna tingkat lanjut. Alat ini memungkinkan pengembang untuk menyimpan grup tab browser yang terbuka sebagai sesi kustom, mencari tab aktif di seluruh jendela, dan memulihkan tab setelah sistem mogok.",
        trustBadge: "Disetujui Editor",
        categoryName: "Produktivitas"
      },
      "ext-11": {
        name: "GitHub Copilot",
        tagline: "Pair programmer AI Anda. Dapatkan saran autocomplete dan bantuan obrolan langsung saat menulis kode.",
        description: "GitHub Copilot adalah alat pengembang AI yang paling banyak diadopsi di dunia. Alat ini memberikan saran bergaya autocomplete saat Anda menulis kode, mengubah komentar menjadi kode yang dapat dieksekusi, dan memungkinkan Anda mengobrol dengan asisten AI di editor untuk menyelesaikan masalah, menulis pengujian, dan memahami basis kode yang kompleks.",
        trustBadge: "Disetujui Editor",
        categoryName: "Alat Developer"
      },
      "ext-12": {
        name: "Codeium",
        tagline: "Pelengkapan otomatis dan pencarian kode AI gratis. Percepat alur kerja coding Anda dengan obrolan cerdas.",
        description: "Codeium adalah alternatif gratis dan ultra-cepat untuk GitHub Copilot. Alat ini menawarkan pelengkapan otomatis kode baris tunggal dan multi-baris di lebih dari 70 bahasa, obrolan inline untuk merefaktor kode, dan pencarian konteks tingkat repositori untuk menjawab pertanyaan tentang seluruh basis kode Anda.",
        trustBadge: "Alternatif Gratis Terbaik",
        categoryName: "Alat Developer"
      },
      "ext-13": {
        name: "Continue.dev",
        tagline: "Asisten kode AI sumber terbuka (open-source). Hubungkan LLM apa pun ke IDE Anda dengan mudah.",
        description: "Continue adalah asisten kode AI open-source terkemuka. Ini memungkinkan Anda membangun asisten pengembangan perangkat lunak kustom dengan menghubungkan LLM lokal (seperti Ollama, Llama3) atau model berbasis API (seperti GPT-4, Claude) untuk pelengkapan otomatis kode, refactoring inline, dan pemahaman kode.",
        trustBadge: "Sumber Terbuka Terbaik",
        categoryName: "Alat Developer"
      },
      "ext-14": {
        name: "Tabnine",
        tagline: "Asisten kode AI kelas perusahaan. Aman, privat, dan dilatih pada kode berlisensi permisif.",
        description: "Tabnine adalah pelopor dalam pelengkapan kode AI yang berfokus pada keamanan dan kepatuhan. Tabnine menawarkan model AI privat yang dapat dijalankan secara lokal (on-premise) atau di cloud Anda, memastikan kode sumber Anda tidak pernah meninggalkan lingkungan aman Anda. Sangat cocok untuk tim perusahaan.",
        trustBadge: "Paling Aman",
        categoryName: "Alat Developer"
      },
      "ext-15": {
        name: "Blackbox AI",
        tagline: "Pencarian kode dan pelengkapan otomatis AI super cepat. Ubah pertanyaan menjadi kode secara instan.",
        description: "Blackbox AI dibuat untuk mencari cuplikan kode di jutaan repositori. Alat ini memberikan saran pelengkapan otomatis di editor Anda dan dapat mengekstrak kode dari video dan gambar secara instan. Cepat, serbaguna, dan sangat andal untuk menyalin dan menemukan skrip.",
        trustBadge: "Pencarian Kode Terbaik",
        categoryName: "Alat Developer"
      },
      "ext-16": {
        name: "CodeGeeX",
        tagline: "Asisten coding AI multibahasa sumber terbuka. Terjemahkan kode antar bahasa pemrograman secara instan.",
        description: "CodeGeeX adalah asisten coding AI multibahasa yang andal. Selain menulis boilerplate kode dan penjelasan, alat ini berspesialisasi dalam menerjemahkan blok kode dari satu bahasa pemrograman ke bahasa pemrograman lainnya dengan presisi tinggi (misal: Python ke Go) untuk mempercepat migrasi sistem.",
        trustBadge: "Penerjemah Kode Terbaik",
        categoryName: "Alat Developer"
      },
      "ext-17": {
        name: "SciSpace Copilot",
        tagline: "Asisten riset AI Anda. Jelaskan makalah ilmiah, telusuri pustaka akademis, dan analisis persamaan.",
        description: "SciSpace Copilot adalah pembantu browser yang andal untuk peneliti dan mahasiswa. Alat ini menyorot teks jurnal yang rumit, merangkum artikel ilmiah, menjelaskan jargon akademis yang sulit, dan memecahkan persamaan matematika secara real-time.",
        trustBadge: "Terbaik Untuk Jurnal",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-18": {
        name: "Explainpaper",
        tagline: "Unggah makalah penelitian yang rumit dan dapatkan penjelasan yang sederhana serta mudah dipahami.",
        description: "Explainpaper adalah cara termudah untuk membaca jurnal akademik. Cukup sorot bagian kalimat atau persamaan yang membingungkan, dan AI Explainpaper akan menerjemahkannya ke dalam bahasa yang sederhana. Membantu mahasiswa memahami jurnal 10x lebih cepat.",
        trustBadge: "Paling Mudah Digunakan",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-19": {
        name: "Scholarcy: Perangkum Makalah Penelitian",
        tagline: "Baca jurnal penelitian lebih cepat. Rangkum artikel ilmiah dan buat kartu flash dalam hitungan detik.",
        description: "Scholarcy adalah perpustakaan interaktif dan alat peringkas otomatis. Alat ini membaca jurnal akademis, bab buku, dan laporan riset, kemudian mengekstrak fakta penting, gambar, dan daftar pustaka menjadi kartu flash ringkasan yang terstruktur.",
        trustBadge: "Peringkas Terbaik",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-20": {
        name: "WebChatGPT: ChatGPT dengan Akses Internet",
        tagline: "Lengkapi prompt ChatGPT Anda dengan hasil pencarian web yang relevan untuk jawaban yang akurat.",
        description: "WebChatGPT adalah ekstensi browser yang menambahkan hasil pencarian web real-time yang relevan ke prompt ChatGPT Anda. Dengan menyediakan akses internet terupdate, ini membantu mahasiswa mendapatkan informasi yang cited dan akurat.",
        trustBadge: "Favorit Mahasiswa",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-21": {
        name: "YouTube Summary dengan ChatGPT",
        tagline: "Dapatkan transkrip dan ringkasan terstruktur instan untuk video YouTube menggunakan AI.",
        description: "YouTube Summary menggunakan ChatGPT to menghasilkan transkrip dan ringkasan video perkuliahan, webinar, dan tutorial di YouTube. Menghemat waktu belajar mahasiswa dengan menyorot konsep inti dan penanda waktu (timestamps) secara instan.",
        trustBadge: "Peringkas Video Terbaik",
        categoryName: "Riset & Pembelajaran"
      },
      "ext-22": {
        name: "Grammarly",
        tagline: "Asisten menulis AI. Perbaiki tata bahasa, periksa ejaan, dan sesuaikan nada di mana saja.",
        description: "Grammarly adalah asisten menulis bertenaga AI yang menjaga email, artikel, dan proposal Anda bebas dari kesalahan. Alat ini menyorot masalah tata bahasa, kesalahan ejaan, dan menyarankan peningkatan struktural agar sesuai dengan nada bicara target.",
        trustBadge: "Korektor Terbaik",
        categoryName: "Penulisan"
      },
      "ext-23": {
        name: "LanguageTool",
        tagline: "Pemeriksa ejaan dan tata bahasa multibahasa. Sumber terbuka, privat, dan mendukung 30+ bahasa.",
        description: "LanguageTool adalah pemeriksa tata bahasa sumber terbuka yang berfokus pada privasi. Sangat cocok untuk penulis yang menyusun teks dalam berbagai bahasa, menawarkan koreksi gaya dan saran sinonim dalam bahasa Inggris, Indonesia, Spanyol, Prancis, dan lainnya.",
        trustBadge: "Multibahasa Terbaik",
        categoryName: "Penulisan"
      },
      "ext-24": {
        name: "QuillBot: AI Paraphrasing Tool",
        tagline: "Parafrase, ringkas, dan terjemahkan teks Anda untuk menulis dengan lebih jelas.",
        description: "QuillBot adalah alat parafrase AI canggih. Ini membantu mahasiswa dan profesional menulis ulang kalimat, paragraf, atau seluruh artikel untuk menghindari plagiarisme, meningkatkan kosakata, dan menemukan frasa sempurna untuk esai atau skripsi.",
        trustBadge: "Parafrase Terbaik",
        categoryName: "Penulisan"
      },
      "ext-25": {
        name: "Wordtune: AI Writing Assistant",
        tagline: "Parafrasekan pemikiran Anda menjadi tulisan yang jelas, menarik, dan profesional.",
        description: "Wordtune menerjemahkan ide Anda menjadi kata-kata tertulis. Menawarkan saran penulisan ulang real-time, membantu Anda memilih antara nada formal, santai, diringkas, atau diperluas. Sangat cocok untuk menyusun proposal yang persuasif.",
        trustBadge: "Parafrase Ide Terbaik",
        categoryName: "Penulisan"
      },
      "ext-26": {
        name: "Compose AI: Autocomplete Writing",
        tagline: "Tulis email, dokumen, dan pesan obrolan 10x lebih cepat dengan pelengkapan otomatis AI.",
        description: "Compose AI adalah ekstensi Chrome gratis yang mengotomatiskan penulisan Anda. Alat ini menggunakan AI generatif untuk melengkapi kalimat secara otomatis saat Anda mengetik di situs web mana pun.",
        trustBadge: "Autocomplete Terbaik",
        categoryName: "Penulisan"
      },
      "ext-27": {
        name: "Canva: AI Graphic Design",
        tagline: "Desain grafis media sosial, presentasi, dan mockup di browser Anda menggunakan AI.",
        description: "Pendamping browser Canva memungkinkan freelancer pemasaran digital mengakses templat, menghasilkan grafis AI, menghapus latar belakang foto dalam satu klik, dan mengatur aset merek secara instan dari tab mana saja.",
        trustBadge: "Terlaris",
        categoryName: "Pembuat Konten"
      },
      "ext-28": {
        name: "Gamma AI: Presentation Builder",
        tagline: "Hasilkan presentasi, halaman web, dan dokumen indah dalam hitungan detik menggunakan AI.",
        description: "Gamma AI membantu Anda membuat slide deck dan presentasi penjualan dengan satu perintah teks. Ini menangani pemformatan tata letak, desain visual, dan pengoptimalan teks, membiarkan freelancer membuat pitch dalam waktu singkat.",
        trustBadge: "Pembuat Slide Terbaik",
        categoryName: "Pembuat Konten"
      },
      "ext-29": {
        name: "Tome: AI Storytelling & Decks",
        tagline: "Bangun laporan interaktif kolaboratif dan slide presentasi dari kerangka tulisan.",
        description: "Tome menggunakan AI generatif untuk merancang dan menulis slide, laporan, dan portofolio. Terintegrasi dengan alat seperti Figma, YouTube, dan Miro, menjadikannya utilitas bercerita yang ideal bagi kreator.",
        trustBadge: "Disetujui Editor",
        categoryName: "Pembuat Konten"
      },
      "ext-30": {
        name: "Adobe Firefly: AI Art Generator",
        tagline: "Hasilkan gambar, efek teks, dan pewarnaan ulang vektor langsung di browser Anda.",
        description: "Adobe Firefly menawarkan model AI generatif yang aman secara komersial. Ketik prompt langsung di sidebar browser Anda untuk menghasilkan ilustrasi digital, menerapkan efek teks yang indah, dan mewarnai ulang aset vektor SVG.",
        trustBadge: "AI Komersial Terbaik",
        categoryName: "Pembuat Konten"
      },
      "ext-31": {
        name: "Designs.ai: All-In-One Studio",
        tagline: "Hasilkan logo, video, mockup, dan pengisi suara menggunakan templat AI.",
        description: "Designs.ai menggabungkan algoritma cerdas untuk membangun aset visual. Buat logo merek, konversi teks-ke-video untuk iklan, dan hasilkan pengisi suara realistis untuk salinan pemasaran Anda dalam hitungan menit.",
        trustBadge: "Sedang Tren",
        categoryName: "Pembuat Konten"
      },
      "ext-32": {
        name: "Loom: Perekam Layar & Editor Video",
        tagline: "Rekam layar dan kamera Anda. Bagikan pesan video cepat dengan klien dan tim.",
        description: "Loom adalah cara termudah untuk merekam video presentasi layar, pembaruan produk, atau laporan bug. Lewati rapat status yang panjang; rekam layar Anda, tambahkan kamera wajah, dan bagikan tautannya instan.",
        trustBadge: "Perekam Video Terbaik",
        categoryName: "Peralatan Freelancer"
      },
      "ext-33": {
        name: "Notion Web Clipper",
        tagline: "Simpan halaman web, artikel, atau sumber daya apa pun langsung ke ruang kerja Notion Anda.",
        description: "Simpan semua bahan referensi Anda di satu tempat. Notion Web Clipper memungkinkan Anda menyimpan blog, portofolio, dan halaman riset langsung ke database kustom untuk mengatur proyek klien dengan mudah.",
        trustBadge: "Disetujui Developer",
        categoryName: "Peralatan Freelancer"
      },
      "ext-34": {
        name: "Wappalyzer: Tech Stack Finder",
        tagline: "Identifikasi CMS, kerangka kerja, dan teknologi web yang digunakan di situs web mana pun.",
        description: "Wappalyzer adalah alat audit teknologi web untuk freelancer dan insinyur. Temukan kerangka kerja (framework), piksel pelacak, penyedia hosting, dan database yang berjalan di situs web kompetitor atau klien.",
        trustBadge: "Audit Teknologi Terbaik",
        categoryName: "Peralatan Freelancer"
      },
      "ext-35": {
        name: "Hunter: Email Finder for Outreach",
        tagline: "Temukan alamat email profesional untuk domain atau situs web apa pun secara instan.",
        description: "Hunter memungkinkan Anda menemukan alamat email yang terkait dengan situs web apa pun dalam hitungan detik. Ideal untuk freelancer penjualan keluar dan pemasar yang mencoba terhubung dengan bisnis.",
        trustBadge: "Pencari Kontak Terbaik",
        categoryName: "Peralatan Freelancer"
      },
      "ext-36": {
        name: "Clockify: Time Tracker & Timesheet",
        tagline: "Lacak jam kerja di berbagai aplikasi web dan susun laporan klien yang bersih.",
        description: "Clockify adalah ekstensi pelacakan waktu gratis. Freelancer dapat memulai pengatur waktu langsung dari Trello, Jira, Notion, dan Gmail untuk menagih klien secara akurat.",
        trustBadge: "Pelacak Waktu Terbaik",
        categoryName: "Peralatan Freelancer"
      },
      "ext-37": {
        name: "Tango: Buat Panduan Langkah demi Langkah",
        tagline: "Buat tangkapan layar terstruktur dan panduan petunjuk (how-to) otomatis saat Anda mengeklik.",
        description: "Tango menangkap alur kerja web Anda secara real-time, secara otomatis menghasilkan dokumentasi langkah demi langkah yang indah dengan tangkapan layar yang diperbesar untuk panduan instruksi.",
        trustBadge: "Disetujui Editor",
        categoryName: "Peralatan Freelancer"
      },
      "ext-38": {
        name: "Keywords Everywhere",
        tagline: "Alat riset kata kunci yang menampilkan volume, CPC, dan tingkat persaingan langsung di Google.",
        description: "Keywords Everywhere menampilkan data volume pencarian di Google Search, YouTube, dan Amazon. Ini menampilkan tarif biaya per klik (CPC) dan grafik tren pencarian untuk membantu blogger merencanakan artikel.",
        trustBadge: "Riset Kata Kunci Terbaik",
        categoryName: "SEO & Pemasaran"
      },
      "ext-39": {
        name: "SimilarWeb: Website Traffic Auditor",
        tagline: "Analisis statistik lalu lintas situs web, sumber rujukan, dan peringkat dalam 1 klik.",
        description: "SimilarWeb menyediakan statistik lalu lintas (traffic) dan keterlibatan pengunjung untuk situs web apa pun. Periksa rasio pantulan kompetitor dan saluran lalu lintas rujukan langsung dari bilah browser.",
        trustBadge: "Analisis Trafik Terbaik",
        categoryName: "SEO & Pemasaran"
      },
      "ext-40": {
        name: "SEOquake",
        tagline: "Lakukan audit SEO instan, periksa otoritas domain, dan analisis kepadatan kata kunci.",
        description: "SEOquake adalah utilitas pemeriksa SEO lengkap. Ini menampilkan metrik pencarian di halaman hasil Google, memungkinkan blogger melakukan audit konten cepat, memverifikasi densitas kata kunci, dan membandingkan backlink.",
        trustBadge: "Audit SEO Praktis Terbaik",
        categoryName: "SEO & Pemasaran"
      },
      "ext-41": {
        name: "Ahrefs SEO Toolbar",
        tagline: "Periksa tautan balik (backlinks), kesulitan kata kunci, dan nilai Domain Rating langsung di hasil pencarian.",
        description: "Ahrefs SEO Toolbar menampilkan metrik Ahrefs langsung di hasil pencarian Anda. Mengevaluasi kesulitan kata kunci pencarian, lalu lintas organik, dan catatan backlink untuk membantu blogger meningkatkan otoritas web.",
        trustBadge: "Pilihan Profesional",
        categoryName: "SEO & Pemasaran"
      },
      "ext-42": {
        name: "Detailed SEO Extension",
        tagline: "Dapatkan wawasan SEO terperinci untuk halaman web mana pun dalam satu klik. Periksa heading dan schema.",
        description: "Detailed SEO menganalisis hierarki heading (H1-H6), tag meta robot, struktur schema, dan tautan kanonik secara instan. Membantu blogger mengoptimalkan sinyal SEO on-page dalam hitungan detik.",
        trustBadge: "Audit On-Page Terbaik",
        categoryName: "SEO & Pemasaran"
      }
    };

    const tr = translations[ext.id];
    if (tr) {
      return {
        ...ext,
        name: tr.name || ext.name,
        tagline: tr.tagline || ext.tagline,
        description: tr.description || ext.description,
        trustBadge: tr.trustBadge || ext.trustBadge,
        categoryName: tr.categoryName || ext.categoryName
      };
    }
    return ext;
  };

  const tSourceCode = (code: any) => {
    if (!code) return code;
    
    // In Indonesian mode, map source code texts to Indonesian. Price is already Rp.
    if (language === "id") {
      const translations: Record<string, { name?: string; tagline?: string; description?: string }> = {
        "sc-1": {
          name: "Sistem Manajemen RT/RW",
          tagline: "Portal lingkungan warga dengan fitur pelacakan tagihan, data warga, dan papan pengumuman.",
          description: "Sistem portal manajemen lingkungan lengkap yang siap pakai. Dashboard admin memudahkan pengurus RT/RW mengunggah catatan pembayaran bulanan, memverifikasi detail daftar warga, dan menyiarkan notifikasi."
        },
        "sc-2": {
          name: "Platform Blog AI",
          tagline: "Buat, rancang, dan jadwalkan konten secara dinamis menggunakan integrasi OpenAI di dalam editor Markdown.",
          description: "Tulis konten dua kali lebih cepat. AI Blog Platform menghubungkan alat pembuat kerangka ChatGPT langsung ke penerbit draf Anda."
        },
        "sc-3": {
          name: "Template Portofolio Pro",
          tagline: "Template portofolio minimalis dan sangat cepat dengan tampilan showcase berkinerja tinggi untuk developer.",
          description: "Landing page pengembang yang memukau. Bagian kisi bersih yang menyoroti repositori proyek open source, ringkasan blog, dan formulir kontak."
        },
        "sc-4": {
          name: "Sistem Manajemen POS Kasir",
          tagline: "Sistem kasir toko yang mendukung inventaris, sinkronisasi struk printer, dan grafik penjualan.",
          description: "Konsol kasir mengelola daftar tagihan, pencocokan barcode otomatis, dan menghasilkan catatan analitik penjualan secara dinamis."
        }
      };

      const tr = translations[code.id];
      if (tr) {
        return {
          ...code,
          name: tr.name || code.name,
          tagline: tr.tagline || code.tagline,
          description: tr.description || code.description
        };
      }
    } else {
      // In English mode, convert price from Rp to USD
      const usdPrices: Record<string, string> = {
        "sc-1": "$7.00",
        "sc-2": "$5.50",
        "sc-3": "$4.00",
        "sc-4": "$7.00"
      };
      return {
        ...code,
        price: usdPrices[code.id] || "$7.00"
      };
    }

    return code;
  };

  const tBlog = (post: any) => {
    if (!post) return post;
    if (language === "en") return post; // Default is English

    const translations: Record<string, { title?: string; excerpt?: string; content?: string; category?: string }> = {
      "post-1": {
        title: "Cara Membangun Aplikasi Manajemen RT/RW",
        excerpt: "Pelajari cara membangun portal manajemen lingkungan lengkap menggunakan Next.js dan Supabase.",
        content: "Membangun platform manajemen untuk komunitas lokal membutuhkan perencanaan autentikasi yang cermat, sistem peran (admin, warga), dan penyiaran pesan. Dalam tutorial ini, kami akan memandu Anda menyiapkan sistem manajemen lingkungan langkah demi langkah...",
        category: "Tutorial"
      },
      "post-2": {
        title: "Panduan Autentikasi Next.js",
        excerpt: "Tutorial langkah demi langkah menerapkan OAuth aman dan tautan ajaib menggunakan Supabase Auth.",
        content: "Sesi pengguna yang aman adalah dasar dari setiap proyek SaaS modern. Dalam panduan ini, kami memandu penyiapan Next.js dengan Supabase Auth, menggunakan cookie untuk menyinkronkan sesi...",
        category: "Tutorial"
      },
      "post-3": {
        title: "Dasar-Dasar Pengembangan Chrome Extension",
        excerpt: "Pelajari cara membuat ekstensi popup browser pertama Anda menggunakan panduan Manifest V3.",
        content: "Pernah ingin membuat sidebar sendiri? Memulai pengembangan ekstensi Chrome sangat mudah jika Anda memahami peran batas manifest.json, background service worker, content script, dan API panel samping...",
        category: "Tutorial"
      },
      "post-4": {
        title: "Studi Kasus: Bagaimana uBlock Origin Mengoptimalkan Overhead Memori",
        excerpt: "Ulasan arsitektural tentang bagaimana uBlock Origin menjaga penggunaan memori tetap rendah saat memblokir jutaan script pelacak.",
        content: "Memblokir iklan itu sederhana, tetapi melakukannya tanpa membuat browser Anda tidak dapat digunakan adalah tantangan teknis yang signifikan. uBlock Origin menggunakan struktur yang sangat dioptimalkan...",
        category: "Studi Kasus"
      },
      "post-5": {
        title: "Ulasan Detail: LanguageTool vs Grammarly di Tahun 2026",
        excerpt: "Kami membandingkan dua raksasa asisten penulisan: LanguageTool yang open-source vs Grammarly kelas enterprise.",
        content: "Baik Anda sedang mengedit makalah akademis atau menyusun proposal klien, memiliki mata kedua otomatis sangatlah diperlukan. Sementara Grammarly mempelopori penulisan AI generatif, LanguageTool fokus pada privasi...",
        category: "Ulasan"
      },
      "post-6": {
        title: "Panduan Migrasi Manifest V3: Web Request ke Declarative Net Request",
        excerpt: "Panduan pengembang tentang aturan migrasi, aturan deklaratif, dan perubahan izin untuk Ekstensi Chrome.",
        content: "Transisi Google Chrome dari Manifest V2 ke V3 memperkenalkan perubahan besar, terutama untuk ekstensi privasi yang memblokir permintaan jaringan...",
        category: "Panduan Pengembangan"
      }
    };

    const tr = translations[post.id];
    if (tr) {
      return {
        ...post,
        title: tr.title || post.title,
        excerpt: tr.excerpt || post.excerpt,
        content: tr.content || post.content,
        category: tr.category || post.category
      };
    }
    return post;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dict, tExtension, tSourceCode, tBlog }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

