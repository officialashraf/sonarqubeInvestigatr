
import React, { useState, useEffect } from 'react';
import { Card, Container, Badge } from 'react-bootstrap';
import { Phone, Email, Person, Cake, Wc } from '@mui/icons-material';

import './profileDetails.css';
import { useSelector } from 'react-redux';
import userImg from '../../Assets/blank-profile.webp'
const ProfileDetails = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const profiles = useSelector((state) => state.pii.data.cyniqBasicResult)
  // console.log("profile",profiles[0])
  // setProfileData(profiles);
  useEffect(() => {
    // Simulating API call - replace with your actual API fetch
    const fetchData = async () => {
      try {
   
        if (profiles && Array.isArray(profiles) && profiles.length > 0) {
          setProfileData(profiles[0]);
        } else {
          setProfileData([]); // Set an empty array if profiles is null or empty
        }
        // if (profiles && profiles.length > 0) {
        //   setProfileData(profiles[0]);
        // }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [profiles]);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <Container  className="profile-container">
      <Card className="profile-card">
        <Card.Body className="p-0">
         
          
          <div className="profile-details">
          <div className="profile-header">
             <div className="profile-avatar-section">
              <div className="profile-avatar">
              {profileData && Array.isArray(profileData.images) && profileData.images.length > 0 ? (
  <img src={profileData.images[0]} alt="Profile Image" width={100} />
) : (
  <img src={userImg} alt="Profile Image" width={100} />
)}
              </div>
              <div className="profile-id"><ul className="email-list">
  {profileData && Array.isArray(profileData.names) && profileData.names.length > 0 ? (
    profileData.names.slice(0, 3).map((name, index) => <li key={index}>{name}</li>)
  ) : (
    <li>--</li>
  )}
</ul></div>
              {/* {profileData.active && (
                <Badge pill className="active-badge">Active</Badge>
              )} */}
            </div>
            {/* <div className="threat-score-section">
              <div className="threat-label">Perceived Threat Score</div>
              <Badge className="threat-score">{profileData.threatScore || "--"}</Badge>
            </div> */}
          </div>
            <div className="detail-item">
              <div className="detail-label">
                <Phone fontSize="small" /> Phone Number
              </div>
              <div className="detail-value">
<ul className="email-list">
  {profileData && Array.isArray(profileData.phones) && profileData.phones.length > 0 ? (
    profileData.phones.map((phones, index) => <li key={index}>{phones}</li>)
  ) : (
    <li>--</li>
  )}
</ul>
</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Email fontSize="small" /> E-mail ID
              </div>
              <div className="detail-value">
              <ul className="email-list">
  {profileData && Array.isArray(profileData.emails) && profileData.emails.length > 0 ? (
    profileData.emails.map((email, index) => <li key={index}>{email}</li>)
  ) : (
    <li>--</li>
  )}
</ul>
</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Person fontSize="small" /> Aliases
              </div>
              <div className="detail-value">{profileData && profileData.aliases || "--"}</div>
            </div> 
            
            <div className="detail-item">
              <div className="detail-label">
                <Cake fontSize="small" /> D.O.B/Age
              </div>
              <div className="detail-value">{profileData && profileData.ages|| "--"}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Wc fontSize="small" /> Gender
              </div>
              <div className="detail-value"  style={{color:"white"}}>{profileData && profileData.gender|| "--"}</div>
            </div>
          </div>
      
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileDetails;