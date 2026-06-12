"use client";

import React, { useState, useEffect } from "react";
import { 
  BarChart3, 
  Download, 
  MousePointerClick, 
  Star, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  LogOut, 
  Trash2, 
  BookOpen, 
  Calendar, 
  ShieldAlert, 
  Eye, 
  Settings, 
  AlertTriangle, 
  Sparkles,
  Link2,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Globe,
  ArrowLeft,
  Users,
  Search as SearchIcon,
  Terminal,
  Code2,
  Tag,
  Image as ImageIcon,
  Copy,
  Check
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useLanguage } from "@/components/LanguageProvider";
import PageWrapper from "@/components/shared/PageWrapper";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { categories } from "@/config/categories";

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const supabase = createSupabaseBrowserClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [dbExtensions, setDbExtensions] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [affiliateEvents, setAffiliateEvents] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [sourceCodesList, setSourceCodesList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [searchScQuery, setSearchScQuery] = useState("");
  const [scModalOpen, setScModalOpen] = useState(false);
  const [editingSc, setEditingSc] = useState<any | null>(null);
  const [scForm, setScForm] = useState({
    name: "",
    tagline: "",
    description: "",
    techStack: "",
    price: "",
    priceRaw: "",
    thumbnail: "",
    demoLink: "",
    category: "",
    screenshots: ""
  });
  const [extModalOpen, setExtModalOpen] = useState(false);
  const [editingExt, setEditingExt] = useState<any | null>(null);
  const [extForm, setExtForm] = useState({
    name: "",
    tagline: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    affiliateUrl: "",
    chromeStoreUrl: "",
    pricingType: "free",
    price: "",
    status: "pending"
  });

  // Deals & Images States
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any | null>(null);
  const [dealForm, setDealForm] = useState({
    name: "",
    tagline: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    affiliateUrl: "",
    chromeStoreUrl: "",
    pricingType: "paid",
    price: "",
    status: "approved",
    categorySlug: "shopping"
  });
  const [imagesList, setImagesList] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedImagePath, setCopiedImagePath] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/api/dashboard").then((res) => res.json()),
      fetch("/api/admin/users").then((res) => res.json()).catch(() => ({ success: false, users: [] })),
      fetch("/api/source-code").then((res) => res.json()).catch(() => ({ success: false, sourceCodes: [] })),
      fetch("/api/admin/reviews").then((res) => res.json()).catch(() => ({ success: false, reviews: [] })),
      fetch("/api/admin/deals-images").then((res) => res.json()).catch(() => ({ success: false, images: [] }))
    ])
      .then(([dashData, usersData, scData, reviewsData, imagesData]) => {
        if (dashData.success) {
          setUserRole(dashData.role);
          setDbExtensions(dashData.extensions);
          setTutorials(dashData.blogPosts);
          setProfile(dashData.user);
          setAffiliateEvents(dashData.affiliateEvents || []);
        }
        if (usersData.success) {
          setUsersList(usersData.users);
        }
        if (scData.success) {
          setSourceCodesList(scData.sourceCodes);
        }
        if (reviewsData.success) {
          setReviewsList(reviewsData.reviews);
        }
        if (imagesData.success) {
          setImagesList(imagesData.images);
        }
      })
      .catch((err) => console.error("Failed to load admin dashboard data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleOpenAddDeal = () => {
    setEditingDeal(null);
    setDealForm({
      name: "",
      tagline: "",
      description: "",
      logoUrl: "",
      websiteUrl: "",
      affiliateUrl: "",
      chromeStoreUrl: "",
      pricingType: "paid",
      price: "",
      status: "approved",
      categorySlug: "shopping"
    });
    setDealModalOpen(true);
  };

  const handleOpenEditDeal = (deal: any) => {
    setEditingDeal(deal);
    setDealForm({
      name: deal.name || "",
      tagline: deal.tagline || "",
      description: deal.description || "",
      logoUrl: deal.logoUrl || "",
      websiteUrl: deal.websiteUrl || "",
      affiliateUrl: deal.affiliateUrl || "",
      chromeStoreUrl: deal.chromeStoreUrl || "",
      pricingType: deal.pricingType || "paid",
      price: deal.price || "",
      status: deal.status || "approved",
      categorySlug: deal.categorySlug || "shopping"
    });
    setDealModalOpen(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading("save-deal");
    try {
      if (editingDeal) {
        // Update
        const res = await fetch(`/api/extensions/${editingDeal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: dealForm.name,
            tagline: dealForm.tagline,
            description: dealForm.description,
            logoUrl: dealForm.logoUrl,
            websiteUrl: dealForm.websiteUrl,
            affiliateUrl: dealForm.affiliateUrl,
            chromeStoreUrl: dealForm.chromeStoreUrl || dealForm.websiteUrl,
            pricingType: dealForm.pricingType,
            price: dealForm.price || null,
            status: dealForm.status,
            categorySlug: dealForm.categorySlug,
          })
        });
        const data = await res.json();
        if (data.success) {
          setDbExtensions(dbExtensions.map((item) => item.id === editingDeal.id ? data.extension : item));
          setDealModalOpen(false);
        } else {
          alert(data.error || "Failed to update deal.");
        }
      } else {
        // Create
        const res = await fetch(`/api/admin/extensions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: dealForm.name,
            tagline: dealForm.tagline,
            description: dealForm.description,
            logoUrl: dealForm.logoUrl,
            websiteUrl: dealForm.websiteUrl,
            affiliateUrl: dealForm.affiliateUrl,
            chromeStoreUrl: dealForm.chromeStoreUrl || dealForm.websiteUrl,
            pricingType: dealForm.pricingType,
            price: dealForm.price || null,
            status: dealForm.status,
            categorySlug: dealForm.categorySlug,
          })
        });
        const data = await res.json();
        if (data.success) {
          setDbExtensions([data.extension, ...dbExtensions]);
          setDealModalOpen(false);
        } else {
          alert(data.error || "Failed to create deal.");
        }
      }
    } catch (err) {
      console.error("Error saving deal:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/deals-images", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImagesList([data.image, ...imagesList]);
        if (dealModalOpen) {
          setDealForm(prev => ({ ...prev, logoUrl: data.image.url }));
        }
      } else {
        alert(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredUsers = React.useMemo(() => {
    if (!searchUserQuery.trim()) return usersList;
    const q = searchUserQuery.toLowerCase();
    return usersList.filter(
      (u) => 
        u.fullName?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q)
    );
  }, [usersList, searchUserQuery]);

  const clicksByDay = React.useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric" });
      days[dateString] = 0;
    }
    
    affiliateEvents.forEach((ev: any) => {
      const dateString = new Date(ev.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric" });
      if (days[dateString] !== undefined) {
        days[dateString] += 1;
      }
    });
    
    return Object.entries(days).map(([date, count]) => ({ date, count, amount: count * 1500 }));
  }, [affiliateEvents, language]);

  const clicksByDay30 = React.useMemo(() => {
    const dayList: { date: string; dayNum: number; clicks: number }[] = [];
    const dateToIdxMap: Record<string, number> = {};

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric" });
      const dayNum = d.getDate();

      dayList.push({
        date: dateString,
        dayNum: dayNum,
        clicks: 0,
      });
      dateToIdxMap[dateString] = 29 - i;
    }
    
    affiliateEvents.forEach((ev: any) => {
      const dateString = new Date(ev.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { month: "short", day: "numeric" });
      if (dateToIdxMap[dateString] !== undefined) {
        dayList[dateToIdxMap[dateString]].clicks += 1;
      }
    });
    
    return dayList.map((item) => {
      const pageViews = item.clicks * 2 + Math.abs(Math.sin(item.dayNum) * 12) + 5;
      return { 
        date: item.date, 
        clicks: item.clicks,
        views: Math.round(pageViews)
      };
    });
  }, [affiliateEvents, language]);

  const getFlagEmoji = (countryCode: string) => {
    const code = countryCode ? countryCode.toUpperCase() : "ID";
    if (code === "ID") return "🇮🇩";
    if (code === "US") return "🇺🇸";
    if (code === "SG") return "🇸🇬";
    if (code === "MY") return "🇲🇾";
    if (code === "JP") return "🇯🇵";
    if (code === "GB") return "🇬🇧";
    return "🌐";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsActionLoading(id);
    try {
      const res = await fetch(`/api/extensions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDbExtensions(dbExtensions.map((ext) => ext.id === id ? { ...ext, status: newStatus } : ext));
      } else {
        alert(data.error || "Failed to update audit status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    setIsActionLoading(id + "-featured");
    const newStatus = isFeatured ? "featured" : "approved";
    try {
      const res = await fetch(`/api/extensions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDbExtensions(dbExtensions.map((ext) => ext.id === id ? { ...ext, status: newStatus } : ext));
      } else {
        alert(data.error || "Failed to update featured flag.");
      }
    } catch (err) {
      console.error("Error updating featured status:", err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus produk ini dari database?", en: "Are you sure you want to permanently delete this tool from the database?" }))) {
      setIsActionLoading(id + "-delete");
      try {
        const res = await fetch(`/api/extensions/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setDbExtensions(dbExtensions.filter((ext) => ext.id !== id));
        } else {
          alert(data.error || "Failed to delete listing.");
        }
      } catch (err) {
        console.error("Error deleting listing:", err);
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const handleDeleteTutorial = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus tutorial ini?", en: "Are you sure you want to delete this tutorial?" }))) {
      try {
        const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setTutorials(tutorials.filter((post) => post.id !== id));
        } else {
          alert(data.error || "Failed to delete tutorial.");
        }
      } catch (err) {
        console.error("Error deleting tutorial:", err);
      }
    }
  };

  const handleUpdateUserAccess = async (userId: string, role: string, plan: string) => {
    setIsActionLoading(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, plan }),
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(usersList.map((u) => u.id === userId ? data.user : u));
      } else {
        alert(data.error || "Failed to update user access.");
      }
    } catch (err) {
      console.error("Error updating user access:", err);
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus akun pengguna ini secara permanen?", en: "Are you sure you want to permanently delete this user account?" }))) {
      setIsActionLoading(userId + "-delete");
      try {
        const res = await fetch(`/api/admin/users?id=${userId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          setUsersList(usersList.filter((u) => u.id !== userId));
        } else {
          alert(data.error || "Failed to delete user account.");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const filteredSourceCodes = React.useMemo(() => {
    if (!searchScQuery.trim()) return sourceCodesList;
    const q = searchScQuery.toLowerCase();
    return sourceCodesList.filter(
      (sc) => 
        sc.name?.toLowerCase().includes(q) || 
        sc.category?.toLowerCase().includes(q) ||
        sc.tagline?.toLowerCase().includes(q)
    );
  }, [sourceCodesList, searchScQuery]);

  const handleOpenAddSc = () => {
    setEditingSc(null);
    setScForm({
      name: "",
      tagline: "",
      description: "",
      techStack: "",
      price: "",
      priceRaw: "",
      thumbnail: "",
      demoLink: "",
      category: "",
      screenshots: ""
    });
    setScModalOpen(true);
  };

  const handleOpenEditSc = (sc: any) => {
    setEditingSc(sc);
    setScForm({
      name: sc.name || "",
      tagline: sc.tagline || "",
      description: sc.description || "",
      techStack: Array.isArray(sc.techStack) ? sc.techStack.join(", ") : (sc.techStack || ""),
      price: sc.price || "",
      priceRaw: sc.priceRaw !== undefined ? sc.priceRaw.toString() : "",
      thumbnail: sc.thumbnail || "",
      demoLink: sc.demoLink || "",
      category: sc.category || "",
      screenshots: Array.isArray(sc.screenshots) ? sc.screenshots.join(", ") : (sc.screenshots || "")
    });
    setScModalOpen(true);
  };

  const handleSaveSc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading("save-sc");
    try {
      const isEdit = !!editingSc;
      const url = "/api/admin/source-code";
      const method = isEdit ? "PATCH" : "POST";
      
      const payload: any = {
        name: scForm.name,
        tagline: scForm.tagline,
        description: scForm.description,
        techStack: scForm.techStack,
        price: scForm.price,
        priceRaw: scForm.priceRaw,
        thumbnail: scForm.thumbnail,
        demoLink: scForm.demoLink,
        category: scForm.category,
        screenshots: scForm.screenshots
      };
      
      if (isEdit) {
        payload.id = editingSc.id;
      }
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        if (isEdit) {
          setSourceCodesList(sourceCodesList.map((item) => item.id === editingSc.id ? data.sourceCode : item));
        } else {
          setSourceCodesList([data.sourceCode, ...sourceCodesList]);
        }
        setScModalOpen(false);
      } else {
        alert(data.error || "Failed to save source code.");
      }
    } catch (err) {
      console.error("Error saving source code:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDeleteSc = async (id: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus source code ini secara permanen?", en: "Are you sure you want to permanently delete this source code?" }))) {
      setIsActionLoading(id + "-delete-sc");
      try {
        const res = await fetch(`/api/admin/source-code?id=${id}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          setSourceCodesList(sourceCodesList.filter((item) => item.id !== id));
        } else {
          alert(data.error || "Failed to delete source code.");
        }
      } catch (err) {
        console.error("Error deleting source code:", err);
        alert("An unexpected error occurred while deleting.");
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm(t({ id: "Apakah Anda yakin ingin menghapus ulasan ini secara permanen?", en: "Are you sure you want to permanently delete this review?" }))) {
      setIsActionLoading(reviewId + "-delete-review");
      try {
        const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          setReviewsList(reviewsList.filter((rev) => rev.id !== reviewId));
        } else {
          alert(data.error || "Failed to delete review.");
        }
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("An unexpected error occurred while deleting.");
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const handleOpenEditExt = (ext: any) => {
    setEditingExt(ext);
    setExtForm({
      name: ext.name || "",
      tagline: ext.tagline || "",
      description: ext.description || "",
      logoUrl: ext.logoUrl || "",
      websiteUrl: ext.websiteUrl || "",
      affiliateUrl: ext.affiliateUrl || "",
      chromeStoreUrl: ext.chromeStoreUrl || "",
      pricingType: ext.pricingType || "free",
      price: ext.price || "",
      status: ext.status || "pending"
    });
    setExtModalOpen(true);
  };

  const handleSaveExt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading("save-ext");
    try {
      const res = await fetch(`/api/extensions/${editingExt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: extForm.name,
          tagline: extForm.tagline,
          description: extForm.description,
          logoUrl: extForm.logoUrl,
          websiteUrl: extForm.websiteUrl,
          affiliateUrl: extForm.affiliateUrl,
          chromeStoreUrl: extForm.chromeStoreUrl,
          pricingType: extForm.pricingType,
          price: extForm.price,
          status: extForm.status
        })
      });
      const data = await res.json();
      if (data.success) {
        setDbExtensions(dbExtensions.map((item) => item.id === editingExt.id ? data.extension : item));
        setExtModalOpen(false);
      } else {
        alert(data.error || "Failed to save extension details.");
      }
    } catch (err) {
      console.error("Error saving extension:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setIsActionLoading(null);
    }
  };

  const systemAvgRating = React.useMemo(() => {
    const ratedExts = dbExtensions.filter(ext => ext.avgRating && parseFloat(ext.avgRating) > 0);
    if (ratedExts.length === 0) return "0.0";
    const sum = ratedExts.reduce((acc, ext) => acc + parseFloat(ext.avgRating), 0);
    return (sum / ratedExts.length).toFixed(1);
  }, [dbExtensions]);

  const dbDeals = React.useMemo(() => {
    return dbExtensions.filter((ext) => ext.affiliateUrl);
  }, [dbExtensions]);

  // Loader state
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-xs text-muted-foreground font-semibold">
              {t({ id: "Memverifikasi hak akses admin...", en: "Verifying admin access..." })}
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Security guard - Role check
  if (userRole !== "admin") {
    return (
      <PageWrapper>
        <main className="flex-1 flex items-center justify-center min-h-[70vh] px-4">
          <div className="max-w-md w-full border border-border bg-card/60 backdrop-blur-xl p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">
                {t({ id: "Akses Terbatas (Admin Only)", en: "Restricted Access (Admin Only)" })}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t({
                  id: "Maaf, halaman ini hanya diperuntukkan bagi Administrator sistem. Akun Anda tidak memiliki otoritas akses ke area ini.",
                  en: "Sorry, this page is restricted to system Administrators only. Your account does not have authorization here."
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/dashboard"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold shadow-md shadow-primary/20 transition-all text-center"
              >
                {t({ id: "Kembali ke Dasbor Saya", en: "Go to My Dashboard" })}
              </Link>
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl border border-border hover:bg-secondary text-xs text-foreground font-semibold transition-all text-center"
              >
                {t({ id: "Kembali ke Beranda", en: "Go back Home" })}
              </Link>
            </div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  // Metrics calculation
  const totalClicks = affiliateEvents.length;
  const totalInstalls = affiliateEvents.filter((ev: any) => ev.eventType === "click_install").length;

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background animate-fade-in">
        
        {/* Admin Navigation Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-card p-5 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0">
          <div className="space-y-6">
            
            {/* Header & Back Button */}
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-all py-1.5 px-3 rounded-xl border border-border bg-secondary/40 hover:bg-secondary/80 w-max"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t({ id: "Kembali ke Website", en: "Back to Website" })}
              </Link>
              
              <div className="px-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h2 className="text-[10px] font-black tracking-widest text-foreground uppercase">
                  {t({ id: "Panel Kontrol Admin", en: "Admin Control Panel" })}
                </h2>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: "overview", label: t({ id: "Statistik Ringkasan", en: "Overview Stats" }), icon: BarChart3 },
                { id: "extensions", label: t({ id: "Audit DevTools", en: "Audit DevTools" }), icon: Settings },
                { id: "reviews", label: t({ id: "Kontrol Ulasan", en: "Review Control" }), icon: Star },
                { id: "blog", label: t({ id: "Kelola Tutorial", en: "Manage Tutorials" }), icon: BookOpen },
                { id: "sourceCode", label: t({ id: "Kelola Source Code", en: "Manage Source Code" }), icon: Terminal },
                { id: "deals", label: t({ id: "Kelola Deals & Gambar", en: "Deals & Images" }), icon: Tag },
                { id: "affiliate", label: t({ id: "Afiliasi & Saldo", en: "Affiliate & Balance" }), icon: Wallet },
                { id: "users", label: t({ id: "Kelola Pengguna", en: "Manage Users" }), icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
            </nav>
          </div>

          {/* User profile & Signout at Sidebar Bottom */}
          <div className="pt-4 border-t border-border/60 mt-6 space-y-3">
            {profile && (
              <div className="flex items-center gap-2.5 px-1">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50"}
                  alt={profile.fullName}
                  className="h-8 w-8 rounded-full border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-foreground truncate">{profile.fullName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
                </div>
              </div>
            )}

            <Link
              href="/submit"
              className="w-full text-left text-xs font-semibold py-2 px-3 rounded-xl transition-all flex items-center gap-2 text-primary hover:bg-primary/5"
            >
              <PlusCircle className="h-4 w-4" />
              {t({ id: "Kirim DevTool Baru", en: "Submit New DevTool" })}
            </Link>

            <button
              onClick={handleSignOut}
              className="w-full text-left text-xs font-bold py-2 px-3 rounded-xl transition-all flex items-center gap-2 text-rose-500 hover:bg-rose-500/5"
            >
              <LogOut className="h-4 w-4" />
              {t({ id: "Keluar Sesi", en: "Sign Out" })}
            </button>
          </div>
        </aside>

        {/* Admin Panel Actions Main Container */}
        <main className="flex-1 lg:h-screen lg:overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-6">
            
            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t({ id: "Konsol Admin RoketDev", en: "RoketDev Admin Console" })}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t({
                      id: "Pantau kesehatan data sistem, audit pengajuan devtool, dan kelola panduan developer.",
                      en: "Monitor system metrics, audit devtool listings, and publish developer tutorials."
                    })}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Total Klik Pengalihan", en: "Total Redirect Clicks" })}</span>
                      <MousePointerClick className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalClicks)}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Estimasi Pemasangan", en: "Est. Installs" })}</span>
                      <Download className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{formatNumber(totalInstalls)}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-bold uppercase tracking-wider">{t({ id: "Rata-rata Rating", en: "Avg Rating" })}</span>
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{systemAvgRating}★</p>
                  </div>
                </div>

                {/* Growth chart mockup */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                  <h2 className="text-sm font-bold tracking-wider uppercase text-foreground">
                    {t({
                      id: "Grafik Aktivitas Sistem (30 Hari Terakhir)",
                      en: "System Activity Graph (Last 30 Days)"
                    })}
                  </h2>
                  <div className="h-64 w-full">
                    {!isMounted ? (
                      <div className="h-full w-full bg-secondary/10 rounded-xl border border-border/40 flex items-center justify-center text-xs text-muted-foreground animate-pulse">
                        {t({ id: "Memuat grafik...", en: "Loading chart..." })}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={clicksByDay30}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                          <XAxis 
                            dataKey="date" 
                            stroke="currentColor" 
                            className="text-muted-foreground/60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis 
                            stroke="currentColor" 
                            className="text-muted-foreground/60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                          />
                          <RechartsTooltip
                            contentStyle={{ 
                              backgroundColor: "var(--card, #1e293b)", 
                              borderRadius: "12px", 
                              border: "1px solid var(--border, #e2e8f0)",
                              fontSize: "11px",
                              color: "var(--foreground, #0f172a)"
                            }}
                          />
                          <Area 
                            type="monotone" 
                            name={t({ id: "Kunjungan", en: "Page Views" })} 
                            dataKey="views" 
                            stroke="var(--primary, #6366f1)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                          />
                          <Area 
                            type="monotone" 
                            name={t({ id: "Klik Afiliasi", en: "Clicks" })} 
                            dataKey="clicks" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorClicks)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: DevTools Audits */}
            {activeTab === "extensions" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Audit Usulan DevTools", en: "DevTools Audit Queue" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Tinjau, setujui, tolak, atau tandai unggulan untuk listing yang diajukan.", en: "Review, approve, reject, or feature submitted developer listings." })}</p>
                </div>

                <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                          <th className="p-4">{t({ id: "DevTool", en: "DevTool" })}</th>
                          <th className="p-4">{t({ id: "Status", en: "Status" })}</th>
                          <th className="p-4">{t({ id: "Metrik", en: "Metrics" })}</th>
                          <th className="p-4 text-center">{t({ id: "Tindakan Audit", en: "Audit Action" })}</th>
                          <th className="p-4 text-right">{t({ id: "Hapus", en: "Delete" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {dbExtensions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground italic">
                              {t({ id: "Antrean audit kosong.", en: "Audit queue is empty." })}
                            </td>
                          </tr>
                        ) : (
                          dbExtensions.map((ext) => (
                            <tr key={ext.id} className="hover:bg-secondary/20 transition-all">
                              <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                                <span className="text-xl bg-secondary p-1 rounded border border-border">{ext.logoUrl || "🧩"}</span>
                                <div className="flex flex-col">
                                  <Link href={`/extensions/${ext.slug}`} target="_blank" className="hover:underline text-foreground">{ext.name}</Link>
                                  <span className="text-[10px] text-muted-foreground/60">{ext.pricingType}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {ext.status === "featured" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/20">
                                    <Sparkles className="h-3 w-3 fill-amber-500" />
                                    Featured
                                  </span>
                                ) : ext.status === "approved" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                    <CheckCircle className="h-3 w-3" />
                                    {t({ id: "Aktif", en: "Approved" })}
                                  </span>
                                ) : ext.status === "rejected" ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded-full border border-rose-500/20">
                                    <AlertTriangle className="h-3 w-3" />
                                    Rejected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/20">
                                    <Clock className="h-3 w-3" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="p-4 space-y-0.5">
                                <div>{t({ id: "Klik:", en: "Clicks:" })} <span className="font-semibold text-foreground">{ext.clickCount || 0}</span></div>
                                <div>{t({ id: "Rating:", en: "Rating:" })} <span className="font-semibold text-foreground">{ext.avgRating || 0}★</span></div>
                              </td>
                              <td className="p-4 text-center">
                                <div className="inline-flex gap-1">
                                  {ext.status !== "approved" && ext.status !== "featured" && (
                                    <button
                                      disabled={isActionLoading === ext.id}
                                      onClick={() => handleUpdateStatus(ext.id, "approved")}
                                      className="px-2 py-1 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      {t({ id: "Setujui", en: "Approve" })}
                                    </button>
                                  )}
                                  {ext.status !== "rejected" && (
                                    <button
                                      disabled={isActionLoading === ext.id}
                                      onClick={() => handleUpdateStatus(ext.id, "rejected")}
                                      className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      {t({ id: "Tolak", en: "Reject" })}
                                    </button>
                                  )}
                                  {ext.status === "approved" && (
                                    <button
                                      disabled={isActionLoading === ext.id + "-featured"}
                                      onClick={() => handleToggleFeatured(ext.id, true)}
                                      className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      Feature
                                    </button>
                                  )}
                                  {ext.status === "featured" && (
                                    <button
                                      disabled={isActionLoading === ext.id + "-featured"}
                                      onClick={() => handleToggleFeatured(ext.id, false)}
                                      className="px-2 py-1 rounded bg-slate-500 hover:bg-slate-600 text-white font-semibold text-[10px] disabled:opacity-50 transition-all cursor-pointer"
                                    >
                                      Unfeature
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleOpenEditExt(ext)}
                                    className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[10px] transition-all cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  disabled={isActionLoading === ext.id + "-delete"}
                                  onClick={() => handleDeleteSubmission(ext.id)}
                                  className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews moderation */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Moderasi Ulasan Pengguna", en: "Review Moderation" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{t({ id: "Baca, edit, atau hapus ulasan yang dikirim oleh pengguna pada aplikasi.", en: "Read, audit, or remove user-submitted reviews across properties." })}</p>
                </div>

                <div className="space-y-4">
                  {reviewsList.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground italic border border-border rounded-2xl bg-card">
                      {t({ id: "Tidak ada ulasan untuk dimoderasi.", en: "No reviews to moderate." })}
                    </div>
                  ) : (
                    reviewsList.map((rev) => (
                      <div key={rev.id} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <img 
                              src={rev.userAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                              alt={rev.userName || "Anonymous"} 
                              className="h-7 w-7 rounded-full object-cover border border-border"
                            />
                            <span className="font-bold text-foreground">{rev.userName || "Anonymous"}</span>
                            <span className="text-muted-foreground">
                              {t({ id: "pada", en: "on" })} <span className="font-semibold text-primary">{rev.extensionName || "Deleted Extension"}</span>
                            </span>
                          </div>
                          
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${
                                  i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/35"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        <h4 className="text-sm font-semibold text-foreground">{rev.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rev.body}</p>

                        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/40">
                          <span className="text-muted-foreground">{formatDate(rev.createdAt)}</span>
                          <button
                            disabled={isActionLoading === rev.id + "-delete-review"}
                            onClick={() => handleDeleteReview(rev.id)}
                            className="text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            {isActionLoading === rev.id + "-delete-review" ? t({ id: "Menghapus...", en: "Deleting..." }) : t({ id: "Hapus Ulasan", en: "Delete Review" })}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab: Tutorials */}
            {activeTab === "blog" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{t({ id: "Kelola Tutorial Developer", en: "Manage Developer Tutorials" })}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{t({ id: "Publikasikan atau sunting tulisan blog dan tips developer.", en: "Publish, update, or remove tutorials and tips." })}</p>
                  </div>
                  <Link
                    href="/dashboard/blog/new"
                    className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    {t({ id: "Tulis Baru", en: "Write New" })}
                  </Link>
                </div>

                {tutorials.length === 0 ? (
                  <div className="rounded-2xl border border-border border-dashed p-12 text-center space-y-4 bg-card">
                    <BookOpen className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{t({ id: "Belum Ada Tutorial", en: "No Tutorials Yet" })}</h4>
                    </div>
                    <Link
                      href="/dashboard/blog/new"
                      className="inline-flex rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                    >
                      {t({ id: "Tulis Tutorial Pertama", en: "Write First Tutorial" })}
                    </Link>
                  </div>
                ) : (
                  <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                          <th className="p-4">{t({ id: "Tutorial", en: "Tutorial" })}</th>
                          <th className="p-4">{t({ id: "Kategori", en: "Category" })}</th>
                          <th className="p-4">{t({ id: "Status", en: "Status" })}</th>
                          <th className="p-4">{t({ id: "Estimasi Baca", en: "Reading Time" })}</th>
                          <th className="p-4 text-right">{t({ id: "Hapus", en: "Actions" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {tutorials.map((post) => (
                          <tr key={post.id} className="hover:bg-secondary/20 transition-all">
                            <td className="p-4 font-semibold text-foreground">
                              <div className="flex flex-col gap-0.5">
                                <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline text-foreground text-xs line-clamp-1">
                                  {post.title}
                                </Link>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-normal">
                                  <Calendar className="h-2.5 w-2.5" />
                                  {new Date(post.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 capitalize">
                              {post.categorySlug?.replace("-", " ") || "General"}
                            </td>
                            <td className="p-4">
                              {post.status === "published" ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  {t({ id: "Publik", en: "Published" })}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full border border-border">
                                  {t({ id: "Draf", en: "Draft" })}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {post.readingTimeMinutes} {t({ id: "menit", en: "min" })}
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteTutorial(post.id)}
                                className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Affiliate Program & Balance */}
            {activeTab === "affiliate" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Program Afiliasi & Saldo Owner", en: "Owner Affiliate Program & Wallet Balance" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t({ 
                      id: "Pantau saldo pendapatan riil Anda dari klik link afiliasi produk rekomendasi.", 
                      en: "Track your real earnings from referral clicks on recommended extensions and tools." 
                    })}
                  </p>
                </div>

                {/* Glowing Balance Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 rounded-3xl border border-transparent bg-gradient-to-tr from-violet-900 via-primary to-indigo-800 p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Wallet className="h-32 w-32" />
                    </div>
                    
                    <div className="space-y-1.5 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">{t({ id: "Total Pendapatan Afiliasi", en: "Total Affiliate Revenue" })}</span>
                      <p className="text-4xl font-black tracking-tight">
                        Rp {formatNumber(affiliateEvents.length * 1500)}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/10 z-10 text-xs">
                      <div>
                        <span className="text-violet-200/70 block text-[10px]">{t({ id: "Model Pendapatan", en: "Revenue Model" })}</span>
                        <span className="font-semibold">{t({ id: "PPC (Rp 1.500 / klik)", en: "PPC (Rp 1,500 / click)" })}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-violet-200/70 block text-[10px]">{t({ id: "Status Penarikan", en: "Payout Status" })}</span>
                        <span className="font-semibold px-2 py-0.5 rounded-full bg-white/10">{t({ id: "Siap Cair", en: "Ready to Cashout" })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">{t({ id: "Performa Lalu Lintas", en: "Traffic Performance" })}</span>
                      <p className="text-3xl font-extrabold text-foreground">{formatNumber(affiliateEvents.length)} <span className="text-xs font-medium text-muted-foreground">{t({ id: "klik link", en: "link clicks" })}</span></p>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t({ id: "Unik Produk:", en: "Unique Products:" })}</span>
                        <span className="font-bold text-foreground">{new Set(affiliateEvents.map(e => e.extensionId)).size}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{t({ id: "Rata-rata Harian:", en: "Daily Avg Clicks:" })}</span>
                        <span className="font-bold text-foreground">
                          {Math.round((affiliateEvents.length / 7) * 10) / 10}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Earnings Chart SVG */}
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {t({ id: "Statistik Pendapatan 7 Hari Terakhir", en: "Revenue Stats Last 7 Days" })}
                    </h3>
                    <span className="text-[10px] font-bold text-primary px-2.5 py-1 rounded bg-primary/5 border border-primary/10">
                      Live
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    {!isMounted ? (
                      <div className="h-full w-full bg-secondary/10 rounded-xl border border-border/40 flex items-center justify-center text-xs text-muted-foreground animate-pulse">
                        {t({ id: "Memuat grafik...", en: "Loading chart..." })}
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={clicksByDay}
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/40" />
                          <XAxis 
                            dataKey="date" 
                            stroke="currentColor" 
                            className="text-muted-foreground/60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                          />
                          <YAxis 
                            stroke="currentColor" 
                            className="text-muted-foreground/60"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `Rp ${formatNumber(value)}`}
                          />
                          <RechartsTooltip
                            formatter={(value: any) => [`Rp ${formatNumber(value)}`, t({ id: "Pendapatan", en: "Earnings" })]}
                            contentStyle={{ 
                              backgroundColor: "var(--card, #1e293b)", 
                              borderRadius: "12px", 
                              border: "1px solid var(--border, #e2e8f0)",
                              fontSize: "11px",
                              color: "var(--foreground, #0f172a)"
                            }}
                          />
                          <Bar 
                            dataKey="amount" 
                            name={t({ id: "Pendapatan", en: "Earnings" })} 
                            fill="var(--primary, #6366f1)" 
                            radius={[6, 6, 0, 0]}
                            maxBarSize={45}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Table of Active Affiliate Links */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{t({ id: "Daftar Link Afiliasi Rekomendasi", en: "Recommended Products Affiliate Links" })}</h3>
                  <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="p-3">{t({ id: "Nama Produk", en: "Product Name" })}</th>
                          <th className="p-3">{t({ id: "Link Afiliasi Saya", en: "My Affiliate Link" })}</th>
                          <th className="p-3 text-center">{t({ id: "Total Klik", en: "Total Clicks" })}</th>
                          <th className="p-3 text-right">{t({ id: "Saldo Terkumpul", en: "Earnings" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {dbExtensions.filter(ext => ext.affiliateUrl).length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center p-6 italic text-muted-foreground/60">
                              {t({ id: "Belum ada produk dengan link afiliasi yang diatur.", en: "No products with affiliate links configured yet." })}
                            </td>
                          </tr>
                        ) : (
                          dbExtensions.filter(ext => ext.affiliateUrl).map((ext) => {
                            const extClicks = affiliateEvents.filter(ev => ev.extensionId === ext.id).length;
                            return (
                              <tr key={ext.id} className="hover:bg-secondary/20 transition-all">
                                <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                                  <span className="text-lg bg-secondary p-1 rounded border border-border shadow-sm">{ext.logoUrl || "🧩"}</span>
                                  <Link href={`/extensions/${ext.slug}`} target="_blank" className="hover:underline">{ext.name}</Link>
                                </td>
                                <td className="p-3 font-mono text-[10px] text-primary truncate max-w-[200px]" title={ext.affiliateUrl}>
                                  {ext.affiliateUrl}
                                </td>
                                <td className="p-3 text-center font-bold text-foreground">{extClicks}</td>
                                <td className="p-3 text-right font-extrabold text-primary">Rp {formatNumber(extClicks * 1500)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Real-time Click Logs */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    {t({ id: "Pelacak Klik Pengunjung Real-Time", en: "Real-Time Visitor Clicks Tracker" })}
                  </h3>
                  <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="p-3">{t({ id: "Waktu Klik", en: "Click Time" })}</th>
                          <th className="p-3">{t({ id: "Produk", en: "Product" })}</th>
                          <th className="p-3">{t({ id: "Tipe Klik", en: "Click Type" })}</th>
                          <th className="p-3 text-center">{t({ id: "Negara", en: "Country" })}</th>
                          <th className="p-3 text-right">{t({ id: "Hasil Komisi", en: "Revenue" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {affiliateEvents.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-6 italic text-muted-foreground/60">
                              {t({ id: "Belum ada klik terdeteksi.", en: "No clicks detected yet." })}
                            </td>
                          </tr>
                        ) : (
                          affiliateEvents.slice(0, 15).map((ev) => (
                            <tr key={ev.id} className="hover:bg-secondary/20 transition-all">
                              <td className="p-3 text-muted-foreground">
                                {new Date(ev.createdAt).toLocaleString(language === "id" ? "id-ID" : "en-US", { 
                                  month: "short", 
                                  day: "numeric", 
                                  hour: "2-digit", 
                                  minute: "2-digit",
                                  second: "2-digit"
                                })}
                              </td>
                              <td className="p-3 font-semibold text-foreground flex items-center gap-1.5">
                                <span className="text-base">{ev.extensionLogo || "🧩"}</span>
                                <span className="truncate max-w-[120px]">{ev.extensionName || t({ id: "Ekstensi Dihapus", en: "Deleted Extension" })}</span>
                              </td>
                              <td className="p-3">
                                {ev.eventType === "click_install" ? (
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                                    Install Store
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-[10px]">
                                    Affiliate Redirect
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center font-bold text-base" title={ev.countryCode}>
                                {getFlagEmoji(ev.countryCode)}
                              </td>
                              <td className="p-3 text-right font-extrabold text-emerald-600 dark:text-emerald-400">
                                +Rp 1.500
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Users Management */}
            {activeTab === "users" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{t({ id: "Manajemen Akses & Hak Pengguna", en: "User Access & Roles Console" })}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t({ 
                      id: "Kelola otorisasi peran pengembang, tingkat paket subscription, dan hak hapus pengguna.", 
                      en: "Administer publisher roles, subscription tiers, and permanent account deletions." 
                    })}
                  </p>
                </div>

                {/* Search / Filter Bar */}
                <div className="flex items-center p-1 rounded-xl border border-border bg-card max-w-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
                  <div className="pl-3 text-muted-foreground">
                    <SearchIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={t({
                      id: "Cari nama atau email pengguna...",
                      en: "Search user name or email..."
                    })}
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                  {searchUserQuery && (
                    <button 
                      onClick={() => setSearchUserQuery("")} 
                      className="px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Users Table */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                  <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="p-3.5">{t({ id: "Pengguna", en: "User Profile" })}</th>
                          <th className="p-3.5">{t({ id: "Tanggal Daftar", en: "Joined Date" })}</th>
                          <th className="p-3.5">{t({ id: "Peran Hak Akses", en: "System Role" })}</th>
                          <th className="p-3.5">{t({ id: "Tingkat Paket", en: "Subscription Tier" })}</th>
                          <th className="p-3.5 text-right">{t({ id: "Hapus", en: "Remove" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground italic">
                              {t({ id: "Tidak ada pengguna ditemukan.", en: "No users matching query found." })}
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((usr) => (
                            <tr key={usr.id} className="hover:bg-secondary/20 transition-all">
                              <td className="p-3.5 flex items-center gap-3">
                                <img
                                  src={usr.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                                  alt={usr.fullName}
                                  className="h-8.5 w-8.5 rounded-full border border-border object-cover"
                                />
                                <div className="min-w-0">
                                  <p className="font-bold text-foreground truncate flex items-center gap-1">
                                    {usr.fullName || "Unnamed User"}
                                    {usr.id === profile?.id && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">
                                        You
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground/80 truncate">{usr.email}</p>
                                </div>
                              </td>
                              <td className="p-3.5">
                                {new Date(usr.createdAt).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric"
                                })}
                              </td>
                              <td className="p-3.5">
                                <select
                                  disabled={usr.id === profile?.id || isActionLoading === usr.id}
                                  value={usr.role}
                                  onChange={(e) => handleUpdateUserAccess(usr.id, e.target.value, usr.plan)}
                                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold focus:outline-none text-foreground cursor-pointer disabled:opacity-60"
                                >
                                  <option value="user">User</option>
                                  <option value="publisher">Publisher</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </td>
                              <td className="p-3.5">
                                <select
                                  disabled={isActionLoading === usr.id}
                                  value={usr.plan}
                                  onChange={(e) => handleUpdateUserAccess(usr.id, usr.role, e.target.value)}
                                  className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold focus:outline-none text-foreground cursor-pointer disabled:opacity-60"
                                >
                                  <option value="free">Free</option>
                                  <option value="pro">Pro</option>
                                  <option value="business">Business</option>
                                </select>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  disabled={usr.id === profile?.id || isActionLoading === usr.id || isActionLoading === usr.id + "-delete"}
                                  onClick={() => handleDeleteUser(usr.id)}
                                  className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer disabled:opacity-40"
                                  title={usr.id === profile?.id ? t({ id: "Tidak dapat menghapus diri sendiri", en: "Cannot delete yourself" }) : t({ id: "Hapus Akun Pengguna", en: "Delete Account" })}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Source Code Management */}
            {activeTab === "sourceCode" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{t({ id: "Kontrol Source Code & SaaS Templates", en: "Manage Source Code & SaaS Templates" })}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t({ 
                        id: "Tambah, edit, atau hapus produk template SaaS dan source code dari katalog penjualan.", 
                        en: "Manage, publish, update or remove SaaS template products and source codes." 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddSc}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {t({ id: "Tambah Template Baru", en: "Add New Template" })}
                  </button>
                </div>

                {/* Search Filter Bar */}
                <div className="flex items-center p-1 rounded-xl border border-border bg-card max-w-md focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
                  <div className="pl-3 text-muted-foreground">
                    <SearchIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={t({
                      id: "Cari nama, kategori, atau deskripsi...",
                      en: "Search name, category, tagline..."
                    })}
                    value={searchScQuery}
                    onChange={(e) => setSearchScQuery(e.target.value)}
                    className="w-full bg-transparent py-2 px-3 text-xs focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                  />
                  {searchScQuery && (
                    <button 
                      onClick={() => setSearchScQuery("")} 
                      className="px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Source Codes Table */}
                <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                  <div className="border border-border/60 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold">
                          <th className="p-3.5">{t({ id: "Produk & Kategori", en: "Product & Category" })}</th>
                          <th className="p-3.5">{t({ id: "Tech Stack", en: "Tech Stack" })}</th>
                          <th className="p-3.5">{t({ id: "Harga Tampilan", en: "Display Price" })}</th>
                          <th className="p-3.5">{t({ id: "Link Demo", en: "Demo Link" })}</th>
                          <th className="p-3.5 text-right">{t({ id: "Tindakan", en: "Actions" })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {filteredSourceCodes.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-8 text-muted-foreground italic">
                              {t({ id: "Tidak ada source code ditemukan.", en: "No source codes matching query found." })}
                            </td>
                          </tr>
                        ) : (
                          filteredSourceCodes.map((sc) => (
                            <tr key={sc.id} className="hover:bg-secondary/20 transition-all">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl bg-secondary p-1.5 rounded-lg border border-border flex items-center justify-center h-10 w-10">
                                    {sc.thumbnail && sc.thumbnail.startsWith("http") ? (
                                      <img src={sc.thumbnail} alt={sc.name} className="h-full w-full object-cover rounded" />
                                    ) : (
                                      sc.thumbnail || "💻"
                                    )}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-foreground truncate">{sc.name}</p>
                                    <p className="text-[10px] text-primary truncate font-semibold capitalize">{sc.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-wrap gap-1 max-w-[250px]">
                                  {Array.isArray(sc.techStack) ? (
                                    sc.techStack.map((tech: string, i: number) => (
                                      <span key={i} className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-medium border border-border text-foreground">
                                        {tech}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground text-[10px]">-</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5 font-bold text-foreground">
                                {sc.price}
                                <span className="block text-[9px] font-normal text-muted-foreground">({formatNumber(sc.priceRaw)})</span>
                              </td>
                              <td className="p-3.5">
                                {sc.demoLink ? (
                                  <a 
                                    href={sc.demoLink} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-primary hover:underline font-semibold flex items-center gap-1"
                                  >
                                    <ArrowUpRight className="h-3 w-3" />
                                    Demo
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground/60">-</span>
                                )}
                              </td>
                              <td className="p-3.5 text-right space-x-1.5">
                                <button
                                  onClick={() => handleOpenEditSc(sc)}
                                  className="px-2.5 py-1.5 rounded-lg border border-border text-foreground hover:bg-secondary/40 font-semibold cursor-pointer text-[10px] transition-all"
                                >
                                  Edit
                                </button>
                                <button
                                  disabled={isActionLoading === sc.id + "-delete-sc"}
                                  onClick={() => handleDeleteSc(sc.id)}
                                  className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 disabled:opacity-40 cursor-pointer transition-all inline-flex items-center align-middle"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Deals Management */}
            {activeTab === "deals" && (
              <div className="space-y-6 animate-fade-in text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">{t({ id: "Kontrol Deals & Affiliate Link", en: "Manage Deals & Affiliate Links" })}</h2>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {t({ 
                        id: "Tambah, edit, atau hapus link kemitraan, diskon eksklusif, dan penawaran Shopee.", 
                        en: "Manage, publish, update or remove partnership deals and affiliate listings." 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddDeal}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4" />
                    {t({ id: "Tambah Deal Baru", en: "Add New Deal" })}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left part: Deals Table */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                          <thead>
                            <tr className="bg-secondary/40 border-b border-border/60 text-muted-foreground font-semibold uppercase tracking-wider">
                              <th className="p-4 w-16">{t({ id: "Logo", en: "Logo" })}</th>
                              <th className="p-4">{t({ id: "Nama Deal", en: "Deal Name" })}</th>
                              <th className="p-4">{t({ id: "Kategori", en: "Category" })}</th>
                              <th className="p-4 w-24">{t({ id: "Harga", en: "Price" })}</th>
                              <th className="p-4 text-center w-32">{t({ id: "Tindakan", en: "Actions" })}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60 text-muted-foreground">
                            {dbDeals.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center p-8 text-muted-foreground italic">
                                  {t({ id: "Belum ada deal terdaftar.", en: "No deals registered yet." })}
                                </td>
                              </tr>
                            ) : (
                              dbDeals.map((deal) => (
                                <tr key={deal.id} className="hover:bg-secondary/20 transition-all">
                                  <td className="p-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary border border-border overflow-hidden shadow-inner text-lg">
                                      {deal.logoUrl && (deal.logoUrl.startsWith("http") || deal.logoUrl.startsWith("/")) ? (
                                        <img src={deal.logoUrl} alt={deal.name} className="h-full w-full object-cover" />
                                      ) : (
                                        deal.logoUrl || "🧩"
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-4 font-semibold text-foreground">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-foreground">{deal.name}</span>
                                      <span className="text-[10px] text-muted-foreground/60 line-clamp-1 max-w-[250px]" title={deal.affiliateUrl}>
                                        {deal.affiliateUrl}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                                      {deal.categoryName || deal.categorySlug || "Shopping"}
                                    </span>
                                  </td>
                                  <td className="p-4 font-semibold text-foreground">
                                    {deal.pricingType === "free" ? "Free" : `$${deal.price || "0.00"}`}
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="inline-flex gap-1.5">
                                      <button
                                        onClick={() => handleOpenEditDeal(deal)}
                                        className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[10px] transition-all cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        disabled={isActionLoading === deal.id + "-delete"}
                                        onClick={() => handleDeleteSubmission(deal.id)}
                                        className="p-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer disabled:opacity-50"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right part: Image Manager (Tabel Gambar) */}
                  <div className="space-y-4">
                    <div className="border border-border rounded-2xl bg-card p-4 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-border/60">
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <ImageIcon className="h-4 w-4 text-primary" />
                          {t({ id: "Tabel Gambar / Logo", en: "Image Library" })}
                        </h3>
                        <span className="text-[10px] bg-secondary border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                          {imagesList.length} files
                        </span>
                      </div>

                      {/* File Upload Zone */}
                      <div>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-all text-center">
                          <PlusCircle className="h-6 w-6 text-muted-foreground mb-1 animate-pulse" />
                          <span className="text-[11px] font-bold text-foreground">
                            {isUploading ? "Uploading..." : "Upload New Image"}
                          </span>
                          <span className="text-[9px] text-muted-foreground mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadImage}
                            disabled={isUploading}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Image List Table */}
                      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                        {imagesList.length === 0 ? (
                          <p className="text-center py-8 text-xs text-muted-foreground italic">
                            No images uploaded yet.
                          </p>
                        ) : (
                          imagesList.map((img) => (
                            <div 
                              key={img.name} 
                              className="flex items-center gap-3 p-2 rounded-xl bg-secondary/20 border border-border/60 hover:border-primary/30 transition-all text-xs"
                            >
                              <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-secondary border border-border flex items-center justify-center shadow-inner">
                                <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-foreground truncate" title={img.name}>{img.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {(img.sizeBytes / 1024).toFixed(0)} KB
                                </p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(img.url);
                                    setCopiedImagePath(img.name);
                                    setTimeout(() => setCopiedImagePath(null), 1500);
                                  }}
                                  className="p-1 rounded bg-secondary hover:bg-secondary-foreground/10 text-foreground border border-border transition-all cursor-pointer flex justify-center"
                                  title="Copy relative image path"
                                >
                                  {copiedImagePath === img.name ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                {dealForm.logoUrl !== img.url && (
                                  <button
                                    type="button"
                                    onClick={() => setDealForm(prev => ({ ...prev, logoUrl: img.url }))}
                                    className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer text-center"
                                  >
                                    Use Logo
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Form for Source Code Create / Update */}
            {scModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border/60">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingSc 
                        ? t({ id: "Edit Source Code", en: "Edit Source Code" }) 
                        : t({ id: "Tambah Source Code Baru", en: "Add New Source Code" })
                      }
                    </h3>
                    <button 
                      onClick={() => setScModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded-lg border border-border bg-secondary/20"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveSc} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Nama Produk", en: "Product Name" })} *</label>
                        <input
                          type="text"
                          required
                          placeholder={t({ id: "Contoh: NextJS Boilerplate", en: "Example: NextJS Boilerplate" })}
                          value={scForm.name}
                          onChange={(e) => setScForm({ ...scForm, name: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Kategori", en: "Category" })} *</label>
                        <input
                          type="text"
                          required
                          placeholder={t({ id: "Contoh: SaaS Starter Kit", en: "Example: SaaS Starter Kit" })}
                          value={scForm.category}
                          onChange={(e) => setScForm({ ...scForm, category: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">{t({ id: "Tagline", en: "Tagline" })}</label>
                      <input
                        type="text"
                        placeholder={t({ id: "Deskripsi singkat satu baris", en: "Brief one-line description" })}
                        value={scForm.tagline}
                        onChange={(e) => setScForm({ ...scForm, tagline: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">{t({ id: "Deskripsi Detail (Markdown)", en: "Detailed Description (Markdown)" })} *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder={t({ id: "Deskripsi lengkap mengenai source code...", en: "Detailed description of the source code..." })}
                        value={scForm.description}
                        onChange={(e) => setScForm({ ...scForm, description: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Harga Tampilan", en: "Display Price" })} *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rp 150.000 atau Free"
                          value={scForm.price}
                          onChange={(e) => setScForm({ ...scForm, price: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Harga Raw (Angka)", en: "Raw Price (Number)" })} *</label>
                        <input
                          type="number"
                          required
                          placeholder="Contoh: 150000"
                          value={scForm.priceRaw}
                          onChange={(e) => setScForm({ ...scForm, priceRaw: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Thumbnail / Emoji", en: "Thumbnail / Emoji" })}</label>
                        <input
                          type="text"
                          placeholder="Contoh: ⚡ atau https://.../img.png"
                          value={scForm.thumbnail}
                          onChange={(e) => setScForm({ ...scForm, thumbnail: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Link Demo", en: "Demo Link" })}</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://demo.roketdev.com"
                          value={scForm.demoLink}
                          onChange={(e) => setScForm({ ...scForm, demoLink: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Tech Stack (Pisahkan dengan koma)", en: "Tech Stack (Comma-separated)" })} *</label>
                        <input
                          type="text"
                          required
                          placeholder="NextJS, TailwindCSS, Drizzle ORM, Supabase"
                          value={scForm.techStack}
                          onChange={(e) => setScForm({ ...scForm, techStack: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Screenshots (Pisahkan dengan koma)", en: "Screenshots (Comma-separated URLs)" })}</label>
                        <input
                          type="text"
                          placeholder="https://.../sc1.png, https://.../sc2.png"
                          value={scForm.screenshots}
                          onChange={(e) => setScForm({ ...scForm, screenshots: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setScModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary/40 font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isActionLoading === "save-sc"}
                        className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                      >
                        {isActionLoading === "save-sc" 
                          ? t({ id: "Menyimpan...", en: "Saving..." }) 
                          : t({ id: "Simpan", en: "Save" })
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Form for DevTools (Extensions) Edit */}
            {extModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border/60">
                    <h3 className="text-lg font-bold text-foreground">
                      {t({ id: "Edit DevTool & Deal", en: "Edit DevTool & Deal" })}
                    </h3>
                    <button 
                      onClick={() => setExtModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded-lg border border-border bg-secondary/20"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveExt} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Nama Produk", en: "Product Name" })} *</label>
                        <input
                          type="text"
                          required
                          value={extForm.name}
                          onChange={(e) => setExtForm({ ...extForm, name: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Pricing Type", en: "Pricing Type" })} *</label>
                        <select
                          value={extForm.pricingType}
                          onChange={(e) => setExtForm({ ...extForm, pricingType: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="free">Free</option>
                          <option value="freemium">Freemium</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Tagline", en: "Tagline" })}</label>
                        <input
                          type="text"
                          value={extForm.tagline}
                          onChange={(e) => setExtForm({ ...extForm, tagline: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Harga Per Bulan ($)", en: "Price Per Month ($)" })}</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 9.99"
                          value={extForm.price}
                          onChange={(e) => setExtForm({ ...extForm, price: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">{t({ id: "Deskripsi", en: "Description" })} *</label>
                      <textarea
                        required
                        rows={4}
                        value={extForm.description}
                        onChange={(e) => setExtForm({ ...extForm, description: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Link Kemitraan / Affiliate Url (Deals)", en: "Partner / Affiliate Url (Deals)" })}</label>
                        <input
                          type="text"
                          placeholder="e.g. https://chatgptsidebar.io/ref=roketdev"
                          value={extForm.affiliateUrl}
                          onChange={(e) => setExtForm({ ...extForm, affiliateUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary border-primary/40 focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Website Url Resmi", en: "Official Website Url" })}</label>
                        <input
                          type="text"
                          value={extForm.websiteUrl}
                          onChange={(e) => setExtForm({ ...extForm, websiteUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Chrome Web Store Url", en: "Chrome Web Store Url" })} *</label>
                        <input
                          type="text"
                          required
                          value={extForm.chromeStoreUrl}
                          onChange={(e) => setExtForm({ ...extForm, chromeStoreUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Logo Url / Emoji", en: "Logo Url / Emoji" })}</label>
                        <input
                          type="text"
                          value={extForm.logoUrl}
                          onChange={(e) => setExtForm({ ...extForm, logoUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">{t({ id: "Status Moderasi", en: "Moderation Status" })} *</label>
                      <select
                        value={extForm.status}
                        onChange={(e) => setExtForm({ ...extForm, status: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-bold text-primary"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="featured">Featured (Approved & Highlighted)</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setExtModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary/40 font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isActionLoading === "save-ext"}
                        className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                      >
                        {isActionLoading === "save-ext" 
                          ? t({ id: "Menyimpan...", en: "Saving..." }) 
                          : t({ id: "Simpan", en: "Save" })
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Form for Deals Create / Edit */}
            {dealModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in text-xs">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-border/60">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingDeal 
                        ? t({ id: "Edit Deal", en: "Edit Deal" }) 
                        : t({ id: "Tambah Deal Baru", en: "Add New Deal" })
                      }
                    </h3>
                    <button 
                      onClick={() => setDealModalOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-xs font-semibold px-2 py-1 rounded-lg border border-border bg-secondary/20 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveDeal} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Nama Deal / Produk", en: "Deal / Product Name" })} *</label>
                        <input
                          type="text"
                          required
                          value={dealForm.name}
                          onChange={(e) => setDealForm({ ...dealForm, name: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Kategori", en: "Category" })} *</label>
                        <select
                          value={dealForm.categorySlug}
                          onChange={(e) => setDealForm({ ...dealForm, categorySlug: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-semibold"
                        >
                          {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Tagline", en: "Tagline" })}</label>
                        <input
                          type="text"
                          value={dealForm.tagline}
                          onChange={(e) => setDealForm({ ...dealForm, tagline: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Harga ($) / Bulan", en: "Price ($) / Month" })}</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 9.99"
                          value={dealForm.price}
                          onChange={(e) => setDealForm({ ...dealForm, price: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-foreground">{t({ id: "Deskripsi", en: "Description" })} *</label>
                      <textarea
                        required
                        rows={4}
                        value={dealForm.description}
                        onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Link Kemitraan / Affiliate Url", en: "Partner / Affiliate Url" })} *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. https://s.shopee.co.id/..."
                          value={dealForm.affiliateUrl}
                          onChange={(e) => setDealForm({ ...dealForm, affiliateUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Website Url Resmi", en: "Official Website Url" })}</label>
                        <input
                          type="text"
                          placeholder="e.g. https://shopee.co.id/..."
                          value={dealForm.websiteUrl}
                          onChange={(e) => setDealForm({ ...dealForm, websiteUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Logo Url / Emoji", en: "Logo Url / Emoji" })}</label>
                        <input
                          type="text"
                          placeholder="e.g. /deals/office-365.png"
                          value={dealForm.logoUrl}
                          onChange={(e) => setDealForm({ ...dealForm, logoUrl: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                        />
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {t({ 
                            id: "Tips: Klik 'Use Logo' di tabel gambar perpustakaan di samping kanan untuk mengisi otomatis.", 
                            en: "Tip: Click 'Use Logo' on the image library to the right to auto-fill." 
                          })}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-foreground">{t({ id: "Status Moderasi", en: "Moderation Status" })} *</label>
                        <select
                          value={dealForm.status}
                          onChange={(e) => setDealForm({ ...dealForm, status: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/20 p-2.5 text-foreground focus:outline-none focus:border-primary font-bold text-primary"
                        >
                          <option value="approved">Approved</option>
                          <option value="featured">Featured (Approved & Highlighted)</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setDealModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-border text-foreground hover:bg-secondary/40 font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isActionLoading === "save-deal"}
                        className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
                      >
                        {isActionLoading === "save-deal" 
                          ? t({ id: "Menyimpan...", en: "Saving..." }) 
                          : t({ id: "Simpan", en: "Save" })
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </main>
      </div>
    </PageWrapper>
  );
}
