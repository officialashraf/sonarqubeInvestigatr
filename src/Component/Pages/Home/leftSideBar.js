import React from 'react';
import { Nav } from 'react-bootstrap';
import { House, ListTask, Folder, BarChart, People,Search} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "../../../Assets/Stlyes/sideBar.css"
const  Sidebar = ()=> {
  const navigate = useNavigate();

  const menuItems = [
    // { label: 'Home', icon: <House size={15} />, path: '/home' },
      { label: 'Search Data', icon: <Search size={15} />, path: '/search' },
    { label: 'PII', icon: <ListTask size={15} />, path: '/pii' },
     { label: 'Cases', icon: <Folder size={15} />, path: '/cases' },
  
    // { label: 'Legals', icon: <FileEarmarkText size={15} />, path: '/legals' },
    { label: 'Reports', icon: <BarChart size={15} />, path: '/reports' },
    // { label: 'Dashboard', icon: <Grid size={15} />, path: '/dashboard' },
    // { label: 'Targets', icon: <Bullseye size={15} />, path: '/targets' },
    { label: 'Admin', icon: <People size={15} />, path: '/admin' },
  ];

  return (
   
      <>
     <div className='sideB'>
          {menuItems.map((item, index) => (
            <Nav.Link
              key={index}
              onClick={() => navigate(item.path)}
              className='navSideLink'
              // style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', textAlign: 'center', marginBottom: '2rem' }}
            >
              {item.icon}
              <span id='spanid'>{item.label}</span>
            </Nav.Link>
          ))}
        </div>
          </>
  );
}

export default Sidebar;
