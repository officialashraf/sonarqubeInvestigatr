import React from 'react';
import { Navbar, Nav,Container, Row, Col,Badge } from 'react-bootstrap';
import { FaFileAlt,FaArrowLeft } from 'react-icons/fa';
 import {  useSelector } from 'react-redux';
//import { setSelectedTab } from '../../../../Redux/Action/caseAction';
import './headerfilter.css';
import { useNavigate, useParams } from 'react-router-dom';
// import CaseData from '../Analyze/TabularData/tabulerData';

const HeaderFilter = () => {
  //const dispatch = useDispatch();
  const caseData1 = useSelector((state) => state.caseData.caseData);
  const {caseId} = useParams()
  console.log("parms id", caseId)
   console.log("headeData", caseData1)
  const navigate = useNavigate()
  const  handleClick =()=>{
    const caseID = caseData1.id
   navigate(`/cases/${caseID}/analysis`)
  }

  return (
    <Navbar expand="sm" className="justify-content-between" style={{background:"lightgray"}}>

      <Container className='custom-containerH'>  <Row className="w-100">
        <Col xs={1} className="d-flex align-items-center justify-content-center">
          <FaArrowLeft style={{ cursor: 'pointer',margin:'0px' }}  onClick={() => navigate('/cases')} />
        </Col>
        <Col xs={11}>
          <Nav className="flex-column">
            <Nav.Item className="d-flex align-items-center">
              <span>ID:{`CASE${String(caseId).padStart(4, '0')}`}</span>
              </Nav.Item> 
              <Nav.Item>
             <span className='caseName'>{caseData1.title} </span> <FaFileAlt className="ml-3" />  <Badge pill bg="dark">
             <span>{caseData1.status}</span>
               </Badge>
              </Nav.Item>
          </Nav>
        </Col>
      </Row>
      
      </Container>
      <button  className='analyze-btn' onClick={handleClick} >
        {/* <FaChartLine /> */}
         Analyze
      </button>
    </Navbar>
  );
};

export default HeaderFilter;
