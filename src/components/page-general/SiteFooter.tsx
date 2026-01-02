import React from "react";

export default function SiteFooter() {
  return (
    <footer className="footer" style={{
      position: "fixed",
      left: 0,
      bottom: 0,
      width: "100%",
      backgroundColor: "black",
      color: "white",
      textAlign: "right",
      padding: "10px 0 10px 0",
      zIndex: 3,
    }}>
      <span style={{ fontSize: 12, marginRight: 10 }}>
        Copyright &copy; {new Date().getFullYear()} Staworth Limited.
      </span>
    </footer>
  );
}
