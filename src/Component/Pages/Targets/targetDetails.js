import React from 'react'
import { Table , CloseButton} from 'react-bootstrap'
const TargetDetails =({ togglePopup, details }) => {
    console.log("details", details)
  return (
  
<div className="popup-overlay">
            <div className="popup-containera">
                <div className="popup-content">
          
                     <div className="header">
                    <span> <h5>Keyword Details</h5></span>
                    <CloseButton onClick={togglePopup}/>
                    </div>
                    <div className="case-details-container"> 
                <Table bordered hover className='custom-table custom-table-th' >
                <tr> <th>Name</th> <td>{details.name}</td> </tr> 
                     <tbody> 
                         <tr> <th>ID</th> <td>{details.id}</td> </tr> 
                       <tr> <th>Created On</th> <td>{details?.created_on? details.created_on.slice(0,18) : '-'}</td> </tr> 
                       <tr> <th>Created By</th> <td>{details?.created_by? details.created_by.slice(0,12) : '-'}</td> </tr>
                        <tr> <th>Modified On</th> <td>{details?.modified_on? details.modified_on.slice(0,18): '-'}</td> </tr> 
                        <tr> <th>Modified By</th> <td>{details?.modified_by? details.modified_by.slice(0,12): '-'}</td> </tr>
                        <tr> <th>Description</th> <td>{details.description || '-'}</td> </tr>
                          <tr> <th>Synonyms/Alternative_Keywords</th> <td>{details.synonyms.join(',') || '-'}</td> </tr>
                         <tr> <th>Threat-Score</th> <td>{details.threat_weightage || '-'}</td> </tr>
                         <tr> <th>Type</th> <td>{details.type || '-'}</td> </tr>
                           <tr> <th>Active</th>  <td>{details.is_active ? 'active' : 'deactive'}</td> </tr>
                             {/* <tr> <th>Deleted</th> <td>{details.is_deleted || '-'}</td> </tr> */}
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

export default TargetDetails


