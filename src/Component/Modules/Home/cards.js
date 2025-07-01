import axios from 'axios';
import { Card, Container } from 'react-bootstrap';
import { Folder, FileEarmarkPlus, PieChart, Check2Circle, PauseCircle, Archive, Trash } from 'react-bootstrap-icons';
import  styles from './card.module.css';
import { useCallback, useEffect, useState } from 'react';
import Cookies from "js-cookie";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { toast } from 'react-toastify';

const cardTemplate = [
  { icon: <Folder size={15} />, name: 'All Cases', key: 'case_count' },
  { icon: <FileEarmarkPlus size={15} />, name: 'New Cases', key: 'New' },
  { icon: <PieChart size={15} />, name: 'In Progress', key: 'In Progress' },
  { icon: <Check2Circle size={15} />, name: 'Closed', key: 'Closed' },
  { icon: <PauseCircle size={15} />, name: 'On Hold', key: 'On Hold' },
  { icon: <Archive size={15} />, name: 'Archived', key: 'Archived' },
  { icon: <Trash size={15} />, name: 'Deleted', key: 'Deleted' },
];

const StatusCard = ({ name, number, icon }) => {
  return (
<Card className={styles.customCard}>
  <Card.Body className={styles.customCardBody}>
    
    {/* Top Row */}
    <div className={styles.customTopRow}>
      <div className={styles.customIconCircle}>{icon}</div>
      <div className={styles.customCardLabel}>{name}</div>
    </div>

    {/* Bottom Row */}
    <div className={styles.customBottomRow}>
      <div className={styles.customCardNumber}>{number}</div>
      <div className={styles.customArrowCircle}>
        <ArrowOutwardIcon size={14}  />
      </div>
    </div>

  </Card.Body>
</Card>


  );
}

const CardList = () => {
  const Token = Cookies.get('accessToken');
  const [cardData, setCardData] = useState(cardTemplate);

  const getCardData = useCallback(async () => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case/states-count`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      console.log("response", response.data)

      const apiData = response.data;

      const updatedData = cardTemplate.map(item => ({
        ...item,
        number: apiData[item.key] || 0
      }));
      console.log("updateData", updatedData)
      setCardData(updatedData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [Token]);


  useEffect(() => {
    getCardData()
    const handleDatabaseUpdate = () => {
      getCardData()
    };

    window.addEventListener("databaseUpdated", handleDatabaseUpdate);

    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
    };
  }, [getCardData]);

  //   const carListData = useCallback(() => {
  //     getCardData()
  // }, [cardData]);
  // useEffect(() => {
  //   if (refresh) {
  //     carListData(); // Runs only when refresh changes
  //       setRefresh(false); // Reset refresh state after running
  //   }
  // }, [refresh]);
  return (
    <Container fluid className={styles.cardListContainer}>
      {cardData.map((item, index) => (
        <StatusCard key={index} name={item.name} number={item.number || 0} icon={item.icon} />
      ))}
    </Container>
  );
}

export default CardList;






