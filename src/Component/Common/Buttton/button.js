import styles from './button.module.css';

const AppButton = ({ children }) => {
  return <button className={styles.button}>{children}</button>;
};

export default AppButton;
