import styles from './button.module.css';

const AppButton = ({ children, onClick,disabled }) => {
  return<button
      onClick={onClick}
      className={`${styles.button} ${disabled ? styles.buttonDisabled : ''}`}
      disabled={disabled}
    >
      {children}
    </button>;
};

export default AppButton;
