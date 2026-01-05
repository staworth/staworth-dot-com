import React from "react";
import Image from "next/image";

export interface AssetRowProps {
  img: string;
  name: string;
  nameUrl?: string;
  thesisUrl?: string;
  delegateUrl?: string;
  balance: number | string;
  value: number;
}

export default function AssetTableRow({
  img,
  name,
  nameUrl,
  thesisUrl,
  delegateUrl,
  balance,
  value,
}: AssetRowProps) {
  return (
    <tr className="asset-table-row">
      <td className="asset-table-cell asset-table-cell-logo">
        {img && (
          <Image
            src={img}
            alt={name}
            width={50}
            height={50}
            className="asset-table-logo-img"
          />
        )}
      </td>
      <td className="asset-table-cell asset-table-cell-name">
        {nameUrl ? <a href={nameUrl}>{name}</a> : name}
      </td>
      <td className="asset-table-cell asset-table-cell-value">
        ${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="asset-table-cell asset-table-cell-balance">
        {typeof balance === 'number' ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : balance}
      </td>
      <td className="asset-table-cell asset-table-cell-publications asset-table-publications">
        {thesisUrl && <a href={thesisUrl}>Thesis</a>}
        {delegateUrl && <a href={delegateUrl}>Platform</a>}
      </td>
    </tr>
  );
}
