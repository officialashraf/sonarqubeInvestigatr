
import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import {axiosInstance} from '../../../utils/axiosConfig';
import Cookies from 'js-cookie';
import './login.css';
import InputField from './inputField'; // reusable input field
import { toast } from 'react-toastify';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import {jwtDecode} from "jwt-decode";

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);

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

    return (
        <Container fluid className="login-container">
            <Row className="login-row">
                <Col md={6} className="left-column">
                    <h1>DataSearch</h1>
                </Col>
                <Col md={6} className="right-column">
                    <Form className="login-form" onSubmit={handleLogin} noValidate>
                        <InputField
                            label="Username *"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                            name="username"
                        />
                        {error.username && <p style={{ color: "red", margin: '0px' }} >{error.username}</p>}
                        <div style={{ position: 'relative', justifyContent: 'center' }}>
                            <InputField
                                label="Password *"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                name="password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    // transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    color: 'black',
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
                                {showPassword ? <EyeSlash /> : <Eye />}
                            </span>
                        </div>
                        {error.password && <p style={{ color: "red", margin: '0px' }}>{error.password}</p>}

                        <div className="d-flex justify-content-end mt-2">
                            <button type="submit" className="login-button"
                            // disabled={isButtonDisabled}
                            >
                                Login
                            </button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
