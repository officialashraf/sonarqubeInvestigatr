import { Nav } from 'react-bootstrap';
import { ListTask, Folder, BarChart, People, Bullseye } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "./sideBar.css"

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'PII', icon: <ListTask size={15} />, path: '/pii' },
    { label: 'Cases', icon: <Folder size={15} />, path: '/cases' },

    { label: 'Reports', icon: <BarChart size={15} />, path: '/reports' },
    { label: 'Targets', icon: <Bullseye size={15} />, path: '/targets' },
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
