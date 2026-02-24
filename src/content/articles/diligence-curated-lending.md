---
date: 2026-02-24T12:00:00Z
title: "Due Diligence For Curated Lending Protocols"
sub_header: "Due Diligence For Curated Lending Protocols"
author: "Jack Gale"
short_description: "Lessons in DeFi risk management for curated lending protocols: the emergence of curators, the Stream Finance disaster and how to tackle due diligence."
preview_image: "../../../public/images/articles/diligence-curated-lending/cover.webp"
header_media_type: "youtube"
header_media_url: "https://www.youtube.com/embed/HxR5_UlGZws?si=9skZ2QUc60Q0ujhT"
keywords: ["Crypto Treasury Management", "DeFi Due Diligence", "Curated Lending Markets", "Stream Finance"]
tags: [ staworth, accountant quits ]
---

In November 2025, we were honoured to join the inaugural [Crypto Treasury Management Academy](https://www.theaccountantquits.com/crypto-treasury-management-academy) hosted by The Accountant Quits. We served as a guest instructor for 2 sessions on investment policy and capital allocation, highlighting everything from effective risk management to capital deployment and transparent reporting.

As we're now delivering our second cohort in February 2026, we've reflected that more materials are still needed to help treasury operators to navigate the daunting discipline of due diligence. 

In this video, we provide a deep dive into one of DeFi's hottest areas in recent years: curated lending markets. We explore the emergence of curation, how curated vaults integrate with lending markets, and the Stream Finance disaster as a case study of the risks. We aim to offer a range of guidance for effective due diligence to fasttrack your evaluation and maximise your risk-adjusted returns.

The below article is a short preview of the video's contents, for those who prefer written guidance to long-form videos.

---

## Brief History

Curated lending markets emerged as a response to early DeFi’s governance bottlenecks. 

The first wave of DeFi's lending protocols saw protocols like Aave and Compound launching pooled lending markets governed primarily by DAOs or other decentralised organisations. Those organisations are collectives of external tokenholders who fully governed the protocol, including the configuration of each lending market. 

Though decentralisation was initially attractive, over time this structure resulted in political alignment becoming the biggest challenge for effective lending markets, not technical execution. Decision‑making was often slow and reactive. Interoperability concentrated risk across interconnected systems. And after a broad market downturn in 2022, the limits of tokenholder participation were exposed, and caused doubts about how *“decentralised”* these markets really were.

The Ethereum developer community’s answer was to reduce protocol governance over markets and introduce a new specialist role: the curator. Projects like Morpho Blue and Euler V2 shifted towards externally managed, isolated markets. Tokenholders still *"govern"* the base protocol, but curators configure markets and manage risk directly.

This was a clear tradeoff. Users avoid the inefficiency of governance, but inherit counterparty risks tied to curators and their borrowers. The curator becomes the primary operator, and accountability concentrates. But whilst some felt that curated markets were a clear step forward, many seem to have missed or ignored the obvious risks of more-centralised management.

## Understanding Curated Lending

To understand how curated lending protocols work, we need to understand the addition of lending vaults: 

Instead of depositing into a single market, lenders deposit into a vault that handles the supply of the same asset across multiple different markets. A depositor might provide USDC, while borrowers post collateral such as BTC, ETH and other native digital assets in separate markets. Ultimately, the curator manages the vault by choosing which market it's exposed to and updating its allocations over time. 

The process can sound deceptively simple. In practice, it commands professional‑grade risk management to monitor market health and exposure, while continually updating allocations. Small mistakes in configuration can have very real consequences.

In a lending vault, exposure is primarily to borrower collateral. If a curator of a USDC vault allocates heavily to several different BTC‑collateral markets, then USDC depositors are effectively exposed to BTC price movements through liquidation risk. Their USDC has been taken in exchange for the BTC collateral deposits, and the user and curator have effectively no control over the deposited assets, only the BTC collateral.

However, the interfaces of curated lending protocols rarely make those consequences obvious. The interfaces typically emphasise objective numbers like yield and size, rather than subjective commentary on strategies and performance. The concept of exposure is represented a mixture of different markets with values and percentage allocations; but nowhere does it explain what *“exposure”* means in practice. The onus is on the users to understand what collateral assets backstop their deposits.

For more exotic or higher-yield products, the protocol interfaces often display dozens of different markets being adjusted many times each day, including new market additions. Curators can completely change the underlying balance of markets and collateral assets of the vault overnight without warning. Keeping up with their progress can be a full-time pursuit. 

## Lessons In Due Diligence

Proper diligence goes well beyond platform selection. It must assess underlying markets, collateral types, oracles, and the health of loan books. It must also account for change, because allocations can move daily and loan health can deteriorate quickly. That context matters because curated lending markets are now large enough to create systemic shocks. 

A 2025 case study illustrates the pitfalls of poor due diligence: 

Stream Finance was the issuer of the yield‑bearing stablecoin xUSD. On 4 November, Stream announced that an external fund manager had lost $93 million of user assets and that legal proceedings would begin. It later emerged that Stream deployed funds into centralised exchange accounts with opaque external managers. The protocol relied on leverage and hard‑coded oracles, while offering minimal transparency about strategies or reserves. The headline product was a stablecoin, but the underlying exposure was not.

Behind the scenes, Stream relied heavily on looping systems to inflate token supply and generate artificial yield. It would mint its own xUSD and borrow against it via Morpho's curated lending markets. It also partnered with other stablecoin issuers to recursively mint each other’s tokens, then borrowed against those positions, increasing leverage across the system. In one Morpho xUSD market, Stream was the sole borrower.

As xUSD depegged, curated vaults with exposure to Stream suffered cascading losses. xUSD depositors had no incentive to take back their flimsy collateral, and user funds vanished into the night. Later it transpired that several leading curators had rejected Stream due to obvious pitfalls in due diligence. A selection of other large curators had not been so effective, and their users suffered large losses. The incident showed how even experienced curators may be missing critical red flags.

The Stream case reinforced that curated markets are a tradeoff: more efficiency for more exposure to counterparty risks. As lending markets become increasingly complicated, their risk profiles can become increasingly opaque and difficult to understand. Free, public interfaces rarely explain the full risk profile of curated products, or remind users about the trust assumptions in place. Users need to understand that yield is backed by borrower collateral, not by the asset they deposit.

---

**Key Takeaways**

* Curated lending markets avoid the inefficiency of DAO-configured protocols, but as a tradeoff for greater counterparty risk with borrowers and curators.

* The web applications and interfaces of lending protocols only provide you with so much information, and won't tell you if a market has lots of unhealthy loans or its oracle is hard-coded.

* The curator controls your exposure; they are constantly updating their allocations and chosen markets, meaning the risk profile of each product can be extremely dynamic.

* Curator vaults expose users to all the collateral assets being deposited into the curated markets. Your yield source is not backed by your deposit asset; it’s backed by the borrower’s collateral.

* After user deposited assets have been borrowed through a market, the user and the curator have no control over what happens to those assets, only the collateral they gave in exchange.

* Just because a product is curated does not mean it’s properly diligenced. Invariably, there are trust assumptions involved in having professional curators allocate user deposits into lending markets.

---

> This blog is a companion piece to sessions taught on The Accountant Quits' [Crypto Treasury Management Academy](https://www.theaccountantquits.com/crypto-treasury-management-academy). To learn more about this and related topics for treasury management, consider signing up to a future cohort [here](https://app.theaccountantquits.com/plans/1919212).
