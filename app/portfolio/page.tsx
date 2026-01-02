"use client";
import React, { useState, useEffect } from "react";
import AssetTableRow from "../../src/components/page-specific/AssetTableRow";

import SiteNavbar from "../../src/components/page-general/SiteNavbar";
import SiteFooter from "../../src/components/page-general/SiteFooter";
import PageSummary from "../../src/components/page-general/PageSummary";
import AssetsTable from "../../src/components/page-specific/AssetsTable";
import Loader from "../../src/components/page-general/Loader";

// Constants for table data configuration
const GOVERNANCE_TOKENS_CONFIG = [
  {
    key: "bifi",
    img: "/images/portfolio/bifi-token.png",
    name: "Beefy",
    nameUrl: "https://beefy.com/",
    thesisUrl: "",
    delegateUrl: "",
    balanceUrl: "https://optimistic.etherscan.io/token/0x57d00d036485b5fee6a58c8763bdc358906e6d19?a=0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
    valueUrl: "https://debank.com/profile/0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
  },
  {
    key: "gno",
    img: "/images/portfolio/gno-token.png",
    name: "Gnosis",
    nameUrl: "https://www.gnosis.io/",
    thesisUrl: "",
    delegateUrl: "https://forum.gnosis.io/t/staworth-jackgale-eth-delegate-platform/8770",
    balanceUrl: "https://etherscan.io/token/0x6810e776880c02933d47db1b9fc05908e5386b96?a=0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
    valueUrl: "https://debank.com/profile/0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
  },
];

const OTHER_ASSETS_CONFIG = [
  {
    key: "eth",
    img: "/images/portfolio/eth-token.png",
    name: "Ether",
    nameUrl: "",
    thesisUrl: "",
    delegateUrl: "",
    balanceUrl: "https://debank.com/profile/0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
    valueUrl: "https://debank.com/profile/0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e",
  },
];

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

  // Map config to rows with actual data
  const governanceTokensRows = GOVERNANCE_TOKENS_CONFIG.map(config => ({
    ...config,
    balance: data[config.key].balance,
    value: data[config.key].value,
  }));

  const otherAssetsRows = OTHER_ASSETS_CONFIG.map(config => ({
    ...config,
    balance: data[config.key].balance,
    value: data[config.key].value,
  }));

  return (
    <div className="portfolio-page">
      <SiteNavbar />
      <PageSummary 
        title="Our Portfolio"
        description="Check out the digital communities that we serve and invest in. See transparently what financial interests Staworth holds."
      />
      <section className="portfolio-section">
        <div className="portfolio-card">
          <p className="portfolio-card-title">Governance Tokens</p>
          <div className="portfolio-card-inner">
            <AssetsTable rows={governanceTokensRows} />
          </div>
        </div>

        <div className="portfolio-card">
          <p className="portfolio-card-title">Other Assets</p>
          <div className="portfolio-card-inner">
            <AssetsTable rows={otherAssetsRows} />
          </div>
        </div>

        <div className="portfolio-card">
          <p className="portfolio-card-title">Total</p>
            <div className="portfolio-card-inner">
              <table className="asset-table asset-table-total">
                <tbody>
                  <AssetTableRow
                    img="/logos/Staworth_1_1_Black.png"
                    name="Portfolio"
                    balance=""
                    balanceUrl={undefined}
                    thesisUrl={undefined}
                    delegateUrl={undefined}
                    value={data.total.value}
                    valueUrl="https://debank.com/profile/0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e"
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