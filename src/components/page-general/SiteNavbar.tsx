"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SiteNavbar() {
    const [open, setOpen] = useState(false);
    return (
        <nav className="navbar-outer navbar-fixed">
            <div className="navbar-inner">
                <Link className="navbar-brand navbar-brand-flex" aria-current="page" href="/">
                    <Image className="navbar-title" src="/logos/Staworth_103_30_Black_Close.webp" alt="Staworth Logo" width={150} height={50} />
                </Link>
                <ul className="navbar-nav navbar-nav-flex">
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" href="/presence">Presence</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/portfolio">Portfolio</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/products">Products</Link>
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
                    <Link href="/products" className="nav-link dropdown-link" onClick={() => setOpen(false)}>Products</Link>
                </div>
            )}
        </nav>
    );
}
