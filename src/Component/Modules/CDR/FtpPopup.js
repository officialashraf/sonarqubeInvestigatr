import React from 'react';
import styles from './Cdr.module.css';

const FtpPopup = ({ togglePopup }) => {
    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainerCdr}>
                <div className={styles.popupHeaderCdr}>
                    <h3>Available FTPs</h3>
                    <button className={styles.closeIconCdr} onClick={togglePopup}>&times;</button>
                </div>

                <div className={styles.popupBodyCdr}>
                    <div className={styles.ftpItem}>
                        <span className={styles.ftpName}>ftp-hs-svc</span>
                        <span className={styles.lastConnected}>Last connected: Jun 21, 2025 17:09 PM</span>
                        <input type="radio" name="ftpSelect" className={styles.radioBtn} />
                    </div>
                </div>

                <div className={styles.popupFooterCdr}>
                    <button className={styles.cancelBtnCdr} onClick={togglePopup}>CANCEL</button>
                    <button className={styles.proceedBtnCdr} disabled>ADD</button>
                </div>
            </div>
        </div>
    );
};

export default FtpPopup;
