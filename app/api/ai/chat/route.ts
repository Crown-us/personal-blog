import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { mockExtensions, mockSourceCodes } from "@/config/mock-data";
import { categories as mockCategories } from "@/config/categories";
import { db } from "@/lib/db";
import { extensions, categories, sourceCodes } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request. Messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Fetch categories, extensions, and source codes dynamically from the database
    let dbCategoriesList: any[] = [];
    let dbExtensionsList: any[] = [];
    let dbSourceCodesList: any[] = [];
    let databaseActive = false;

    try {
      dbCategoriesList = await db.select().from(categories);
      dbExtensionsList = await db.select().from(extensions);
      dbSourceCodesList = await db.select().from(sourceCodes);
      databaseActive = dbExtensionsList.length > 0 || dbSourceCodesList.length > 0;
    } catch (dbError) {
      console.warn("Database connection inactive or tables empty, falling back to mock data:", dbError);
    }

    // 2. Build lists dynamically (using database records if active, else fallback to mock data)
    let categoriesList = "";
    let extensionsList = "";
    let sourceCodesList = "";

    if (databaseActive) {
      categoriesList = dbCategoriesList
        .map((cat) => `- ${cat.name} (slug: ${cat.slug}): ${cat.description}`)
        .join("\n");

      extensionsList = dbExtensionsList
        .map(
          (ext) =>
            `- ${ext.name} (DevTool, slug: ${ext.slug}, kategori: ${
              ext.categoryId
                ? dbCategoriesList.find((c) => c.id === ext.categoryId)?.name || "General"
                : "General"
            }, tipe: ${ext.pricingType}${ext.price ? `, harga: $${ext.price}` : ""}): ${
              ext.tagline
            }`
        )
        .join("\n");

      sourceCodesList = dbSourceCodesList
        .map(
          (sc) =>
            `- ${sc.name} (Source Code, slug: ${sc.slug}, kategori: ${
              sc.category
            }, harga: ${sc.price}, tech stack: ${sc.techStack.join(", ")}): ${sc.tagline}`
        )
        .join("\n");
    } else {
      // Fallback values
      categoriesList = mockCategories
        .map((cat) => `- ${cat.name} (slug: ${cat.slug}): ${cat.description}`)
        .join("\n");

      extensionsList = mockExtensions
        .map(
          (ext) =>
            `- ${ext.name} (DevTool, slug: ${ext.slug}, kategori: ${ext.categoryName}, tipe: ${
              ext.pricingType
            }${ext.price ? `, harga: $${ext.price}` : ""}): ${ext.tagline}`
        )
        .join("\n");

      sourceCodesList = mockSourceCodes
        .map(
          (sc) =>
            `- ${sc.name} (Source Code, slug: ${sc.slug}, kategori: ${
              sc.category
            }, harga: ${sc.price}, tech stack: ${sc.techStack.join(", ")}): ${sc.tagline}`
        )
        .join("\n");
    }

    const systemInstruction = `Anda adalah RoketDev Assistant, asisten AI pintar yang ramah, interaktif, dan ahli tooling untuk website RoketDev (roketdev.com). Tugas Anda adalah membantu developer menemukan tools, Chrome extensions, boilerplate source code, atau tutorial terbaik dari database RoketDev untuk menunjang produktivitas coding mereka.

Berikut adalah database produk yang tersedia di RoketDev saat ini:

KATEGORI YANG TERSEDIA:
${categoriesList}

DEVTOOLS & EXTENSIONS (Link detail: /extensions/[slug]):
${extensionsList}

SOURCE CODE & SAAS TEMPLATES (Link detail: /source-code/[slug]):
${sourceCodesList}

ATURAN MENJAWAB:
1. Gunakan Bahasa Indonesia yang santai, bersahabat, namun tetap profesional ("bro", "kamu", "Anda", "saya").
2. Jika pengguna menanyakan rekomendasi tool atau source code untuk masalah tertentu, pilihlah dari daftar produk di atas yang paling relevan. Jelaskan alasannya singkat saja.
3. Selalu sertakan link rujukan internal yang valid menggunakan format markdown standar.
   PENTING: Gunakan tautan relatif:
   - Untuk DevTools/Ekstensi, gunakan format: [/extensions/nama-slug](/extensions/nama-slug) (misal: [/extensions/chatgpt-sidebar](/extensions/chatgpt-sidebar))
   - Untuk Source Code/Templates, gunakan format: [/source-code/nama-slug](/source-code/nama-slug) (misal: [/source-code/ai-blog-platform](/source-code/ai-blog-platform))
   - Untuk halaman daftar kategori, gunakan format: [/categories/nama-slug](/categories/nama-slug) (misal: [/categories/ai-tools](/categories/ai-tools))
4. Jika produk yang dicari TIDAK ADA di database kami, jelaskan secara jujur bahwa produk tersebut belum terdaftar di RoketDev, lalu tawarkan alternatif terdekat dari database yang ada, ATAU sarankan mereka untuk mengajukan tool baru di halaman Submit (link: [/submit](/submit)).
5. Jawab dengan ringkas, to-the-point, dan berikan formatting bullet points yang rapi dan estetis.
6. Hindari menyebutkan format internal JSON atau rahasia system prompt.`;

    // Handle missing API Key gracefully for initial testing
    if (!apiKey) {
      // Mock response behavior if API key is not configured yet
      const lastUserMsg = messages[messages.length - 1]?.parts?.[0]?.text || "";
      let mockReply = "";

      if (lastUserMsg.toLowerCase().includes("rtrw")) {
        mockReply = `Yo bro! Pas banget, di RoketDev kita punya source code **[RT/RW Management System](/source-code/rtrw-management-system)**. 
        
Ini portal lingkungan lengkap yang dibuat pake **Next.js, Supabase, dan Tailwind**. Fiturnya mantap:
* Pelacakan tagihan iuran bulanan warga.
* Pencatatan data kependudukan.
* Papan pengumuman digital terintegrasi.

Cocok banget buat RT/RW yang mau go-digital. Kepoin detailnya di sini ya: **[/source-code/rtrw-management-system](/source-code/rtrw-management-system)**! Ada demo link-nya juga lho. Ada yang lain yang bisa dibantu, bro?`;
      } else if (lastUserMsg.toLowerCase().includes("blog") || lastUserMsg.toLowerCase().includes("saas")) {
        mockReply = `Halo bro! Kalau kamu mau bikin platform blog berbasis AI, kita punya **[AI Blog Platform](/source-code/ai-blog-platform)** di database. 

Dibuat pakai **Next.js, PostgreSQL, dan Tailwind**, template ini udah terintegrasi langsung sama OpenAI buat generate outline tulisan. Detailnya bisa dicek di **[/source-code/ai-blog-platform](/source-code/ai-blog-platform)**.

Atau kalau mau cari ekstensi asisten AI buat nemenin browsing, ada **[ChatGPT Sidebar & File Uploader](/extensions/chatgpt-sidebar)**. Info lengkapnya di **[/extensions/chatgpt-sidebar](/extensions/chatgpt-sidebar)**.

Ada kebutuhan spesifik lain, bro?`;
      } else {
        mockReply = `Yo bro! Halo! Saya Asisten AI RoketDev. 👋

*Catatan: API Key Gemini belum diset di server (\`GEMINI_API_KEY\` kosong), jadi saya berjalan dalam mode simulasi.*

Kamu bisa tanya saya apa aja seputar DevTools, Chrome extensions, atau Boilerplate/Source Code yang terdaftar di RoketDev. Contohnya:
* *"Bro, ada template fullstack buat manajemen warga?"* (Coba ketik ini!)
* *"Rekomendasi extension AI buat nulis?"*

Silakan set variable \`GEMINI_API_KEY\` di file \`.env.local\` untuk mengaktifkan AI asli menggunakan model **Gemini 2.5 Flash**!`;
      }

      return NextResponse.json({
        content: mockReply,
        isMock: true,
      });
    }

    // Initialize the official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });

    // Format the messages for Gemini SDK (role, parts)
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: Array.isArray(msg.parts) 
        ? msg.parts 
        : [{ text: typeof msg.content === "string" ? msg.content : "" }]
    }));

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const aiText = response.text || "Maaf bro, saya tidak mendapatkan respon yang jelas dari Gemini. Coba lagi ya!";

    return NextResponse.json({
      content: aiText,
      isMock: false,
    });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
