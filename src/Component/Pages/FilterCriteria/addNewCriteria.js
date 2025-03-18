import React, { useState } from 'react';
import Select from 'react-select';
import DatePickera from './datepicker'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import enLocale from 'date-fns/locale/en-US';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import '../FilterCriteria/createCriteria.css'
import { customStyles } from '../Case/createCase'
import RecentCriteria from './recentCriteria';
import SavedCriteria from './savedCriteria';


export const sharedSxStyles = {
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            border: 'none', // Removes the border
        },
        '&:hover fieldset': {
            border: 'none', // Ensures no border on hover
        },
        '&.Mui-focused fieldset': {
            border: 'none', // Removes the border when focused
        },
    },
    '& .MuiInputBase-root': {
        boxShadow: 'none', // Removes blue focus shadow
    }
}

const AddNewCriteria = ({ togglePopup, handleCreateCase, isPopupVisible, setIsPopupVisible }) => {
    const [formData, setFormData] = useState({
        // New fields
        searchQuery: '',
        datatype: null,
        filetype: [],
        caseNumber: '',
        // selectedDates: '',
        includeArchived: false
    });
    const [showPopupR, setShowPopupR] = useState(false);
    const [showPopupS, setShowPopupS] = useState(false);
    const [showPopupD, setShowPopupD] = useState(false);
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
        startTime: { hours: 16, minutes: 30 },
        endTime: { hours: 16, minutes: 30 }
    });
    console.log("setfggfd", selectedDates)


    const options = [
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
    ];


    const togglePopupN = () => {
        setIsPopupVisible(false); // Pop-up ko close kar deta hai
    };
    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Toggle popup visibility
    const togglePopupA = () => {
        setShowPopupD(!showPopupD);
    };
    const togglePopupR = () => {
        setShowPopupR(!showPopupR);
    };
    const togglePopupS = () => {
        setShowPopupS(!showPopupS);
    };
    // Handle data from DatePicker
    const handleDateSelection = (dateData) => {
        setSelectedDates(dateData);
        togglePopupA(); // Close popup after selection
    };
    console.log("handledatw", handleDateSelection)
    // Format date for display
    const formatDate = (date) => {
        if (!date) return 'No date selected';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    //console.log("formatdate", formatDate(selectedDates))
    return (
        <>
            {isPopupVisible && (
                <div className="popup-overlay" style={{ justifyContent: 'center' }}>
                    <div className="popup-container" style={{ width: '20%' }}>

                        <div className="popup-content" style={{ marginTop: '4rem' }}>
                            <h5> Filter Criteria </h5>
                            <span style={{ cursor: "pointer", marginLeft: '14rem' }} onClick={togglePopupN}>
                                &times;
                            </span>
                            <form
                            // onSubmit={(e) => {
                            //     e.preventDefault();
                            //     handleCreateCase(formData);
                            // }}
                            >
                                {/* Search Bar with Icons */}
                                <h5>Filter</h5>


                                {/* Datatype Dropdown (Single Select) */}
                                <div className="mb-3">
                                    <label>Datatype</label>
                                    <Select
                                        isMulti
                                        options={options}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.datatype}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, datatype: selected }))}
                                        placeholder="Select Datatype"
                                    />
                                </div>

                                {/* Filetype Dropdown (Multi Select) */}
                                <div className="mb-3">
                                    <label>Filetype</label>
                                    <Select
                                        isMulti
                                        options={options}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.filetype}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
                                        placeholder="Select Filetypes"
                                    />
                                </div>

                                {/* Case Search Field */}
                                {/* <label>Case</label> */}
                                <div className="mb-3">
                                    <label>Case</label>
                                    <Select
                                        isMulti
                                        options={options}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.filetype}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
                                        placeholder="Select Filetypes"
                                    />
                                </div>
                                {/* <TextField
                            fullWidth
                            className="com mb-3"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ), style: {
                                    height: '38px', // Use consistent height
                                    padding: '0 8px', // Ensure uniform padding
                                  },
                            }}
                            placeholder="Search Case..."
                            value={formData.caseNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                            sx={sharedSxStyles}
                        /> */}


                                {/* Datatype Dropdown (Single Select) */}

                                <div className=" mb-3">
                                    <label>DatePicker</label>
                                    <TextField
                                        fullWidth
                                        className="com mb-3"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon style={{ cursor: 'pointer' }} onClick={togglePopupA} />
                                                </InputAdornment>
                                            ), style: {
                                                height: '38px', // Use consistent height
                                                padding: '0 8px', // Ensure uniform padding
                                            },
                                        }}
                                        placeholder="Select Date..."
                                        value={
                                            selectedDates.startDate && selectedDates.endDate
                                                ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                                                : formatDate(selectedDates.startDate || selectedDates.endDate)
                                        }
                                        onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
                                        sx={sharedSxStyles}
                                    />

                                </div>


                                <label>Focus your search to a particular location or area</label>
                                <h5 className="mb-3">SELECT ON MAP</h5>
                                {/* <TextField placeholder='SELECT ON MAP'
                        className="com mb-3"
                        InputProps={{
                           style: {
                               height: '38px', // Use consistent height
                               padding: '0 8px', // Ensure uniform padding
                             },
                       }}sx={sharedSxStyles}
                        ></TextField> */}
                                {/* Checkbox */}
                                {/* <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.includeArchived}
                                            onChange={(e) => setFormData(prev => ({ ...prev, includeArchived: e.target.checked }))}
                                            color="primary"
                                        />
                                    }
                                    label="Save this search"
                                    className="mb-3"
                                /> */}


                                {/* <span>{selectedDates}</span> */}
                                {/* Submit Button */}
                                <div className="button-container" >
                                    <button
                                        type="submit"
                                        style={{ height: '30px' }}
                                        className="add-btn">Search</button>
                                        <button
                                        type="submit"
                                        style={{ height: '30px' }}
                                        className="add-btn">Cancel</button>
                                        <button
                                        type="submit"
                                        style={{ height: '30px' }}
                                        className="add-btn">Apply</button>
                                    {/* <Button
                variant="outlined"
                color="secondary"
                onClick={togglePopup}
              >
                Cancel
              </Button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                    {showPopupD && (

                        <DatePickera
                            onSubmit={handleDateSelection}
                            initialDates={selectedDates}
                            onClose={togglePopupA}
                        />

                    )}
                    {showPopupR && (

                        <RecentCriteria

                            onClose={togglePopupR}
                        />


                    )}
                    {showPopupS && (
                        < SavedCriteria
                            onClose={togglePopupS}
                        />
                    )}
                </div>)}
        </>);
};

export default AddNewCriteria;