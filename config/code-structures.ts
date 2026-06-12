export interface CodeFile {
  name: string;
  path: string;
  type: "file";
  language: string;
  code: string;
  explanation: string;
}

export interface CodeFolder {
  name: string;
  path: string;
  type: "folder";
  children: (CodeFile | CodeFolder)[];
}

export type CodeNode = CodeFile | CodeFolder;

export interface ProjectCodeStructure {
  productId: string;
  root: CodeFolder;
}

export const projectCodeStructures: Record<string, ProjectCodeStructure> = {
  "rtrw-management-system": {
    productId: "sc-1",
    root: {
      name: "rtrw-management-system",
      path: "",
      type: "folder",
      children: [
        {
          name: "lib",
          path: "lib",
          type: "folder",
          children: [
            {
              name: "supabase.ts",
              path: "lib/supabase.ts",
              type: "file",
              language: "typescript",
              code: `import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for Client-side and Server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get service role client for secure server-side overrides
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Missing service role key');
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};`,
              explanation: "File ini menginisialisasi client Supabase untuk operasi umum (anon key) dan menyediakan admin client dengan bypass RLS (Row Level Security) menggunakan `SUPABASE_SERVICE_ROLE_KEY` untuk operasi server-side yang aman seperti verifikasi iuran pembayaran warga."
            },
            {
              name: "schema.ts",
              path: "lib/schema.ts",
              type: "file",
              language: "typescript",
              code: `import { pgTable, uuid, varchar, integer, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

export const citizens = pgTable('citizens', {
  id: uuid('id').primaryKey().defaultRandom(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  houseNumber: varchar('house_number', { length: 20 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  isResident: boolean('is_resident').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const billings = pgTable('billings', {
  id: uuid('id').primaryKey().defaultRandom(),
  citizenId: uuid('citizen_id').references(() => citizens.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  periodMonth: integer('period_month').notNull(), // 1 - 12
  periodYear: integer('period_year').notNull(),
  isPaid: boolean('is_paid').default(false),
  paymentDate: timestamp('payment_date'),
  receiptUrl: varchar('receipt_url', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow()
});`,
              explanation: "Definisi skema database menggunakan Drizzle ORM. Skema ini mendefinisikan tabel `citizens` untuk data kependudukan warga dan tabel `billings` untuk mencatat iuran bulanan warga, lengkap dengan status pembayaran dan tanggal pelunasan."
            }
          ]
        },
        {
          name: "app",
          path: "app",
          type: "folder",
          children: [
            {
              name: "api",
              path: "app/api",
              type: "folder",
              children: [
                {
                  name: "billing",
                  path: "app/api/billing",
                  type: "folder",
                  children: [
                    {
                      name: "route.ts",
                      path: "app/api/billing/route.ts",
                      type: "file",
                      language: "typescript",
                      code: `import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { billings } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

// PUT: Update billing status (Verify payment)
export async function PUT(request: Request) {
  try {
    const { billingId, isPaid } = await request.json();
    
    if (!billingId) {
      return NextResponse.json({ error: 'Billing ID is required' }, { status: 400 });
    }

    const updated = await db.update(billings)
      .set({ 
        isPaid, 
        paymentDate: isPaid ? new Date() : null 
      })
      .where(eq(billings.id, billingId))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,
                      explanation: "API Route Next.js App Router (`/api/billing`) untuk memverifikasi iuran pembayaran warga. Ketika admin mengeklik tombol 'Lunas' di dashboard, endpoint ini akan memperbarui status tagihan di database PostgreSQL."
                    }
                  ]
                }
              ]
            },
            {
              name: "billing",
              path: "app/billing",
              type: "folder",
              children: [
                {
                  name: "page.tsx",
                  path: "app/billing/page.tsx",
                  type: "file",
                  language: "typescript",
                  code: `"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';

export default function BillingPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Billing Tracking RT/RW</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari warga/no rumah..." 
            className="pl-9 pr-4 py-2 border rounded-xl text-sm w-64 bg-card focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="pb-3">Nama Warga</th>
              <th className="pb-3">No. Rumah</th>
              <th className="pb-3">Iuran Bulanan</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-muted/40">
              <td className="py-3 font-semibold">Budi Santoso</td>
              <td className="py-3">Blok A-12</td>
              <td className="py-3 font-semibold">Rp100.000</td>
              <td className="py-3">
                <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full w-max">
                  <CheckCircle className="h-3.5 w-3.5" /> Lunas
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}`,
                  explanation: "Halaman antarmuka utama dashboard iuran warga. Komponen client-side ini menampilkan tabel data iuran per warga, fitur pencarian terpadu, dan badge status pembayaran berwarna dinamis."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "ai-blog-platform": {
    productId: "sc-2",
    root: {
      name: "ai-blog-platform",
      path: "",
      type: "folder",
      children: [
        {
          name: "lib",
          path: "lib",
          type: "folder",
          children: [
            {
              name: "gemini.ts",
              path: "lib/gemini.ts",
              type: "file",
              language: "typescript",
              code: `import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

export const ai = new GoogleGenAI({ apiKey });

export async function generateBlogOutline(topic: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: \`Buat outline blog detail terstruktur tentang: "\${topic}". Format dengan JSON JSON array strings untuk subjudul.\`,
    config: {
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text || '[]');
}`,
              explanation: "Wrapper SDK resmi Google GenAI (`@google/genai`). File ini mengekspor instansi `ai` serta utilitas `generateBlogOutline` yang memanggil model `gemini-2.5-flash` dengan konfigurasi output JSON agar terstruktur rapi untuk editor draft."
            }
          ]
        },
        {
          name: "app",
          path: "app",
          type: "folder",
          children: [
            {
              name: "api",
              path: "app/api",
              type: "folder",
              children: [
                {
                  name: "generate",
                  path: "app/api/generate",
                  type: "folder",
                  children: [
                    {
                      name: "route.ts",
                      path: "app/api/generate/route.ts",
                      type: "file",
                      language: "typescript",
                      code: `import { NextResponse } from 'next/server';
import { generateBlogOutline } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const outline = await generateBlogOutline(topic);
    return NextResponse.json({ success: true, outline });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,
                      explanation: "API Route POST (`/api/generate`) yang menghubungkan UI Editor dengan SDK Gemini. Endpoint ini menerima topik tulisan, memicu AI, dan mengembalikan outline terstruktur dalam format JSON."
                    }
                  ]
                }
              ]
            },
            {
              name: "editor",
              path: "app/editor",
              type: "folder",
              children: [
                {
                  name: "page.tsx",
                  path: "app/editor/page.tsx",
                  type: "file",
                  language: "typescript",
                  code: `"use client";

import React, { useState } from 'react';
import { Sparkles, Save, BookOpen } from 'lucide-react';

export default function EditorPage() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAISuggest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.success) {
        const generated = data.outline.map((h: string) => \`## \${h}\\n\\nTulis artikel di sini...\\n\`).join('\\n');
        setContent(generated);
      }
    } catch (err) {
      alert('AI Gagal merespon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Topik artikel blog..." 
          className="flex-1 bg-card border rounded-xl px-4 py-2 text-sm focus:outline-none"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button 
          onClick={handleAISuggest}
          disabled={loading || !topic}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs disabled:opacity-50 hover:bg-primary/95"
        >
          <Sparkles className="h-4 w-4" /> {loading ? 'Drafting...' : 'Generate Outline'}
        </button>
      </div>
      <textarea 
        className="w-full h-96 p-4 bg-card border rounded-xl font-mono text-sm focus:outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Editor markdown..."
      />
    </div>
  );
}`,
                  explanation: "Dashboard editor markdown terintegrasi AI. Mengizinkan pengguna memasukkan topik tulisan, mengeklik 'Generate Outline' untuk memanggil model Gemini secara asinkronus, lalu menampilkan draf outline terstruktur langsung di dalam editor teks."
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "portfolio-pro-template": {
    productId: "sc-3",
    root: {
      name: "portfolio-pro-template",
      path: "",
      type: "folder",
      children: [
        {
          name: "src",
          path: "src",
          type: "folder",
          children: [
            {
              name: "components",
              path: "src/components",
              type: "folder",
              children: [
                {
                  name: "Hero.tsx",
                  path: "src/components/Hero.tsx",
                  type: "file",
                  language: "typescript",
                  code: `import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-20 w-20 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500"
      />
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl sm:text-6xl font-extrabold tracking-tight"
      >
        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Alex</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed"
      >
        A full-stack software engineer focused on building clean, animations-driven interfaces that feel responsive and alive.
      </motion.p>
    </section>
  );
}`,
                  explanation: "Komponen header pendaratan (Hero) portofolio menggunakan kombinasi TailwindCSS untuk penataan tata letak serta Framer Motion untuk animasi transisi *fade-in* dan *scaling* yang dinamis saat halaman pertama kali dibuka."
                },
                {
                  name: "Projects.tsx",
                  path: "src/components/Projects.tsx",
                  type: "file",
                  language: "typescript",
                  code: `import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const mockProjects = [
  { name: 'SaaS App', desc: 'Subscription model dashboard.', tech: ['React', 'Next.js'] },
  { name: 'Analytics Platform', desc: 'Realtime telemetry server.', tech: ['Node', 'Redis'] }
];

export default function Projects() {
  return (
    <section className="py-12 max-w-5xl mx-auto px-4 space-y-6">
      <h2 className="text-xl font-bold border-b pb-2">Featured Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mockProjects.map((proj) => (
          <div key={proj.name} className="p-5 border rounded-2xl bg-card hover:border-indigo-500/50 transition-colors group">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base group-hover:text-indigo-400 transition-colors">{proj.name}</h3>
              <div className="flex gap-2 text-muted-foreground">
                <Github className="h-4.5 w-4.5 hover:text-foreground cursor-pointer" />
                <ExternalLink className="h-4.5 w-4.5 hover:text-foreground cursor-pointer" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{proj.desc}</p>
            <div className="flex gap-2 mt-4 flex-wrap">
              {proj.tech.map((t) => (
                <span key={t} className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-secondary border rounded text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}`,
                  explanation: "Tampilan grid portofolio proyek terkurasi. Desain memiliki efek transisi perubahan warna border dinamis saat di-hover dan terintegrasi dengan ikon-ikon representasi repositori eksternal."
                }
              ]
            },
            {
              name: "App.tsx",
              path: "src/App.tsx",
              type: "file",
              language: "typescript",
              code: `import React from 'react';
import Hero from './components/Hero';
import Projects from './components/Projects';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white">
      <main className="space-y-10">
        <Hero />
        <Projects />
      </main>
    </div>
  );
}`,
              explanation: "Root komponen React untuk template portofolio, mendefinisikan warna latar belakang dasar, warna font, dan tumpukan tata letak utama komponen-komponen visual."
            }
          ]
        }
      ]
    }
  },
  "pos-management-system": {
    productId: "sc-4",
    root: {
      name: "pos-management-system",
      path: "",
      type: "folder",
      children: [
        {
          name: "app",
          path: "app",
          type: "folder",
          children: [
            {
              name: "Http",
              path: "app/Http",
              type: "folder",
              children: [
                {
                  name: "Controllers",
                  path: "app/Http/Controllers",
                  type: "folder",
                  children: [
                    {
                      name: "CartController.php",
                      path: "app/Http/Controllers/CartController.php",
                      type: "file",
                      language: "php",
                      code: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use App\\Models\\Product;

class CartController extends Controller
{
    // Add item to cart session
    public function addToCart(Request $request)
    {
        $productId = $request->input('product_id');
        $quantity = $request->input('quantity', 1);

        $product = Product::findOrFail($productId);
        
        if ($product->stock < $quantity) {
            return response()->json(['error' => 'Stok produk tidak mencukupi'], 400);
        }

        $cart = session()->get('cart', []);
        
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'thumbnail' => $product->thumbnail
            ];
        }

        session()->put('cart', $cart);
        
        return response()->json([
            'success' => 'Produk berhasil ditambahkan ke kasir',
            'cart' => $cart
        ]);
    }
}`,
                      explanation: "Controller Laravel PHP (`CartController`) untuk manajemen keranjang belanja kasir. Metode ini menyelaraskan kuantitas barang, membaca dari database MySQL, memeriksa stok fisik barang di gudang, dan menyimpan state keranjang sementara menggunakan mekanisme session Laravel."
                    }
                  ]
                }
              ]
            },
            {
              name: "Models",
              path: "app/Models",
              type: "folder",
              children: [
                {
                  name: "Product.php",
                  path: "app/Models/Product.php",
                  type: "file",
                  language: "php",
                  code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sku',
        'price',
        'stock',
        'thumbnail'
    ];

    // Scope for low stock alert
    public function scopeLowStock($query, $limit = 5)
    {
        return $query->where('stock', '<=', $limit);
    }
}`,
                      explanation: "Model data Eloquent Laravel (`Product`) yang mendefinisikan atribut database produk kasir. Dilengkapi dengan fungsi query scope `scopeLowStock` untuk menarik laporan stok kritis secara instan."
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };
