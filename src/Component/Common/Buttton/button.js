import styles from './button.module.css';

const AppButton = ({ children, onClick }) => {
  return <button onClick={onClick} className={styles.button}>{children}</button>;
};

export default AppButton;
