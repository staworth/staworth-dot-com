"use client";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import Loader from "../../src/components/page-general/Loader";

import Article, { ArticleLink } from "../../src/components/page-specific/Article";
import PageNavigation from "../../src/components/page-general/PageNavigation";
import ArticleSubscribe from "../../src/components/page-specific/ArticleSubscribe";
import ArticleFilters from "../../src/components/page-specific/ArticleFilters";

type ArticleType = ArticleLink;

const VALID_TAGS = new Set(["beefy", "staworth", "octav", "kpk"]);
const VALID_YEARS = new Set(["2023", "2024", "2025", "2026"]);

export default function ArticlesPage() {
  const [links, setLinks] = useState<ArticleLink[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitializedFilters = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        // Fetch API articles
        const apiResponse = await fetch("https://api.staworth.com/articles");
        const apiData = await apiResponse.json();
        const apiArticles = apiData.map((item: any) => ({
          ...item,
          href: item.link
        }));

        // Fetch markdown-based articles
        const mdResponse = await fetch("/api/articles");
        const mdArticles = await mdResponse.json();

        // Extract titles from markdown articles for deduplication
        const mdTitles = new Set(
          mdArticles.map((article: ArticleLink) => article.title.toLowerCase().trim())
        );

        // Filter out API articles that have the same title as markdown articles
        const filteredApiArticles = apiArticles.filter((article: any) => {
          // Keep only if title is not in markdown articles
          return !mdTitles.has(article.title.toLowerCase().trim());
        });

        // Combine filtered API articles with markdown articles and sort by date (newest first)
        const allArticles = [...filteredApiArticles, ...mdArticles].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLinks(allArticles);
            setLoading(false);
          }
        }, remainingTime);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, remainingTime);
      }
    };
    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  const ARTICLES_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const parseFilterValues = (key: string, allowed: Set<string>) => {
    const rawValues = searchParams?.getAll(key) ?? [];
    const splitValues = rawValues.flatMap((value) => value.split(","));
    const normalized = splitValues
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value && allowed.has(value));
    return Array.from(new Set(normalized));
  };

  const toggleSelection = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const clearSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter([]);
  };

  useEffect(() => {
    if (!searchParams) return;
    const incomingTags = parseFilterValues("type", VALID_TAGS);
    const incomingYears = parseFilterValues("year", VALID_YEARS);
    const incomingSearch = (searchParams.get("search") ?? "").trim();
    const incomingPageRaw = (searchParams.get("page") ?? "").trim();
    const incomingPage = Math.max(1, Number.parseInt(incomingPageRaw, 10) || 1);

    setSelectedTags(incomingTags);
    setSelectedYears(incomingYears);
    setSearchQuery(incomingSearch);
    setPage(incomingPage);
    hasInitializedFilters.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (!hasInitializedFilters.current) return;
    const params = new URLSearchParams();
    if (selectedTags.length > 0) {
      params.set("type", selectedTags.join(","));
    }
    if (selectedYears.length > 0) {
      params.set("year", selectedYears.join(","));
    }
    if (searchQuery.trim().length > 0) {
      params.set("search", searchQuery.trim());
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const query = params.toString();
    const nextUrl = query ? `/articles?${query}` : "/articles";
    router.replace(nextUrl, { scroll: false });
  }, [selectedTags, selectedYears, searchQuery, page, router]);

  const filteredLinks = links.filter((article) => {
    const tagCandidates = article.tags && article.tags.length > 0 ? article.tags : [article.category];
    const normalizedTags = tagCandidates.map((tag) => tag.toLowerCase());

    const date = new Date(article.date);
    const year = Number.isNaN(date.getTime()) ? null : String(date.getFullYear());

    const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => normalizedTags.includes(tag));
    const yearMatch = selectedYears.length === 0 || (year ? selectedYears.includes(year) : false);
    const query = searchQuery.trim().toLowerCase();
    const searchHaystack = [
      article.title,
      article.description,
      ...(article.tags ?? []),
      article.category,
    ]
      .join(" ")
      .toLowerCase();
    const searchMatch = query.length === 0 || searchHaystack.includes(query);

    return tagMatch && yearMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredLinks.length / ARTICLES_PER_PAGE);
  const startIdx = (page - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const currentArticles = filteredLinks.slice(startIdx, endIdx);

  useEffect(() => {
    if (totalPages === 0 && page !== 1) {
      setPage(1);
      return;
    }
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <SiteNavbar />
      <main>
        <PageSummary
          title="Our Publications"
          description="Review our recent work and contribution across Staworth and the different organisations we serve."
        />
        <ArticleFilters
          selectedTags={selectedTags}
          selectedYears={selectedYears}
          onToggleTag={(tag) => { setPage(1); toggleSelection(tag, setSelectedTags); }}
          onToggleYear={(year) => { setPage(1); toggleSelection(year, setSelectedYears); }}
          onClearTags={() => { setPage(1); clearSelection(setSelectedTags); }}
          onClearYears={() => { setPage(1); clearSelection(setSelectedYears); }}
          searchQuery={searchQuery}
          onSearchChange={(value) => { setPage(1); setSearchQuery(value); }}
          onClearSearch={() => { setPage(1); setSearchQuery(""); }}
        />
        {currentArticles.map((article, idx) => (
          <Article key={startIdx + idx} {...article} />
        ))}
        {totalPages > 1 && (
          <PageNavigation page={page} totalPages={totalPages} setPage={setPage} />
        )}
        <ArticleSubscribe />
      </main>
      <SiteFooter />
    </>
  );
}
