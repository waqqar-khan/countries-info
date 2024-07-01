import React, { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Pagination from "./Pagination";

const Table = ({ columns, data}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextPaginationState = updater({ pageIndex, pageSize });
        setPageIndex(nextPaginationState.pageIndex);
        setPageSize(nextPaginationState.pageSize);
      } else {
        if (updater.pageIndex !== undefined) setPageIndex(updater.pageIndex);
        if (updater.pageSize !== undefined) setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ padding: '10px', margin: '10px', border: '1px solid #ddd' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.original.name} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination table={table} />
    </div>
  );
};

export default Table;
