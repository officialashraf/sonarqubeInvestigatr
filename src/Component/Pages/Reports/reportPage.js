import { Container, Row, Col } from 'react-bootstrap';
import './reportPage.css'; // Import the external CSS file
import SearchView from './searchView';
import GridView from './gridView';

const ReportPage = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12} md={4} style={{margin:'0',padding:'0'}} className="left-div">
       
          <SearchView />
        </Col>
        <Col  xs={12} md={4} className="right-div">

   
          <GridView />
        </Col>
   
        </Row>
            
    </Container>
  );
};

export default ReportPage;