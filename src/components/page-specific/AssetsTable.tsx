import React from "react";
import AssetTableRow, { AssetRowProps } from "./AssetTableRow";

interface AssetsTableProps {
  rows: AssetRowProps[];
}

export default function AssetsTable({ rows }: AssetsTableProps) {
  return (
    <table className="asset-table">
      <thead>
        <tr className="asset-table-row asset-table-row-head">
          <th className="asset-table-cell asset-table-cell-logo" />
          <th className="asset-table-cell asset-table-cell-name">Name</th>
          <th className="asset-table-cell asset-table-cell-value">Value</th>
          <th className="asset-table-cell asset-table-cell-balance">Balance</th>
          <th className="asset-table-cell asset-table-cell-publications">Links</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <AssetTableRow key={index} img={row.img} name={row.name} nameUrl={row.nameUrl} thesisUrl={row.thesisUrl} delegateUrl={row.delegateUrl} balance={row.balance} value={row.value} />
        ))}
      </tbody>
    </table>
  );
}
