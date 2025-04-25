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
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

import './cardDetails.css'; // Import external CSS file
import { useSelector } from 'react-redux';
import { Tiktok } from 'react-bootstrap-icons';


const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profiles = useSelector((state) => state.pii.data.cyniqBasicResult)
  console.log("profile", profiles)
  useEffect(() => {
    // Function to fetch data from API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint



        if (profiles &&  profiles.length > 0) {
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
  console.log("users", users)
  const platformIconMap = {
    linkedin: { icon: LinkedInIcon, color: "#0A66C2" },
    facebook: { icon: FacebookIcon, color: "#1877F2" },
    instagram: { icon: InstagramIcon, color: "#C13584" },
    twitter: { icon: TwitterIcon, color: "#1DA1F2" },
    youtube: { icon: YouTubeIcon, color: "#FF0000" },
    tiktok: { icon: LinkIcon, color: "#010101" },
    vk: { icon: Tiktok, color: "#45668E" },
    // अन्य प्लेटफ़ॉर्म्स को यहाँ जोड़ें
  };
  
  const getPlatformIcon = (source) => {
    if (!source) return null;
    const key = source.toLowerCase();
    const platform = platformIconMap[key];
    if (!platform) return null;
    const IconComponent = platform.icon;
    return  <IconComponent
    sx={{
      fontSize: '2.5rem',
      color: platform.color,
    display:'flex-end',
    }}
  />;
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
      {users &&
  users
    .filter((user) => user.has_account) // Only users with has_account: true
    .map((user) => (
      <Grid item xs={12} sm={6} md={4} key={user.id}>
        <Card className="user-card">
          <CardContent>
          <div className="user-header">
  {/* Left: Profile Image */}
  <Avatar className="user-avatar">
    {user && Array.isArray(user.images) && user.images.length > 0 ? (
      <img src={user.images[0]} alt="Profile Image" width={100} />
    ) : (
      <Avatar />
    )}
  </Avatar>

  {/* Center: Name & User ID */}
  <div style={{color:'white'}}>
    {user && Array.isArray(user.names) && user.names.length > 0 ? (
      user.names.slice(0, 1).map((name, index) => (
        <Typography key={index} >{name}</Typography>
      ))
    ) : (
      <Typography> </Typography>
    )}

    {user && Array.isArray(user.user_ids) && user.user_ids.length > 0 ? (
      user.user_ids.slice(0, 1).map((userid, index) => (
        <Typography key={index}>{userid}</Typography>
      ))
    ) : (
      <Typography> </Typography>
    )}
  </div>

  {/* Right: pii_source Icon inside Avatar */}
  {user.pii_source && (
    <div style={{marginRight:'5px'}} >
      {getPlatformIcon(user.pii_source)}
    </div>
  )}

</div>

            <Typography className="user-info">
              {user && Array.isArray(user.jobs) && user.jobs.length > 0
                ? user.jobs.slice(0, 1).map((job, index) => <div key={index}>{job}</div>)
                : " "}
            </Typography>

            <Typography className="user-info">
              {user && Array.isArray(user.educations) && user.educations.length > 0
                ? user.educations.slice(0, 1).map((edu, index) => <div key={index}>{edu}</div>)
                : " "}
            </Typography>

            <Typography className="user-info">
              {user && Array.isArray(user.usernames) && user.usernames.length > 0
                ? user.usernames.slice(0, 1).map((username, index) => <div key={index}>{username}</div>)
                : " "}
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