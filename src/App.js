import React, { useEffect, useState } from "react";
import { fetchCountries } from "./Utils/api";
import Table from "./components/Table";
import ErrorBoundary from "./components/ErrorBoundary";
const { createColumnHelper } = require("@tanstack/react-table");
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("name", {
    header: "Country Name",
    cell: (info) => info.getValue() || "NA",
  }),
  columnHelper.accessor("abbreviation", {
    header: "Country Code",
    cell: (info) => info.getValue() || "NA",
  }),
  columnHelper.accessor("capital", {
    header: "Capital",
    cell: (info) => info.getValue() || "NA",
  }),
  columnHelper.accessor("phone", {
    header: "Phone Code",
    cell: (info) => info.getValue() || "NA",
  }),
  columnHelper.accessor("population", {
    header: "Population",
    cell: (info) => (info.getValue() ? info.getValue().toLocaleString() : "NA"),
  }),
  columnHelper.accessor("media.flag", {
    header: "Flag",
    cell: (info) =>
      info.getValue() ? (
        <img
          src={info.getValue()}
          alt={`${info.row.original.name} Flag`}
          style={{ width: "50px", height: "auto" }}
        />
      ) : (
        "NA"
      ),
  }),
  columnHelper.accessor("media.emblem", {
    header: "Emblem",
    cell: (info) =>
      info.getValue() ? (
        <img
          src={info.getValue()}
          alt={`${info.row.original.name} Emblem`}
          style={{ width: "50px", height: "auto" }}
        />
      ) : (
        "NA"
      ),
  }),
];

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [populationFilter, setPopulationFilter] = useState("");
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const countries = await fetchCountries();
      setData(countries);
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterData(value, populationFilter);
  };

  const handlePopulationFilter = (e) => {
    const value = e.target.value;
    setPopulationFilter(value);
    filterData(search, value);
  };

  const filterData = (searchTerm, populationRange) => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (populationRange) {
      const maxPopulation = parseInt(populationRange);
      filtered = filtered.filter(
        (item) => item.population && item.population < maxPopulation
      );
    }

    setFilteredData(filtered);
    setInitialLoad(false);
  };

  const clearFilter = () => {
    setSearch("");
    setPopulationFilter("");
    setFilteredData(data);
    setInitialLoad(false);
  };

  const showAllCountries = () => {
    setFilteredData(data);
    setInitialLoad(false);
  };

  return (
    <div className="App" style={{ margin: "2% 4%" }}>
      <h1 style={{ textAlign: "left" }}>Countries Info</h1>
      <div
        className="filters"
        style={{
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "10px 0 10px 0",
        }}
      >
        <input
          type="text"
          placeholder="Country Name"
          value={search}
          maxLength={20}
          onChange={handleSearch}
          style={{
            padding: "10px",
            marginRight: "10px",
            placeholderColor: "gray",
            color: "#000",
            cursor: "text",
            outlineColor: "#6907f3",
          }}
        />
        <select
          value={populationFilter}
          onChange={handlePopulationFilter}
          style={{ padding: "10px", marginRight: "10px", cursor: "pointer" }}
        >
          <option value="">Population</option>
          <option value="1000000">&lt; 1M</option>
          <option value="5000000">&lt; 5M</option>
          <option value="10000000">&lt; 10M</option>
        </select>
        <button
          onClick={clearFilter}
          style={{
            textDecoration: "underline",
            textDecorationColor: "gray",
            border: "none",
            background: "none",
            color: "#6907f3",
            padding: "10px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          onClick={showAllCountries}
          style={{
            background: "#6907f2",
            color: "#FFF",
            border: "2px solid #6907f3",
            borderRadius: "5px",
            marginLeft: "auto",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Show all Countries
        </button>
      </div>
      <ErrorBoundary>
        {initialLoad ? (
          <div></div>
        ) : filteredData.length === 0 ? (
          <div>No results found</div>
        ) : (
          <Table columns={columns} data={filteredData} />
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
