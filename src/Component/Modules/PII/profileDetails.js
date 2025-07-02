import { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Phone, Email, Person, Cake, Wc } from '@mui/icons-material';
import Carousel from 'react-bootstrap/Carousel';
import './profileDetails.css';
import { useSelector } from 'react-redux';
import userImg from '../../Assets/Images/blank-profile.webp'

const ProfileDetails = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const profiles = useSelector((state) => state.pii?.data?.cyniqBasicResult || '')
  useEffect(() => {
    // Simulating API call - replace with your actual API fetch
    const fetchData = async () => {
      try {
        setLoading(true);

        if (profiles && Array.isArray(profiles) && profiles.length > 0) {
          setProfileData(profiles[0]);
        } else {
          setProfileData([]); // Set an empty array if profiles is null or empty
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profiles]);

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Body className="p-0">

          <div className="profile-details">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  {profileData && Array.isArray(profileData.images) && profileData.images.length > 0 ? (
                    <Carousel >
                      {profileData.images.map((image, index) => (
                        <Carousel.Item key={index}>
                          <img src={image} alt={`Profile Pic ${index}`} width={100} height={100} />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (

                    <img src={userImg} alt={`Profile Pic`} width={100} height={100} />
                  )}
                </div>
                {/* <div className="profile-id"><ul className="email-list">
                  {profileData && Array.isArray(profileData.names) && profileData.names.length > 0 ? (
                    profileData.names.slice(0, 3).map((name, index) => <li key={index}>{name}</li>)
                  ) : (
                    <li></li>
                  )}
                </ul></div> */}
              </div>
            </div>
            <div className="detail-item">
              <div className="profile-name-above-phone">
                {profileData?.names?.[0] || "Unknown Name"}
              </div>
            </div>
            {/* <div className="detail-item"> */}
            {/* <div className="detail-label">
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
              </div> */}
            {/* <div className="detail-header">
                <div className="detail-label">Phone Number</div>
                <Phone fontSize="small" className="detail-icon" />
              </div>
              <div className="detail-value">
                <ul className="email-list">
                  {profileData && Array.isArray(profileData.phones) && profileData.phones.length > 0 ? (
                    profileData.phones.map((phone, index) => <li key={index}>{phone}</li>)
                  ) : (
                    <li>--</li>
                  )}
                </ul>
              </div>
            </div> */}
            <div className="detail-item">
              <div className="detail-row">
                <div className="detail-text">
                  <div className="detail-label">Phone Number</div>
                  <div className="detail-value">
                    <ul className="email-list">
                      {profileData && Array.isArray(profileData.phones) && profileData.phones.length > 0 ? (
                        profileData.phones.map((phone, index) => <li key={index}>{phone}</li>)
                      ) : (
                        <li>--</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="detail-icon-wrapper">
                  <Phone fontSize="medium" className="detail-icon" />
                </div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-row">
                <div className="detail-text">
                  <div className="detail-label">E-mail ID</div>
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
                <div className="detail-icon-wrapper">
                  <Email fontSize="medium" className="detail-icon" />
                </div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-row">
                <div className="detail-text">
                  <div className="detail-label">Names</div>
                  <div className="detail-value">{profileData?.aliases || "--"}</div>
                </div>
                <div className="detail-icon-wrapper">
                  <Person fontSize="medium" className="detail-icon" />
                </div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-row">
                <div className="detail-text">
                  <div className="detail-label">DOB/Age</div>
                  <div className="detail-value">{profileData?.ages || "--"}</div>
                </div>
                <div className="detail-icon-wrapper">
                  <Cake fontSize="medium" className="detail-icon" />
                </div>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-row">
                <div className="detail-text">
                  <div className="detail-label">Gender</div>
                  <div className="detail-value">{profileData?.gender || "--"}</div>
                </div>
                <div className="detail-icon-wrapper">
                  <Wc fontSize="medium" className="detail-icon" />
                </div>
              </div>
            </div>


          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileDetails;
