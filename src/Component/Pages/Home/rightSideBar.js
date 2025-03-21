import React,{useState} from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Cpu, FileEarmarkText, Bell, PinAngle, ChatLeftText ,Search} from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "../../../Assets/Stlyes/rightSideBar.css"
import CreateCriteria from '../FilterCriteria/createCriteria'
import SavedCriteria from '../FilterCriteria/savedCriteria';

const  RightSidebar = ()=> {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleItemClick = (item, setShowPopup, navigate) => {
    if (item.isPopup) {
        setShowPopup(true); // Search click hone par popup open hoga
    } else {
        navigate(item.path); // Baaki sab pages navigate karenge
    }}
   
    const togglePopup = () => {
      setShowPopup((prev) => !prev);
    };

  const menuItems = [
    { label: 'Gemini', icon: <Cpu size={15} />, path: '/gemini' },
     { label: 'Search', icon: <Search size={15} />, isPopup: true },
    { label: 'Docs', icon: <FileEarmarkText size={15} />, path: '/documents' },
    { label: 'Pin', icon: <PinAngle size={15} />, path: '/pin' },
    { label: 'Comm', icon: <ChatLeftText size={15} />, path: '/ comments' },
    // { label: 'Notif', icon: <Bell size={15} />, path: '/notification' },
  ];

  return (
     <>
         <div style={{marginTop:'1rem'}}>
         {menuItems.map((item, index) => (
            <Nav.Link
              key={index}
              onClick={() => handleItemClick(item, setShowPopup, navigate)}
              style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px',  marginBottom: '2rem' }}
            >
              {item.icon}
              <span style={{ marginLeft: '1px' }}>{item.label}</span>
            </Nav.Link>
          ))}
         </div>
         {/* {showPopup && <CreateCriteria togglePopup={togglePopup} setShowPopup={setShowPopup}/>} */}
          
          {showPopup && <SavedCriteria togglePopup={togglePopup} setShowPopup={setShowPopup}/>} 
          </>
  );
}

export default RightSidebar;