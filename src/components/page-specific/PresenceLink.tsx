import React from "react";
import Image from "next/image";

interface PresenceLinkProps {
  href: string;
  img: string;
  label: string;
}

export default function PresenceLink({ href, img, label }: PresenceLinkProps) {
  return (
    <a className="link-preview" href={href} target="_blank" rel="noopener noreferrer">
      <div className="link-row">
        <div className="link-column">
          <Image className="link-image" src={img} alt={label} width={40} height={40} />
        </div>
        <div className="link-column">
          <p className="link-header">{label}</p>
        </div>
      </div>
    </a>
  );
}
