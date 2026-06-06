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
        categoryName: "Alat AI"
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

