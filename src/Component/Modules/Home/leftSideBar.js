import { Nav } from 'react-bootstrap';
import { ListTask, Folder, BarChart, People, Bullseye, Search ,Cpu, FileEarmarkText} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./sideBar.css"
import { useDispatch, useSelector } from 'react-redux';
import { openPopup } from '../../../Redux/Action/criteriaAction';
import RecentCriteria from '../FilterCriteria/recentCriteria';
import CreateCriteria from '../FilterCriteria/createCriteria';
import SavedCriteria from '../FilterCriteria/savedCriteria';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activePopup = useSelector((state) => state.popup?.activePopup || null);
  console.log("activePopup", activePopup);

  const handleItemClick = (item) => {
    if (item.isPopup) {
      console.log("Dispatching action: openPopup");
      dispatch(openPopup("recent")); // Search click hone par popup open hoga
    } else {
      navigate(item.path); // Baaki sab pages navigate karenge
    }
  };

  const menuItems = [
    { label: 'Cases', icon: <Folder size={20} />, path: '/cases' },
    { label: 'PII', icon: <ListTask size={20} />, path: '/pii' },
    { label: 'Targets', icon: <Bullseye size={20} />, path: '/targets' },
    { label: 'Reports', icon: <BarChart size={20} />, path: '/reports' },
    { label: 'Admin', icon: <People size={20} />, path: '/admin' },
    {  icon: <Search size={20} />, isPopup: true },
        // {  icon: <Cpu size={20} />, path: '/gemini' },
        // { icon: <FileEarmarkText size={20} />, path: '/documents' },
  ];

  return (
    <>
      <div className='sideB'>
      
    <div className='sideTop'>
    {menuItems.slice(0, 5).map((item, index) => (
      <Nav.Link
        key={index}
        onClick={() => handleItemClick(item)}
        className={`navSideLink ${window.location.pathname === item.path ? 'active' : ''}`}
      >
        {item.icon}
        <span>{item.label}</span>
      </Nav.Link>
    ))}
  </div>

  {/* Bottom Section */}
  <div className='sideBottom'>
    {menuItems.slice(5).map((item, index) => (
      <Nav.Link
        key={index}
        onClick={() => handleItemClick(item)}
        className={`navSideLink ${window.location.pathname === item.path ? 'active' : ''}`}
      >
        {item.icon}
      </Nav.Link>
    ))}
  </div>


      </div>

      {/* Popup Components */}
      {activePopup === "recent" && <RecentCriteria />}
      {activePopup === "create" && <CreateCriteria />}
      {activePopup === "saved" && <SavedCriteria />}
    </>
  );
}

export default Sidebar;
