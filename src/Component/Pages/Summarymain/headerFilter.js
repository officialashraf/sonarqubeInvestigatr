
import { Navbar, Nav, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaFileAlt, FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import './headerfilter.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const HeaderFilter = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const caseData = useSelector((state) => state.caseData.caseData);
  const storedCaseId = useSelector((state) => state.caseData.caseData.id);
  console.log("parms id", caseId)
  console.log("headeData", caseData)
  useEffect(() => {
    if (caseId !== String(storedCaseId)) {
      navigate("/not-found"); //  Redirect if URL caseId doesn't match Redux caseId
    }
  }, [caseId, storedCaseId, navigate]);
  const handleClick = () => {
    const caseID = caseData.id
    navigate(`/cases/${caseData.id}/analysis`)
  }

  return (
    <Navbar expand="sm" className="justify-content-between" style={{ background: "lightgray" }}>

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
    <button className='analyze-btn' onClick={handleClick}>
        Analyze
    </button>
)}

    </Navbar>
  );
};

export default HeaderFilter;
