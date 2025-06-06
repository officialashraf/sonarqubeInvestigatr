import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import {axiosInstance} from '../../../utils/axiosConfig';
import Cookies from 'js-cookie';
import './login.css';
import InputField from './inputField'; // reusable input field
import { toast } from 'react-toastify';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState({});

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
            const response = await axiosInstance.post(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/v1/user/validate`, {
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



                // Navigate to the next page after successful login
                toast.success("You have successfully logged in");
                navigate('/cases');

            } else {
                // Handle errors when the response is not 200
                toast.error('An unexpected error has occurred. Please try again');
            }
        } catch (err) {
            // Error handling based on the type of error
            console.error('Error during login:', err);

            if (err.response) {

                toast(err.response?.data?.detail || 'Something went wrong. Please try again');

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
                            autocomplete="off"
                            name="username"


                        />
                        {error.username && <p style={{ color: "red", margin: '0px' }} >{error.username}</p>}
                        <InputField
                            label="Password *"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"

                            autocomplete="off"
                            name="password"

                        />
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
