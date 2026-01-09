"use client";
import React, { useEffect } from "react";
import { useState } from "react";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import Loader from "../../src/components/page-general/Loader";

import Article, { ArticleLink } from "../../src/components/page-specific/Article";
import PageNavigation from "../../src/components/page-general/PageNavigation";

type ArticleType = ArticleLink;


export default function ArticlesPage() {
  const [links, setLinks] = useState<ArticleLink[]>([]);
  const [loading, setLoading] = useState(true);

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
  const totalPages = Math.ceil(links.length / ARTICLES_PER_PAGE);
  const startIdx = (page - 1) * ARTICLES_PER_PAGE;
  const endIdx = startIdx + ARTICLES_PER_PAGE;
  const currentArticles = links.slice(startIdx, endIdx);

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
        {currentArticles.map((article, idx) => (
          <Article key={startIdx + idx} {...article} />
        ))}
        <PageNavigation page={page} totalPages={totalPages} setPage={setPage} />
      </main>
      <SiteFooter />
    </>
  );
}
