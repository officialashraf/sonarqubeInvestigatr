import buildInfo from '../../../InfoApp/build-info';

import PopupModal from "../../Common/Popup/popup";
import DetailBox from "../../Common/DetailBox/DetailBox";
import styles from '../../Common/DetailBox/detailBox.module.css';
import AppButton from "../../Common/Buttton/button";

const AboutUs = ({ togglePopup }) => {
    return (
        <PopupModal title="About Us" onClose={togglePopup}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <DetailBox label="Product Name" value={buildInfo.productName} />
                    <DetailBox label="Version" value={buildInfo.version} />
                    <DetailBox label="Updated By" value={"Curated Codes"} />
                    <DetailBox label="Maintained By" value={"Curated Codes"} />
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <AppButton onClick={togglePopup}>Cancel</AppButton>
            </div>
        </PopupModal>
    );
};

export default AboutUs;
