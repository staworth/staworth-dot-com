# Staworth Website

The official website for Staworth, a digital organization focused on governance and community involvement. This is a Next.js-based web application that showcases portfolio information, publications, and organizational presence.

## 🌐 Live Site

Visit [staworth.com](https://staworth.com) or [staworth.org](https://staworth.org) to see the live application.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)

## ✨ Features

- **Portfolio Dashboard**: Display digital asset holdings with real-time valuations
- **Articles Showcase**: Browse articles and contributions across the organization
- **Presence Links**: Links to community platforms and engagement channels
- **Responsive Design**: Fully responsive design for desktop and mobile devices
- **Loading Animations**: Smooth loading states with animated loader
- **Page Navigation**: Multi-page article navigation with configurable items per page

## 🔧 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.1.1 - React framework for production
- **Runtime**: Node.js with TypeScript support
- **Styling**: CSS (Global styles in `styles/globals.css`)
- **State Management**: React hooks (useState, useEffect)
- **Package Manager**: pnpm 10.27.0

## 📁 Project Structure

```
staworth-dot-com/
├── app/                          # Next.js app directory (routes)
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Home page
│   ├── articles/                # Articles page
│   ├── loading/                 # Loading page
│   ├── portfolio/               # Portfolio page
│   ├── products/                # Redirects to /articles
│   └── presence/                # Presence/links page
├── src/
│   ├── components/
│   │   ├── page-general/        # Shared components
│   │   │   ├── Loader.tsx       # Loading animation component
│   │   │   ├── PageNavigation.tsx
│   │   │   ├── PageSummary.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   └── SiteNavbar.tsx
│   │   └── page-specific/       # Page-specific components
│   │       ├── Article.tsx
│   │       ├── AssetsTable.tsx
│   │       ├── AssetTableRow.tsx
│   │       └── PresenceLink.tsx
│   ├── hooks/
│   │   └── useLoadingAnimation.ts
│   └── (no data files - now API-driven)
├── public/                       # Static assets
│   ├── images/
│   └── logos/
├── styles/
│   └── globals.css              # Global styles
├── package.json                  # Dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- pnpm 10.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Staworth/staworth-dot-com.git
cd staworth-dot-com
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start development server with Turbopack on port 3000 |
| `pnpm build` | Build application for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Next.js linting |

## 📦 Dependencies

### Production Dependencies

| Package | Version | Description |
| ------- | ------- | ----------- |
| `next` | ^16.1.1 | React framework for production with SSR and static generation |
| `react` | ^19.2.3 | JavaScript library for building user interfaces |
| `react-dom` | ^19.2.3 | React package for DOM rendering |

### Development Dependencies

| Package | Version | Description |
| ------- | ------- | ----------- |
| `@types/react` | ^19.2.7 | TypeScript type definitions for React |

## 🎨 Styling

Global styles are defined in `styles/globals.css`. The design uses:

- **Color Scheme**: Dark theme with black background, white text
- **Accent Color**: Green (`#03a70b`)
- **Typography**: Arial, Helvetica, sans-serif

Key style classes:
- `.portfolio-page` - Portfolio page container
- `.portfolio-card` - Content card styling
- `.asset-table` - Asset table layout
- `.navbar-fixed` - Fixed navigation bar
- `.link-preview` - Presence link styling

## 🔄 Data Flow

### Portfolio Page
1. Page loads as client component
2. Fetch portfolio data from API
3. Show loader for minimum 800ms
4. Map data to configured token list
5. Render assets with balances and values

### Articles Page
1. Similar loading flow with 800ms minimum
2. Fetch articles from API
3. Paginate articles (5 per page)
4. Render article cards with navigation
5. Accessible via /articles or /products (redirects)

## 🛠️ Development Notes

- **Next.js Version**: 16.1.1 with Turbopack for faster builds
- **Client Components**: Portfolio and articles pages use `"use client"` directive for interactivity
- **Loading States**: Consistent 800ms minimum loading time across pages for UX consistency
- **No Build-Time Data Fetching**: All data is fetched at runtime from the API
- **Route Redirect**: /products redirects to /articles for backward compatibility

## 👤 Author

[jackgale.eth](https://github.com/iamjackgale)
