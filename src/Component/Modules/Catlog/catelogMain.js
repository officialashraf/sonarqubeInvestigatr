import { Card, CardContent, Typography, IconButton } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { ListAltOutlined } from "@mui/icons-material";
import { ListTask } from 'react-bootstrap-icons';
import  styles from '../Home/card.module.css';

const CatalogMain = () => {
  const navigate = useNavigate();
  const cardData = [
    { title: 'PII Management' },
    { title: 'Gridview Management'}
  ];

const handleCheckboxChange = (title) => {
  if (title === "PII Management") {
    navigate("/piiCatalogue");
  }

  if (title === "Gridview Management") {
    navigate("/gridCatalogue");
  }
};

  return <div className="container-fluid  py-4">
    <div className="row justify-content-start">
      {cardData.map((data, index) =>
        <div key={index} className="col-auto mb-3">
          <Card
            sx={{
              width: 300,
              backgroundColor: "#101d2b",
              color: "white",
              borderRadius: "15px"
            }}
          >
            <CardContent onClick={() => handleCheckboxChange(data.title)}>
              <div className="d-flex justify-content-end align-items-end">
                <IconButton sx={{ color: "white" }} size="small">
                  {/* <MoreVertIcon /> */}
                </IconButton>
              </div>
              <div className={styles.customIconCircle} style={{marginBottom:"5px"}}>
                <IconButton size="small" 
                // sx={{ color: "white" }}
                >
                  {index === 0 && <ListTask />}
                  {index === 1 && <ListAltOutlined />}
                 
                </IconButton>
              </div>
              <Typography variant="subtitle1" sx={{ color: "#0073cf",marginTop:"5px" }}>
                {data.title}
              </Typography>
              {data.subtitle &&
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  {data.subtitle}
                </Typography>}
              {data.date &&
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                  Last Updated: {data.date}
                </Typography>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  </div>;
};

export default CatalogMain;