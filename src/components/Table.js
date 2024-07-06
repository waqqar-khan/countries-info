import React, { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import "../App.css";

const Table = ({ columns, data }) => {
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
        <div className="TableContainer">
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.original.name}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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
