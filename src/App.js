import React, { useEffect, useState } from "react";
import { fetchCountries } from "./Utils/api";
import Table from "./components/Table";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

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
          className="table-image"
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
          className="table-image"
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
    if (search || populationFilter) {
      setSearch("");
      setPopulationFilter("");
      setFilteredData(data)
      setInitialLoad(false)
    }
  };

  const showAllCountries = () => {
    setFilteredData(data);
    setInitialLoad(false);
  };

  return (
    <div className="App">
      <h1>Countries Info</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Country Name"
          value={search}
          maxLength={20}
          onChange={handleSearch}
          className="filter-input"
        />
        <select
          value={populationFilter}
          onChange={handlePopulationFilter}
          className="filter-select"
        >
          <option value="">Population</option>
          <option value="1000000">&lt; 1M</option>
          <option value="5000000">&lt; 5M</option>
          <option value="10000000">&lt; 10M</option>
        </select>
        <button onClick={clearFilter} className="filters-button clear">
          Clear
        </button>
        <button onClick={showAllCountries} className="filters-button show-all">
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
