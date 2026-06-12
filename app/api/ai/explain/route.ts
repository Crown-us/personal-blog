import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  try {
    const { filePath, code, language, question } = await request.json();

    if (!filePath || !code) {
      return NextResponse.json(
        { error: "filePath and code are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if API key is not configured
    if (!apiKey) {
      const isQuestion = !!question && question.trim().length > 0;
      let mockReply = "";

      if (isQuestion) {
        mockReply = `**[Mode Simulasi AI]**\n\nAnda bertanya tentang file \`${filePath}\`: *"${question}"*\n\nDi dunia nyata, Gemini akan menganalisis kode berikut:\n\`\`\`${language}\n${code.substring(0, 150)}...\n\`\`\`\n\nBerdasarkan kode di atas, file ini berorientasi pada stack **${language}**. Kode ini menangani fungsionalitas utama modul terkait. Silakan tambahkan \`GEMINI_API_KEY\` pada file \`.env.local\` untuk mendapatkan analisis mendalam langsung dari model **Gemini 2.5 Flash**!`;
      } else {
        mockReply = `### 🔍 Analisis Kode (\`${filePath}\`)\n\n* **Bahasa Pemrograman**: \`${language}\`\n* **Fungsi Utama**: Kode ini mengimplementasikan logika kontroler, model skema, atau konfigurasi helper.\n\n#### 🛠️ Analisis Struktur:\n1. **Inisialisasi & Impor**: Menghubungkan library eksternal yang dibutuhkan.\n2. **Logika Bisnis**: Melakukan sanitasi data, validasi, dan interaksi dengan layer database/session.\n3. **Kembalian Data**: Mengembalikan respon JSON atau visual state yang bersih.\n\n*Silakan set \`GEMINI_API_KEY\` untuk mengaktifkan analisis line-by-line real-time dari Gemini.*`;
      }

      return NextResponse.json({
        explanation: mockReply,
        isMock: true,
      });
    }

    // Initialize the official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });

    let prompt = "";
    if (question && question.trim().length > 0) {
      prompt = `Pengguna ingin tahu tentang file "${filePath}" (ditulis dalam "${language}").
Berikut adalah kodenya:
\`\`\`${language}
${code}
\`\`\`

Pertanyaan pengguna: "${question}"

Berikan jawaban yang jelas, to-the-point, santai (gunakan sapaan "bro"), ramah, dan mendalam dalam Bahasa Indonesia.`;
    } else {
      prompt = `Sebagai pakar rekayasa perangkat lunak, analisislah kode dari file "${filePath}" berikut (ditulis dalam "${language}"):
\`\`\`${language}
${code}
\`\`\`

Berikan penjelasan yang komprehensif, terstruktur, santai (gunakan sapaan "bro"), ramah, dan informatif dalam Bahasa Indonesia.
Sertakan bagian:
1. **Fungsi Utama**: Apa peran file ini dalam arsitektur aplikasi?
2. **Bedah Kode**: Analisis bagian kode yang penting secara teknis baris demi baris atau fungsi demi fungsi.
3. **Tips & Rekomendasi**: Berikan saran optimalisasi (misal penanganan error, performa, keamanan).`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    const explanationText = response.text || "Gagal menghasilkan analisis dari model AI. Coba lagi, bro.";

    return NextResponse.json({
      explanation: explanationText,
      isMock: false,
    });
  } catch (error: any) {
    console.error("AI Explain API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
