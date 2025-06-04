import { useState, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Summary from './summary.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import './mainContainer.css';
import AddFilter2 from '../Filters/addFilter.js';
import Loader from '../Layout/loader.js';
import { toast } from 'react-toastify';

const MainContainer = () => {
  const token = Cookies.get('accessToken');

  const [filterdata, setfilterdata] = useState([]);
  const caseData = useSelector((state) => state.caseData.caseData);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const filterData = useCallback(async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/filters`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setfilterdata(response.data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail)
        console.error("Backend error:", error.response.data.detail);
      } else {
        console.error("An error occurred:", error.message);
      }
    } finally {
      setIsLoading(false); // End loading regardless of success/error
    }
  }, [token]);

  useEffect(() => {
    filterData();
    const handleDatabaseUpdate = () => filterData();
    window.addEventListener("databaseUpdated", handleDatabaseUpdate);
    return () => window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
  }, [filterData]);

  // Check if filters exist for the current case
  const hasFilters = filterdata.some(
    (filter) => filter["case id"]?.includes(String(caseData?.id))
  );

  const isCaseInProgress = caseData?.status === ('In Progress' || 'On Hold'|| 'Closed');

  const isFilterZero = filterdata.length > 0;

  const shouldProceed = hasFilters || (isCaseInProgress && isFilterZero);

  const matchingFilters = filterdata.filter(
    (filter) => filter["case id"]?.includes(String(caseData?.id))
  );
  const numberOfMatchingFilters = matchingFilters.length;

  const renderContent = () => {
    if (isLoading) {
      return <>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop: '30rem', width: '100%' }}> <Loader />; </div> </>// Show loading state
    }

    if (shouldProceed) {
      return <Summary filters={numberOfMatchingFilters} />;
    }

    return (
      <div className="resourcesContainer">
        <h3 className="title">Let's Get Started!</h3>
        <p className="content">Add resources to get started</p>
        <Button variant="primary" className="add-resource-button" onClick={togglePopup}>
          <FaPlus /> Add Resources
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="containerM" style={{ background: "lightgray", margin: '0px' }}>
        {renderContent()}
      </div>
      {showPopup && <AddFilter2 togglePopup={togglePopup} />}
    </>
  );
};
export default MainContainer;
