// import { useState, useEffect } from 'react';
// import { Card, Container } from 'react-bootstrap';
// import { Phone, Email, Person, Cake, Wc } from '@mui/icons-material';
// import Carousel from 'react-bootstrap/Carousel';
// import styles from './profileDetails.module.css';
// import { useSelector } from 'react-redux';
// import userImg from '../../Assets/Images/blank-profile.webp'

// const ProfileDetails = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const profiles = useSelector((state) => state.pii?.data?.cyniqBasicResult || '')
//   useEffect(() => {
//     // Simulating API call - replace with your actual API fetch
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         if (profiles && Array.isArray(profiles) && profiles.length > 0) {
//           setProfileData(profiles[0]);
//         } else {
//           setProfileData([]); // Set an empty array if profiles is null or empty
//         }

//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [profiles]);

//   if (loading) {
//     return <div className="loading-container">Loading profile...</div>;
//   }

//   return (
//     <Container className={styles.profileContainer}>
//       <Card className={styles.profileCard}>
//         <Card.Body className="p-0">

//           <div className={styles.profileDetails}>
//             <div className={styles.profileHeader}>
//               <div className={styles.profileAvatarSection}>
//                 <div className={styles.profileAvatar}>
//                   {profileData && Array.isArray(profileData.images) && profileData.images.length > 0 ? (
//                     <Carousel >
//                       {profileData.images.map((image, index) => (
//                         <Carousel.Item key={index}>
//                           <img src={image} alt={`Profile Pic ${index}`} width={100} height={100} />
//                         </Carousel.Item>
//                       ))}
//                     </Carousel>
//                   ) : (

//                     <img src={userImg} alt={`Profile Pic`} width={100} height={100} />
//                   )}
//                 </div>
      
//               </div>
//             </div>
//             <div className={styles.detailItem}>
//               <div className={styles.profileNameAbovePhone}>
//                 {profileData?.names?.[0] || "Unknown Name"}
//               </div>
//             </div>
          
//             <div className={styles.detailItem}>
//               <div className={styles.detailRow}>
//                 <div className={styles.detailText}>
//                   <div className={styles.detailLabel}>Phone Number</div>
//                   <div className={styles.detailValue}>
//                     <ul className={styles.emailList}>
//                       {profileData && Array.isArray(profileData.phones) && profileData.phones.length > 0 ? (
//                         profileData.phones.map((phone, index) => <li key={index}>{phone}</li>)
//                       ) : (
//                         <li>--</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className={styles.detailIconWrapper}>
//                   <Phone fontSize="medium" className={styles.detailIcon} />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <div className={styles.detailRow}>
//                 <div className={styles.detailText}>
//                   <div className={styles.detailLabel}>E-mail ID</div>
//                   <div className={styles.detailValue}>
//                     <ul className={styles.emailList}>
//                       {profileData && Array.isArray(profileData.emails) && profileData.emails.length > 0 ? (
//                         profileData.emails.map((email, index) => <li key={index}>{email}</li>)
//                       ) : (
//                         <li>--</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className={styles.detailIconWrapper}>
//                   <Email fontSize="medium" className={styles.detailIcon} />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <div className={styles.detailRow}>
//                 <div className={styles.detailText}>
//                   <div className={styles.detailLabel}>Names</div>
//                   <div className={styles.detailValue}>{profileData?.aliases || "--"}</div>
//                 </div>
//                 <div className={styles.detailIconWrapper}>
//                   <Person fontSize="medium" className={styles.detailIcon} />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <div className={styles.detailRow}>
//                 <div className={styles.detailText}>
//                   <div className={styles.detailLabel}>DOB/Age</div>
//                   <div className={styles.detailValue}>{profileData?.ages || "--"}</div>
//                 </div>
//                 <div className={styles.detailIconWrapper}>
//                   <Cake fontSize="medium" className={styles.detailIcon} />
//                 </div>
//               </div>
//             </div>

//             <div className={styles.detailItem}>
//               <div className={styles.detailRow}>
//                 <div className={styles.detailText}>
//                   <div className={styles.detailLabel}>Gender</div>
//                   <div className={styles.detailValue}>{profileData?.gender || "--"}</div>
//                 </div>
//                 <div className={styles.detailIconWrapper}>
//                   <Wc fontSize="medium" className={styles.detailIcon} />
//                 </div>
//               </div>
//             </div>
//           </div>

//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default ProfileDetails;
