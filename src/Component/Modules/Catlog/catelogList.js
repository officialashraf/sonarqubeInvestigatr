import "../Case/tableGlobal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Loader from "../Layout/loader";
import TableModal from "../../Common/Table/table";
import AppButton from "../../Common/Buttton/button";

const CatlogList = () => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popupDetails, setPopupDetails] = useState(null);

    // const togglePopup = () => {
    //     setShowPopup(prev => !prev);
    // };
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const togglePopup = () => {
        setShowPopup(prev => !prev);
    };


    const fetchCatalog = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("accessToken");
            const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log("resposne from roles", response)
            setData(response.data);
            console.log("data from roles", response)
            setFilteredData(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(error.response.data.detail);
            } else {
                console.error("An error occurred:", error.message);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchCatalog();

        const handleDatabaseUpdated = () => {
            fetchCatalog();
        };

        window.addEventListener("databaseUpdated", handleDatabaseUpdated);
        return () => {
            window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
        };
    }, []);
    const handleSaveChanges = async (editedRows) => {
        const token = Cookies.get("accessToken");
        try {
            const updatePromises = Object.entries(editedRows).map(([id, row]) =>
                axios.put(
                    `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings/${id}`,
                    {
                        group_name: row.group_name,
                        display_name: row.display_name, // or fetch from existing data if needed
                        is_visible: row.is_visible,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                )
            );

            await Promise.all(updatePromises);
            toast.success("All changes saved successfully!");
            fetchCatalog(); // reload latest data
        } catch (error) {
            toast.error("Failed to save changes.");
            console.error(error);
        }
    };

    if (loading) {
        return <Loader />
    }
    const roleColumns = [
        { key: "id", label: "Catlog ID" },
        { key: "column_name", label: "Column Name" },
        { key: "group_name", label: "Group Name" },
        { key: "display_name", label: "Dispaly Name" },
        { key: "is_visible", label: "Visible" },
    ];

    return (
        <>
            {data && data.length > 0 ? (
                <div>
                    {/* <FaArrowLeft
                                style={{
                                    cursor: 'pointer', margin: '0px 40px 0px 38px',
                                    fontSize: '18px'
                                }}

                                onClick={() => navigate('/admin')}
                            /> */}
                    <TableModal
                        title="Catalogue Dashboard"
                        data={data}
                        columns={roleColumns}
                        onAddClick={() => togglePopup()}
                        idPrefix="CAT"
                        btnTitle=" + Add New Catalogue"
                        editable={true}
                        onSaveChanges={handleSaveChanges}
                    />
                </div>


            ) : (
                <div className="resourcesContainer" style={{ border: 'none' }}>
                    <h3 className="title">Let's Get Started!</h3>
                    <p className="content">Add roles to get started</p>
                    {/* <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Roles</button> */}
                    <AppButton onClick={togglePopup} children={" + Add New Role"} />
                </div>
            )
            }
        </>
    );
};

export default CatlogList;