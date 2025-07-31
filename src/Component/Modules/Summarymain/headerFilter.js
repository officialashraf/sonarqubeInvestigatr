
import { Navbar, Container, Row, Col, Badge } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import styles from './headerfilter.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cdr from '../CDR/cdr.js';
import AddFilter2 from '../Filters/addFilter';
import FileUpload from '../CDR/FileUpload.js';
import FtpPopup from '../CDR/FtpPopup';
import AppButton from '../../Common/Buttton/button.js';

const HeaderFilter = () => {
  const { caseId } = useParams()
  const navigate = useNavigate()
  const caseData = useSelector((state) => state.caseData.caseData);
  const storedCaseId = useSelector((state) => state.caseData.caseData.id);

  const [showCdr, setShowCdr] = useState(false);
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showFtpPopup, setShowFtpPopup] = useState(false);

  const handleProceed = (selectedOption) => {
    setShowCdr(false);
    if (selectedOption === 'osintData') {
      setShowAddFilter(true);
    } else if (selectedOption === 'ftpServer') {
      setShowFtpPopup(true);
    } else if (selectedOption === 'localStorage') {
      setShowFileUpload(true);
    }
  };

  console.log("parms id", caseId)
  console.log("headeData", caseData.id)

  useEffect(() => {
    if (caseId !== String(storedCaseId)) {
      navigate("/not-found"); //  Redirect if URL caseId doesn't match Redux caseId
    }
  }, [caseId, storedCaseId, navigate]);

  const handleClick = () => {
    navigate(`/cases/${caseData.id}/analysis`)
  }
  const togglePopupCdr = (value) => {
    setShowCdr(value); // Directly set true/false
  };
  return (
    <>
      <Navbar expand="sm" className="justify-content-between custom-navbarH">

    <Container fluid className={styles.customContainerH}>
  <Row className="w-100">
    {/* <Col xs="auto" className={`${styles.caseIcon} p-2`}>
      <FaArrowLeft style={{ cursor: 'pointer' }} onClick={() => navigate('/cases')} size={20} />
    </Col> */}


    <Col>
      <div className={styles.caseInfo}>
        <div className={styles.caseId}> {`CASE${String(caseData.id).padStart(4, "0")}`}{" "}
              ({caseData.title})</div>
        <div className={styles.caseTitleStatus}>
          {/* <span className={styles.caseTitle}>{caseData.title}</span> */}
          <Badge
            pill
            bg={
              caseData.status === "In Progress"
                ? "warning"
                : caseData.status === "New"
                  ? "success"
                  : "danger"
            }
            className={styles.ms2 + " text-black"}
          >
            {caseData.status}
          </Badge>
        </div>
      </div>
    </Col>

    <Col xs="auto" className={styles.dFlexGap2}>
      {caseData.status !== "New" && (
        <>
          <AppButton onClick={handleClick}>Analyze</AppButton>
          <AppButton onClick={togglePopupCdr}>+ Add Resource</AppButton>
        </>
      )}
    </Col>
  </Row>
</Container>

      </Navbar>

      {showCdr && <Cdr togglePopup={() => setShowCdr(false)} handleProceed={handleProceed} />}
      {/* {showCdr && <Cdr togglePopup={setShowCdr} handleProceed={handleProceed} />} */}
      {showAddFilter && <AddFilter2 togglePopup={() => setShowAddFilter(false)} />}
      {showFileUpload && <FileUpload togglePopup={() => setShowFileUpload(false)} />}
      {showFtpPopup && <FtpPopup togglePopup={() => setShowFtpPopup(false)} />}
    </>
  );
};

export default HeaderFilter;
