"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import Loader from "../../src/components/page-general/Loader";

import PresenceLink from "../../src/components/page-specific/PresenceLink";
import PageNavigation from "../../src/components/page-general/PageNavigation";

export default function PresencePage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLinks(transformedData);
            setLoading(false);
          }
        }, remainingTime);
      } catch (error) {
        console.error("Failed to fetch links:", error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
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
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(links.length / LINKS_PER_PAGE);
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
