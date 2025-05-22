import { Table, CloseButton } from 'react-bootstrap'
const DetailsPermission = ({ togglePopup, details }) => {
    console.log("details", details)
    return (

        <div className="popup-overlay">
            <div className="popup-containera">
                <div className="popup-content">

                    <div className="header">
                        <span> <h5>Permission Details</h5></span>
                        <CloseButton onClick={togglePopup} />
                    </div>
                    <div className="case-details-container">
                        <Table bordered hover className='custom-table custom-table-th' >
                            <tbody> <tr> <th>Roles</th> <td>{details.role}</td> </tr>
                                <tr> <th>Created On</th> <td>{details?.created_on ? details.created_on.slice(0, 12) : '-'}</td> </tr>
                                <tr> <th>Created By</th> <td>{details?.created_by ? details.created_by.slice(0, 8) : '-'}</td> </tr>
                                <tr> <th>Edited On</th> <td>{details.editedOn || '-'}</td> </tr>
                                <tr> <th>Edited By</th> <td>{details.editedBy || '-'}</td> </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="button-container">
                        <button type="button" className="cancel-btn" onClick={togglePopup}>
                            Cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default DetailsPermission


