"use client";
import React, { useEffect, useRef, useMemo } from "react";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import SiteNavbar from "../page-general/SiteNavbar";
import SiteFooter from "../page-general/SiteFooter";
import PageSummary from "../page-general/PageSummary";
import Loader from "../page-general/Loader";

import Article, { ArticleLink } from "./Article";
import PageNavigation from "../page-general/PageNavigation";
import ArticleSubscribe from "./ArticleSubscribe";
import ArticleFilters from "./ArticleFilters";

const VALID_TAGS = new Set(["beefy", "staworth", "octav", "nexus", "kpk", "accountant quits"]);
const VALID_YEARS = new Set(["2023", "2024", "2025", "2026"]);
const VALID_TYPES = new Set(["article", "video", "link"]);

export default function ArticlesPageClient() {
  const [links, setLinks] = useState<ArticleLink[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString() ?? "";
  const parsedParams = useMemo(() => new URLSearchParams(searchParamsString), [searchParamsString]);
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
          href: item.link,
          headerMediaType: null,
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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeList = (values: string[]) => Array.from(new Set(values)).sort();

  const parseFilterValues = (key: string, allowed: Set<string>) => {
    const rawValues = parsedParams.getAll(key);
    const splitValues = rawValues.flatMap((value) => value.split(","));
    const normalized = splitValues
      .map((value) => value.trim().toLowerCase())
      .filter((value) => value && allowed.has(value));
    return normalizeList(normalized);
  };

  const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((value, index) => value === b[index]);

  const toggleSelection = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const clearSelection = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter([]);
  };

  useEffect(() => {
    const incomingTags = parseFilterValues("type", VALID_TAGS);
    const incomingYears = parseFilterValues("year", VALID_YEARS);
    const incomingTypes = parseFilterValues("format", VALID_TYPES);
    const incomingSearch = (parsedParams.get("search") ?? "").trim();
    const incomingPageRaw = (parsedParams.get("page") ?? "").trim();
    const incomingPage = Math.max(1, Number.parseInt(incomingPageRaw, 10) || 1);

    setSelectedTags((prev) => (arraysEqual(prev, incomingTags) ? prev : incomingTags));
    setSelectedYears((prev) => (arraysEqual(prev, incomingYears) ? prev : incomingYears));
    setSelectedTypes((prev) => (arraysEqual(prev, incomingTypes) ? prev : incomingTypes));
    setSearchQuery((prev) => (prev === incomingSearch ? prev : incomingSearch));
    setPage((prev) => (prev === incomingPage ? prev : incomingPage));
    hasInitializedFilters.current = true;
  }, [searchParamsString, parsedParams]);

  useEffect(() => {
    if (!hasInitializedFilters.current || loading) return;
    const params = new URLSearchParams();
    if (selectedTags.length > 0) {
      params.set("type", normalizeList(selectedTags).join(","));
    }
    if (selectedYears.length > 0) {
      params.set("year", normalizeList(selectedYears).join(","));
    }
    if (selectedTypes.length > 0) {
      params.set("format", normalizeList(selectedTypes).join(","));
    }
    if (searchQuery.trim().length > 0) {
      params.set("search", searchQuery.trim());
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const query = params.toString();
    const currentQuery = searchParamsString;
    const currentUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;
    const nextUrl = query ? `/articles?${query}` : "/articles";
    if (query === currentQuery) {
      return;
    }
    if (nextUrl === currentUrl) {
      return;
    }
    router.replace(nextUrl, { scroll: false });
  }, [selectedTags, selectedYears, selectedTypes, searchQuery, page, router, searchParamsString, pathname, loading]);

  const filteredLinks = links.filter((article) => {
    const tagCandidates = article.tags && article.tags.length > 0 ? article.tags : [article.category];
    const normalizedTags = tagCandidates.map((tag) => tag.toLowerCase());

    const date = new Date(article.date);
    const year = Number.isNaN(date.getTime()) ? null : String(date.getFullYear());

    const tagMatch = selectedTags.length === 0 || selectedTags.some((tag) => normalizedTags.includes(tag));
    const yearMatch = selectedYears.length === 0 || (year ? selectedYears.includes(year) : false);
    const isInternal = article.href.startsWith("/");
    const mediaType = (article.headerMediaType ?? "").toLowerCase();
    const articleType = !isInternal
      ? "link"
      : mediaType === "youtube"
        ? "video"
        : "article";
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(articleType);
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

    return tagMatch && yearMatch && typeMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredLinks.length / ARTICLES_PER_PAGE);
  const startIdx = (page - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const currentArticles = filteredLinks.slice(startIdx, endIdx);

  useEffect(() => {
    if (loading) return;
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
          selectedTypes={selectedTypes}
          onToggleTag={(tag) => {
            setPage(1);
            toggleSelection(tag, setSelectedTags);
          }}
          onToggleYear={(year) => {
            setPage(1);
            toggleSelection(year, setSelectedYears);
          }}
          onToggleType={(type) => {
            setPage(1);
            toggleSelection(type, setSelectedTypes);
          }}
          onClearTags={() => {
            setPage(1);
            clearSelection(setSelectedTags);
          }}
          onClearYears={() => {
            setPage(1);
            clearSelection(setSelectedYears);
          }}
          onClearTypes={() => {
            setPage(1);
            clearSelection(setSelectedTypes);
          }}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setPage(1);
            setSearchQuery(value);
          }}
          onClearSearch={() => {
            setPage(1);
            setSearchQuery("");
          }}
        />
        {currentArticles.map((article, idx) => (
          <Article
            key={startIdx + idx}
            {...article}
            onTagClick={(tag) => {
              const normalized = tag.toLowerCase();
              setPage(1);
              setSelectedTags([normalized]);
            }}
          />
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
