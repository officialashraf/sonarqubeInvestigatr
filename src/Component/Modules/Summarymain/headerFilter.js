
import { Navbar, Nav, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import './headerfilter.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cdr from '../CDR/cdr.js';
import AppButton from '../../Common/Buttton/button.js';

const HeaderFilter = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const caseData = useSelector((state) => state.caseData.caseData);
  const storedCaseId = useSelector((state) => state.caseData.caseData.id);
  const [showPopup, setShowPopup] = useState(false);
  console.log("parms id", caseId)
  console.log("headeData", caseData.id)

  useEffect(() => {
    if (caseId !== String(storedCaseId)) {
      navigate("/not-found"); //  Redirect if URL caseId doesn't match Redux caseId
    }
  }, [caseId, storedCaseId, navigate]);

  const handleClick = () => {
    const caseID = caseData.id
    navigate(`/cases/${caseData.id}/analysis`)
  }

  const togglePopup = (value) => {
    if (typeof value === 'boolean') {
      setShowPopup(value); // set true or false explicitly
    } else {
      setShowPopup((prev) => !prev); // fallback toggle
    }
  };
  return (
    <>
      {/* <Navbar expand="sm" className="justify-content-between" >

      <Container className='custom-containerH'>  <Row className="w-100">
        <Col xs={1} className="d-flex align-items-center justify-content-center">
          <FaArrowLeft style={{ cursor: 'pointer', margin: '0px' }} onClick={() => navigate('/cases')} />
        </Col>
        <Col xs={11}>
          <Nav className="flex-column">
            <Nav.Item className="d-flex align-items-center">
              <span>ID:{`CASE${String(caseData.id).padStart(4, '0')}`}</span>
            </Nav.Item>
            <Nav.Item>
              <span >{caseData.title} </span> <FaFileAlt className="ml-3" />  <Badge pill bg="dark">
                <span>{caseData.status}</span>
              </Badge>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      </Container>
     {caseData.status !== "New" && (
      <AppButton children={"Analyze"} onClick={handleClick}/>
)}
      <AppButton children={"+ Add Resource"} onClick={togglePopup}/>
    </Navbar> */}
      <Navbar expand="sm" className="justify-content-between custom-navbarH">
        <Container fluid className="custom-containerH">
          <Row className="w-100">
            <Col xs="auto" className='cassIcon p-2'>
              <FaArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate('/cases')} size={20} />
            </Col>

            <Col>
              <div className="case-info">
                <div className="case-id">CASE{String(caseData.id).padStart(4, '0')}</div>
                <div className="case-title-status">
                  <span className="case-title">{caseData.title}</span>
                  {/* <FaFileAlt className="ml-2" /> */}
                  <Badge
                    pill
                    bg={
                      caseData.status === "In Progress"
                        ? "warning"
                        : caseData.status === "New"
                          ? "success"
                          : "danger"
                    }
                    className="ms-2 text-black"
                  >
                    {caseData.status}
                  </Badge>
                </div>
              </div>
            </Col>

            <Col xs="auto" className="d-flex align-items-center gap-2">
             {caseData.status !== "New" && (
  <>
    <AppButton onClick={handleClick}>Analyze</AppButton>
    <AppButton onClick={togglePopup}>+ Add Resource</AppButton>
  </>
)}
            </Col>

          </Row>
        </Container>
      </Navbar>

      {showPopup && <Cdr togglePopup={togglePopup} />}
    </>
  );
};

export default HeaderFilter;
