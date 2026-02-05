"use client";
import React, { useState, useEffect } from "react";
import AssetTableRow from "../../src/components/page-specific/AssetTableRow";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import AssetsTable from "../../src/components/page-specific/AssetsTable";
import Loader from "../../src/components/page-general/Loader";

// Configuration for delegate platforms (not provided by API)
const DELEGATE_PLATFORMS: Record<string, string> = {
  gno: "https://forum.gnosis.io/t/staworth-jackgale-eth-delegate-platform/8770",
};

export default function PortfolioPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    let isMounted = true;

    const fetchPortfolioData = async () => {
      try {
        const response = await fetch("https://api.staworth.com/portfolio");
        const portfolioData = await response.json();
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setData(portfolioData);
            setLoading(false);
          }
        }, remainingTime);
      } catch (error) {
        console.error("Failed to fetch portfolio:", error);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);

        setTimeout(() => {
          if (isMounted) {
            setLoading(false);
          }
        }, remainingTime);
      }
    };

    fetchPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !data) {
    return <Loader />;
  }

  // Categorize positions by type
  const governanceTokensRows: any[] = [];
  const defiPositionsRows: any[] = [];
  const coreAssetsRows: any[] = [];

  Object.entries(data.positions).forEach(([key, position]: [string, any]) => {
    const normalizedKey = key.toLowerCase();
    const normalizedName = (position.name || "").toLowerCase();
    const isXdai = normalizedKey === "xdai" || normalizedName === "xdai";
    const isEth = normalizedKey === "eth" || normalizedName === "ethereum" || normalizedName === "eth";

    const displayName = isXdai ? "Savings xDAI" : isEth ? "ETH" : (position.name || key);

    const row = {
      key,
      img: position.img || "/logos/Staworth_1_1_Black.webp",
      name: displayName,
      nameUrl: position.url || "",
      thesisUrl: "",
      delegateUrl: DELEGATE_PLATFORMS[key] || "",
      balance: position.balance,
      value: position.value,
    };

    if (position.type === 'governance') {
      governanceTokensRows.push(row);
    } else if (position.type === 'defi') {
      defiPositionsRows.push(row);
    } else {
      coreAssetsRows.push(row);
    }
  });

  // Sort rows by value (descending)
  [governanceTokensRows, defiPositionsRows, coreAssetsRows].forEach(rows => {
    rows.sort((a, b) => b.value - a.value);
  });

  return (
    <div className="portfolio-page">
      <SiteNavbar />
      <PageSummary 
        title="Our Portfolio"
        description="Explore the interests we hold and the businesses and assets we invest in with full transparency."
      />
      <section className="portfolio-section">
        <div className="portfolio-card">
          <p className="portfolio-card-title">Governance Tokens</p>
          <div className="portfolio-card-inner">
            <AssetsTable rows={governanceTokensRows} />
          </div>
        </div>

        <div className="portfolio-card">
          <p className="portfolio-card-title">DeFi Positions</p>
          <div className="portfolio-card-inner">
            <AssetsTable rows={defiPositionsRows} />
          </div>
        </div>

        <div className="portfolio-card">
          <p className="portfolio-card-title">Core Assets</p>
          <div className="portfolio-card-inner">
            <AssetsTable rows={coreAssetsRows} />
          </div>
        </div>

        <div className="portfolio-card">
          <p className="portfolio-card-title">Total</p>
            <div className="portfolio-card-inner">
              <table className="asset-table asset-table-total">
                <tbody>
                  <AssetTableRow
                    img="/logos/Staworth_1_1_Black.webp"
                    name="Portfolio"
                    balance=""
                    thesisUrl={undefined}
                    delegateUrl={undefined}
                    value={data.total.value}
                  />
                </tbody>
              </table>
            </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
