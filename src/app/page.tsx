'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from "@/components/ui/header-1";
import { HeroSection, SourcesSection } from "@/components/ui/hero-1";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, ExternalLinkIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { AuthModal } from '@/components/auth/auth-modal';

interface Article {
  id: string;
  title: string;
  source: string;
  link: string;
  summary?: string;
  timestamp?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'latest' | 'saved'>('latest');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const fetchSavedArticles = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching saved articles:", error);
    } else if (data) {
      setSavedIds(data.map(item => item.article_id));
      setSavedArticles(
        data.map(item => ({
          id: item.article_id,
          title: item.title || "Titre inconnu",
          link: item.link || "#",
          source: item.source || "Source inconnue",
          summary: item.summary || "",
          timestamp: item.published_at || item.created_at
        }))
      );
    }
  }, [supabase]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/articles.json');
      if (res.ok) {
        const data: Article[] = await res.json();
        // Dédupliquer par ID pour éviter les doublons à l'affichage
        const uniqueDataMap = new Map<string, Article>();
        data.forEach(item => {
          if (!uniqueDataMap.has(item.id)) {
            uniqueDataMap.set(item.id, item);
          }
        });
        setArticles(Array.from(uniqueDataMap.values()));
      }
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check initial user (getUser() validates the token server-side, unlike getSession())
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser ?? null);
      if (currentUser) {
        fetchSavedArticles(currentUser.id);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSavedArticles(session.user.id);
      } else {
        setSavedIds([]);
        setSavedArticles([]);
      }
    });

    fetchArticles();

    return () => subscription.unsubscribe();
  }, [supabase, fetchSavedArticles, fetchArticles]);

  // Track which articles are currently being toggled to prevent double-clicks
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const toggleSave = async (article: Article) => {
    const id = article.id;
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Prevent double-click: if this article is already being processed, ignore
    if (savingIds.has(id)) return;

    const isSaved = savedIds.includes(id);

    // Lock this article
    setSavingIds(prev => new Set(prev).add(id));

    // Optimistic update
    const previousSaved = [...savedIds];
    const previousSavedArticles = [...savedArticles];

    const newSaved = isSaved
      ? savedIds.filter(sid => sid !== id)
      : [...savedIds, id];
    setSavedIds(newSaved);

    const newSavedArticles = isSaved
      ? savedArticles.filter(a => a.id !== id)
      : [article, ...savedArticles];
    setSavedArticles(newSavedArticles);

    try {
      if (isSaved) {
        // Delete
        const { error } = await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', id);

        if (error) {
          console.error("Error un-saving article:", error);
          setSavedIds(previousSaved);
          setSavedArticles(previousSavedArticles);
        }
      } else {
        // Upsert: prevents duplicate errors if somehow triggered twice
        const { error } = await supabase
          .from('saved_articles')
          .upsert(
            {
              user_id: user.id,
              article_id: id,
              title: article.title,
              link: article.link,
              source: article.source,
              summary: article.summary,
              published_at: article.timestamp || null
            },
            { onConflict: 'user_id,article_id' }
          );

        if (error) {
          console.error("Error saving article:", error);
          setSavedIds(previousSaved);
          setSavedArticles(previousSavedArticles);
        }
      }
    } finally {
      // Unlock this article
      setSavingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const displayedArticles = view === 'latest'
    ? articles
    : savedArticles;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/10">
      <Header />

      <main className="flex-grow">
        <HeroSection />

        <div id="articles-grid" className="mx-auto max-w-5xl px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border w-fit">
              <Button
                variant={view === 'latest' ? 'secondary' : 'ghost'}
                className="rounded-full px-6 transition-all"
                onClick={() => setView('latest')}
              >
                Flux d&apos;actualités
              </Button>
              <Button
                variant={view === 'saved' ? 'secondary' : 'ghost'}
                className="rounded-full px-6 transition-all"
                onClick={() => setView('saved')}
              >
                Enregistrés ({savedIds.length})
              </Button>
            </div>

            <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={fetchArticles} disabled={loading}>
              <RefreshCwIcon className={cn("size-4", loading && "animate-spin")} />
              Actualiser
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-muted/50 animate-pulse border" />
              ))}
            </div>
          ) : displayedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article) => (
                <div
                  key={article.id}
                  className="group relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      {article.source}
                    </span>
                    <button
                      onClick={() => toggleSave(article)}
                      disabled={savingIds.has(article.id)}
                      className={cn(
                        "rounded-full p-2 transition-colors hover:bg-muted",
                        savedIds.includes(article.id) ? "text-primary" : "text-muted-foreground",
                        savingIds.has(article.id) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <BookmarkIcon className={cn("size-4", savedIds.includes(article.id) && "fill-current")} />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                    {article.summary || "Aucun résumé disponible pour cet article."}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Lire l&apos;article <ExternalLinkIcon className="size-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <BookmarkIcon className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Aucun article trouvé</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                {view === 'saved'
                  ? (user
                    ? "Vous n'avez pas encore d'articles enregistrés."
                    : "Connectez-vous pour voir vos articles enregistrés.")
                  : "Le flux est vide pour le moment. Revenez plus tard !"}
              </p>
              {!user && view === 'saved' && (
                <Button onClick={() => setShowAuthModal(true)} className="mt-4 rounded-full">
                  Se connecter
                </Button>
              )}
            </div>
          )}
        </div>

        <SourcesSection />
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg" />
            <span className="font-bold tracking-tight text-xl text-primary">Pulse.AI</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Pulse.AI — Veille Stratégique IA.
          </p>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
