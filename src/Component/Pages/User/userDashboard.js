import { Card, CardContent, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUsersBetweenLines } from "react-icons/fa6";

const UserDashboard = () => {
  const navigate = useNavigate();
  const cardData = [
    { title: 'User Management' },
    { title: 'Roles and Permissions' },
  ];

  const handleCheckboxChange = (title) => {
    if (title === "User Management") {
      navigate("/users");
    } else if (title === "Roles and Permissions") {
      navigate("/roles");
    }
  };
  return <div className="container-fluid  py-4">
    <div className="row justify-content-start">
      {cardData.map((data, index) =>
        <div key={index} className="col-auto mb-3">
          <Card
            sx={{
              width: 300,
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px"
            }}
          >
            <CardContent onClick={() => handleCheckboxChange(data.title)}>
              <div className="d-flex justify-content-end align-items-end">
                <IconButton sx={{ color: "white" }} size="small">
                  <MoreVertIcon />
                </IconButton>
              </div>
              <div className="form-check">
                <IconButton size="small" sx={{ color: "white" }}>
                  {index === 0 && <FaUsersBetweenLines />}
                  {index === 1 && <MdAdminPanelSettings />}
                </IconButton>
              </div>
              <Typography variant="subtitle1">
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
