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


    const allowedKeys = ["group_name", "display_name", "is_visible"];

const handleSaveChanges = async (editedRows) => {
  const token = Cookies.get("accessToken");

  const rowsToUpdate = Object.entries(editedRows).map(([id, changes]) => {
    const cleanRow = { id: Number(id) };

    allowedKeys.forEach((key) => {
      if (changes[key] !== undefined) {
        cleanRow[key] = changes[key];
      }
    });

    return cleanRow;
  });

  if (rowsToUpdate.length === 0) return;

  try {
    await axios.put(
      `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings/batch-update`,
      { rows: rowsToUpdate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Changes saved successfully!");
    fetchCatalog();
  } catch (error) {
    console.error(error);
    toast.error("Failed to save changes.",error);
  }
};



    if (loading) {
        return <Loader />
    }
    const roleColumns = [
        { key: "id", label: "Catalogue ID" },
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
                    <p className="content">Add catalogue to get started</p>
                    {/* <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Roles</button> */}
                    <AppButton onClick={togglePopup} children={" + Add New Catalogue"} />
                </div>
            )
            }
        </>
    );
};

export default CatlogList;