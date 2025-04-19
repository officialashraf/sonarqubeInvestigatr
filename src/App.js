
import Header from './Component/Pages/Home/header.js';
import Home from './Component/Pages/Home/home';
import SearchBar from './Component/Pages/SearchPage/searchBar';
import LoginPage from './Component/Pages/User/login';
import { BrowserRouter , Routes, Route, useLocation  } from 'react-router-dom';
import MainFilter from './Component/Pages/Summarymain/mainFilterPage.js';
import AddFilter2 from './Component/Pages/Filters/addFilter.js';
import CaseTableDataFilter from './Component/Pages/Analyze/caseTableDataFilter.js';
import CaseAddFilter from './Component/Pages/Summarymain/unusable/caseAddFilter.js';
import RightSidebar from './Component/Pages/Home/rightSideBar.js';
import Sidebar from './Component/Pages/Home/leftSideBar.js';
import './Component/Pages/Home/dashboard.css';
import Summary from './Component/Pages/Summarymain/summary.js';
import LineChart1 from './Component/Pages/Analyze/GraphicalData/lineChart.js';
import KeywordChart from './Component/Pages/Analyze/GraphicalData/keywordChart.js';
import GraphicalData from './Component/Pages/Analyze/GraphicalData/graphicalData.js';
import './App.css'
import ProtectedRoute from './utils/protectRoute.js';
import Loader from './Component/Pages/Layout/loader.js';
import SearchResults from './Component/Pages/FilterCriteria/List/fullscreen.js';
import UsersDashboard from './Component/Pages/User/UsersDashboard.js';
import Confirm from './Component/Pages/FilterCriteria/confirmCriteria.js';
import LogoutUser from './Component/Pages/User/logout.js';
import ShowDetails from './Component/Pages/PII/showDetails.js';



const AppContent = () => {
  const location = useLocation();

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === "/cases") return "Cases";
    if (path === "/pii") return "PII";
    if (path.startsWith("/cases/") && path.endsWith("/analysis"))
      return "Case Analysis";
    if (path.startsWith("/cases/") && path.endsWith("/case-summary"))
      return "Case Summary";
    if (path === "/key") return "Keyword Chart";
    if (path === "/line") return "Line Chart";
    if (path === "/grapg") return "Graphical Data";
    if (path === "/search") return "Search";
    if (path === "/users") return "Users";
    if (path === "/reports") return "Reports";
    if (path === "/ comments") return "Comm";
    if (path === "/pin") return "Pin";
    if (path === "/documents") return "Docs";
    if (path === "/gemini") return "Gemini";

    return "Cases";
  };

  return (
    <div className="ContainerDashboard">
      {/* Render Header for all pages except the LoginPage */}

      <div className="dashboard-container">
        <div className="cont-d">
          {location.pathname !== "/" && <Header title={getHeaderTitle()} />}
        </div>
        <div className="cont-a">
          {location.pathname !== "/" && <Sidebar />}
        </div>

        <div className="cont-b">
          <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/pii" element={<ShowDetails/>} />
            <Route path="/cases" element={<Home />} />
            <Route path="/cases/:caseId" element={<MainFilter />} />
            <Route path="/add-filter" element={<AddFilter2 />} />
            <Route path='/case-detail' element={<CaseAddFilter />} />
            <Route path='/cases/:caseID/analysis' element={<CaseTableDataFilter />} />
            <Route path="/cases/:caseID/case-summary" element={<Summary />} />
            <Route path="/key" element={< KeywordChart/>} />
            <Route path="/line" element={<LineChart1 />} />
            <Route path="/grapg" element={< GraphicalData />} />
            <Route path="/search" element={< SearchResults />} />
            <Route path="/confirm" element={< Confirm />} />
            <Route path="logout" element={< LogoutUser />} />
            <Route path="/users" element={< UsersDashboard />} />
            <Route path="*" element={<div className='notfound'> <h4>Work in progress........</h4></div>} />



          </Route>
          <Route path='loader' element={<Loader/>}/>

          </Routes>
        </div>

        <div className="cont-c">
          {location.pathname !== "/" && <RightSidebar />}
        </div>
      </div>
    </div>
  );
};

const App = () =>
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>;

export default App;
