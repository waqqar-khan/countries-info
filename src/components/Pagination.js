import React from "react";

const Pagination = ({ table }) => {
  return (
    <div className="pagination" style={{ margin: "2% 4%", textAlign: "left", display: "flex" }}>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        style={{ cursor: table.getCanPreviousPage() ? "pointer" : "not-allowed" }}
      >
        Previous
      </button>
      <span>
        Page{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        style={{ cursor: table.getCanNextPage() ? "pointer" : "not-allowed" }}
      >
        Next
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        style={{ marginLeft: "auto", cursor: "pointer" }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pagination;
