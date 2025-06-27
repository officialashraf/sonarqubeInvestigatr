// A full screen reusable styled component for a data table screen with dark theme
// Sort icons included, modular, responsive, and customizable

import React, { useState } from "react";
import styles from "./table.module.css";
import { Table, InputGroup, FormControl } from "react-bootstrap";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import AppButton from "../Buttton/button";

const TableModal = ({ columns = [], data = [],  searchPlaceholder = "Search...",idPrefix = "",btnTitle='' }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? ' ↑' : ' ↓';
      
    }
   return '↓↑';
  };

  const filteredData = data
    .filter((row) =>
      columns.some((col) =>
        String(row[col.key] || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = (a[sortConfig.key] || "").toString().toLowerCase();
      const bVal = (b[sortConfig.key] || "").toString().toLowerCase();
      return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  return (
    <>
          <div className={styles.header}>
             
          <input
          className={styles.searchBar}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
    
        <AppButton children={btnTitle}/>
      </div>
      <div className={styles.tableWrapper}>
        <Table  hover responsive size="sm" className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)} className={styles.th}>
  <div className={styles.thContent}>
<span>{col.label}</span>
  <span>{renderSortIcon(col.key)}</span>
  </div>
</th>

              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}> {col.key === "id" && idPrefix
                      ? `${idPrefix}${String(row[col.key]).padStart(4, "0")}`
                      : row[col.key]}
                      </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
   </>
  );
};

export default TableModal;
