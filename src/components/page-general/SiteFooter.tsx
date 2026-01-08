import React from "react";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <span style={{ fontSize: 12, marginRight: 10 }}>
        Copyright &copy; {new Date().getFullYear()} Staworth Limited.
      </span>
    </footer>
  );
}
