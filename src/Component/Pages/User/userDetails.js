import { Table, CloseButton } from "react-bootstrap";
import "../Case/caseDetails.css"

const UserDetails = ({ item, users, toggleDetails }) => {
  console.log(item.last_logout, "items")
  console.log(users, "users ohhhhhkk");

  return <div className="popup-overlay">
    <div className="popup-containera">
      <div className="popup-content">
        <div className="header">
          <h5>
            {item.username}
          </h5>
          <CloseButton onClick={toggleDetails} />
        </div>
        <div className="case-details-container">
          <Table bordered hover className="custom-table custom-table-th">
            <tbody>
              <tr>
                <th>Username</th>
                <td>
                  {item.username}
                </td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>
                  {item.id}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {item.email}
                </td>
              </tr>
              <tr>
                <th>Last Active</th>
                <td>
                  {item.last_logout}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className={item.status === "Active" ? "status-active-1" : "status-inactive"}>
                    ● {item.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="button-container">
          <button type="button" className="cancel-btn" onClick={toggleDetails}>
            OK
          </button>
        </div>
      </div>
    </div>
  </div>;
};

export default UserDetails;
