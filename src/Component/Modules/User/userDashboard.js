import { Card, CardContent, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HttpsIcon from '@mui/icons-material/Https';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUsersBetweenLines } from "react-icons/fa6";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import  styles from '../Home/card.module.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const cardData = [
    { title: 'User Management' },
    { title: 'Roles and Permissions' },
    { title: 'Connection Management'},
    { title: 'Catalogue Management'}
  ];

  const handleCheckboxChange = (title) => {
    if (title === "User Management") {
      navigate("/users");
    } else if (title === "Roles and Permissions") {
      navigate("/roles");
    } else if (title === "Connection Management"){
      navigate("/connections")
    }else if (title === "Catalogue Management"){
      navigate("/catalogue")
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
                  <MoreVertIcon />
                </IconButton>
              </div>
              <div className={styles.customIconCircle}>
                <IconButton size="small" sx={{ color: "white" }}>
                  {index === 0 && <FaUsersBetweenLines />}
                  {index === 1 && <MdAdminPanelSettings />}
                  {index === 2 && <HttpsIcon/>}
                  {index === 3 && <AutoAwesomeIcon/>}
                </IconButton>
              </div>
              <Typography variant="subtitle1" sx={{ color: "#0073cf" }}>
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

export default UserDashboard;
