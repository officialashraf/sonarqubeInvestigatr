import React from "react";
import styles from "./popup.module.css"; // Rename your CSS if using module

const PopupModal = ({ title, children, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <button className={styles.closeIcon} onClick={onClose}>
          &times;
        </button>
        <div className={styles.renewPopup}>
          {title && <h5 >{title}</h5>}
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;

