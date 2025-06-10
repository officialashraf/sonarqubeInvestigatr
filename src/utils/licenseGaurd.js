// utils/LicenseGuard.jsx

import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from "../Component/Pages/Layout/loader"; // adjust path as needed

const LicenseGuard = () => {
    const [loading, setLoading] = useState(true);
    const [licenseValid, setLicenseValid] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkLicense = async () => {
            try {
                const res = await axios.get("http://5.180.148.40:9000/api/license");
                setLicenseValid(res.data?.license_registered || false);
            } catch (err) {
                console.error("License check failed:", err);
                setLicenseValid(false);
            } finally {
                setLoading(false);
            }
        };

        checkLicense();
    }, []);

    if (loading) {
        return (
            <div style={{ background: "black", color: "white" }}>
                <p>Checking license validity...</p>
                <Loader />
            </div>
        );
    }

    return licenseValid ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default LicenseGuard;
