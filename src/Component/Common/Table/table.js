import React, { useState } from "react";
import styles from "./table.module.css";
import { Table } from "react-bootstrap";
import AppButton from "../Buttton/button";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from "react-router-dom";
import { Button, Select, MenuItem, Checkbox, Typography, TextField } from "@mui/material";
import DropdownField from "../SelectDropDown/selectDropDown";
import { InputField } from "../InpuField/inputField";


const TableModal = ({ columns = [], title, data = [], onAddClick, searchPlaceholder = "Search...", idPrefix = "", btnTitle = '', onRowClick, onRowAction = {}, enableRowClick = false, editable = false, onSaveChanges,

}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editedRows, setEditedRows] = useState({});

  const groupOptions = [
    { label: "Group 1", value: "group 1" },
    { label: "Group 2", value: "group 2" },
    { label: "Group 3", value: "group 3" },
    { label: "OSINT", value: "OSINT" },
    { label: "CDR", value: "CDR" },
    { label: "IPDR", value: "IPDR" },
    { label: "Common", value: "Common" },
  ];

const handleGroupChange = (id, newGroup) => {
  setEditedRows((prev) => ({
    ...prev,
    [id]: {
      ...prev[id],
      group_name: newGroup,
    },
  }));
};


const handleVisibilityChange = (id, newValue) => {
  setEditedRows((prev) => ({
    ...prev,
    [id]: {
      ...prev[id],
      is_visible: newValue,
    },
  }));
};


const handleDisplayNameChange = (id, newValue) => {
  setEditedRows((prev) => ({
    ...prev,
    [id]: {
      ...prev[id],
      display_name: newValue,
    },
  }));
};


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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* {["User Dashboard", "Role Dashboard", "Connection Dashboard"].includes(title) && (
          <FaArrowLeft
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigate('/admin')}
            size={20}
          />
        )} */}
          <input
            className={styles.searchBar}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>


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
                {onRowAction && title !== "Catalogue Dashboard" && <th className={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx}
                  style={{ cursor: enableRowClick ? 'pointer' : 'default' }}
                  onClick={() => enableRowClick && onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} >
                      {col.key === "id" && idPrefix
                        ? `${idPrefix}${String(row[col.key]).padStart(4, "0")}`
                        : editable && col.key === "group_name"
                          ? (
                            // <span>shushu</span>
                           
                            <DropdownField
                              // label="Group "
                              source="Select Group"
                              value={editedRows[row.id]?.group_name || row.group_name}
                              onChange={(e) => handleGroupChange(row.id, e.target?.value)}
                              disabled={!editable}
                              required={true}
                              options={groupOptions}
                               customPadding={styles.noPadding}
                               customnWrapper={styles.customnWrapper}
                            />
                          )
                          : editable && col.key === "display_name"
                            ? (
                              <InputField
                                // label="Display Name"
                                value={editedRows[row.id]?.display_name ?? row.display_name}
                                placeholder={row.display_name}
                                onChange={(e) => handleDisplayNameChange(row.id, e.target.value)}
                                customPaddingInput={styles.noPaddingInput}
                                customnWrapper={styles.customnWrapper}
                              />
                              // <span>tpka aaaaaam</span>
                            )

                            : editable && col.key === "is_visible"
                              ? (
                                <>
                                  <Checkbox
                                    checked={
                                      editedRows[row.id]?.is_visible !== undefined
                                        ? editedRows[row.id].is_visible
                                        : row.is_visible
                                    }
                                    onChange={(e) =>
                                      handleVisibilityChange(row.id, e.target.checked)
                                    }
                                  />

                                  {(
                                    editedRows[row.id]?.is_visible !== undefined
                                      ? editedRows[row.id].is_visible
                                      : row.is_visible
                                  ) ? "Yes" : "No"}
                                </>
                              )
                              : row[col.key]}
                    </td>
                  ))}



                  {onRowAction && title !== "Catalogue Dashboard" && (
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
        {editable && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <AppButton
              variant="contained"
              color="primary"
              onClick={() => onSaveChanges(editedRows)}
              disabled={Object.keys(editedRows).length === 0}
            >
              Save All Changes
            </AppButton>
          </div>
        )}

      </div>
    </>
  );
};

export default TableModal;



