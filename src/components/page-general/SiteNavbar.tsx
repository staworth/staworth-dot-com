"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SiteNavbar() {
    const [open, setOpen] = useState(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [presenceOpen, setPresenceOpen] = useState(false);
    return (
        <nav className="navbar-outer navbar-fixed">
            <div className="navbar-inner">
                <Link className="navbar-brand navbar-brand-flex" aria-current="page" href="/">
                    <Image className="navbar-title" src="/logos/Staworth_103_30_Black_Close.webp" alt="Staworth Logo" width={412} height={120} quality={100}/>
                </Link>
                <ul className="navbar-nav navbar-nav-flex">
                    <li className="nav-item products-dropdown-container">
                        <button
                            className="nav-link products-dropdown-button"
                            onClick={() => {
                                setPresenceOpen((prev) => !prev);
                                setProductsOpen(false);
                            }}
                        >
                            Presence
                        </button>
                        {presenceOpen && (
                            <div className="products-dropdown">
                                <Link href="/presence" className="nav-link dropdown-link" onClick={() => setPresenceOpen(false)}>Links</Link>
                                <Link href="/contact" className="nav-link dropdown-link" onClick={() => setPresenceOpen(false)}>Contact</Link>
                            </div>
                        )}
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/portfolio">Portfolio</Link>
                    </li>
                    <li className="nav-item products-dropdown-container">
                        <button
                            className="nav-link products-dropdown-button"
                            onClick={() => {
                                setProductsOpen((prev) => !prev);
                                setPresenceOpen(false);
                            }}
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
                    <button
                        className="nav-link dropdown-link products-mobile-button"
                        onClick={() => {
                            setPresenceOpen((prev) => !prev);
                            setProductsOpen(false);
                        }}
                    >
                        <span>Presence</span>
                        <span className={`products-arrow ${presenceOpen ? 'open' : ''}`}>▼</span>
                    </button>
                    {presenceOpen && (
                        <div className="products-mobile-nested">
                            <Link href="/presence" className="nav-link dropdown-link" onClick={() => { setOpen(false); setPresenceOpen(false); }}>Links</Link>
                            <Link href="/contact" className="nav-link dropdown-link" onClick={() => { setOpen(false); setPresenceOpen(false); }}>Contact</Link>
                        </div>
                    )}
                    <Link href="/portfolio" className="nav-link dropdown-link" onClick={() => setOpen(false)}>Portfolio</Link>
                    <button
                        className="nav-link dropdown-link products-mobile-button"
                        onClick={() => {
                            setProductsOpen((prev) => !prev);
                            setPresenceOpen(false);
                        }}
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
