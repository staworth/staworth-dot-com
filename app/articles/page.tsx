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
        const response = await fetch("https://api.staworth.com/articles");
        const data = await response.json();
        // Transform 'link' field to 'href'
        const transformedData = data.map((item: any) => ({
          ...item,
          href: item.link
        }));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLinks(transformedData);
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
