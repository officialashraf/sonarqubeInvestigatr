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
                <div className="profile-id"><ul className="email-list">
                  {profileData && Array.isArray(profileData.names) && profileData.names.length > 0 ? (
                    profileData.names.slice(0, 3).map((name, index) => <li key={index}>{name}</li>)
                  ) : (
                    <li></li>
                  )}
                </ul></div>

              </div>

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
              <div className="detail-value">{(profileData && profileData.aliases) || "--"}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Cake fontSize="small" /> D.O.B/Age
              </div>
              <div className="detail-value">{(profileData && profileData.ages) || "--"}</div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Wc fontSize="small" /> Gender
              </div>
              <div className="detail-value" style={{ color: "white" }}>{(profileData && profileData.gender) || "--"}</div>
            </div>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileDetails;