import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Avatar
} from '@mui/material';
import {
  Link as LinkIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import './cardDetails.css';
import { useSelector } from 'react-redux';
import { FaSkype, FaGoogle, FaTelegram, FaWhatsapp, FaDiscord, FaSnapchatGhost, FaPinterest } from 'react-icons/fa';
import { SiPhonepe, SiGooglepay, SiGmail, SiTiktok, SiVk } from 'react-icons/si';

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const profiles = useSelector((state) => state.pii?.data?.cyniqBasicResult || '');

  useEffect(() => {
    // Function to fetch data from API
    const fetchUsers = async () => {
      try {
        setLoading(true);

        if (profiles && profiles.length > 0) {
          setUsers(profiles.slice(1));
        } else {
          setUsers([]); // Set an empty array if profiles is null or empty
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [profiles]);

  // Enhanced platform icon mapping with standard platform colors
  const platformIconMap = {
    linkedin: { icon: LinkedInIcon, color: "#0A66C2" },
    facebook: { icon: FacebookIcon, color: "#1877F2" },
    instagram: { icon: InstagramIcon, color: "#C13584" },
    twitter: { icon: TwitterIcon, color: "#1DA1F2" },
    youtube: { icon: YouTubeIcon, color: "#FF0000" },
    tiktok: { icon: SiTiktok, color: "#000000" },
    vk: { icon: SiVk, color: "#45668E" },
    skype: { icon: FaSkype, color: "#00AFF0" },
    google: { icon: FaGoogle, color: "#4285F4" },
    gpay: { icon: SiGooglepay, color: "#4285F4" },
    phonepay: { icon: SiPhonepe, color: "#5F259F" },
    whatsapp: { icon: FaWhatsapp, color: "#25D366" },
    gmail: { icon: SiGmail, color: "#EA4335" },
    telegram: { icon: FaTelegram, color: "#0088CC" },
    discord: { icon: FaDiscord, color: "#5865F2" },
    snapchat: { icon: FaSnapchatGhost, color: "#FFFC00" },
    pinterest: { icon: FaPinterest, color: "#E60023" },
    axisbank: { icon: SiPhonepe, color: "#97144D" },
    // Default for unknown platforms
    default: { icon: Avatar }
  };

  const getPlatformIcon = (source) => {
    if (!source) return null;
    const key = source.toLowerCase();
    const platform = platformIconMap[key] || platformIconMap.default;
    const IconComponent = platform.icon;

    return (
      <IconComponent
        style={{
          fontSize: '2rem',
          color: platform.color,

        }}
      />
    );
  };



  if (loading) {
    return (
      <Container className="loader-container">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Typography className="error-message">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="cards-container">

      <Grid container spacing={3}>
        {users && users.filter((user) => user.has_account) // Only users with has_account: true
          .map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id || Math.random().toString()}>
              <Card className="user-card">
                <CardContent>
                  <div className="user-header">
                    {/* Platform Icon */}
                    {user.pii_source ? (
                      <div style={{ marginRight: '15px' }}>
                        {getPlatformIcon(user.pii_source)}
                      </div>
                    ) : (
                      <Avatar />
                    )}

                    {/* User Info */}
                    <div className="user-info">
                      {user && Array.isArray(user.names) && user.names.length > 0 ? (
                        user.names.slice(0, 1).map((name, index) => (
                          <Typography key={index} >{name}</Typography>
                        ))
                      ) : (
                        <Typography >Unknown User</Typography>
                      )}

                      {user && Array.isArray(user.user_ids) && user.user_ids.length > 0 ? (
                        user.user_ids.slice(0, 1).map((userid, index) => (
                          <Typography key={index}>{userid}</Typography>
                        ))
                      ) : null}
                    </div>
                  </div>

                  <Typography className="user-info">
                    {user && Array.isArray(user.jobs) && user.jobs.length > 0
                      ? user.jobs.slice(0, 1).map((job, index) => <div key={index}>{job}</div>)
                      : null}
                  </Typography>

                  <Typography className="user-info">
                    {user && Array.isArray(user.educations) && user.educations.length > 0
                      ? user.educations.slice(0, 1).map((edu, index) => <div key={index}>{edu}</div>)
                      : null}
                  </Typography>

                  <Typography className="user-info">
                    {user && Array.isArray(user.usernames) && user.usernames.length > 0
                      ? user.usernames.slice(0, 1).map((username, index) => <div key={index}>{username}</div>)
                      : null}
                  </Typography>

                  <Typography className="user-info">
                    <PhoneIcon className="info-icon" />
                    {user && Array.isArray(user.phones) && user.phones.length > 0
                      ? user.phones.slice(0, 1).map((phone, index) => <div key={index}>{phone}</div>)
                      : "--"}
                  </Typography>

                  <Typography className="user-info">
                    <EmailIcon className="info-icon" />
                    {user && Array.isArray(user.emails) && user.emails.length > 0
                      ? user.emails.slice(0, 1).map((email, index) => <div key={index}>{email}</div>)
                      : "--"}
                  </Typography>

                  <Typography className="user-info">
                    <LinkIcon className="info-icon" />
                    {user && Array.isArray(user.urls) && user.urls.length > 0
                      ? user.urls.slice(0, 1).map((url, index) => <div key={index}>{url}</div>)
                      : "--"}
                  </Typography>

                  <Typography className="user-info">
                    <LocationOnIcon className="info-icon" />
                    {user && Array.isArray(user.addresses) && user.addresses.length > 0
                      ? user.addresses.slice(0, 1).map((address, index) => <div key={index}>{address}</div>)
                      : "--"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};

export default UserCards;