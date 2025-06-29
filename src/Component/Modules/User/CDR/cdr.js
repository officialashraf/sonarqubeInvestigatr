import React, { useState } from 'react';
import styles from "./Cdr.module.css"
import AddFilter2 from '../../Filters/addFilter';
import FileUpload from './FileUpload';
import FtpPopup from './FtpPopup';


const Cdr = ({ togglePopup }) => {
  const [selectedOption, setSelectedOption] = useState('localStorage');
  const [selectDataType, setSelectDataType] = useState('CDR');
  const [showPopup, setShowPopup] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false); // 🔹 for upload screen
  const [showFtpPopup, setShowFtpPopup] = useState(false);




  const options = [
    { value: 'localStorage', label: 'Upload from Local Storage', description: 'Add a file from local drive' },
    { value: 'ftpServer', label: 'Upload from FTP Server', description: 'Add Documents, Images, Videos, Recordings and more from local drive.' },
    { value: 'osintData', label: 'Import via OSINT data', description: 'Include attributes for harvesting OSINT data' },
  ];

  // const batchNames = ['New Batch 1', 'New Batch 2', 'New Batch 3'];
  const dataTypes = ['CDR', 'IPDR', 'Other'];
  const handleProceed = () => {
    if (selectedOption === 'osintData') {
      setShowPopup(true); // 🔹 show AddFilter2
    } else if (selectedOption === 'ftpServer') {
      setShowFtpPopup(true);
    }
    else if (selectedOption === 'localStorage') {
      setShowFileUpload(true); // 🔹 open upload popup
    }
  };

  return (
    <>
      <div className={styles.popupOverlay}>
        <div className={styles.popupContainerCdr}>
          <div className={styles.popupHeaderCdr}>
            <h3>Add Resources</h3>
            <button className={styles.closeIconCdr} onClick={togglePopup}>&times;</button>
          </div>
          <div className={styles.popupBodyCdr}>
            <p>Choose an option to continue</p>
            <div className={styles.optionsListCdr}>
              {options.map((option) => (
                <label key={option.value} className={`${styles.optionItemCdr} ${selectedOption === option.value ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="resourceOption"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={() => setSelectedOption(option.value)}
                  />
                  <div className={styles.optionContentCdr}>
                    <span className={styles.optionLabelCdr}>{option.label}</span>
                    <span className={styles.optionDescriptionCdr}>{option.description}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* <div className={styles.batchSelectionCdr}>
            <label>
              <input
                type="radio"
                name="batchType"
                value="newBatch"
                checked={batchType === 'newBatch'}
                onChange={() => setBatchType('newBatch')}
              />
              Create New Batch
            </label>
            <label>
              <input
                type="radio"
                name="batchType"
                value="existingBatch"
                checked={batchType === 'existingBatch'}
                onChange={() => setBatchType('existingBatch')}
              />
              Add to Existing Batch
            </label>
          </div> */}

            {/* <div className={styles.customOutlinedWrapper}>
            <label className={styles.customBadgeLabel}>Batch Name*</label>
            <select
              className={styles.customSelectField}
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            >
              {batchNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div> */}

            <div className={styles.targetDataTypeCdr}>
              {/* <div className={styles.selectTargetCdr}>
              <div className={styles.customOutlinedWrapper}>
                <label className={styles.customBadgeLabel}>Select Target</label>
                <input
                  type="text"
                  className={styles.customSelectField}
                  placeholder="Enter Target"
                  value={selectTarget}
                  onChange={(e) => setSelectTarget(e.target.value)}
                />
                <small>Selected Target would be applied to the entire batch. You can add the targets to individual files later.</small>
              </div>
            </div> */}

              <div className={styles.selectDataTypeCdr}>
                <div className={styles.customOutlinedWrapper}>
                  <label className={styles.customBadgeLabel}>Select Data Type*</label>
                  <select
                    className={styles.customSelectField}
                    value={selectDataType}
                    onChange={(e) => setSelectDataType(e.target.value)}
                  >
                    {dataTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <small>Selected Data Type would be applied to all resources in this batch</small>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.popupFooterCdr}>
            <button className={styles.cancelBtnCdr} onClick={togglePopup}>CANCEL</button>
            <button className={styles.proceedBtnCdr} onClick={handleProceed}>PROCEED</button>
          </div>
        </div>
      </div>
      {showPopup && <AddFilter2 togglePopup={() => setShowPopup(false)} />}
      {showFileUpload && <FileUpload togglePopup={() => setShowFileUpload(false)} />}
      {showFtpPopup && <FtpPopup togglePopup={() => setShowFtpPopup(false)} />}
    </>
  );
};

export default Cdr;
