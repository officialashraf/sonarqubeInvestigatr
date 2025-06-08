
import { Table, CloseButton } from 'react-bootstrap'
const AboutUs = ({ togglePopup}) => {
    
    return (

        <div className="popup-overlay">
            <div className="popup-containera">
                <div className="popup-content">

                    <div className="header">
                        <span> <h5>About Us</h5></span>
                        <CloseButton onClick={togglePopup} />
                    </div>
                    <div className="case-details-container">
                        <Table bordered hover className='custom-table custom-table-th' >
                            <tbody> <tr> <th>Product Name</th> <td>{"DataSearch"}</td> </tr>
                                <tr> <th>Current Version </th> <td>{"1.0.0"}</td> </tr>
                                <tr> <th>Maintain By</th> <td>{"DataSearc"}</td> </tr>
                                <tr> <th>LastModified On</th> <td>{"6/6/2025"}</td> </tr>
                             
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

export default AboutUs


