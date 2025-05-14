import React, { useState, useEffect, useRef } from 'react';
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

  const [filterdata, setfilterdata] = useState([]);
  // const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const caseData = useSelector((state) => state.caseData.caseData);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const token = Cookies.get('accessToken');
  const initialRender = useRef(true);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const filterData = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`http://5.180.148.40:9002/api/osint-man/v1/filters`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setfilterdata(response.data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
       if (error.response && error.response.data && error.response.data.detail) {
              toast.error( error.response.data.detail)
              console.error("Backend error:", error.response.data.detail);
            } else {
              console.error("An error occurred:", error.message);
            }
    } finally {
      setIsLoading(false); // End loading regardless of success/error
    }
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false; // Mark first render as completed
      return; // Avoid making the request initially
    }
    filterData();
    const handleDatabaseUpdate = () => filterData();
    window.addEventListener("databaseUpdated", handleDatabaseUpdate);
    return () => window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
  }, []);

  // Check if filters exist for the current case
  const hasFilters = filterdata.some(
    (filter) => filter["case id"]?.includes(String(caseData?.id))
  );

const isCaseInProgress = caseData?.status === 'In Progress';

const isFilterZero = filterdata.length > 0;

const shouldProceed = hasFilters || (isCaseInProgress && isFilterZero);

  const matchingFilters = filterdata.filter(
    (filter) => filter["case id"]?.includes(String(caseData?.id))
  );
  const numberOfMatchingFilters = matchingFilters.length;

  const renderContent = () => {
    if (isLoading) {
      return <>
      <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginTop:'30rem', width:'100%' }}> <Loader />; </div> </>// Show loading state
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


// import React,{useState, useEffect} from 'react';
// import { Button } from 'react-bootstrap';
// import { FaPlus } from 'react-icons/fa';
// import { useSelector } from 'react-redux';
// import {useNavigate } from 'react-router-dom'
// import Summary from './summary.js';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import Jobs from './jobs';
// import Reports from './reports';
// import Tasks from './tasks';
// import Contributors from './contributors';
// import History from './history';
// import  '../../../../Assets/Stlyes/mainContainer.css';
// import AddFilter2 from '../AddExistingFilter/addFilter2.js';
// //import CaseTableDataFilter from '../AddExistingFilter/TabularData/caseTableDataFilter';

// // const MainContainer = () => {
// //   const navigate = useNavigate();
// //   const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
// //   const caseData1 = useSelector((state) => state.caseData.caseData);
// //   console.log("caseData1",caseData1);
// //   const caseData2 = useSelector((state) => state.caseData.caseData);
// //   console.log("casedata2", caseData2)
// //   const [showPopup, setShowPopup] = useState(false);
 

// //   const togglePopup = () => {
// //     setShowPopup((prev) => !prev);
// //   };   

// // console.log("stlected", selectedTab)
// //   const renderContent = () => {
   
// //     switch (selectedTab) {
      
// //       case 'summary':
// //         return <Summary />
// //       case 'jobs':
// //         return <Jobs />
// //       case 'reports':
// //         return <Reports />
// //       case 'tasks':
// //         return <Tasks />
// //       case 'contributors':
// //         return <Contributors />
// //       case 'history':
// //         return <History />
     
// //       default:
        
// //         return (
// //           <div className="resourcesContainer" >
// //             <h3 className="title">Let's Get Started!</h3>
          
// //             <p className="content">Add resources to get started</p>
// //             <Button variant="primary" className="add-resource-button" onClick={togglePopup} >
// //               <FaPlus /> Add Resources
// //             </Button>
// //           </div>
          
// //         );
       
// //     }
// //   };

// //   return <> <div className="containerM" containerM style={{background:"lightgray", margin:'0px'}}>{renderContent()}</div>
// //   {showPopup && <AddFilter2 togglePopup={togglePopup} />}
// //   </>
// // };

// // export default MainContainer;

// const MainContainer = () => {
//   const navigate = useNavigate();
//   const [filterdata, setfilterdata] = useState();
//   const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
//   const caseData = useSelector((state) => state.caseData.caseData);
//   console.log("caseDaataid", caseData.id)
//   const [showPopup, setShowPopup] = useState(false);
//   const filterCount = useSelector((state) => state.filterCount.filterCount.data);
//   console.log("filterrrrr", filterdata)
//   const token = Cookies.get('accessToken');
//   // Check if filters exist


//   const togglePopup = () => {
//     setShowPopup((prev) => !prev);
//   };   


//   const filterData = async () => {
//     try { 
//      const response = await axios.get(`http://5.180.148.40:9006/api/osint-man/v1/filters`,{
//        headers: {
//          'Content-Type': 'application/json',
//          'Authorization': `Bearer ${token}`,
//        },
//      });
//     console.log("resposne", response)
//       const user = response.data.data;
//       console.log("filtersasa", user)
//       setfilterdata(user)
//      //  setRefresh(true);
//       // Update the state with usered data
//         } catch (error) { 
//          console.error('There was an error usering the data!', error); 
//        } 
//      };
    
 
//    useEffect(() => {
//      filterData()
//      const handleDatabaseUpdate = () => {
//          filterData()
//      };

//      window.addEventListener("databaseUpdated", handleDatabaseUpdate);

//      return () => {
//          window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
//      };
//  }, []);

//  const hasFilters = Array.isArray(filterdata) && filterdata.some((filter) =>
//   Array.isArray(filter["case id"]) && filter["case id"].includes(String(caseData.id))
// );    
// const matchingFilters = Array.isArray(filterdata) ? 
//   filterdata.filter((filter) =>
//     Array.isArray(filter["case id"]) && filter["case id"].includes(String(caseData.id))
//   ) : [];

// const numberOfMatchingFilters = matchingFilters.length;

// console.log(`Number of filters for the particular case: ${numberOfMatchingFilters}`);

//   console.log("Selected Tab:", selectedTab);
//   console.log("Has Filters:", hasFilters);

//   const renderContent = () => {
//     // Pehle check karein ke filter apply hai ya nahi
//     if (!hasFilters) {
//       return (
//         <div className="resourcesContainer">
//           <h3 className="title">Let's Get Started!</h3>
//           <p className="content">Add resources to get started</p>
//           <Button variant="primary" className="add-resource-button" onClick={togglePopup}>
//             <FaPlus /> Add Resources
//           </Button>
//         </div>
//       );
//     }

//     // Agar filter applied hai, sirf Summary show karein
//     return <Summary filters={numberOfMatchingFilters} />;
//   };

//   return (
//     <>
//       <div className="containerM" style={{ background: "lightgray", margin: '0px' }}>
//         {renderContent()}
//       </div>
//       {showPopup && <AddFilter2 togglePopup={togglePopup} />}
//     </>
//   );
// };

// export default MainContainer;
