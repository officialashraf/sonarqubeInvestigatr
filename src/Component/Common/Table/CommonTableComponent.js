import React from "react";
import { Table, Pagination } from "react-bootstrap";
import style from "../../Modules/Analyze/TabularData/caseTableData.module.css";
import Loader from "../../Modules/Layout/loader";
import styles from "./table.module.css";

const CommonTableComponent = ({
    // Data props
    data = [],
    headers = [],
    loading = false,
    error = null,

    // Pagination props
    currentPage = 1,
    totalPages = 1,
    totalResults = 0,
    handlePageChange = () => { },

    // Column mapping props (for TabulerData)
    columnMapping = [],
    useColumnMapping = false,

    // Color/styling props
    groupColors = {},
    getGroupColor = () => "#f0f0f0",
    showGroupHeaders = false,

    // Custom props
    noDataMessage = "No data available",
    containerStyle = {},
    tableWrapperStyle = {},

    // Special rendering props
    specialColumns = ["targets", "person", "gpe", "unified_case_id", "org", "loc", "socialmedia_hashtags"],
    tagStyle = {
        backgroundColor: "#FFC107",
        color: "#000",
        padding: "2px 6px",
        borderRadius: "12px",
        fontSize: "11px",
        whiteSpace: "nowrap"
    }
}) => {

    // Process headers for display names and grouping
    const processedHeaders = headers.map((header) => {
        const mapping = columnMapping.find((col) => col.column_name === header);
        return {
            key: header,
            displayName: useColumnMapping && mapping?.display_name
                ? mapping.display_name
                : header.split("_").map((word) =>
                    word === word.toUpperCase()
                        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        : word.charAt(0).toUpperCase() + word.slice(1)
                ).join(" "),
            groupName: useColumnMapping && mapping?.group_name ? mapping.group_name : "Others"
        };
    });

    // Create pagination items
    const createPaginationItems = () => {
        const pages = [];

        // For simple pagination (like CriteriaCaseTable)
        if (!useColumnMapping) {
            // Always add first page
            pages.push(
                <Pagination.Item
                    key={1}
                    active={1 === currentPage}
                    onClick={() => handlePageChange(1)}
                    disabled={loading}
                >
                    1
                </Pagination.Item>
            );

            // Add pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(
                        <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => handlePageChange(i)}
                            disabled={loading}
                        >
                            {i}
                        </Pagination.Item>
                    );
                }
            }

            // Always add last page if different from first
            if (totalPages > 1) {
                pages.push(
                    <Pagination.Item
                        key={totalPages}
                        active={totalPages === currentPage}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={loading}
                    >
                        {totalPages}
                    </Pagination.Item>
                );
            }
        } else {
            // For advanced pagination (like TabulerData)
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 1) {
                    pages.push(
                        <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => handlePageChange(i)}
                            className={`${styles.pageItem} ${i === currentPage ? styles.activePage : ""}`}
                        >
                            {i}
                        </Pagination.Item>
                    );
                } else if (
                    (i === 2 && currentPage > 4) ||
                    (i === totalPages - 1 && currentPage < totalPages - 3)
                ) {
                    pages.push(
                        <Pagination.Item key={`ellipsis-${i}`} className={style.pageItem} disabled>
                            ...
                        </Pagination.Item>
                    );
                }
            }
        }

        return pages;
    };

    // Render cell content with special handling for arrays/objects
    const renderCellContent = (item, colKey) => {
        const value = item[colKey];

        // Handle special columns with tags
        if (specialColumns.includes(colKey)) {
            let tags = [];
            try {
                if (Array.isArray(value)) {
                    tags = value;
                } else if (typeof value === 'string') {
                    tags = JSON.parse(value?.replace(/'/g, '"') || "[]");
                }
            } catch (err) {
                tags = [];
            }

            if (tags.length > 0) {
                return (
                    <div style={{ display: "flex", gap: "4px" }}>
                        {tags.map((tag, i) => (
                            <span key={i} style={tagStyle}>
                                {tag}
                            </span>
                        ))}
                    </div>
                );
            }
        }

        // Handle objects/arrays
        if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
        }

        return value || "-";
    };

    if (loading) return <Loader />;
    if (error) return <div>{error.message || error}</div>;

    return (
        <div className={styles.mainContainer} style={containerStyle}>
            <div
                className={styles.tableWrapper}
                style={{
                    overflowY: "auto",
                    overflowX: "auto",
                    ...tableWrapperStyle
                }}
            >
                {data && data.length > 0 ? (
                    <Table hover className={styles.table}>
                        <thead>
                            {/* Group Headers (only for TabulerData style) */}
                            {showGroupHeaders && (
                                <tr>
                                    {(() => {
                                        const groupMap = {};
                                        processedHeaders.forEach((col) => {
                                            if (!groupMap[col.groupName]) groupMap[col.groupName] = [];
                                            groupMap[col.groupName].push(col);
                                        });

                                        return Object.entries(groupMap).map(([group, cols]) => {
                                            const visibleCols = cols.filter(col => headers.includes(col.key));
                                            if (visibleCols.length > 0) {
                                                return (
                                                    <th
                                                        key={`group-${group}`}
                                                        colSpan={visibleCols.length}
                                                        className={style.groupTh}
                                                        style={{
                                                            textAlign: "center",
                                                            backgroundColor: "#f0f0f0",
                                                            fontWeight: "600",
                                                            fontSize: "13px",
                                                            borderBottom: "1px solid #ccc"
                                                        }}
                                                    >
                                                        {group}
                                                    </th>
                                                );
                                            }
                                            return null;
                                        });
                                    })()}
                                </tr>
                            )}

                            {/* Column Headers */}
                            <tr>
                                {processedHeaders
                                    .filter(col => headers.includes(col.key))
                                    .map((col) => (
                                        <th key={col.key} className={style.fixedTh}>
                                            <div>
                                                {col.displayName}
                                            </div>
                                        </th>
                                    ))}
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    {processedHeaders
                                        .filter(col => headers.includes(col.key))
                                        .map((col) => (
                                            <td
                                                key={col.key}
                                                className={style.fixedTd}
                                                style={useColumnMapping ? {
                                                    backgroundColor: getGroupColor(col.groupName)
                                                } : {}}
                                            >
                                                <div
                                                    className="cell-content"
                                                    style={{
                                                        cursor: "pointer",
                                                        fontWeight: "400",
                                                        overflow: "auto",
                                                        whiteSpace: "nowrap",
                                                        padding: "0px 5px",
                                                        fontSize: "12px",
                                                        fontFamily: "roboto",
                                                        scrollbarWidth: "none",
                                                        msOverflowStyle: "none"
                                                    }}
                                                    title={typeof item[col.key] === 'object' ? JSON.stringify(item[col.key]) : item[col.key]}
                                                >
                                                    {renderCellContent(item, col.key)}
                                                </div>
                                            </td>
                                        ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p className="text-center" style={{ margin: "20px 0px", border: "1px solid #ccc" }}>
                        {noDataMessage}
                    </p>
                )}
            </div>

            {/* Pagination */}
            <div
                className={style.paginationContainer}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "0 16px"
                }}
            >
                {/* Pagination centered */}
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    {totalPages > 1 && (
                        <Pagination>
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1 || loading}
                            />
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                            >
                                Previous
                            </Pagination.Prev>

                            {createPaginationItems()}

                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                            >
                                Next
                            </Pagination.Next>
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages || loading}
                            />
                        </Pagination>
                    )}
                </div>

                {/* Total results on the right */}
                <div style={{ fontSize: "12px", color: "#ccc" }}>
                    (Total Results - {totalResults})
                </div>
            </div>
        </div>
    );
};

export default CommonTableComponent;