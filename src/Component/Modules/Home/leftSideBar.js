import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { ListTask, Folder, BarChart, People, Bullseye, Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import styles from "./sideBar.module.css"
import { useDispatch, useSelector } from 'react-redux';
import { openPopup } from '../../../Redux/Action/criteriaAction';
import RecentCriteria from '../FilterCriteria/recentCriteria';
import CreateCriteria from '../FilterCriteria/createCriteria';
import SavedCriteria from '../FilterCriteria/savedCriteria';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);

  const activePopup = useSelector((state) => state.popup?.activePopup || null);

  const handleItemClick = (item) => {
    setSelectedItem(item.label);

    if (item.path) {
      navigate(item.path);
    }

    if (item.isPopup && item.popup) {
      dispatch(openPopup(item.popup));
    }
  };

  const menuItems = [
    { label: 'Cases', icon: <Folder size={20} />, path: '/cases' },
    { label: 'PII', icon: <ListTask size={20} />, path: '/pii' },
    { label: 'Targets', icon: <Bullseye size={20} />, path: '/targets' },
    { label: 'Reports', icon: <BarChart size={20} />, path: '/reports' },
    { label: 'Admin', icon: <People size={20} />, path: '/admin' },
    { label: 'Search', icon: <Search size={20} />, isPopup: true, popup: 'recent' },
  ];

  return (
    <>
         <div className={styles.sideB}>
      <div className={styles.sideTop}>
        {menuItems.slice(0, 5).map((item, index) => (
          <Nav.Link
            key={index}
            onClick={() => handleItemClick(item)}
            className={`${styles.navSideLink} ${selectedItem === item.label ? styles.navSideLinkActive : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </div>

      <div className={styles.sideBottom}>
        {menuItems.slice(5).map((item, index) => (
          <Nav.Link
            key={index}
            onClick={() => handleItemClick(item)}
            className={`${styles.sideBottomNavLink} ${selectedItem === item.label ? styles.sideBottomNavLinkActive : ''}`}
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
};

export default Sidebar;
