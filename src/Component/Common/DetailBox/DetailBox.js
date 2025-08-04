import styles from './detailBox.module.css';

const DetailBox = ({ label, value, isStatus }) => {
 const getStatusClass = () => {
  const normalized = value?.toLowerCase();

  const activeStatuses = ['active', 'new', 'in progress'];
  const inactiveStatuses = ['inactive', 'closed', 'on hold'];

  if (activeStatuses.includes(normalized)) return styles.active;
  if (inactiveStatuses.includes(normalized)) return styles.inactive;

  return '';
};


  return (
    <div className={styles.detailBox}>
      <span className={styles.label}>{label}</span>
      {isStatus ? (
        <span className={`${styles.status} ${getStatusClass()}`}>
          {value || '—'}
        </span>
      ) : (
        <span className={styles.value}>{value || '—'}</span>
      )}
    </div>
  );
};

export default DetailBox;
