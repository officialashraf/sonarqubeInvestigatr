// File: FileUpload.js
import React from 'react';
import styles from './Cdr.module.css';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useState, useRef } from 'react';

const FileUpload = ({ togglePopup }) => {
    const fileInputRef = useRef(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    const handleChooseFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // const handleUpload = async () => {
    //     if (!uploadedFile) {
    //         alert("Please choose a file first.");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("file", uploadedFile); // bas file bhej rahe ho

    //     try {
    //         const response = await fetch("http://your-server-url.com/upload", {
    //             method: "POST",
    //             body: formData,
    //         });

    //         const result = await response.json(); // or text
    //         alert("✅ Upload Success: " + result.message);
    //     } catch (err) {
    //         console.error("Upload error:", err);
    //         alert("❌ Failed to upload file.");
    //     }
    // };
    // const handleUpload = async () => {
    //     const formData = new FormData();

    //     if (uploadType === "local") {
    //         if (!uploadedFile) return alert("Please choose a file");
    //         formData.append("uploadType", "local");
    //         formData.append("file", uploadedFile);
    //     } else if (uploadType === "ftp") {
    //         if (!ftpFilePath) return alert("Please enter FTP file path");
    //         formData.append("uploadType", "ftp");
    //         formData.append("ftpPath", ftpFilePath);
    //     }

    //     await fetch("http://your-backend-url.com/upload", {
    //         method: "POST",
    //         body: formData,
    //     });
    // };
      

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            console.log('File selected:', file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setUploadedFile(file);
            console.log('File dropped:', file);
        }
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContainerCdr}>
                <div className={styles.popupHeaderCdr}>
                    <h3>Upload File</h3>
                    <button className={styles.closeIconCdr} onClick={togglePopup}>&times;</button>
                </div>
                <div className={styles.popupBodyCdr}>
                    <div className={styles.uploadContent}
                        onDragOver={(e) => e.preventDefault()}
                     onDrop={handleDrop}
                     >
                        <div className={styles.uploadIcon}>
                            <DriveFolderUploadIcon fontSize="inherit" />
                        </div>
                        <p>Drag and drop file to upload</p>
                        <span className={styles.orText}>or</span>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {uploadedFile && (
                            <p className={styles.fileName}>Selected File: {uploadedFile.name}</p>
                        )}

                        <button className={styles.chooseFileBtn} onClick={handleChooseFile} >CHOOSE FILE</button>
                        <p className={styles.maxSizeNote}>Maximum upload size: 1 GB.</p>

                    </div>
                </div>
                <div className={styles.popupFooterCdr}>
                    <button className={styles.cancelBtnCdr} onClick={togglePopup}>CANCEL</button>
                    <button className={styles.proceedBtnCdr} disabled>UPLOAD</button>
                </div>
            </div>
        </div>
    );
};

export default FileUpload;
