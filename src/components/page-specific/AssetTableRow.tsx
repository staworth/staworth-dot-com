import React from "react";
import Image from "next/image";

export interface AssetRowProps {
  img: string;
  name: string;
  nameUrl?: string;
  thesisUrl?: string;
  delegateUrl?: string;
  balance: number | string;
  balanceUrl?: string;
  value: number;
  valueUrl?: string;
}

export default function AssetTableRow({
  img,
  name,
  nameUrl,
  thesisUrl,
  delegateUrl,
  balance,
  balanceUrl,
  value,
  valueUrl,
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
      <td className="asset-table-cell asset-table-cell-publications asset-table-publications">
        {thesisUrl && <a href={thesisUrl}>Thesis</a>}
        {delegateUrl && <a href={delegateUrl}>Platform</a>}
      </td>
      <td className="asset-table-cell asset-table-cell-balance">
        {balanceUrl ? <a href={balanceUrl}>{balance}</a> : balance}
      </td>
      <td className="asset-table-cell asset-table-cell-value">
        {valueUrl ? <a href={valueUrl}>${Number(value).toLocaleString()}</a> : `$${Number(value).toLocaleString()}`}
      </td>
    </tr>
  );
}
