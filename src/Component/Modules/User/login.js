import { useState,useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import {axiosInstance} from '../../../utils/axiosConfig';
import Cookies from 'js-cookie';
import style from './login.module.css';
import { InputField } from '../../Common/InpuField/inputField'; // reusable input field
import { toast } from 'react-toastify';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { jwtDecode } from "jwt-decode";
import { useAutoFocusWithManualAutofill } from '../../../utils/autoFocus';
import AppButton from '../../Common/Buttton/button';
import Logo from '../../Assets/Images/ProforceLogo.png'
import investigatrLogo from '../../Assets/Images/investigatr.png'; // Assuming this is the logo you want to use

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();


     const [loginData, setLoginData] = useState(null);

useEffect(() => {
  fetch('/login-text.json', { cache: "no-store" })
    .then((res) => res.json())
    .then((data) => {
       setLoginData({
          loginTextHeader: (data.loginTextHeader),
              loginTextFooter: (data.loginTextFooter),
          logoUrl: (data.logoUrl),
        });
    });
}, []);

    const validateForm = () => {
        const errors = {};

        if (!formData.username.trim()) {
            errors.username = "Username is required";
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setError((prevErrors) => ({
            ...prevErrors,
            [name]: ""  // Remove the specific error message
        }));

    };

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents form default submission

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }
        try {
            // Sending REST API request with username and password

            const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user/validate`, {
                username: formData.username,
                password: formData.password
            });
            console.log("response", response)
            // Checking if the response is successful
            if (response.status === 200) {
                const { access_token, refresh_token } = response.data; // Extract tokens from REST response

                // Set cookies for 1 day
                Cookies.set('accessToken', access_token, { expires: 10 });
                Cookies.set('refreshToken', refresh_token, { expires: 10 });

                const decodedToken = jwtDecode(access_token); // Decode JWT token
                console.log("admin", decodedToken)
                const username = decodedToken?.sub; //  Extract username

                // Redirect based on username
                navigate(username === "admin" ? "/admin" : "/cases");
                // navigate('/cases');

            } else {
                // Handle errors when the response is not 200
                toast.error('An unexpected error has occurred. Please try again');
            }
        } catch (err) {
            // Error handling based on the type of error
            console.error('Error during login:', err);

            if (err.response) {

                toast.error(err.response?.data?.detail || 'Something went wrong. Please try again');

            } else if (err.request) {
                // No response from the server
                toast.error('No response from the server. Please check your connection.');
            } else {
                // Unknown err occurred
                toast.error('An unknown error occurred. Please try again.');
            }
        }
    };

    //  if (!loginData) return <div>Loading...</div>;
    return (
    
        <Container fluid className={style.loginContainer}>
            {/* Logo Section (Centered) */}
            <Row className="justify-content-center" style={{marginTop:'2rem'}}>
                <img
                   src={loginData?.logoUrl || "Logo" }
                    alt="Investigatr Logo"
                    className={style.logoCenter} /* Use the CSS class */
                />
            </Row>

            <h1>{loginData?.loginTextHeader || "Default Login"}</h1>

            {/* <h1>Your Gateway to Actionable Intelligence</h1> */}

            {/* Main Content Section (Left and Right Content) */}
            <Row className="justify-content-center">
                <Col >
                    <Form className={style.loginForm} onSubmit={handleLogin} noValidate>
                        <h2 style={{ color: 'white', marginBottom: '24px' }}>Login</h2>

                        <InputField
                            label="Username *"
                            type="text"
                            ref={inputRef}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="user-name"
                            name="username"
                            autoFocus
                            readOnly={isReadOnly}
                            onFocus={handleFocus}
                            error={!!error.username}
                        />
                        {error.username && <p style={{ color: "red" }}>{error.username}</p>}

                        <div style={{ position: 'relative', justifyContent: 'center', marginBottom: '20px' }}>
                            <InputField
                                label="Password *"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                name="password"
                                error={!!error.password}
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '28%',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    color: 'white',
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                    }
                                }}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
                            </span>
                        </div>
                        {error.password && <p style={{ color: "red" }}>{error.password}</p>}

                        <div className="d-flex justify-content-end mt-3">
                            <AppButton children={"Login to Begin Your Investigation"} />
                        </div>
                    </Form>
                </Col>
            </Row>

           <h1>{loginData?.loginTextFooter || "Default Login"} </h1>
            {/* <h4>Secure. Scalable. Built for law Enforcement</h4> */}

        </Container>
    );
}
export default LoginPage;      
