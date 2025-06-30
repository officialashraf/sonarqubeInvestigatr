import Header from '../Component/Modules/Home/header.js';
import Home from '../Component/Modules/Home/home';
import LoginPage from '../Component/Modules/User/login';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainFilter from '../Component/Modules/Summarymain/mainFilterPage.js';
import AddFilter2 from '../Component/Modules/Filters/addFilter.js';
import CaseTableDataFilter from '../Component/Modules/Analyze/caseTableDataFilter.js';
import CaseAddFilter from '../Component/Modules/Summarymain/unusable/caseAddFilter.js';
// import RightSidebar from '../Component/Modules/Home/rightSideBar.js';
import Sidebar from '../Component/Modules/Home/leftSideBar.js';
import styles from '../Component/Modules/Home/dashboard.module.css';
import Summary from '../Component/Modules/Summarymain/summary.js';
import LineChart1 from '../Component/Modules/Analyze/GraphicalData/lineChart.js';
import KeywordChart from '../Component/Modules/Analyze/GraphicalData/keywordChart.js';
import GraphicalData from '../Component/Modules/Analyze/GraphicalData/graphicalData.js';
import '../App.css'
import ProtectedRoute from './protectRoute.js';
import Loader from '../Component/Modules/Layout/loader.js';
import SearchResults from '../Component/Modules/FilterCriteria/List/fullscreen.js';
import Confirm from '../Component/Modules/FilterCriteria/confirmCriteria.js';
import LogoutUser from '../Component/Modules/User/logout.js';
import ShowDetails from '../Component/Modules/PII/showDetails.js';
import LicensePage from '../Component/Modules/User/license.js';
import LicenseValidator from './licenseValidator.js';
import UserDashboard from '../Component/Modules/User/userDashboard.js';
import UserManagement from '../Component/Modules/User/UserManagement.js';
import RolesPermission from '../Component/Modules/Roles/roles_Permission.js';
import ReportPage from '../Component/Modules/Reports/reportPage.js';
import TargetDashboard from '../Component/Modules/Targets/targetDashboard.js';
import { setupAxiosInterceptors } from './axiosConfig.js';
import LicenseGuard from './licenseGaurd.js';
import ConnectionManagement from '../Component/Modules/Connections/connectionManagement.js';
import AboutUs from '../Component/Modules/Home/aboutUs.js';
import DAButton from '../Component/Common/Buttton/button.js';


const AppContent = () => {
    const location = useLocation();
    setupAxiosInterceptors();

    const getHeaderTitle = () => {
        const path = location.pathname;
        if (path === "/cases") return "Cases";
        if (path === "/pii") return "Personally Identifiable Information";
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
        if (path === "/comments") return "Comments";
        if (path === "/pin") return "Pin";
        if (path === "/documents") return "Docs";
        if (path === "/gemini") return "Gemini";
        if (path === "/admin") return "Admin";
        if (path === "/roles") return "Roles";
        if (path === "/targets") return "Target";
        if (path === "/connections") return "Connections";

        return "Cases";
    };
    const excludedPaths = ["/login", "/", "/license"];
    return (
        <div className={styles.ContainerDashboard}>
            {/* Render Header for all pages except the LoginPage */}

            <div className={styles.dashboardContainer}>
                <div className={styles.contD}>
                    {!excludedPaths.includes(location.pathname) && <Header title={getHeaderTitle()} />}

                </div>
                <div className={styles.contA}>
                    {!excludedPaths.includes(location.pathname) && <Sidebar />}
                </div>

                <div className={styles.contB}>
                    <Routes>
                        <Route path='/' element={<LicenseValidator />} />
                           <Route path='/btn' element={<DAButton />} />
                        <Route path="/license" element={<LicensePage />} />
                        {/* <Route path="/login" element={<LoginPage />} /> */}
                        <Route element={<LicenseGuard />}>
                            <Route path="/login" element={<LoginPage />} />
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/pii" element={<ShowDetails />} />
                            <Route path="/cases" element={<Home />} />
                            <Route path="/cases/:caseId" element={<MainFilter />} />
                            <Route path="/add-filter" element={<AddFilter2 />} />
                            <Route path='/case-detail' element={<CaseAddFilter />} />
                            <Route path='/cases/:caseID/analysis' element={<CaseTableDataFilter />} />
                            <Route path="/cases/:caseID/case-summary" element={<Summary />} />
                            <Route path="/key" element={< KeywordChart />} />
                            <Route path="/line" element={<LineChart1 />} />
                            <Route path="/grapg" element={< GraphicalData />} />
                            <Route path="/search" element={< SearchResults />} />
                            <Route path="/confirm" element={< Confirm />} />
                            <Route path="logout" element={< LogoutUser />} />
                            <Route path="/users" element={< UserManagement />} />
                            <Route path="/admin" element={< UserDashboard />} />
                            <Route path="/roles" element={< RolesPermission />} />
                            <Route path="/reports" element={< ReportPage />} />
                            <Route path="/targets" element={< TargetDashboard />} />
                            <Route path="/about" element={< AboutUs />} />
                            <Route path="/connections" element={ <ConnectionManagement />} />
                            <Route path="*" element={<div className='notfound'> <h4>Work in progress........</h4></div>} />
                        </Route>
                        <Route path='loader' element={<Loader />} />

                    </Routes>
                </div>

                {/* <div className="cont-c">
                    {!excludedPaths.includes(location.pathname) && <RightSidebar />}
                </div> */}
            </div>
        </div>
    );
};
export default AppContent;