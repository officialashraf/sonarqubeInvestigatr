import React from "react";
import CommonMultiSelect from "../../Common/MultiSelect/CommonMultiSelect";
import CommonDateInput from "../../Common/DateField/DateField";
import { InputField } from "../../Common/InpuField/inputField";
import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";
import DatePickera from '../../Modules/FilterCriteria/datepicker';
import styles from '../../Common/Table/table.module.css';

const CriteriaForm = ({
    title = "Filter Criteria",
    caseFieldConfig, // { show: true, readOnly: false, value: "", onChange: fn }
    options, // { cases: [], platforms: [], targets: [], sentiments: [] }
    formData,
    setFormData,
    selectedDates,
    setSelectedDates,
    toggleDatePicker,
    onSearch,
    onCreate, // optional
    onCancel,
    showDatePicker,
    showCreateButton = false,
    isSearchDisabled,
}) => {
    const formatDateRange = () => {
        if (selectedDates.startDate && selectedDates.endDate) {
            return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
        }
        return "Select date range";
    };

    const handleDateSelection = (dateData) => {
        setSelectedDates(dateData);
        setFormData((prev) => ({
            ...prev,
            startDate: dateData.startDate,
            endDate: dateData.endDate,
        }));
        toggleDatePicker();
    };

    return (
        <div className="popup-overlay" style={{ justifyContent: "center" }}>
            <div className="popup-container" style={{ width: "40%" }}>
                <div className="popup-content" style={{ marginTop: "4rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: "10px" }}>
                        <h5 style={{ margin: 0, color: "white" }}>{title}</h5>
                        <span
                            style={{ cursor: "pointer", fontSize: "20px", color: "white" }}
                            onClick={onCancel}
                        >
                            &times;
                        </span>
                    </div>

                    <form>
                        {/* Case Field */}
                        {caseFieldConfig?.show && (
                            <div>
                                <InputField
                                    label="Case Id"
                                    type="text"
                                    value={caseFieldConfig.value}
                                    onChange={caseFieldConfig.onChange}
                                    placeholder="Select case"
                                    disabled={caseFieldConfig.readOnly}
                                    customPaddingInput={styles.noPaddingcase}
                                />
                            </div>
                        )}

                        {/* Cases Dropdown (when selectable) */}
                        {options.cases && options.cases.length > 0 && !caseFieldConfig?.readOnly && (
                            <div>
                                <CommonMultiSelect
                                    label="Cases"
                                    isMulti
                                    options={options.cases}
                                    customStyles={customSelectStyles}
                                    value={formData.caseIds}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, caseIds: selected }))
                                    }
                                    placeholder="Select cases"
                                />
                            </div>
                        )}

                        {/* Platform */}
                        <CommonMultiSelect
                            label="Platform"
                            isMulti
                            options={options.platforms}
                            customStyles={customSelectStyles}
                            value={formData.platform}
                            onChange={(selected) =>
                                setFormData((prev) => ({ ...prev, platform: selected }))
                            }
                            placeholder="Select platforms"
                        />

                        {/* Targets */}
                        <CommonMultiSelect
                            label="Targets"
                            isMulti
                            options={options.targets}
                            customStyles={customSelectStyles}
                            value={formData.targets}
                            onChange={(selected) =>
                                setFormData((prev) => ({ ...prev, targets: selected }))
                            }
                            placeholder="Select targets"
                        />

                        {/* Sentiments */}
                        <CommonMultiSelect
                            label="Sentiment"
                            isMulti
                            options={options.sentiments}
                            customStyles={customSelectStyles}
                            value={formData.sentiments}
                            onChange={(selected) =>
                                setFormData((prev) => ({ ...prev, sentiments: selected }))
                            }
                            placeholder="Select sentiments"
                        />

                        {/* Date Range */}
                        <CommonDateInput
                            label="Date Range"
                            placeholder="Select date range"
                            value={formatDateRange()}
                            onClickIcon={toggleDatePicker}
                        />

                        {/* Action Buttons */}
                        <div className="button-container" style={{ marginTop: "10px" }}>
                            <button
                                type="button"
                                onClick={onSearch}
                                className="add-btn"
                                disabled={isSearchDisabled}
                            >
                                Search
                            </button>

                            {showCreateButton && (
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={onCreate}
                                >
                                    Create
                                </button>
                            )}

                            <button
                                type="button"
                                className="add-btn"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Date Picker Popup */}
            {showDatePicker && (
                <DatePickera
                    onSubmit={handleDateSelection}
                    initialDates={selectedDates}
                    onClose={toggleDatePicker}
                />
            )}
        </div>
    );
};

export default CriteriaForm;
