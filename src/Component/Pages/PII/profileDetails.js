
import React, { useState, useEffect } from 'react';
import { Card, Container, Badge } from 'react-bootstrap';
import { Phone, Email, Person, Cake, Wc } from '@mui/icons-material';
import './profileDetails.css';

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API call - replace with your actual API fetch
    const fetchData = async () => {
      try {
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        
        // Sample data for demonstration
        const data = {
          id: "T29701",
          active: true,
          threatScore: 4,
          phoneNumber: "9876777210",
          email: "-",
          aliases: "-",
          ageAndDob: "-",
          gender: "-"
        };
        
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <Container fluid className="profile-container">
      <Card className="profile-card">
        <Card.Body className="p-0">
         
          
          <div className="profile-details">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar"></div>
              <div className="profile-id">{profileData.id}</div>
              {profileData.active && (
                <Badge pill className="active-badge">Active</Badge>
              )}
            </div>
            <div className="threat-score-section">
              <div className="threat-label">Perceived Threat Score</div>
              <Badge className="threat-score">{profileData.threatScore}</Badge>
            </div>
          </div>
            <div className="detail-item">
              <div className="detail-label">
                <Phone fontSize="small" /> Phone Number
              </div>
              <div className="detail-value">{profileData.phoneNumber}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Email fontSize="small" /> E-mail ID
              </div>
              <div className="detail-value">{profileData.email}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Person fontSize="small" /> Aliases
              </div>
              <div className="detail-value">{profileData.aliases}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Cake fontSize="small" /> Age & Date of Birth
              </div>
              <div className="detail-value">{profileData.ageAndDob}</div>
            </div>
            
            <div className="detail-item">
              <div className="detail-label">
                <Wc fontSize="small" /> Gender
              </div>
              <div className="detail-value">{profileData.gender}</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileDetails;