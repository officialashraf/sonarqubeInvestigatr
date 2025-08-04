import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Container, CircularProgress, Avatar } from '@mui/material';
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
import styles from './cardDetails.module.css';
import { useSelector } from 'react-redux';
import { FaSkype, FaGoogle, FaTelegram, FaWhatsapp, FaDiscord, FaSnapchatGhost, FaPinterest } from 'react-icons/fa';
import { SiPhonepe, SiGooglepay, SiGmail, SiTiktok, SiVk } from 'react-icons/si';

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profiles = useSelector((state) => state.pii?.data || []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        if (profiles && profiles.length > 0) {
          setUsers(profiles.slice(1));
        } else {
          setUsers([]);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [profiles]);

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
      <Container className={styles.loaderContainer}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.errorContainer}>
        <Typography className={styles.errorMessage}>Error: {error}</Typography>
      </Container>
    );
  }

  const iconMap = {
    phones: PhoneIcon,
    emails: EmailIcon,
    addresses: LocationOnIcon,
    urls: LinkIcon,
  };

  return (
    <Container maxWidth="lg" className={styles.cardsContainer} sx={{ marginBottom: '10px' }}>
      <Grid container spacing={3}>
        {profiles.map((user, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={styles.userCard}>
              <CardContent>
                <div className={styles.userHeader}>
                  <Avatar
                    src={user.imageUrls && user.imageUrls.length > 0 ? user.imageUrls[0] : undefined}
                    alt={
                      user.names &&
                      user.names.length > 0 &&
                      typeof user.names[0] === 'string' &&
                      !["none", "null", "undefined", "n"].includes(user.names[0].toLowerCase())
                        ? user.names[0]
                        : ""
                    }
                    sx={{ width: 60, height: 60 }}
                  />
                  <div className={styles.userInfo}>
                    <Typography>
                      {(user.names && user.names.length > 0 &&
                        typeof user.names[0] === 'string' &&
                        !["none", "null", "undefined", "n"].includes(user.names[0].toLowerCase()))
                        ? user.names[0]
                        : (user.user_displayname && typeof user.user_displayname === 'string' &&
                          !["none", "null", "undefined", "n"].includes(user.user_displayname.toLowerCase())
                          ? user.user_displayname
                          : "")
                      }
                    </Typography>
                  </div>
                </div>

                {/* Dynamic Fields */}
                {Object.entries(user).map(([key, value]) => {
                  if (
                    key === "names" ||
                    !value ||
                    (typeof value === "string" && value.toLowerCase() === "none") ||
                    (Array.isArray(value) && (value.length === 0 || value.some(v => typeof v === "string" && v.toLowerCase() === "none")))
                  )
                    return null;
                    
                  const IconComponent = iconMap[key] || null;

                  return (
                    <div key={key} className={styles.infoRow}>
                      <div className={styles.infoIconWrapper}>
                        {IconComponent && (
                          <IconComponent className={styles.infoIcon} />
                        )}
                      </div>
                      <div className={styles.infoText}>
                        <div className={styles.infoLabel}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className={styles.infoValue}>
                          {Array.isArray(value) ? value[0] : value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserCards;