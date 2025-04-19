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
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './cardDetails.css'; // Import external CSS file

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from API
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        {users.map(user => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Card className="user-card">
              <CardContent>
                <div className="user-header">
                  <Avatar className="user-avatar">
                    {user.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" className="user-name">{user.name}</Typography>
                </div>
                
                <Typography className="user-info">
                  <PhoneIcon className="info-icon" />
                  {user.phone}
                </Typography>
                
                <Typography className="user-info">
                  <EmailIcon className="info-icon" />
                  {user.email}
                </Typography>
                
                <Typography className="user-info">
                  <LocationOnIcon className="info-icon" />
                  {user.address && user.address.city}
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