import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Cpu, FileEarmarkText, Bell, PinAngle, ChatLeftText } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import "../../../Assets/Stlyes/rightSideBar.css"
const  RightSidebar = ()=> {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Gemini', icon: <Cpu size={15} />, path: '/gemini' },
    { label: 'Docs', icon: <FileEarmarkText size={15} />, path: '/documents' },
    { label: 'Pin', icon: <PinAngle size={15} />, path: '/pin' },
    { label: 'Comm', icon: <ChatLeftText size={15} />, path: '/ comments' },
    // { label: 'Notif', icon: <Bell size={15} />, path: '/notification' },
  ];

  return (
   
     <>
      {/* style={{marginTop:'1rem'}} */}
         <div className='SideR'>
         {menuItems.map((item, index) => (
            <Nav.Link
            className='navRightLink'
              key={index}
              onClick={() => navigate(item.path)}
              // style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px',  marginBottom: '2rem' }}
            >
              {item.icon}
              <span id='spanRid' style={{ marginLeft: '1px' }}>{item.label}</span>
            </Nav.Link>
          ))}
         </div>
          </>

  );
}

export default RightSidebar;
