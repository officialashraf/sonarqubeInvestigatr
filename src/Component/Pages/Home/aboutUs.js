import React from 'react';
import buildInfo from '../../../constants/build-info';



import { Table, CloseButton } from 'react-bootstrap'
const AboutUs = ({ togglePopup }) => {

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
                            <tbody style={{ textAlign: 'left' }}> <tr> <th>Product Name</th> <td>{buildInfo.productName}</td> </tr>
                                <tr> <th> Version </th> <td>{buildInfo.version}</td> </tr>
                                {/* <tr> <th>LastModified On</th> <td>{buildInfo.lastModifiedOn}</td> </tr>
                                <tr> <th>Updated By:</th> <td>{buildInfo.updatedBy}</td> </tr>
                                <tr> <th>Maintain By</th> <td>{buildInfo.maintainedBy}</td> </tr> */}

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


