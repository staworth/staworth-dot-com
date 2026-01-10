"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SiteNavbar() {
    const [open, setOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    return (
        <nav className="navbar-outer navbar-fixed">
            <div className="navbar-inner">
                <Link className="navbar-brand navbar-brand-flex" aria-current="page" href="/">
                    <Image className="navbar-title" src="/logos/Staworth_103_30_Black_Close.webp" alt="Staworth Logo" width={412} height={120} quality={100}/>
                </Link>
                <ul className="navbar-nav navbar-nav-flex">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" href="/presence">Presence</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/portfolio">Portfolio</Link>
                    </li>
                    <li className="nav-item products-dropdown-container">
                        <button
                            className="nav-link products-dropdown-button"
                            onClick={() => setProductsOpen((prev) => !prev)}
                        >
                            Products
                        </button>
                        {productsOpen && (
                            <div className="products-dropdown">
                                <Link href="/articles" className="nav-link dropdown-link" onClick={() => setProductsOpen(false)}>Articles</Link>
                                <a href="https://beefy.staworth.com/" className="nav-link dropdown-link" onClick={() => setProductsOpen(false)}>Beefy</a>
                            </div>
                        )}
                    </li>
                </ul>
                <button
                    className="navbar-toggler navbar-toggler-custom"
                    type="button"
                    aria-label="Toggle navigation"
                    onClick={() => setOpen((prev) => !prev)}
                >
                    <span className="navbar-toggler-icon">
                        <span className="navbar-toggler-bar"></span>
                        <span className="navbar-toggler-bar"></span>
                        <span className="navbar-toggler-bar"></span>
                    </span>
                </button>
            </div>
            {/* Mobile Dropdown */}
            {open && (
                <div className="navbar-dropdown">
                    <Link href="/presence" className="nav-link dropdown-link" onClick={() => setOpen(false)}>Presence</Link>
                    <Link href="/portfolio" className="nav-link dropdown-link" onClick={() => setOpen(false)}>Portfolio</Link>
                    <button
                        className="nav-link dropdown-link products-mobile-button"
                        onClick={() => setProductsOpen((prev) => !prev)}
                    >
                        <span>Products</span>
                        <span className={`products-arrow ${productsOpen ? 'open' : ''}`}>▼</span>
                    </button>
                    {productsOpen && (
                        <div className="products-mobile-nested">
                            <Link href="/articles" className="nav-link dropdown-link" onClick={() => { setOpen(false); setProductsOpen(false); }}>Articles</Link>
                            <a href="https://beefy.staworth.com/" className="nav-link dropdown-link" onClick={() => { setOpen(false); setProductsOpen(false); }}>Beefy</a>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
