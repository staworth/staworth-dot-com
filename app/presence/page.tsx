"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import Loader from "../../src/components/page-general/Loader";

import PresenceLink from "../../src/components/page-specific/PresenceLink";
import PageNavigation from "../../src/components/page-general/PageNavigation";

const ICO_LINK = {
  href: "https://ico.org.uk/ESDWebPages/Entry/ZB781910",
  img: "/images/links/ico.webp",
  label: "ICO",
};

export default function PresencePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let isMounted = true;

    const fetchLinks = async () => {
      try {
        const response = await fetch("https://api.staworth.com/links");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        // Transform 'link' field to 'href'
        const transformedData = data.map((item: any) => ({
          ...item,
          href: item.link
        }));
        const hasIcoLink = transformedData.some((item: any) => item.href === ICO_LINK.href);
        const linksWithIco = hasIcoLink ? transformedData : [...transformedData, ICO_LINK];
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLinks(linksWithIco);
            setLoading(false);
          }
        }, remainingTime);
      } catch (error) {
        console.error("Failed to fetch links:", error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLinks([ICO_LINK]);
            setLoading(false);
          }
        }, remainingTime);
      }
    };
    fetchLinks();

    return () => {
      isMounted = false;
    };
  }, []);

  const LINKS_PER_PAGE = 6;
  const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);

  useEffect(() => {
    const syncPageFromUrl = () => {
      const rawPage = new URLSearchParams(window.location.search).get("page");
      const parsedPage = rawPage ? Number(rawPage) : 1;
      const nextPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
      setPage(nextPage);
    };

    syncPageFromUrl();
    window.addEventListener("popstate", syncPageFromUrl);
    return () => {
      window.removeEventListener("popstate", syncPageFromUrl);
    };
  }, []);

  useEffect(() => {
    if (loading || totalPages === 0) return;
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [loading, page, totalPages]);

  useEffect(() => {
    const currentQueryPage = new URLSearchParams(window.location.search).get("page");
    const targetQueryPage = page > 1 ? String(page) : null;
    if (currentQueryPage === targetQueryPage) return;

    const params = new URLSearchParams(window.location.search);
    if (targetQueryPage) {
      params.set("page", targetQueryPage);
    } else {
      params.delete("page");
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [page, pathname, router]);

  const startIdx = (page - 1) * LINKS_PER_PAGE;
  const endIdx = startIdx + LINKS_PER_PAGE;
  const currentLinks = links.slice(startIdx, endIdx);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <SiteNavbar />
      <PageSummary
        title="Our Presence"
        description="Explore our digital footprint, and learn more about the work we do and where we do it."
      />
      {currentLinks.map((link, idx) => (
        <PresenceLink key={startIdx + idx} href={link.href} img={link.img} label={link.label} />
      ))}
      <PageNavigation page={page} totalPages={totalPages} setPage={setPage} />
      <SiteFooter />
    </>
  );
}
