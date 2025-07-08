import React, { useState } from "react";
import styles from "./table.module.css";
import { Table } from "react-bootstrap";
import AppButton from "../Buttton/button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockResetIcon from '@mui/icons-material/LockReset';


const TableModal = ({ columns = [], data = [], onAddClick, searchPlaceholder = "Search...", idPrefix = "", btnTitle = '', onRowClick, onRowAction = {}, enableRowClick = false,

}) => {
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

        <AppButton onClick={() => onAddClick && onAddClick()} children={btnTitle} />
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <Table hover className={styles.table}>
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
                {onRowAction && <th className={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx}
                  style={{ cursor: enableRowClick ? 'pointer' : 'default' }}
                  onClick={() => enableRowClick && onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === "id" && idPrefix
                        ? `${idPrefix}${String(row[col.key]).padStart(4, "0")}`
                        : (col.key === "watchers" || col.key === "synonyms")
                          ? Array.isArray(row[col.key])
                            ? row[col.key].join(", ")
                            : row[col.key]
                          : row[col.key]}
                    </td>
                  ))}

                  {onRowAction && (
                    <td className={styles.actionCol}>
                      <EditIcon
                        className={styles.iconEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowAction.edit && onRowAction.edit(row);
                        }}
                        titleAccess="Edit"
                      />
                      <DeleteIcon
                        className={styles.iconDelete}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowAction.delete && onRowAction.delete(row);
                        }}
                        titleAccess="Delete"
                      />
                      <VisibilityIcon
                        className={styles.iconEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowAction.details && onRowAction.details(row);
                        }}
                        titleAccess="Details"
                      />
                      {onRowAction.assign && (
                        <AssignmentIndIcon
                          className={styles.iconEdit}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowAction.assign(row);
                          }}
                          titleAccess="Assign Permission"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                      {onRowAction.reset && (
                        <LockResetIcon
                          className={styles.iconEdit}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowAction.reset(row);
                          }}
                          titleAccess="Reset Password"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default TableModal;



